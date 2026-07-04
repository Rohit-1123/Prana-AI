import uuid
import json
import time
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.forecast_service import ForecastService
from app.cache.redis import cache
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/forecast", tags=["Prediction Engine"])

@router.get("/current")
async def get_current(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    cache_key = f"api:fc:current:{location_id}"
    cached = await cache.get(cache_key)
    if cached:
        return {
            "success": True,
            "message": "Current forecast retrieved.",
            "data": json.loads(cached),
            "metadata": {"cache": True},
            "errors": []
        }

    fc_service = ForecastService(db)
    data = await fc_service.get_current_forecast(location_id)
    # Serialize datetime parameters
    data_serializable = data.copy()
    data_serializable["prediction_time"] = data["prediction_time"].isoformat()

    await cache.set(cache_key, json.dumps(data_serializable), expire_seconds=300)

    return {
        "success": True,
        "message": "Current forecast retrieved.",
        "data": data_serializable,
        "metadata": {"cache": False},
        "errors": []
    }

@router.get("/timeline")
async def get_timeline(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    horizon: int = Query(24, description="Horizon steps in hours"),
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    timeline = await fc_service.get_timeline_forecast(location_id, horizon)
    
    # Serialize datetimes
    serializable = []
    for item in timeline:
        copy_item = item.copy()
        copy_item["time"] = item["time"].isoformat()
        serializable.append(copy_item)

    return {
        "success": True,
        "message": "Timeline forecast retrieved.",
        "data": serializable,
        "metadata": {},
        "errors": []
    }

@router.get("/location/{location_id}")
async def get_location_forecast(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    current = await fc_service.get_current_forecast(location_id)
    timeline = await fc_service.get_timeline_forecast(location_id, 24)
    comparison = await fc_service.get_historical_comparison(location_id)

    # Serialize times
    current["prediction_time"] = current["prediction_time"].isoformat()
    for t in timeline:
        t["time"] = t["time"].isoformat()

    return {
        "success": True,
        "message": "Complete location forecast stats compiled.",
        "data": {
            "current": current,
            "timeline": timeline,
            "comparison": comparison
        },
        "metadata": {},
        "errors": []
    }

@router.get("/comparison")
async def get_comparison(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    comp = await fc_service.get_historical_comparison(location_id)
    return {
        "success": True,
        "message": "Historical comparison computed.",
        "data": comp,
        "metadata": {},
        "errors": []
    }

@router.get("/confidence")
async def get_confidence(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    confidence = await fc_service.get_explainability(location_id)
    return {
        "success": True,
        "message": "Explainability confidence metrics retrieved.",
        "data": confidence,
        "metadata": {},
        "errors": []
    }

@router.get("/analytics")
async def get_analytics(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    analytics = await fc_service.get_forecast_analytics(location_id)
    return {
        "success": True,
        "message": "Forecast analytics aggregated successfully.",
        "data": analytics,
        "metadata": {},
        "errors": []
    }

@router.get("/table")
async def get_table(
    location_id: uuid.UUID = Query(..., description="Target Location UUID"),
    db: AsyncSession = Depends(get_async_db)
):
    fc_service = ForecastService(db)
    timeline = await fc_service.get_timeline_forecast(location_id, 12)
    
    # Format to table details
    rows = []
    for item in timeline:
        rows.append({
            "timestamp": item["time"].isoformat(),
            "predicted_aqi": item["predicted_aqi"],
            "confidence": item["confidence"],
            "weather_summary": item["weather_summary"],
            "model": "XGBoost",
            "status": "ready"
        })

    return {
        "success": True,
        "message": "Forecast timeline ledger compiled.",
        "data": rows,
        "metadata": {},
        "errors": []
    }

@router.get("/model")
async def get_model_info():
    return {
        "success": True,
        "message": "Active model registry metadata retrieved.",
        "data": {
            "model_name": "XGBoost Regressor Model",
            "version": "1.0.0",
            "training_date": "2026-06-25T00:00:00Z",
            "accuracy_r2": 0.89,
            "prediction_horizon_hours": 72
        },
        "metadata": {},
        "errors": []
    }
