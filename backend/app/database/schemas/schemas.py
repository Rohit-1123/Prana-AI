import uuid
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# Base mixin
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# --- USERS SCHEMAS ---
class UserBase(BaseSchema):
    email: EmailStr
    full_name: str
    role: str = "Citizen"
    avatar: Optional[str] = None
    organization: Optional[str] = None
    phone: Optional[str] = None
    status: str = "active"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar: Optional[str] = None
    organization: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

# --- CITIES SCHEMAS ---
class CityBase(BaseSchema):
    name: str
    state: str
    country: str
    latitude: float
    longitude: float
    population: int = 0
    timezone: str = "IST"
    status: str = "active"

class CityCreate(CityBase):
    boundary_geojson: Optional[str] = None

class CityUpdate(BaseModel):
    population: Optional[int] = None
    status: Optional[str] = None

class CityRead(CityBase):
    id: uuid.UUID
    created_at: datetime

# --- LOCATIONS SCHEMAS ---
class LocationBase(BaseSchema):
    city_id: uuid.UUID
    name: str
    latitude: float
    longitude: float
    postal_code: Optional[str] = None
    category: str
    status: str = "active"

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    status: Optional[str] = None

class LocationRead(LocationBase):
    id: uuid.UUID
    created_at: datetime

# --- AQI SCHEMAS ---
class AQIObservationBase(BaseSchema):
    location_id: uuid.UUID
    aqi: int
    pm2_5: float
    pm10: float
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None
    category: str
    timestamp: datetime
    data_source: str = "sensor_network"
    quality_score: float = 1.0

class AQIObservationCreate(AQIObservationBase):
    pass

class AQIObservationRead(AQIObservationBase):
    id: uuid.UUID

# --- WEATHER SCHEMAS ---
class WeatherObservationBase(BaseSchema):
    location_id: uuid.UUID
    temperature: float
    humidity: float
    pressure: Optional[float] = None
    wind_speed: float
    wind_direction: float
    visibility: Optional[float] = None
    uv_index: Optional[float] = None
    rainfall: Optional[float] = None
    timestamp: datetime

class WeatherObservationCreate(WeatherObservationBase):
    pass

class WeatherObservationRead(WeatherObservationBase):
    id: uuid.UUID

# --- FORECAST SCHEMAS ---
class ForecastBase(BaseSchema):
    location_id: uuid.UUID
    forecast_time: datetime
    predicted_aqi: int
    confidence_score: float
    prediction_model: str = "XGBoost"
    version: str = "1.0.0"

class ForecastCreate(ForecastBase):
    pass

class ForecastRead(ForecastBase):
    id: uuid.UUID

# --- REPORTS SCHEMAS ---
class ReportBase(BaseSchema):
    report_name: str
    report_type: str
    status: str = "pending"
    export_format: str = "pdf"
    location_scope: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

# --- NOTIFICATIONS SCHEMAS ---
class NotificationBase(BaseSchema):
    title: str
    message: str
    priority: str = "medium"
    type: str
    read_status: bool = False

class NotificationCreate(NotificationBase):
    user_id: uuid.UUID

class NotificationRead(NotificationBase):
    id: uuid.UUID
    created_at: datetime

# --- ALERTS SCHEMAS ---
class AlertBase(BaseSchema):
    location_id: uuid.UUID
    alert_type: str
    severity: str = "warning"
    aqi_trigger: Optional[int] = None
    status: str = "active"
    resolved: bool = False

class AlertCreate(AlertBase):
    pass

class AlertRead(AlertBase):
    id: uuid.UUID
    created_at: datetime
