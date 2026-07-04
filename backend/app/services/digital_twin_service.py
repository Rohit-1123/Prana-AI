import uuid
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import Location, AQIObservation, WeatherObservation
from app.services.mission_control_service import MissionControlService
from app.core.logging.logger import logger

class DigitalTwinService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.mc_service = MissionControlService(db)

    async def get_map_geojson(self) -> Dict[str, Any]:
        """Exposes raw coordinates in standardized GeoJSON FeatureCollection structures."""
        query = select(Location).filter(Location.status == "active")
        res = await self.db.execute(query)
        locations = res.scalars().all()

        features = []
        for loc in locations:
            summary = await self.mc_service.get_dashboard_summary(loc.id)
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [loc.longitude, loc.latitude]
                },
                "properties": {
                    "id": str(loc.id),
                    "name": loc.name,
                    "category": loc.category,
                    "aqi": summary["aqi"],
                    "weather": summary["weather"],
                    "health_score": summary["health_score"]
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    async def get_heatmap_data(self) -> List[Dict[str, Any]]:
        """Compiles AQI coordinates and weights to populate Leaflet heatmaps."""
        query = select(Location).filter(Location.status == "active")
        res = await self.db.execute(query)
        locations = res.scalars().all()

        heatmap = []
        for loc in locations:
            summary = await self.mc_service.get_dashboard_summary(loc.id)
            heatmap.append({
                "lat": loc.latitude,
                "lng": loc.longitude,
                "aqi": summary["aqi"],
                "weight": min(summary["aqi"] / 300.0, 1.0), # normalize weight
                "radius": 25.0
            })
        return heatmap

    async def get_nearby_sensors(self, lat: float, lon: float, radius_km: float) -> List[Dict[str, Any]]:
        # Perform standard proximity calculations
        query = select(Location).filter(Location.status == "active")
        res = await self.db.execute(query)
        locations = res.scalars().all()

        nearby = []
        for loc in locations:
            # Quick bounding box distance check
            dist = ((loc.latitude - lat)**2 + (loc.longitude - lon)**2) ** 0.5 * 111.0 # approx km
            if dist <= radius_km:
                summary = await self.mc_service.get_dashboard_summary(loc.id)
                nearby.append({
                    "id": str(loc.id),
                    "name": loc.name,
                    "distance_km": round(dist, 2),
                    "aqi": summary["aqi"],
                    "category": summary["category"]
                })
        
        # Sort by distance
        nearby.sort(key=lambda x: x["distance_km"])
        return nearby

    async def get_layers_metadata(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "aqi_layer",
                "name": "Air Quality Index",
                "description": "Visualizes color-coded active AQI markers.",
                "visibility": True,
                "type": "sensor"
            },
            {
                "id": "weather_layer",
                "name": "Weather Conditions",
                "description": "Exposes live temperature and humidity circles.",
                "visibility": False,
                "type": "weather"
            }
        ]
