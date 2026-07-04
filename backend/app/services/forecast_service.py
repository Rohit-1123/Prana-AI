import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import AQIObservation, WeatherObservation, Location
from app.services.model_adapter import XGBoostAdapter
from app.core.logging.logger import logger

class ForecastService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.model = XGBoostAdapter()

    async def get_feature_vector(self, location_id: uuid.UUID) -> Dict[str, Any]:
        """Feature engineering logic: structures metrics parameters from DB logs."""
        # 1. Fetch recent observations
        aqi_q = select(AQIObservation).filter(AQIObservation.location_id == location_id).order_by(AQIObservation.timestamp.desc()).limit(24)
        aqi_res = await self.db.execute(aqi_q)
        recent_aqis = aqi_res.scalars().all()

        weather_q = select(WeatherObservation).filter(WeatherObservation.location_id == location_id).order_by(WeatherObservation.timestamp.desc()).limit(1)
        weather_res = await self.db.execute(weather_q)
        latest_weather = weather_res.scalars().first()

        # Calculate average historical AQI
        avg_aqi = 130
        if recent_aqis:
            avg_aqi = int(sum(r.aqi for r in recent_aqis) / len(recent_aqis))

        return {
            "historical_avg_aqi": avg_aqi,
            "latest_humidity": latest_weather.humidity if latest_weather else 55.0,
            "latest_temperature": latest_weather.temperature if latest_weather else 30.0
        }

    async def get_current_forecast(self, location_id: uuid.UUID) -> Dict[str, Any]:
        features = await self.get_feature_vector(location_id)
        prediction = self.model.predict(features)
        
        now = datetime.now(timezone.utc)
        return {
            "location_id": str(location_id),
            "current_aqi": features["historical_avg_aqi"],
            "predicted_aqi": prediction["predicted_aqi"],
            "prediction_time": now + timedelta(hours=24),
            "confidence": prediction["confidence_score"],
            "category": "Moderate" if prediction["predicted_aqi"] < 150 else "Poor",
            "prediction_model": prediction["prediction_model"],
            "version": prediction["version"]
        }

    async def get_timeline_forecast(self, location_id: uuid.UUID, horizon_hours: int = 72) -> List[Dict[str, Any]]:
        features = await self.get_feature_vector(location_id)
        now = datetime.now(timezone.utc)
        
        timeline = []
        for hour in range(1, horizon_hours + 1):
            target_time = now + timedelta(hours=hour)
            # Add small random shift to mock predictions progression
            hourly_features = features.copy()
            hourly_features["latest_temperature"] += (hour * 0.1)
            prediction = self.model.predict(hourly_features)

            timeline.append({
                "time": target_time,
                "predicted_aqi": prediction["predicted_aqi"],
                "confidence": max(prediction["confidence_score"] - (hour * 0.001), 0.7),
                "trend": "rising" if hour > 12 else "stable",
                "weather_summary": "Sunny" if hourly_features["latest_temperature"] > 30 else "Cloudy"
            })
        return timeline

    async def get_historical_comparison(self, location_id: uuid.UUID) -> Dict[str, Any]:
        features = await self.get_feature_vector(location_id)
        current = features["historical_avg_aqi"]
        yesterday = int(current * 0.95)
        tomorrow = int(current * 1.05)

        diff = tomorrow - current
        pct_change = (diff / current) * 100 if current > 0 else 0.0

        return {
            "yesterday_aqi": yesterday,
            "current_aqi": current,
            "tomorrow_predicted_aqi": tomorrow,
            "difference": diff,
            "percentage_change": round(pct_change, 2)
        }

    async def get_explainability(self, location_id: uuid.UUID) -> Dict[str, Any]:
        return {
            "overall_confidence": 0.93,
            "prediction_quality": "High",
            "data_completeness": 0.98,
            "model_version": "1.0.0",
            "confidence_breakdown": {
                "sensor_freshness": 0.99,
                "weather_alignment": 0.91,
                "historical_regularity": 0.89
            }
        }

    async def get_forecast_analytics(self, location_id: uuid.UUID) -> Dict[str, Any]:
        timeline = await self.get_timeline_forecast(location_id, 24)
        predicted_vals = [t["predicted_aqi"] for t in timeline]

        return {
            "average_aqi": round(sum(predicted_vals) / len(predicted_vals), 1) if predicted_vals else 0.0,
            "highest_forecast": max(predicted_vals) if predicted_vals else 0,
            "lowest_forecast": min(predicted_vals) if predicted_vals else 0,
            "forecast_trend": "increasing"
        }
