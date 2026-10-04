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
class LocationContext(BaseModel):
    """Live readings for a place, supplied by the client (used only as context for its own answer)."""
    name: str = Field(min_length=1, max_length=80)
    city: Optional[str] = Field(None, max_length=40)
    aqi: int = Field(ge=0, le=999)
    pm2_5: Optional[float] = Field(None, ge=0, le=2000)
    pm10: Optional[float] = Field(None, ge=0, le=3000)
    temperature: Optional[float] = Field(None, ge=-60, le=60)
    humidity: Optional[float] = Field(None, ge=0, le=100)
    wind_speed: Optional[float] = Field(None, ge=0, le=100)
    weather_condition: Optional[str] = Field(None, max_length=30)
    forecast_24h: Optional[int] = Field(None, ge=0, le=999)

class ChatTurn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    text: str = Field(max_length=2000)

class CitizenQueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=1000)
    ward_id: Optional[int] = None  # legacy: backend ward; ignored when `ward` is given
    ward: Optional[LocationContext] = None
    locations: List[LocationContext] = Field(default_factory=list, max_length=200)
    history: List[ChatTurn] = Field(default_factory=list, max_length=10)
    language: str = Field("en", pattern="^(en|hi|te|ta|kn)$")

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
