import httpx
from typing import Dict, Any, List
from app.providers.interfaces.base_provider import GeocodingProviderInterface
from app.core.config.settings import settings
from app.core.logging.logger import logger

class NominatimProvider(GeocodingProviderInterface):
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org"
        self.headers = {"User-Agent": settings.NOMINATIM_USER_AGENT}
        self.timeout = 10.0

    async def geocode(self, query: str) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/search"
        params = {"q": query, "format": "json", "addressdetails": 1, "limit": 5}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                logger.error(f"Nominatim geocoding request failed for query {query}: {e}")
            return []

    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        url = f"{self.base_url}/reverse"
        params = {"lat": lat, "lon": lon, "format": "json", "addressdetails": 1}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                logger.error(f"Nominatim reverse geocoding failed for {lat},{lon}: {e}")
            return {}
