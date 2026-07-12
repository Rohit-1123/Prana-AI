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

        # 3. Create Locations for all cities with PostGIS POINTs
        locations_data = [
            # Hyderabad
            {"name": "Gachibowli", "lat": 17.4401, "lon": 78.3489, "postal": "500032", "category": "Commercial", "population": 120000},
            {"name": "Madhapur", "lat": 17.4483, "lon": 78.3915, "postal": "500081", "category": "Commercial", "population": 160000},
            {"name": "Kondapur", "lat": 17.4622, "lon": 78.3572, "postal": "500084", "category": "Residential", "population": 110000},
            {"name": "Hitech City", "lat": 17.4504, "lon": 78.3809, "postal": "500081", "category": "Commercial", "population": 95000},
            {"name": "Jubilee Hills", "lat": 17.4325, "lon": 78.4075, "postal": "500033", "category": "Residential", "population": 85000},
            {"name": "Banjara Hills", "lat": 17.4165, "lon": 78.4350, "postal": "500034", "category": "Residential", "population": 90000},
            {"name": "Begumpet", "lat": 17.4448, "lon": 78.4600, "postal": "500016", "category": "Commercial", "population": 45000},
            {"name": "Secunderabad", "lat": 17.4399, "lon": 78.4983, "postal": "500003", "category": "Commercial", "population": 65000},
            {"name": "Charminar", "lat": 17.3616, "lon": 78.4747, "postal": "500002", "category": "Heritage", "population": 250000},
            {"name": "Kukatpally", "lat": 17.4855, "lon": 78.4100, "postal": "500072", "category": "Residential", "population": 180000},
            {"name": "Uppal", "lat": 17.4019, "lon": 78.5602, "postal": "500039", "category": "Residential", "population": 150000},
            {"name": "LB Nagar", "lat": 17.3457, "lon": 78.5522, "postal": "500074", "category": "Residential", "population": 130000},
            {"name": "Nampally", "lat": 17.3918, "lon": 78.4678, "postal": "500001", "category": "Commercial", "population": 110000},
            {"name": "Miyapur", "lat": 17.4966, "lon": 78.3483, "postal": "500049", "category": "Residential", "population": 145000},
            {"name": "Mehdipatnam", "lat": 17.3971, "lon": 78.4316, "postal": "500028", "category": "Residential", "population": 165000},
        ]
        
        location_ids = {}
        for loc_data in locations_data:
            loc_id = uuid.uuid4()
            location_ids[loc_data["name"]] = loc_id
            location = Location(
                id=loc_id,
                city_id=city_id,
                name=loc_data["name"],
                latitude=loc_data["lat"],
                longitude=loc_data["lon"],
                point_geom=text(f"ST_GeomFromText('POINT({loc_data['lon']} {loc_data['lat']})', 4326)"),
                postal_code=loc_data["postal"],
                category=loc_data["category"],
                population=loc_data["population"],
                status="active"
            )
            session.add(location)
        
        await session.flush()

        # 4. Create Observations (AQI & Weather) for all locations
        now_time = datetime.now(timezone.utc)
        
        # Base values for generating realistic data
        base_aqi_values = {
            "Gachibowli": 145, "Madhapur": 182, "Kondapur": 125, "Hitech City": 198,
            "Jubilee Hills": 95, "Banjara Hills": 110, "Begumpet": 156, "Secunderabad": 168,
            "Charminar": 220, "Kukatpally": 185, "Uppal": 172, "LB Nagar": 158,
            "Nampally": 195, "Miyapur": 138, "Mehdipatnam": 165
        }
        
        observations = []
        forecasts = []
        
        for loc_name, loc_id in location_ids.items():
            base_aqi = base_aqi_values.get(loc_name, 150)
            
            # Create AQI observation
            aqi_obs = AQIObservation(
                location_id=loc_id,
                aqi=base_aqi,
                pm2_5=round(base_aqi * 0.4, 1),
                pm10=round(base_aqi * 0.6, 1),
                no2=round(20 + (base_aqi / 10), 1),
                so2=round(10 + (base_aqi / 20), 1),
                co=round(0.5 + (base_aqi / 200), 2),
                o3=round(40 + (base_aqi / 15), 1),
                category="Moderate" if base_aqi < 200 else "Poor",
                timestamp=now_time,
                data_source="sensor_network",
                quality_score=0.95
            )
            observations.append(aqi_obs)
            
            # Create weather observation
            weather_obs = WeatherObservation(
                location_id=loc_id,
                temperature=round(28 + (base_aqi / 30), 1),
                humidity=round(50 + (base_aqi / 10), 1),
                pressure=1010.0,
                wind_speed=round(3 + (base_aqi / 50), 1),
                wind_direction=240.0,
                visibility=round(10 - (base_aqi / 100), 1),
                uv_index=round(6 + (base_aqi / 50), 1),
                rainfall=0.0,
                timestamp=now_time
            )
            observations.append(weather_obs)
            
            # Create forecast
            forecast = Forecast(
                location_id=loc_id,
                forecast_time=now_time + timedelta(hours=24),
                predicted_aqi=base_aqi + 10,
                confidence_score=0.91,
                prediction_model="XGBoost",
                version="1.0.0"
            )
            forecasts.append(forecast)
        
        # 5. System Configuration
        sys_config = SystemConfiguration(
            setting_key="maintenance_mode",
            setting_value="false",
            description="Toggles maintenance splash screens"
        )
        
        session.add_all(observations + forecasts + [sys_config])
        await session.commit()
        print("PostgreSQL Database Seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_postgres())
