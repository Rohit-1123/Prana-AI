import uuid
import json
import time
from typing import List
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.environmental_intelligence_service import EnvironmentalIntelligenceService
from app.cache.redis import cache
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/environment", tags=["Environmental Analytics"])

@router.get("/intelligence")
async def get_intelligence_overview(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    cache_key = f"api:env:overview:{location_id}"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Environmental intelligence overview retrieved.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    env_service = EnvironmentalIntelligenceService(db)
    data = await env_service.get_overview(location_id)
    # Serialize datetime
    data_serializable = data.copy()
    data_serializable["generated_at"] = data["generated_at"].isoformat()

    await cache.set(cache_key, json.dumps(data_serializable), expire_seconds=300)

    return {
        "success": True,
        "message": "Environmental intelligence overview retrieved.",
        "data": data_serializable,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/trends")
async def get_trends_analysis(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    period: int = Query(24, description="Horizon steps in hours"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    trends = await env_service.get_trends(location_id, period)

    # Serialize datetimes
    serializable = trends.copy()
    serializable["timeline"] = []
    for item in trends["timeline"]:
        copy_item = item.copy()
        copy_item["timestamp"] = item["timestamp"].isoformat()
        serializable["timeline"].append(copy_item)

    return {
        "success": True,
        "message": "Trends timeline analysis retrieved.",
        "data": serializable,
        "metadata": {},
        "errors": []
    }

@router.get("/comparison")
async def get_comparison(
    location_ids: List[uuid.UUID] = Query(..., description="List of location UUIDs to compare"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    comparison = await env_service.get_comparison(location_ids)
    return {
        "success": True,
        "message": "Locations comparison compiled.",
        "data": comparison,
        "metadata": {},
        "errors": []
    }

@router.get("/hotspots")
async def get_hotspots(db: AsyncSession = Depends(get_async_db)):
    cache_key = "api:env:hotspots"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Ranked hotspot indicators compiled.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    env_service = EnvironmentalIntelligenceService(db)
    data = await env_service.get_hotspots()
    await cache.set(cache_key, json.dumps(data), expire_seconds=300)

    return {
        "success": True,
        "message": "Ranked hotspot indicators compiled.",
        "data": data,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/pollution-breakdown")
async def get_breakdown(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    breakdown = await env_service.get_pollution_attribution(location_id)
    return {
        "success": True,
        "message": "Rule-based source breakdown computed.",
        "data": breakdown,
        "metadata": {},
        "errors": []
    }

@router.get("/indicators")
async def get_indicators(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    indicators = await env_service.get_indicators(location_id)
    return {
        "success": True,
        "message": "Environmental indicators compiled.",
        "data": indicators,
        "metadata": {},
        "errors": []
    }

@router.get("/history")
async def get_history(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    # Returns last 24h of history logs formatted cleanly
    env_service = EnvironmentalIntelligenceService(db)
    trends = await env_service.get_trends(location_id, 24)
    
    # Serialize datetimes
    rows = []
    for item in trends["timeline"]:
        rows.append({
            "timestamp": item["timestamp"].isoformat(),
            "aqi": item["aqi"],
            "pm2_5": item["pm2_5"],
            "pm10": item["pm10"],
            "temperature": item["temperature"],
            "humidity": item["humidity"],
            "wind_speed": item["wind_speed"]
        })

    return {
        "success": True,
        "message": "Historical chronological ledger retrieved.",
        "data": rows,
        "metadata": {},
        "errors": []
    }

@router.get("/statistics")
async def get_statistics(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    stats = await env_service.get_statistics(location_id)
    return {
        "success": True,
        "message": "Detailed mathematical metrics retrieved.",
        "data": stats,
        "metadata": {},
        "errors": []
    }

@router.get("/insights")
async def get_insights(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    insights = await env_service.get_insights(location_id)
    return {
        "success": True,
        "message": "Deterministic summaries compiled.",
        "data": insights,
        "metadata": {},
        "errors": []
    }

@router.get("/risk")
async def get_risk(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    env_service = EnvironmentalIntelligenceService(db)
    risk = await env_service.get_risk_analysis(location_id)
    return {
        "success": True,
        "message": "Risk impact scores computed.",
        "data": risk,
        "metadata": {},
        "errors": []
    }
