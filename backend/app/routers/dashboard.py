from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.models import Ward, HistoricalAQI, Alert
from app.schemas.schemas import WardIntelligenceResponse, HistoricalAQIResponse
from app.agents.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])
orchestrator = AgentOrchestrator()

@router.get("/wards")
def get_wards_summary(db: Session = Depends(get_db)):
    """
    Returns a brief dashboard summary for all wards in the city,
    including latest AQI, temperature, weather, and general metrics.
    """
    wards = db.query(Ward).all()
    results = []
    
    for ward in wards:
        latest = (
            db.query(HistoricalAQI)
            .filter(HistoricalAQI.ward_id == ward.id)
            .order_by(HistoricalAQI.timestamp.desc())
            .first()
        )
        
        if latest:
            # Simple EHS calculation
            green_factor = ward.green_cover_pct * 0.5
            aqi_penalty = max(0, min(60, (latest.aqi / 500) * 60))
            traffic_penalty = (latest.traffic_congestion / 100) * 10
            ind_penalty = (latest.industrial_emissions / 100) * 10
            ehs = max(10, min(100, int(100 + green_factor - aqi_penalty - traffic_penalty - ind_penalty)))
            
            results.append({
                "id": ward.id,
                "name": ward.name,
                "ward_number": ward.ward_number,
                "population": ward.population,
                "area_sqkm": ward.area_sqkm,
                "green_cover_pct": ward.green_cover_pct,
                "aqi": latest.aqi,
                "pm2_5": latest.pm2_5,
                "pm10": latest.pm10,
                "temperature": latest.temperature,
                "humidity": latest.humidity,
                "wind_speed": latest.wind_speed,
                "weather_condition": latest.weather_condition,
                "environmental_health_score": ehs
            })
        else:
            results.append({
                "id": ward.id,
                "name": ward.name,
                "ward_number": ward.ward_number,
                "population": ward.population,
                "area_sqkm": ward.area_sqkm,
                "green_cover_pct": ward.green_cover_pct,
                "aqi": 50,
                "pm2_5": 15,
                "pm10": 30,
                "temperature": 25.0,
                "humidity": 50.0,
                "wind_speed": 5.0,
                "weather_condition": "Sunny",
                "environmental_health_score": 85
            })
            
    return results

@router.get("/wards/{ward_id}/intelligence", response_model=WardIntelligenceResponse)
def get_ward_intelligence(ward_id: int, db: Session = Depends(get_db)):
    """
    Triggers the multi-agent decision intelligence pipeline for the specified ward.
    Exposes forecasts, explanations, attributions, and intervention guidelines.
    """
    try:
        intelligence = orchestrator.get_ward_intelligence(db, ward_id)
        return intelligence
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intelligence compilation error: {e}")

@router.get("/alerts")
def get_active_alerts(db: Session = Depends(get_db)):
    """
    Returns all active system alerts across wards (e.g. Critical AQI hotspots).
    If no alerts are present in the DB, it dynamically generates alerts for wards with AQI > 150.
    """
    alerts = db.query(Alert).filter(Alert.status == "Active").all()
    
    if not alerts:
        # Dynamically generate temporary alerts for high AQI wards to demonstrate functionality
        wards = db.query(Ward).all()
        for w in wards:
            latest = db.query(HistoricalAQI).filter(HistoricalAQI.ward_id == w.id).order_by(HistoricalAQI.timestamp.desc()).first()
            if latest and latest.aqi > 200:
                new_alert = Alert(
                    ward_id=w.id,
                    title="Critical AQI Advisory",
                    description=f"AQI in {w.name} is currently at {latest.aqi} due to high industrial emissions and dust levels. Outdoor activities should be restricted.",
                    severity="Critical"
                )
                db.add(new_alert)
            elif latest and latest.aqi > 150:
                new_alert = Alert(
                    ward_id=w.id,
                    title="Poor Air Quality Alert",
                    description=f"AQI in {w.name} has crossed {latest.aqi}. Traffic and dust suppressions are advised.",
                    severity="High"
                )
                db.add(new_alert)
        db.commit()
        alerts = db.query(Alert).filter(Alert.status == "Active").all()
        
    return [
        {
            "id": a.id,
            "ward_id": a.ward_id,
            "ward_name": a.ward.name,
            "title": a.title,
            "description": a.description,
            "severity": a.severity,
            "created_at": a.created_at,
            "status": a.status
        }
        for a in alerts
    ]
