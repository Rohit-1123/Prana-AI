import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.database.models.models import AQIObservation, WeatherObservation, Alert, Location
from app.core.logging.logger import logger

class MissionControlService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_summary(self, location_id: uuid.UUID) -> Dict[str, Any]:
        # 1. Fetch latest AQI
        aqi_q = select(AQIObservation).filter(AQIObservation.location_id == location_id).order_by(AQIObservation.timestamp.desc()).limit(1)
        aqi_res = await self.db.execute(aqi_q)
        latest_aqi = aqi_res.scalars().first()

        # 2. Fetch latest Weather
        weather_q = select(WeatherObservation).filter(WeatherObservation.location_id == location_id).order_by(WeatherObservation.timestamp.desc()).limit(1)
        weather_res = await self.db.execute(weather_q)
        latest_weather = weather_res.scalars().first()

        # 3. Fetch active alerts count
        alerts_q = select(func.count(Alert.id)).filter(Alert.location_id == location_id, Alert.status == "active")
        alerts_res = await self.db.execute(alerts_q)
        active_alerts_count = alerts_res.scalar() or 0

        # Health Score Calculation logic
        aqi_val = latest_aqi.aqi if latest_aqi else 100
        health_score = max(min(int(100 - (aqi_val * 0.15) - (active_alerts_count * 5)), 100), 0)

        risk_category = "Low"
        color = "green"
        if health_score < 50:
            risk_category = "Critical"
            color = "red"
        elif health_score < 75:
            risk_category = "Medium"
            color = "yellow"

        return {
            "aqi": aqi_val,
            "category": latest_aqi.category if latest_aqi else "Moderate",
            "weather": {
                "temperature": latest_weather.temperature if latest_weather else 25.0,
                "humidity": latest_weather.humidity if latest_weather else 55.0,
                "wind_speed": latest_weather.wind_speed if latest_weather else 5.0
            },
            "health_score": health_score,
            "risk_category": risk_category,
            "color": color,
            "active_alerts_count": active_alerts_count,
            "timestamp": latest_aqi.timestamp if latest_aqi else None
        }

    async def get_statistics(self, location_id: uuid.UUID) -> Dict[str, Any]:
        aqi_q = select(
            func.avg(AQIObservation.aqi).label("avg_aqi"),
            func.max(AQIObservation.aqi).label("max_aqi"),
            func.min(AQIObservation.aqi).label("min_aqi")
        ).filter(AQIObservation.location_id == location_id)
        
        res = await self.db.execute(aqi_q)
        stats = res.first()

        return {
            "average_aqi": round(float(stats.avg_aqi), 1) if stats and stats.avg_aqi else 0.0,
            "highest_aqi": int(stats.max_aqi) if stats and stats.max_aqi else 0,
            "lowest_aqi": int(stats.min_aqi) if stats and stats.min_aqi else 0,
            "prediction_confidence": 0.92
        }

    async def get_alerts(self, location_id: uuid.UUID) -> List[Dict[str, Any]]:
        query = select(Alert).filter(Alert.location_id == location_id).order_by(Alert.created_at.desc())
        res = await self.db.execute(query)
        alerts = res.scalars().all()
        return [
            {
                "id": str(a.id),
                "title": a.alert_type,
                "description": f"Target values triggered standard bounds. Triggered score: {a.aqi_trigger or 150}",
                "severity": a.severity,
                "status": a.status,
                "created_at": a.created_at
            }
            for a in alerts
        ]

    async def get_recommendations(self, location_id: uuid.UUID) -> List[Dict[str, Any]]:
        # Mock recommendations based on logic
        return [
            {
                "recommendation": "Restrict heavy commercial traffic flow.",
                "description": "Divert particulate-heavy logistics away from the IT corridor.",
                "estimated_impact": "AQI reduction of ~15-20 points",
                "priority": "high",
                "category": "traffic"
            },
            {
                "recommendation": "Deploy dry-fogging mist cannons.",
                "description": "Operate mist cannons near construction zones to capture dust particles.",
                "estimated_impact": "PM10 reduction of ~10%",
                "priority": "medium",
                "category": "construction"
            }
        ]
