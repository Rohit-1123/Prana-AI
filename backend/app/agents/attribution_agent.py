class SourceAttributionAgent:
    def __init__(self):
        self.name = "Source Attribution Agent"

    def estimate_sources(self, current_metrics: dict) -> dict:
        """
        Calculates source attribution splits and returns them with confidence metrics.
        Categorizes: Traffic, Construction, Industrial, Dust, and Meteorology.
        """
        traffic = current_metrics.get("traffic_congestion", 50.0)
        industry = current_metrics.get("industrial_emissions", 30.0)
        construction = current_metrics.get("construction_activity", 40.0)
        dust = current_metrics.get("dust_level", 20.0)
        wind = current_metrics.get("wind_speed", 5.0)
        weather = current_metrics.get("weather_condition", "Sunny")
        
        # Core coefficients (Traffic 0.65, Industry 1.1, Construction 0.45, Dust 0.35)
        raw_traffic = traffic * 0.65
        raw_industry = industry * 1.1
        raw_construction = construction * 0.45
        
        # Dust depends on weather and construction
        raw_dust = dust * 0.35
        if weather == "Windy" and wind > 10.0:
            raw_dust += (wind - 10.0) * 1.5
            
        # Meteorology (dilutes or concentrates)
        raw_met = 35.0
        if wind < 3.0:
            raw_met += 25.0
        elif wind > 10.0:
            raw_met = max(5.0, raw_met - 20.0)
            
        if weather == "Foggy":
            raw_met += 30.0
        elif weather == "Rainy":
            raw_met = max(5.0, raw_met - 25.0)
            
        total = raw_traffic + raw_industry + raw_construction + raw_dust + raw_met
        
        splits = {
            "Traffic": round((raw_traffic / total) * 100, 1),
            "Industrial": round((raw_industry / total) * 100, 1),
            "Construction": round((raw_construction / total) * 100, 1),
            "Dust": round((raw_dust / total) * 100, 1),
            "Meteorology": round((raw_met / total) * 100, 1)
        }
        
        # Calculate confidence scores (drier, less volatile weather yields higher confidence)
        confidence = 0.90
        if weather == "Rainy" or weather == "Windy":
            confidence = 0.82 # Weather volatility reduces static model confidence
            
        return {
            "ward": current_metrics.get("ward", "Ward 1"),
            "attributions": [
                {"source": "Traffic", "percentage": splits["Traffic"], "confidence": confidence},
                {"source": "Industrial Activity", "percentage": splits["Industrial"], "confidence": confidence},
                {"source": "Construction", "percentage": splits["Construction"], "confidence": confidence},
                {"source": "Road Dust", "percentage": splits["Dust"], "confidence": confidence},
                {"source": "Meteorological Factors", "percentage": splits["Meteorology"], "confidence": confidence}
            ],
            "total_percentage": 100.0
        }
