import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.providers.aqi.openweather import OpenWeatherProvider
from app.services.normalization import NormalizationService
from app.services.validation import ValidationService
from app.cache.redis import cache
from app.database.models.models import AQIObservation, WeatherObservation
from app.core.logging.logger import logger

class AQIIngestionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.provider = OpenWeatherProvider()

    async def get_aqi(self, lat: float, lon: float, location_id: uuid.UUID) -> Optional[Dict[str, Any]]:
        # 1. Attempt Cache Load
        cache_key = f"aqi:{lat:.4f}:{lon:.4f}"
        cached = await cache.get(cache_key)
        if cached:
            logger.info(f"Cache HIT for AQI at lat={lat}, lon={lon}")
            return json.loads(cached)

        # 2. Fetch from Provider
        logger.info(f"Cache MISS for AQI at lat={lat}, lon={lon}. Querying OpenWeather...")
        raw_data = await self.provider.fetch_aqi(lat, lon)
        normalized = NormalizationService.normalize_aqi(raw_data)
        
        if not ValidationService.validate_aqi(normalized):
            logger.error("Fetched AQI data failed validation checks.")
            return None

        # 3. Cache Data (5 minutes TTL)
        await cache.set(cache_key, json.dumps(normalized), expire_seconds=300)

        # 4. Save to Database
        db_obs = AQIObservation(
            id=uuid.uuid4(),
            location_id=location_id,
            aqi=normalized["aqi"],
            pm2_5=normalized["pm2_5"],
            pm10=normalized["pm10"],
            no2=normalized["no2"],
            so2=normalized["so2"],
            co=normalized["co"],
            o3=normalized["o3"],
            category=normalized["category"],
            timestamp=datetime.now(timezone.utc),
            data_source=normalized["data_source"],
            quality_score=normalized["quality_score"]
        )
        self.db.add(db_obs)
        await self.db.flush()

        return normalized

class WeatherIngestionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.provider = OpenWeatherProvider()

    async def get_weather(self, lat: float, lon: float, location_id: uuid.UUID) -> Optional[Dict[str, Any]]:
        # 1. Attempt Cache Load
        cache_key = f"weather:{lat:.4f}:{lon:.4f}"
        cached = await cache.get(cache_key)
        if cached:
            logger.info(f"Cache HIT for weather at lat={lat}, lon={lon}")
            return json.loads(cached)

        # 2. Fetch from Provider
        logger.info(f"Cache MISS for weather at lat={lat}, lon={lon}. Querying OpenWeather...")
        raw_data = await self.provider.fetch_weather(lat, lon)
        normalized = NormalizationService.normalize_weather(raw_data)

        if not ValidationService.validate_weather(normalized):
            logger.error("Fetched weather metrics failed validation checks.")
            return None

        # 3. Cache Data (10 minutes TTL)
        await cache.set(cache_key, json.dumps(normalized), expire_seconds=600)

        # 4. Save to Database
        db_obs = WeatherObservation(
            id=uuid.uuid4(),
            location_id=location_id,
            temperature=normalized["temperature"],
            humidity=normalized["humidity"],
            pressure=normalized["pressure"],
            wind_speed=normalized["wind_speed"],
            wind_direction=normalized["wind_direction"],
            visibility=normalized["visibility"],
            uv_index=normalized["uv_index"],
            rainfall=normalized["rainfall"],
            timestamp=datetime.now(timezone.utc)
        )
        self.db.add(db_obs)
        await self.db.flush()

        return normalized
