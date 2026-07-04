import os
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.routers import auth, dashboard, simulation, chat, reports, map
from app.services.seeder import seed_database

# Version 1 foundations imports
from app.api.v1.routers import health, auth as v1_auth, users as v1_users, mission_control as v1_mission_control, locations as v1_locations, digital_twin as v1_digital_twin, forecast as v1_forecast, environment as v1_environment, ai as v1_ai, reports as v1_reports, notifications as v1_notifications, alerts as v1_alerts, jobs as v1_jobs
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.exceptions.handlers import (
    APIException,
    api_exception_handler,
    validation_exception_handler,
    global_exception_handler
)

# Create tables
Base.metadata.create_all(bind=engine)

# Auto seed database on startup if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="PranaAI - Urban Environmental Decision Intelligence API",
    description="Enterprise-grade AI-powered Smart City Environmental Platform API.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development and production domains
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)

# Custom exception handlers registration
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Register routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(simulation.router)
app.include_router(chat.router)
app.include_router(reports.router)
app.include_router(map.router)

# v1 Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(v1_auth.router, prefix="/api/v1")
app.include_router(v1_users.router, prefix="/api/v1")
app.include_router(v1_mission_control.router, prefix="/api/v1")
app.include_router(v1_locations.router, prefix="/api/v1")
app.include_router(v1_digital_twin.router, prefix="/api/v1")
app.include_router(v1_forecast.router, prefix="/api/v1")
app.include_router(v1_environment.router, prefix="/api/v1")
app.include_router(v1_ai.router, prefix="/api/v1")
app.include_router(v1_reports.router, prefix="/api/v1")
app.include_router(v1_notifications.router, prefix="/api/v1")
app.include_router(v1_alerts.router, prefix="/api/v1")
app.include_router(v1_jobs.router, prefix="/api/v1")









@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PranaAI Decision Intelligence Backend",
        "docs": "/docs"
    }
