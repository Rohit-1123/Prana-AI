import uuid
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.location_service import LocationService
from app.services.mission_control_service import MissionControlService
from app.exceptions.handlers import APIException
from sqlalchemy.future import select
from app.database.models.models import Location

router = APIRouter(prefix="/locations", tags=["Location Intelligence"])

@router.get("/search")
async def search_locations(
    q: str = Query(..., min_length=2, description="Address search query text")
):
    loc_service = LocationService()
    results = await loc_service.search_by_name(q)
    return {
        "success": True,
        "message": f"Search completed for query: {q}",
        "data": results,
        "metadata": {},
        "errors": []
    }

@router.get("/{location_id}")
async def get_location_details(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db)
):
    # Fetch Location details from Postgres
    query = select(Location).filter(Location.id == location_id)
    res = await db.execute(query)
    loc = res.scalars().first()
    if not loc:
        raise APIException(message="Location not found.", status_code=404)

    # Gather current statistics using MissionControlService
    mc_service = MissionControlService(db)
    summary = await mc_service.get_dashboard_summary(location_id)
    
    return {
        "success": True,
        "message": "Location details retrieved.",
        "data": {
            "id": str(loc.id),
            "name": loc.name,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "category": loc.category,
            "summary": summary
        },
        "metadata": {},
        "errors": []
    }
