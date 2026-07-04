from typing import Dict, Any

class NormalizationService:
    @staticmethod
    def normalize_aqi(raw: Dict[str, Any], provider: str = "openweather") -> Dict[str, Any]:
        """Normalizes raw air quality logs to standardized schemas."""
        if not raw or "list" not in raw or len(raw["list"]) == 0:
            return {}

        record = raw["list"][0]
        components = record.get("components", {})
        
        # Maps category indexes (OpenWeather AQI runs 1 to 5)
        aqi_index = record.get("main", {}).get("aqi", 1)
        categories = ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"]
        category = categories[min(aqi_index - 1, len(categories) - 1)]

        return {
            "aqi": int(aqi_index * 30),  # Map to 0-500 scale approximation
            "pm2_5": float(components.get("pm2_5", 0.0)),
            "pm10": float(components.get("pm10", 0.0)),
            "no2": float(components.get("no2", 0.0)),
            "so2": float(components.get("so2", 0.0)),
            "co": float(components.get("co", 0.0)),
            "o3": float(components.get("o3", 0.0)),
            "category": category,
            "data_source": provider,
            "quality_score": 0.9
        }

    @staticmethod
    def normalize_weather(raw: Dict[str, Any], provider: str = "openweather") -> Dict[str, Any]:
        """Normalizes raw meteorology metrics to standardized schemas."""
        if not raw or "main" not in raw:
            return {}

        main = raw["main"]
        wind = raw.get("wind", {})
        
        return {
            "temperature": float(main.get("temp", 25.0)),
            "humidity": float(main.get("humidity", 50.0)),
            "pressure": float(main.get("pressure", 1013.0)),
            "wind_speed": float(wind.get("speed", 0.0)),
            "wind_direction": float(wind.get("deg", 0.0)),
            "visibility": float(raw.get("visibility", 10000.0) / 1000.0), # convert meters to km
            "uv_index": 5.0, # default index
            "rainfall": float(raw.get("rain", {}).get("1h", 0.0))
        }

    @staticmethod
    def normalize_geocode(raw: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes geocoding results."""
        address = raw.get("address", {})
        return {
            "name": raw.get("display_name", "Unknown location"),
            "latitude": float(raw.get("lat", 0.0)),
            "longitude": float(raw.get("lon", 0.0)),
            "postal_code": address.get("postcode"),
            "category": raw.get("type", "residential"),
            "status": "active"
        }
