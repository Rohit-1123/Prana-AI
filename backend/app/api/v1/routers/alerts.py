import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.notification_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts & Advisories"])

@router.get("/active")
async def get_active_alerts(
    db: AsyncSession = Depends(get_async_db)
):
    service = AlertService(db)
    res = await service.get_active_alerts()
    return {
        "success": True,
        "message": "Currently active alerts retrieved.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.get("/history")
async def get_alerts_history(
    db: AsyncSession = Depends(get_async_db)
):
    service = AlertService(db)
    res = await service.get_alerts_history()
    return {
        "success": True,
        "message": "Alert logs history resolved.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.get("/health")
async def get_health_advisories(
    aqi: int = Query(50, description="Current AQI index value")
):
    service = AlertService(None)
    res = await service.get_health_advisories(aqi)
    return {
        "success": True,
        "message": "Subgroup health advisories generated.",
        "data": res,
        "metadata": {},
        "errors": []
    }
