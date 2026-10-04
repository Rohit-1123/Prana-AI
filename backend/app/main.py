import os
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.routers import auth, dashboard, simulation, chat, reports, map
from app.services.seeder import seed_database
from app.core.config.settings import settings

# Version 1 foundations imports
from app.api.v1.routers import health, auth as v1_auth, users as v1_users, mission_control as v1_mission_control, locations as v1_locations, digital_twin as v1_digital_twin, forecast as v1_forecast, environment as v1_environment, ai as v1_ai, reports as v1_reports, notifications as v1_notifications, alerts as v1_alerts, jobs as v1_jobs
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.core.rate_limit import rate_limit
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
# Set BACKEND_CORS_ORIGINS='["https://your-frontend.example"]' in .env for deployments
origins = settings.BACKEND_CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Dev servers hop ports (5173 -> 5174 ...); production stays on the explicit allow-list
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+" if settings.ENVIRONMENT == "development" else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Brute-force protection for credential endpoints (per IP, per route)
auth_limit = [Depends(rate_limit(10, 60))]

# Custom exception handlers registration
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Register routers
app.include_router(auth.router, dependencies=auth_limit)
app.include_router(dashboard.router)
app.include_router(simulation.router)
app.include_router(chat.router)
app.include_router(reports.router)
app.include_router(map.router)

# v1 Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(v1_auth.router, prefix="/api/v1", dependencies=auth_limit)
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
