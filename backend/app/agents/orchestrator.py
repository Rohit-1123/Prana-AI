from sqlalchemy.orm import Session
from app.models.models import Ward, HistoricalAQI
from app.agents.data_agent import DataIntelligenceAgent
from app.agents.prediction_agent import PredictionAgent
from app.agents.explanation_agent import ExplanationAgent
from app.agents.attribution_agent import SourceAttributionAgent
from app.agents.recommendation_agent import RecommendationAgent
from app.agents.citizen_agent import CitizenAdvisoryAgent
from app.agents.report_agent import ReportGenerationAgent
from app.services.aqi_service import get_live_aqi

# Coordinates mapping for Hyderabad wards (IT Corridor)
WARD_COORDINATES = {
    "Gachibowli": (17.4401, 78.3489),
    "Hitech City": (17.4504, 78.3809),
    "Financial District": (17.4190, 78.3429),
    "Madhapur": (17.4483, 78.3915),
    "Kondapur": (17.4622, 78.3572),
    "Nanakramguda": (17.4172, 78.3562)
}

class AgentOrchestrator:
    def __init__(self):
        self.data_agent = DataIntelligenceAgent()
        self.prediction_agent = PredictionAgent()
        self.explanation_agent = ExplanationAgent()
        self.attribution_agent = SourceAttributionAgent()
        self.recommendation_agent = RecommendationAgent()
        self.citizen_agent = CitizenAdvisoryAgent()
        self.report_agent = ReportGenerationAgent()

    def get_ward_intelligence(self, db: Session, ward_id: int) -> dict:
        """
        Runs the full intelligence workflow for a specific ward:
        1. Query recent readings (Data Intelligence)
        2. Fetch real-time metrics (OpenAQ/OpenWeather) to overlay live indicators
        3. Execute AQI forecast models (Prediction)
        4. Explain current spikes/drivers (Explanation)
        5. Calculate source attributions (Source Attribution)
        6. Formulate policy recommendations (Recommendation)
        """
        # Fetch ward details
        ward = db.query(Ward).filter(Ward.id == ward_id).first()
        if not ward:
            raise ValueError(f"Ward with id {ward_id} not found.")

        # Try to retrieve live coordinates readings from OpenAQ/OpenWeather
        coords = WARD_COORDINATES.get(ward.name)
        live_data = None
        if coords:
            # Query live coordinates
            live_data = get_live_aqi(coords[0], coords[1])

        # Get latest historical AQI reading as 'current state'
        latest_reading = (
            db.query(HistoricalAQI)
            .filter(HistoricalAQI.ward_id == ward_id)
            .order_by(HistoricalAQI.timestamp.desc())
            .first()
        )
        
        # Get previous reading to compute delta
        previous_reading = (
            db.query(HistoricalAQI)
            .filter(HistoricalAQI.ward_id == ward_id)
            .order_by(HistoricalAQI.timestamp.desc())
            .offset(1)
            .first()
        )
        
        if not latest_reading:
            # Return nominal default if database is empty
            return self._get_default_response(ward)
            
        prev_aqi = previous_reading.aqi if previous_reading else 120
        
        # Merge live API values if available
        aqi_val = live_data["aqi"] if (live_data and "aqi" in live_data) else latest_reading.aqi
        pm2_5_val = live_data["pm2_5"] if (live_data and "pm2_5" in live_data) else latest_reading.pm2_5
        pm10_val = live_data["pm10"] if (live_data and "pm10" in live_data) else latest_reading.pm10
        data_source = live_data["source"] if (live_data and "source" in live_data) else "Database Fallback"
        
        # Assemble metrics dictionary for agents
        metrics = {
            "ward": ward.name,
            "aqi": aqi_val,
            "pm2_5": pm2_5_val,
            "pm10": pm10_val,
            "temperature": latest_reading.temperature,
            "humidity": latest_reading.humidity,
            "wind_speed": latest_reading.wind_speed,
            "wind_direction": latest_reading.wind_direction,
            "uv_index": latest_reading.uv_index,
            "weather_condition": latest_reading.weather_condition,
            "traffic_congestion": latest_reading.traffic_congestion,
            "construction_activity": latest_reading.construction_activity,
            "industrial_emissions": latest_reading.industrial_emissions,
            "dust_level": latest_reading.dust_level
        }
        
        # 1. Clean and Validate
        validated_metrics = self.data_agent.clean_and_validate(metrics)
        
        # 2. Run Predictions (24h/48h/72h)
        predictions = self.prediction_agent.predict_forecasts(validated_metrics)
        
        # 3. Source Attribution splits
        attributions = self.attribution_agent.estimate_sources(validated_metrics)
        
        # 4. Narrative Explanation
        explanation = self.explanation_agent.explain_aqi_state(validated_metrics, prev_aqi)
        
        # Inject the live data source description into the explanation
        if live_data:
            explanation["narrative_explanation"] = f"(Live metrics fetched via {data_source}) " + explanation["narrative_explanation"]
        
        # 5. Interventions & estimated AQI drops
        recommendations = self.recommendation_agent.generate_recommendations(validated_metrics)
        
        # Calculate Environmental Health Score (EHS)
        green_factor = (ward.green_cover_pct or 20) * 0.5
        aqi_penalty = max(0, min(60, (aqi_val / 500) * 60))
        traffic_penalty = (latest_reading.traffic_congestion / 100) * 10
        ind_penalty = (latest_reading.industrial_emissions / 100) * 10
        ehs = max(10, min(100, int(100 + green_factor - aqi_penalty - traffic_penalty - ind_penalty)))
        
        return {
            "ward_id": ward.id,
            "ward_name": ward.name,
            "population": ward.population,
            "area_sqkm": ward.area_sqkm,
            "green_cover_pct": ward.green_cover_pct,
            "environmental_health_score": ehs,
            "current_metrics": validated_metrics,
            "predictions": predictions["forecast"],
            "source_attributions": attributions["attributions"],
            "explanation": explanation,
            "recommendations": recommendations["recommendations"],
            "recommendations_brief": recommendations["executive_policy_brief"],
            "data_source": data_source
        }

    def _get_default_response(self, ward) -> dict:
        return {
            "ward_id": ward.id,
            "ward_name": ward.name,
            "population": ward.population or 50000,
            "area_sqkm": ward.area_sqkm or 10.0,
            "green_cover_pct": ward.green_cover_pct or 20.0,
            "environmental_health_score": 75,
            "current_metrics": {
                "ward": ward.name,
                "aqi": 80,
                "pm2_5": 28,
                "pm10": 45,
                "temperature": 26.0,
                "humidity": 60.0,
                "wind_speed": 7.5,
                "wind_direction": 120.0,
                "weather_condition": "Sunny",
                "traffic_congestion": 40.0,
                "construction_activity": 20.0,
                "industrial_emissions": 20.0,
                "dust_level": 15.0
            },
            "predictions": [
                {"horizon_hours": 24, "predicted_aqi": 85, "confidence_score": 0.88, "trend": "Rising"},
                {"horizon_hours": 48, "predicted_aqi": 90, "confidence_score": 0.79, "trend": "Rising"},
                {"horizon_hours": 72, "predicted_aqi": 75, "confidence_score": 0.68, "trend": "Falling"}
            ],
            "source_attributions": [
                {"source": "Traffic", "percentage": 30.0, "confidence": 0.90},
                {"source": "Industrial Activity", "percentage": 15.0, "confidence": 0.90},
                {"source": "Construction", "percentage": 10.0, "confidence": 0.90},
                {"source": "Road Dust", "percentage": 20.0, "confidence": 0.90},
                {"source": "Meteorological Factors", "percentage": 25.0, "confidence": 0.90}
            ],
            "explanation": {
                "primary_driver": "Vehicular Congestion",
                "narrative_explanation": "Air quality is currently in satisfactory zone. Traffic emissions account for the largest single contributor."
            },
            "recommendations": [],
            "recommendations_brief": "",
            "data_source": "Offline Fallback"
        }
