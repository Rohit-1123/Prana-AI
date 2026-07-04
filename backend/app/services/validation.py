from typing import Dict, Any

class ValidationService:
    @staticmethod
    def validate_aqi(data: Dict[str, Any]) -> bool:
        if not data:
            return False
        
        # Check coordinates and bounds
        aqi = data.get("aqi", -1)
        pm2_5 = data.get("pm2_5", -1.0)
        pm10 = data.get("pm10", -1.0)

        if not (0 <= aqi <= 500):
            return False
        if pm2_5 < 0.0 or pm10 < 0.0:
            return False
        
        return True

    @staticmethod
    def validate_weather(data: Dict[str, Any]) -> bool:
        if not data:
            return False

        temp = data.get("temperature", -99.0)
        humidity = data.get("humidity", -1.0)
        pressure = data.get("pressure", -1.0)

        if not (-80.0 <= temp <= 60.0):
            return False
        if not (0.0 <= humidity <= 100.0):
            return False
        if pressure <= 0.0:
            return False

        return True

    @staticmethod
    def validate_coordinates(lat: float, lon: float) -> bool:
        return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0
