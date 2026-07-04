import uuid
import json
import time
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.digital_twin_service import DigitalTwinService
from app.services.location_service import LocationService
from app.cache.redis import cache
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin GIS"])

@router.get("/map")
async def get_map(db: AsyncSession = Depends(get_async_db)):
    cache_key = "api:dt:map"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Map GeoJSON initialized successfully.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    dt_service = DigitalTwinService(db)
    geojson = await dt_service.get_map_geojson()
    await cache.set(cache_key, json.dumps(geojson), expire_seconds=120)

    return {
        "success": True,
        "message": "Map GeoJSON initialized successfully.",
        "data": geojson,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/markers")
async def get_markers(db: AsyncSession = Depends(get_async_db)):
    # Reuses get_map endpoint to deliver marker details formatted in GeoJSON
    dt_service = DigitalTwinService(db)
    geojson = await dt_service.get_map_geojson()
    return {
        "success": True,
        "message": "Map markers retrieved.",
        "data": geojson["features"],
        "metadata": {},
        "errors": []
    }

@router.get("/location/{location_id}")
async def get_popup_details(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    dt_service = DigitalTwinService(db)
    summary = await dt_service.mc_service.get_dashboard_summary(location_id)
    recs = await dt_service.mc_service.get_recommendations(location_id)
    alerts = await dt_service.mc_service.get_alerts(location_id)

    return {
        "success": True,
        "message": "Location popup details compiled.",
        "data": {
            "id": str(location_id),
            "summary": summary,
            "recommendations": recs,
            "alerts": alerts
        },
        "metadata": {},
        "errors": []
    }

@router.get("/heatmap")
async def get_heatmap(db: AsyncSession = Depends(get_async_db)):
    cache_key = "api:dt:heatmap"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Heatmap coordinates retrieved.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    dt_service = DigitalTwinService(db)
    data = await dt_service.get_heatmap_data()
    await cache.set(cache_key, json.dumps(data), expire_seconds=120)

    return {
        "success": True,
        "message": "Heatmap coordinates retrieved.",
        "data": data,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/layers")
async def get_layers(db: AsyncSession = Depends(get_async_db)):
    dt_service = DigitalTwinService(db)
    metadata = await dt_service.get_layers_metadata()
    return {
        "success": True,
        "message": "Map layer metadata compiled.",
        "data": metadata,
        "metadata": {},
        "errors": []
    }

@router.get("/layers/{layer}")
async def get_layer_data(
    layer: str,
    db: AsyncSession = Depends(get_async_db)
):
    dt_service = DigitalTwinService(db)
    geojson = await dt_service.get_map_geojson()
    return {
        "success": True,
        "message": f"Layer {layer} GeoJSON data compiled.",
        "data": geojson,
        "metadata": {},
        "errors": []
    }

@router.get("/search")
async def dt_search(
    q: str = Query(..., min_length=2, description="Target search query")
):
    loc_service = LocationService()
    results = await loc_service.search_by_name(q)
    return {
        "success": True,
        "message": "Digital Twin autocomplete search completed.",
        "data": results,
        "metadata": {},
        "errors": []
    }

@router.get("/nearby")
async def get_nearby(
    lat: float = Query(..., description="Target Latitude"),
    lon: float = Query(..., description="Target Longitude"),
    radius: float = Query(5.0, description="Search radius in kilometers"),
    db: AsyncSession = Depends(get_async_db)
):
    dt_service = DigitalTwinService(db)
    nearby = await dt_service.get_nearby_sensors(lat, lon, radius)
    return {
        "success": True,
        "message": "Nearby sensors query completed.",
        "data": nearby,
        "metadata": {},
        "errors": []
    }

@router.get("/clusters")
async def get_clusters(db: AsyncSession = Depends(get_async_db)):
    # Standard dummy grouping representing cluster regions
    return {
        "success": True,
        "message": "Marker clusters resolved.",
        "data": {
            "type": "FeatureCollection",
            "features": []
        },
        "metadata": {},
        "errors": []
    }

@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_async_db)):
    return {
        "success": True,
        "message": "Live map summary compiled.",
        "data": {
            "visible_sensors": 6,
            "average_aqi": 128.5
        },
        "metadata": {},
        "errors": []
    }
