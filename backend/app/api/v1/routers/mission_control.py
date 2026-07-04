import uuid
import json
import time
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.mission_control_service import MissionControlService
from app.cache.redis import cache
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/mission-control", tags=["Mission Control"])

@router.get("/summary")
async def get_summary(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    cache_key = f"api:mc:summary:{location_id}"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Dashboard summary retrieved successfully.",
            "data": json.loads(cached),
            "metadata": {"cache": True, "timestamp": time.time()},
            "errors": []
        }

    mc_service = MissionControlService(db)
    data = await mc_service.get_dashboard_summary(location_id)

    # Cache for 2 minutes (120 seconds)
    await cache.set(cache_key, json.dumps(data), expire_seconds=120)

    return {
        "success": True,
        "message": "Dashboard summary retrieved successfully.",
        "data": data,
        "metadata": {"cache": False, "timestamp": time.time()},
        "errors": []
    }

@router.get("/statistics")
async def get_statistics(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    cache_key = f"api:mc:stats:{location_id}"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Statistics retrieved.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    mc_service = MissionControlService(db)
    data = await mc_service.get_statistics(location_id)
    await cache.set(cache_key, json.dumps(data), expire_seconds=120)

    return {
        "success": True,
        "message": "Statistics retrieved.",
        "data": data,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/alerts")
async def get_alerts(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    mc_service = MissionControlService(db)
    alerts = await mc_service.get_alerts(location_id)
    return {
        "success": True,
        "message": "Active alerts retrieved.",
        "data": alerts,
        "metadata": {},
        "errors": []
    }

@router.get("/recommendations")
async def get_recommendations(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    mc_service = MissionControlService(db)
    recs = await mc_service.get_recommendations(location_id)
    return {
        "success": True,
        "message": "AI Recommendations retrieved.",
        "data": recs,
        "metadata": {},
        "errors": []
    }

@router.get("/cards")
async def get_cards(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    mc_service = MissionControlService(db)
    summary = await mc_service.get_dashboard_summary(location_id)
    stats = await mc_service.get_statistics(location_id)
    alerts = await mc_service.get_alerts(location_id)
    recs = await mc_service.get_recommendations(location_id)

    cards = {
        "aqi_card": {"value": summary["aqi"], "status": summary["category"]},
        "weather_card": summary["weather"],
        "health_score_card": {"score": summary["health_score"], "category": summary["risk_category"]},
        "stats_card": stats,
        "alerts_count": len(alerts),
        "recommendations": recs
    }

    return {
        "success": True,
        "message": "Dashboard card stats compiled successfully.",
        "data": cards,
        "metadata": {},
        "errors": []
    }
