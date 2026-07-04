import asyncio
from app.core.logging.logger import logger
from app.database.connection import AsyncSessionLocal
from app.services.ingestion_services import AQIIngestionService, WeatherIngestionService
from sqlalchemy.future import select
from app.database.models.models import Location

async def refresh_active_locations_data():
    """Background task pulling live environmental metrics periodically."""
    logger.info("Starting background refresh loop for active locations...")
    async with AsyncSessionLocal() as session:
        try:
            # Query active locations
            query = select(Location).filter(Location.status == "active")
            result = await session.execute(query)
            locations = result.scalars().all()
            
            aqi_service = AQIIngestionService(session)
            weather_service = WeatherIngestionService(session)

            for loc in locations:
                logger.info(f"Refreshed stats for location {loc.name}...")
                await aqi_service.get_aqi(loc.latitude, loc.longitude, loc.id)
                await weather_service.get_weather(loc.latitude, loc.longitude, loc.id)

            await session.commit()
            logger.info("Background refresh loop successfully synchronized.")
        except Exception as e:
            logger.error(f"Error during background refresh loop execution: {e}")
            await session.rollback()
