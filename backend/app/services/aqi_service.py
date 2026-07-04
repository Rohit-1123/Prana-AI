import os
import requests
from typing import Optional, Dict, Any

def get_live_aqi(lat: float, lng: float) -> Optional[Dict[str, Any]]:
    """
    Fetch real-time air quality index and particulate matter levels for given coordinates.
    Tries OpenAQ first (free, keyless public endpoint) and falls back to OpenWeather (if API key available).
    """
    # 1. Try OpenAQ API (Free public endpoint)
    try:
        url = f"https://api.openaq.org/v2/latest?coordinates={lat},{lng}&radius=15000&limit=10"
        headers = {"User-Agent": "PranaAI-Environmental-Intelligence/1.0"}
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            results = data.get("results", [])
            if results:
                pm25 = None
                pm10 = None
                for result in results:
                    for m in result.get("measurements", []):
                        param = m.get("parameter")
                        val = m.get("value")
                        if param == "pm25" and pm25 is None:
                            pm25 = val
                        elif param == "pm10" and pm10 is None:
                            pm10 = val
                
                if pm25 is not None:
                    # Calculate AQI based on PM2.5 (Indian Standard / US Standard approximation)
                    # PM2.5 <= 30 is Good (0-50 AQI)
                    # PM2.5 31-60 is Satisfactory (51-100 AQI)
                    # PM2.5 61-90 is Moderate (101-200 AQI)
                    # PM2.5 91-120 is Poor (201-300 AQI)
                    if pm25 <= 30:
                        aqi = int((pm25 / 30) * 50)
                    elif pm25 <= 60:
                        aqi = int(50 + ((pm25 - 30) / 30) * 50)
                    elif pm25 <= 90:
                        aqi = int(100 + ((pm25 - 60) / 30) * 100)
                    elif pm25 <= 120:
                        aqi = int(200 + ((pm25 - 90) / 30) * 100)
                    else:
                        aqi = int(300 + min(200, ((pm25 - 120) / 100) * 200))
                        
                    return {
                        "aqi": aqi,
                        "pm2_5": int(pm25),
                        "pm10": int(pm10 if pm10 is not None else pm25 * 1.5),
                        "source": "OpenAQ API"
                    }
    except Exception as e:
        print(f"OpenAQ live query failed: {e}")

    # 2. Try OpenWeather Air Pollution API (if key exists)
    api_key = os.getenv("OPENWEATHER_API_KEY", "")
    if api_key:
        try:
            url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lng}&appid={api_key}"
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                data = res.json()
                list_data = data.get("list", [])
                if list_data:
                    components = list_data[0].get("components", {})
                    pm25 = components.get("pm2_5", 35.0)
                    pm10 = components.get("pm10", 55.0)
                    
                    # Convert to AQI
                    # OpenWeather AQI is 1 (Good) to 5 (Very Poor)
                    ow_aqi = list_data[0].get("main", {}).get("aqi", 3)
                    aqi_map = {1: 45, 2: 85, 3: 135, 4: 220, 5: 350}
                    aqi = aqi_map.get(ow_aqi, 150)
                    
                    return {
                        "aqi": aqi,
                        "pm2_5": int(pm25),
                        "pm10": int(pm10),
                        "source": "OpenWeather API"
                    }
        except Exception as e:
            print(f"OpenWeather air pollution query failed: {e}")

    return None
