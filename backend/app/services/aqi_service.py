import time
from datetime import datetime, timezone
import requests
from typing import Optional, Dict, Any, List, Tuple

# Open-Meteo: free, keyless, global. Air quality comes from the CAMS atmospheric model.
AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
SOURCE = "Open-Meteo (CAMS)"

# CPCB (India National AQI) breakpoints: (conc_lo, conc_hi, aqi_lo, aqi_hi)
PM25_BREAKPOINTS = [(0, 30, 0, 50), (30, 60, 50, 100), (60, 90, 100, 200), (90, 120, 200, 300), (120, 250, 300, 400), (250, 500, 400, 500)]
PM10_BREAKPOINTS = [(0, 50, 0, 50), (50, 100, 50, 100), (100, 250, 100, 200), (250, 350, 200, 300), (350, 430, 300, 400), (430, 600, 400, 500)]

# ponytail: in-process TTL cache, swap for Redis if running multiple workers
CACHE_TTL_SECONDS = 600
FAIL_RETRY_SECONDS = 60
_cache: Dict[tuple, tuple] = {}

WMO_CONDITIONS = [  # (max weather code, label)
    (0, "Clear"), (3, "Cloudy"), (48, "Fog"), (67, "Rain"), (77, "Snow"), (82, "Rain"), (86, "Snow"), (99, "Thunderstorm"),
]


def _sub_index(conc: float, breakpoints) -> int:
    for c_lo, c_hi, i_lo, i_hi in breakpoints:
        if conc <= c_hi:
            return round(i_lo + (conc - c_lo) * (i_hi - i_lo) / (c_hi - c_lo))
    return 500


def calculate_aqi(pm2_5: float, pm10: Optional[float] = None) -> int:
    """CPCB AQI = max of pollutant sub-indices (PM2.5 and PM10 here)."""
    aqi = _sub_index(pm2_5, PM25_BREAKPOINTS)
    if pm10 is not None:
        aqi = max(aqi, _sub_index(pm10, PM10_BREAKPOINTS))
    return aqi


def main_pollutant(pm2_5: float, pm10: float) -> str:
    """The pollutant whose CPCB sub-index sets the AQI."""
    return "PM10" if _sub_index(pm10, PM10_BREAKPOINTS) > _sub_index(pm2_5, PM25_BREAKPOINTS) else "PM2.5"


def _condition(code: Optional[int], pm2_5: float) -> str:
    if code is None:
        return "Clear"
    if code <= 3 and pm2_5 > 90:  # clear/cloudy sky but heavy particulates reads as haze
        return "Haze"
    return next((label for max_code, label in WMO_CONDITIONS if code <= max_code), "Clear")


def _mean(values: List[Optional[float]]) -> Optional[float]:
    vals = [v for v in values if v is not None]
    return sum(vals) / len(vals) if vals else None


def _parse(air: dict, weather: Optional[dict]) -> Dict[str, Any]:
    hourly = air["hourly"]
    # current time can sit on a half hour (IST is +5:30); match the hourly slot by "YYYY-MM-DDTHH"
    now_hour = air["current"]["time"][:13]
    now_idx = next(i for i, t in enumerate(hourly["time"]) if t[:13] == now_hour)
    pm25, pm10 = hourly["pm2_5"], hourly["pm10"]

    # CPCB AQI uses 24-hour average concentrations for PM
    def window_aqi(end: int) -> Optional[Tuple[int, float, float]]:
        p25, p10 = _mean(pm25[max(0, end - 23):end + 1]), _mean(pm10[max(0, end - 23):end + 1])
        return None if p25 is None else (calculate_aqi(p25, p10), p25, p10 if p10 is not None else p25 * 1.5)

    current = window_aqi(now_idx)
    if current is None:
        raise ValueError("no PM2.5 data")
    aqi, avg25, avg10 = current
    forecast = []
    for h in (24, 48, 72):
        if now_idx + h < len(pm25) and (w := window_aqi(now_idx + h)):
            forecast.append({"horizon_hours": h, "predicted_aqi": w[0]})

    # Hourly rows from 24h ago to 72h ahead: CPCB AQI on a rolling 24h mean, plus weather when available
    wx_hourly = (weather or {}).get("hourly", {})
    wx_by_hour = {t[:13]: i for i, t in enumerate(wx_hourly.get("time", []))}

    def wx(key: str, hour: str):
        i = wx_by_hour.get(hour)
        return wx_hourly[key][i] if i is not None else None

    series = []
    for i in range(max(0, now_idx - 24), min(len(pm25), now_idx + 73)):
        w = window_aqi(i)
        if w:
            hour = hourly["time"][i][:13]
            series.append({
                "t": hourly["time"][i], "aqi": w[0], "pm2_5": round(w[1], 1),
                "temperature": wx("temperature_2m", hour), "humidity": wx("relative_humidity_2m", hour),
                "wind_speed": wx("wind_speed_10m", hour), "is_forecast": i > now_idx,
            })

    result: Dict[str, Any] = {
        "aqi": aqi,
        "pm2_5": round(avg25, 1),
        "pm10": round(avg10, 1),
        "forecast": forecast,
        "series": series,
        "source": SOURCE,
        "observed_at": datetime.now(timezone.utc).isoformat(timespec="minutes"),
    }
    if weather:
        cur = weather["current"]
        result.update({
            "temperature": cur["temperature_2m"],
            "humidity": cur["relative_humidity_2m"],
            "wind_speed": cur["wind_speed_10m"],
            "weather_condition": _condition(cur.get("weather_code"), pm25[now_idx] or avg25),
        })
    return result


def _as_list(payload) -> list:
    return payload if isinstance(payload, list) else [payload]


def get_live_batch(points: List[Tuple[float, float]]) -> List[Optional[Dict[str, Any]]]:
    """Live AQI (CPCB, from 24h-mean PM2.5/PM10), 72h forecast and weather for many points in 2 HTTP calls."""
    keys = [(round(lat, 3), round(lng, 3)) for lat, lng in points]
    now = time.time()
    missing = list(dict.fromkeys(k for k in keys if not (k in _cache and now - _cache[k][0] < CACHE_TTL_SECONDS)))

    if missing:
        lats = ",".join(str(k[0]) for k in missing)
        lngs = ",".join(str(k[1]) for k in missing)
        try:
            air = requests.get(AIR_URL, params={
                "latitude": lats, "longitude": lngs, "current": "pm2_5",
                "hourly": "pm2_5,pm10", "past_days": 2, "forecast_days": 4, "timezone": "auto",
            }, timeout=8)
            air.raise_for_status()
            airs = _as_list(air.json())
        except Exception as e:
            print(f"Open-Meteo air quality query failed: {e}")
            for k in missing:  # retry soon, but don't hammer during an outage
                _cache[k] = (now - CACHE_TTL_SECONDS + FAIL_RETRY_SECONDS, None)
            airs = None

        if airs is not None:
            try:
                wx = requests.get(WEATHER_URL, params={
                    "latitude": lats, "longitude": lngs, "wind_speed_unit": "ms",
                    "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
                    "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m",
                    "past_days": 2, "forecast_days": 4, "timezone": "auto",
                }, timeout=8)
                wx.raise_for_status()
                weathers = _as_list(wx.json())
            except Exception as e:
                print(f"Open-Meteo weather query failed: {e}")
                weathers = [None] * len(missing)

            for k, a, w in zip(missing, airs, weathers):
                try:
                    _cache[k] = (now, _parse(a, w))
                except Exception as e:
                    print(f"Open-Meteo parse failed for {k}: {e}")
                    _cache[k] = (now - CACHE_TTL_SECONDS + FAIL_RETRY_SECONDS, None)

    return [_cache.get(k, (0, None))[1] for k in keys]


def get_live_aqi(lat: float, lng: float) -> Optional[Dict[str, Any]]:
    return get_live_batch([(lat, lng)])[0]


if __name__ == "__main__":
    assert calculate_aqi(0) == 0
    assert calculate_aqi(30) == 50
    assert calculate_aqi(60) == 100
    assert calculate_aqi(90) == 200
    assert calculate_aqi(250) == 400
    assert calculate_aqi(1000) == 500
    assert calculate_aqi(20, 300) == 250  # PM10 dominates
    assert main_pollutant(89.5, 303.7) == "PM10" and main_pollutant(43, 62) == "PM2.5"
    assert _condition(0, 20) == "Clear" and _condition(2, 120) == "Haze" and _condition(63, 120) == "Rain"
    hours = [f"2026-10-{1 + i // 24:02d}T{i % 24:02d}:00" for i in range(100)]
    fake_air = {"current": {"time": "2026-10-02T00:30"}, "hourly": {"time": hours, "pm2_5": [60.0] * 100, "pm10": [40.0] * 100}}
    parsed = _parse(fake_air, None)
    assert parsed["aqi"] == 100 and [f["horizon_hours"] for f in parsed["forecast"]] == [24, 48, 72]
    assert len(parsed["series"]) == 97 and parsed["series"][24]["is_forecast"] is False and parsed["series"][25]["is_forecast"]
    print("aqi_service ok")
