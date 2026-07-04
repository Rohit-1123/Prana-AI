import uuid
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.mission_control_service import MissionControlService
from app.services.forecast_service import ForecastService
from app.services.environmental_intelligence_service import EnvironmentalIntelligenceService

class ToolOrchestrator:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.mc_service = MissionControlService(db)
        self.fc_service = ForecastService(db)
        self.env_service = EnvironmentalIntelligenceService(db)

    async def gather_context_for_intent(self, intent: str, location_id: uuid.UUID) -> Dict[str, Any]:
        """Orchestrates internal service queries based on detected intent."""
        context = {}
        try:
            if intent == "forecast":
                fc_data = await self.fc_service.get_current_forecast(location_id)
                context["forecast_aqi"] = fc_data.get("predicted_aqi", "N/A")
                context["forecast_confidence"] = fc_data.get("confidence", "N/A")
            elif intent == "compare":
                # Quick comparison metrics
                comp = await self.fc_service.get_historical_comparison(location_id)
                context["yesterday_aqi"] = comp.get("yesterday_aqi")
                context["current_aqi"] = comp.get("current_aqi")
                context["tomorrow_predicted_aqi"] = comp.get("tomorrow_predicted_aqi")
            elif intent == "hotspots":
                hotspots = await self.env_service.get_hotspots()
                context["active_hotspots_count"] = len(hotspots)
                if hotspots:
                    context["top_hotspot"] = hotspots[0]["name"]
                    context["top_hotspot_aqi"] = hotspots[0]["aqi"]
            else:
                # Default to summary context
                summary = await self.mc_service.get_dashboard_summary(location_id)
                context["current_aqi"] = summary.get("aqi")
                context["current_category"] = summary.get("category")
                context["health_score"] = summary.get("health_score")
        except Exception:
            # Graceful degradation context
            context["info"] = "Telemetry data is temporarily unavailable."
        return context
