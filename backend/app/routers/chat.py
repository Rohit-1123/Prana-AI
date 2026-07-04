from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import CitizenQueryRequest, CitizenQueryResponse
from app.models.models import Ward, HistoricalAQI
from app.agents.citizen_agent import CitizenAdvisoryAgent

router = APIRouter(prefix="/api/chat", tags=["Citizen AI Chat"])
citizen_agent = CitizenAdvisoryAgent()

@router.post("/query", response_model=CitizenQueryResponse)
def citizen_query(payload: CitizenQueryRequest, db: Session = Depends(get_db)):
    """
    Takes a citizen location (ward_id) and query, retrieves current metrics,
    and calls the Citizen Advisory Agent to generate custom health/route guidelines.
    """
    ward = db.query(Ward).filter(Ward.id == payload.ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found.")
        
    latest_reading = (
        db.query(HistoricalAQI)
        .filter(HistoricalAQI.ward_id == payload.ward_id)
        .order_by(HistoricalAQI.timestamp.desc())
        .first()
    )
    
    # Default fallbacks if no history exists yet
    metrics = {
        "ward": ward.name,
        "aqi": latest_reading.aqi if latest_reading else 80,
        "pm2_5": latest_reading.pm2_5 if latest_reading else 28,
        "pm10": latest_reading.pm10 if latest_reading else 45,
        "temperature": latest_reading.temperature if latest_reading else 25.0,
        "humidity": latest_reading.humidity if latest_reading else 50.0,
        "wind_speed": latest_reading.wind_speed if latest_reading else 5.0,
        "weather_condition": latest_reading.weather_condition if latest_reading else "Sunny"
    }
    
    advisory = citizen_agent.get_health_advisory(metrics, payload.query)
    
    return CitizenQueryResponse(
        ward_name=ward.name,
        current_aqi=metrics["aqi"],
        air_quality_rating=advisory["air_quality_rating"],
        rating_color=advisory["rating_color"],
        query=payload.query,
        advisory_response=advisory["advisory_response"],
        recommended_clean_routes=advisory["recommended_clean_routes"]
    )
