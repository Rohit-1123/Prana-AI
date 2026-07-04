from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str = "Citizen" # Citizen, Municipal Officer, Pollution Control Board, Urban Planner

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- GIS / MAP SCHEMAS ---
class CityResponse(BaseModel):
    id: int
    name: str
    state: str
    country: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class WardResponse(BaseModel):
    id: int
    city_id: int
    name: str
    ward_number: int
    boundary_geojson: Optional[str] = None
    population: int
    area_sqkm: float
    green_cover_pct: float

    class Config:
        from_attributes = True

class HistoricalAQIResponse(BaseModel):
    id: int
    ward_id: int
    timestamp: datetime
    pm2_5: int
    pm10: int
    aqi: int
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: float
    weather_condition: str
    traffic_congestion: float
    construction_activity: float
    industrial_emissions: float
    dust_level: float

    class Config:
        from_attributes = True

class InfrastructureResponse(BaseModel):
    id: int
    ward_id: int
    name: str
    type: str # Hospital, School, Industry, Construction
    latitude: float
    longitude: float
    details: Optional[str] = None

    class Config:
        from_attributes = True

# --- SIMULATOR SCHEMAS ---
class SimulationRequest(BaseModel):
    ward_id: int
    intervention: str # e.g. "Restrict Trucks", "Water Sprinkling", etc.
    duration_hours: int = Field(..., ge=1, le=48)

class SimulationResponse(BaseModel):
    id: Optional[int] = None
    ward_id: int
    ward_name: str
    intervention: str
    duration_hours: int
    predicted_aqi_reduction: int
    population_impacted: int
    hospitals_benefited: int
    schools_benefited: int
    timestamp: datetime

# --- CITIZEN AI SCHEMAS ---
class CitizenQueryRequest(BaseModel):
    ward_id: int
    query: str

class RouteSuggestion(BaseModel):
    name: str
    aqi: int
    reason: str

class CitizenQueryResponse(BaseModel):
    ward_name: str
    current_aqi: int
    air_quality_rating: str
    rating_color: str
    query: str
    advisory_response: str
    recommended_clean_routes: List[RouteSuggestion]

# --- INTELLIGENCE / AGENTS WORKFLOW RESPONSE ---
class ForecastResponse(BaseModel):
    horizon_hours: int
    predicted_aqi: int
    confidence_score: float
    trend: str

class AttributionResponse(BaseModel):
    source: str
    percentage: float
    confidence: float

class RecommendationResponse(BaseModel):
    id: str
    name: str
    description: str
    target_source: str
    estimated_aqi_reduction: int
    cost_level: str
    difficulty: str

class ExplanationResponse(BaseModel):
    primary_driver: str
    narrative_explanation: str

class WardIntelligenceResponse(BaseModel):
    ward_id: int
    ward_name: str
    population: int
    area_sqkm: float
    green_cover_pct: float
    environmental_health_score: int
    current_metrics: Dict[str, Any]
    predictions: List[ForecastResponse]
    source_attributions: List[AttributionResponse]
    explanation: ExplanationResponse
    recommendations: List[RecommendationResponse]
    recommendations_brief: str

# --- REPORTS SCHEMAS ---
class ReportResponse(BaseModel):
    id: int
    title: str
    type: str # Weekly, Monthly, Yearly
    file_path: str
    created_at: datetime
    summary: Optional[str] = None

    class Config:
        from_attributes = True
