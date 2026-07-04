from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.models import Ward, Infrastructure, HistoricalAQI

router = APIRouter(prefix="/api/map", tags=["GIS & Map Layers"])

@router.get("/geojson")
def get_wards_geojson(db: Session = Depends(get_db)):
    """
    Returns a unified GeoJSON FeatureCollection containing all ward boundaries
    and their current AQI levels to paint the map layers.
    """
    wards = db.query(Ward).all()
    features = []
    
    for ward in wards:
        latest = (
            db.query(HistoricalAQI)
            .filter(HistoricalAQI.ward_id == ward.id)
            .order_by(HistoricalAQI.timestamp.desc())
            .first()
        )
        
        aqi_val = latest.aqi if latest else 50
        
        # Load boundary coordinate string
        boundary = {}
        if ward.boundary_geojson:
            try:
                boundary = json.loads(ward.boundary_geojson)
            except Exception:
                pass
                
        if boundary:
            # Inject AQI and status properties into GeoJSON
            if "properties" not in boundary:
                boundary["properties"] = {}
            boundary["properties"]["ward_id"] = ward.id
            boundary["properties"]["ward_name"] = ward.name
            boundary["properties"]["ward_number"] = ward.ward_number
            boundary["properties"]["aqi"] = aqi_val
            boundary["properties"]["green_cover_pct"] = ward.green_cover_pct
            
            features.append(boundary)
            
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/points")
def get_infrastructure_points(db: Session = Depends(get_db)):
    """
    Returns coordinate markers for hospitals, schools, industries, and construction zones
    along with their metadata parameters.
    """
    infra_items = db.query(Infrastructure).all()
    results = []
    
    for item in infra_items:
        details_parsed = {}
        if item.details:
            try:
                details_parsed = json.loads(item.details)
            except Exception:
                pass
                
        results.append({
            "id": item.id,
            "ward_id": item.ward_id,
            "ward_name": item.ward.name,
            "name": item.name,
            "type": item.type, # Hospital, School, Industry, Construction
            "latitude": item.latitude,
            "longitude": item.longitude,
            "details": details_parsed
        })
        
    return results
