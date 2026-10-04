from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.rate_limit import rate_limit
from app.schemas.schemas import CitizenQueryRequest, CitizenQueryResponse
from app.models.models import Ward, HistoricalAQI
from app.agents.citizen_agent import CitizenAdvisoryAgent, mentions
from app.services import geocode
from app.services.aqi_service import get_live_aqi

router = APIRouter(prefix="/api/chat", tags=["Citizen AI Chat"])
citizen_agent = CitizenAdvisoryAgent()


def _db_location(ward: Ward, db: Session) -> dict:
    latest = (
        db.query(HistoricalAQI)
        .filter(HistoricalAQI.ward_id == ward.id)
        .order_by(HistoricalAQI.timestamp.desc())
        .first()
    )
    return {
        "name": ward.name,
        "city": "Hyderabad",
        "aqi": latest.aqi if latest else None,
        "pm2_5": latest.pm2_5 if latest else None,
        "pm10": latest.pm10 if latest else None,
        "temperature": latest.temperature if latest else None,
        "humidity": latest.humidity if latest else None,
        "wind_speed": latest.wind_speed if latest else None,
        "weather_condition": latest.weather_condition if latest else None,
    }


def _lookup_unknown_place(query: str, focus: dict, locations: list) -> None:
    """If the question names a place we have no reading for, geocode it and add its live reading (marked `asked`)."""
    known = [focus, *locations]
    if any(mentions(query, loc["name"]) or (loc.get("city") and mentions(query, loc["city"])) for loc in known):
        return
    for name in geocode.candidates(query):
        place = geocode.find_place(name)
        live = place and get_live_aqi(place["lat"], place["lng"])
        if live:
            locations.append({
                "name": place["name"], "city": place["city"], "aqi": live["aqi"], "pm2_5": live["pm2_5"], "pm10": live["pm10"],
                "temperature": live.get("temperature"), "humidity": live.get("humidity"), "wind_speed": live.get("wind_speed"),
                "weather_condition": live.get("weather_condition"),
                "forecast_24h": live["forecast"][0]["predicted_aqi"] if live.get("forecast") else None, "asked": True,
            })
            return


@router.post("/query", response_model=CitizenQueryResponse, dependencies=[Depends(rate_limit(20, 60))])
def citizen_query(payload: CitizenQueryRequest, db: Session = Depends(get_db)):
    """
    Answers a citizen question using live readings for the focus location (and other known
    locations for comparisons). The client sends the live context it is displaying, so any
    city works; `ward_id` remains for backend (stored) wards.
    """
    if payload.ward:
        focus = payload.ward.model_dump()
        locations = [loc.model_dump() for loc in payload.locations]
    else:
        ward = db.query(Ward).filter(Ward.id == payload.ward_id).first() if payload.ward_id else None
        if not ward:
            raise HTTPException(status_code=404, detail="Ward not found.")
        focus = _db_location(ward, db)
        if focus["aqi"] is None:
            raise HTTPException(status_code=503, detail="No readings available for this ward yet.")
        locations = [_db_location(w, db) for w in db.query(Ward).all()]
        locations = [loc for loc in locations if loc["aqi"] is not None]

    _lookup_unknown_place(payload.query, focus, locations)

    advisory = citizen_agent.get_health_advisory(
        focus, payload.query, locations,
        history=[t.model_dump() for t in payload.history],
        language=payload.language,
    )

    return CitizenQueryResponse(
        ward_name=focus["name"],
        current_aqi=focus["aqi"],
        air_quality_rating=advisory["air_quality_rating"],
        rating_color=advisory["rating_color"],
        query=payload.query,
        advisory_response=advisory["advisory_response"],
        recommended_clean_routes=advisory["recommended_clean_routes"]
    )
