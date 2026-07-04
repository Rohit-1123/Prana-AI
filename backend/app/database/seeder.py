import asyncio
import json
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import AsyncSessionLocal, engine
from app.database.models.models import (
    User,
    UserSettings,
    City,
    Location,
    AQIObservation,
    WeatherObservation,
    Forecast,
    SystemConfiguration
)
from app.security.security import get_password_hash

async def seed_postgres():
    print("Seeding PostgreSQL PostGIS Database...")
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        if count > 0:
            print("PostgreSQL Database already seeded. Skipping.")
            return

        # 1. Create Default Users (Admin & Developer)
        admin_id = uuid.uuid4()
        admin_user = User(
            id=admin_id,
            email="admin@prana.ai",
            hashed_password=get_password_hash("admin123"),
            full_name="Municipal Commissioner",
            role="Administrator",
            organization="GHMC",
            status="active"
        )
        
        dev_user = User(
            id=uuid.uuid4(),
            email="developer@prana.ai",
            hashed_password=get_password_hash("developer123"),
            full_name="Software Developer",
            role="Researcher",
            organization="PranaAI Tech",
            status="active"
        )

        session.add_all([admin_user, dev_user])
        await session.flush()

        # Seed Settings
        admin_settings = UserSettings(
            user_id=admin_id,
            theme="dark",
            default_location="Gachibowli",
            timezone="IST",
            measurement_units="metric",
            notification_preferences="all",
            map_preferences="{}"
        )
        session.add(admin_settings)

        # 2. Create City (Hyderabad) with PostGIS boundary polygon
        city_id = uuid.uuid4()
        # Create a bounding box polygon for Hyderabad region
        boundary_wkt = "POLYGON((78.20 17.30, 78.50 17.30, 78.50 17.60, 78.20 17.60, 78.20 17.30))"
        
        city = City(
            id=city_id,
            name="Hyderabad",
            state="Telangana",
            country="India",
            latitude=17.4401,
            longitude=78.3489,
            boundary_geom=text(f"ST_GeomFromText('{boundary_wkt}', 4326)"),
            population=10000000,
            timezone="IST",
            status="active"
        )
        session.add(city)
        await session.flush()

        # 3. Create Locations (Gachibowli & Hitech City) with PostGIS POINTs
        gachibowli_id = uuid.uuid4()
        gachibowli = Location(
            id=gachibowli_id,
            city_id=city_id,
            name="Gachibowli",
            latitude=17.4401,
            longitude=78.3489,
            point_geom=text("ST_GeomFromText('POINT(78.3489 17.4401)', 4326)"),
            postal_code="500032",
            category="Commercial",
            status="active"
        )

        hitech_id = uuid.uuid4()
        hitech = Location(
            id=hitech_id,
            city_id=city_id,
            name="Hitech City",
            latitude=17.4504,
            longitude=78.3809,
            point_geom=text("ST_GeomFromText('POINT(78.3809 17.4504)', 4326)"),
            postal_code="500081",
            category="Commercial",
            status="active"
        )

        session.add_all([gachibowli, hitech])
        await session.flush()

        # 4. Create Observations (AQI & Weather)
        now_time = datetime.now(timezone.utc)
        
        aqi_gachibowli = AQIObservation(
            location_id=gachibowli_id,
            aqi=145,
            pm2_5=58.0,
            pm10=85.0,
            no2=24.5,
            so2=12.2,
            co=0.8,
            o3=45.0,
            category="Moderate",
            timestamp=now_time,
            data_source="sensor_network",
            quality_score=0.95
        )

        weather_gachibowli = WeatherObservation(
            location_id=gachibowli_id,
            temperature=31.5,
            humidity=55.0,
            pressure=1012.0,
            wind_speed=6.2,
            wind_direction=240.0,
            visibility=10.0,
            uv_index=8.0,
            rainfall=0.0,
            timestamp=now_time
        )

        # 5. Create Forecasts
        forecast_gachibowli = Forecast(
            location_id=gachibowli_id,
            forecast_time=now_time + timedelta(hours=24),
            predicted_aqi=152,
            confidence_score=0.91,
            prediction_model="XGBoost",
            version="1.0.0"
        )

        # 6. System Configuration
        sys_config = SystemConfiguration(
            setting_key="maintenance_mode",
            setting_value="false",
            description="Toggles maintenance splash screens"
        )

        session.add_all([aqi_gachibowli, weather_gachibowli, forecast_gachibowli, sys_config])
        await session.commit()
        print("PostgreSQL Database Seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_postgres())
