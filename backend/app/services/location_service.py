import json
from typing import Dict, Any, List, Optional
from app.providers.geocoding.nominatim import NominatimProvider
from app.services.normalization import NormalizationService
from app.cache.redis import cache
from app.core.logging.logger import logger

class LocationService:
    def __init__(self):
        self.provider = NominatimProvider()

    async def search_by_name(self, query: str) -> List[Dict[str, Any]]:
        cache_key = f"geocode:search:{query.replace(' ', '_').lower()}"
        cached = await cache.get(cache_key)
        if cached:
            logger.info(f"Cache HIT for geocode search query: {query}")
            return json.loads(cached)

        logger.info(f"Cache MISS for query: {query}. Requesting Nominatim...")
        raw_results = await self.provider.geocode(query)
        normalized = [NormalizationService.normalize_geocode(r) for r in raw_results]

        # Cache search query for 24 hours (86400 seconds)
        await cache.set(cache_key, json.dumps(normalized), expire_seconds=86400)
        return normalized

    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        cache_key = f"geocode:reverse:{lat:.4f}:{lon:.4f}"
        cached = await cache.get(cache_key)
        if cached:
            logger.info(f"Cache HIT for reverse geocode coordinates: {lat},{lon}")
            return json.loads(cached)

        logger.info(f"Cache MISS for coordinates: {lat},{lon}. Requesting Nominatim...")
        raw_result = await self.provider.reverse_geocode(lat, lon)
        normalized = NormalizationService.normalize_geocode(raw_result)

        # Cache reverse geocode details for 24 hours
        await cache.set(cache_key, json.dumps(normalized), expire_seconds=86400)
        return normalized
