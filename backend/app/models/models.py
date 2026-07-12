from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Citizen") # Citizen, Municipal Officer, Pollution Control Board, Urban Planner
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    simulations = relationship("Simulation", back_populates="user")
    reports = relationship("Report", back_populates="user")

class City(Base):
    __tablename__ = "cities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    wards = relationship("Ward", back_populates="city")

class Ward(Base):
    __tablename__ = "wards"
    
    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    ward_number = Column(Integer, nullable=False)
    boundary_geojson = Column(Text, nullable=True) # Storing GeoJSON string for cross-compatibility (SQLite/PostgreSQL)
    population = Column(Integer, default=50000)
    area_sqkm = Column(Float, default=10.0)
    green_cover_pct = Column(Float, default=20.0)
    
    city = relationship("City", back_populates="wards")
    historical_aqi = relationship("HistoricalAQI", back_populates="ward")
    infrastructure = relationship("Infrastructure", back_populates="ward")
    predictions = relationship("Prediction", back_populates="ward")
    alerts = relationship("Alert", back_populates="ward")
    recommendations = relationship("Recommendation", back_populates="ward")
    simulations = relationship("Simulation", back_populates="ward")

class HistoricalAQI(Base):
    __tablename__ = "historical_aqi"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    pm2_5 = Column(Integer, nullable=False)
    pm10 = Column(Integer, nullable=False)
    aqi = Column(Integer, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    wind_direction = Column(Float, nullable=False)
    uv_index = Column(Integer, default=0)
    weather_condition = Column(String, nullable=False) # Sunny, Cloudy, Rainy, Windy, Foggy
    traffic_congestion = Column(Float, default=0.0) # 0-100
    construction_activity = Column(Float, default=0.0) # 0-100
    industrial_emissions = Column(Float, default=0.0) # 0-100
    dust_level = Column(Float, default=0.0) # 0-100
    
    ward = relationship("Ward", back_populates="historical_aqi")

class Infrastructure(Base):
    __tablename__ = "infrastructure"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # Hospital, School, Industry, Construction
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    details = Column(Text, nullable=True) # Extra info (JSON format)
    
    ward = relationship("Ward", back_populates="infrastructure")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False) # Prediction Target Time
    lead_time_hours = Column(Integer, nullable=False) # 24, 48, 72
    predicted_aqi = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    model_used = Column(String, default="XGBoost")
    
    ward = relationship("Ward", back_populates="predictions")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False) # Low, Medium, High, Critical
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Active") # Active, Resolved
    
    ward = relationship("Ward", back_populates="alerts")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    intervention_type = Column(String, nullable=False) # Restrict Trucks, Water Sprinkling, etc.
    estimated_aqi_reduction = Column(Integer, nullable=False)
    details = Column(Text, nullable=True)
    
    ward = relationship("Ward", back_populates="recommendations")

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    intervention = Column(String, nullable=False)
    duration_hours = Column(Integer, nullable=False)
    predicted_aqi_reduction = Column(Integer, nullable=False)
    population_impacted = Column(Integer, nullable=False)
    hospitals_benefited = Column(Integer, nullable=False)
    schools_benefited = Column(Integer, nullable=False)
    
    user = relationship("User", back_populates="simulations")
    ward = relationship("Ward", back_populates="simulations")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False) # Weekly, Monthly, Yearly
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    summary = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="reports")

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

