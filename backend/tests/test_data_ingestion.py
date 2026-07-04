import pytest
from app.services.normalization import NormalizationService
from app.services.validation import ValidationService

def test_aqi_normalization():
    raw_response = {
        "coord": [78.3489, 17.4401],
        "list": [
            {
                "dt": 1605182400,
                "main": {"aqi": 3},
                "components": {
                    "co": 201.94,
                    "no": 0.01,
                    "no2": 0.08,
                    "o3": 68.66,
                    "so2": 0.6,
                    "pm2_5": 10.5,
                    "pm10": 21.4,
                    "nh3": 0.23
                }
            }
        ]
    }
    
    normalized = NormalizationService.normalize_aqi(raw_response)
    assert normalized["aqi"] == 90 # 3 * 30
    assert normalized["pm2_5"] == 10.5
    assert normalized["pm10"] == 21.4
    assert normalized["category"] == "Moderate"

def test_weather_normalization():
    raw_weather = {
        "coord": {"lon": 78.3489, "lat": 17.4401},
        "main": {
            "temp": 28.5,
            "feels_like": 30.2,
            "temp_min": 28.0,
            "temp_max": 29.0,
            "pressure": 1012,
            "humidity": 65
        },
        "wind": {"speed": 4.12, "deg": 150},
        "visibility": 8000,
        "dt": 1605182400
    }
    
    normalized = NormalizationService.normalize_weather(raw_weather)
    assert normalized["temperature"] == 28.5
    assert normalized["humidity"] == 65.0
    assert normalized["wind_speed"] == 4.12
    assert normalized["pressure"] == 1012.0

def test_data_validation():
    # 1. Valid AQI data
    valid_aqi = {
        "aqi": 120,
        "pm2_5": 35.5,
        "pm10": 55.0
    }
    assert ValidationService.validate_aqi(valid_aqi) is True

    # 2. Out-of-bounds AQI data
    invalid_aqi = {
        "aqi": 700, # Max AQI is 500
        "pm2_5": -10.0, # Negative AQI components not allowed
        "pm10": 45.0
    }
    assert ValidationService.validate_aqi(invalid_aqi) is False
