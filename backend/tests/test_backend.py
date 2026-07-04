import pytest
from app.agents.data_agent import DataIntelligenceAgent
from app.agents.attribution_agent import SourceAttributionAgent

def test_data_intelligence_agent_validation():
    agent = DataIntelligenceAgent()
    
    # 1. Normal values should remain unchanged and valid
    raw_data = {
        "temperature": 28.5,
        "humidity": 60.0,
        "wind_speed": 12.0,
        "aqi": 120,
        "traffic_congestion": 50.0,
        "industrial_emissions": 30.0
    }
    cleaned = agent.clean_and_validate(raw_data)
    assert cleaned["is_valid"] is True
    assert cleaned["temperature"] == 28.5
    assert cleaned["humidity"] == 60.0
    assert len(cleaned["anomalies_flagged"]) == 0

    # 2. Out-of-bounds values should trigger warnings and auto-impute defaults
    raw_bad_data = {
        "temperature": 99.0,  # Extreme temperature outlier
        "humidity": 150.0,    # Physical impossibility
        "wind_speed": -10.0,  # Negative wind speed
        "aqi": 1500,          # Out of bounds
        "traffic_congestion": 120.0
    }
    cleaned_bad = agent.clean_and_validate(raw_bad_data)
    assert cleaned_bad["is_valid"] is True
    assert cleaned_bad["temperature"] == 25.0 # Imputed default
    assert cleaned_bad["humidity"] == 55.0    # Imputed default
    assert cleaned_bad["wind_speed"] == 8.0   # Imputed default
    assert len(cleaned_bad["anomalies_flagged"]) > 0

def test_source_attribution_normalization():
    agent = SourceAttributionAgent()
    
    current_metrics = {
        "ward": "Ward 3",
        "aqi": 250,
        "temperature": 32.0,
        "humidity": 45.0,
        "wind_speed": 4.5,
        "weather_condition": "Sunny",
        "traffic_congestion": 70.0,
        "industrial_emissions": 80.0,
        "construction_activity": 40.0,
        "dust_level": 50.0
    }
    
    result = agent.estimate_sources(current_metrics)
    assert "attributions" in result
    assert result["total_percentage"] == 100.0
    
    # Check that attributions sum to exactly 100%
    total_split_sum = sum(item["percentage"] for item in result["attributions"])
    assert round(total_split_sum, 1) == 100.0
