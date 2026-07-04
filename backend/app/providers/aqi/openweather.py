import httpx
import asyncio
from typing import Dict, Any
from app.providers.interfaces.base_provider import AQIProviderInterface, WeatherProviderInterface
from app.core.config.settings import settings
from app.core.logging.logger import logger

class OpenWeatherProvider(AQIProviderInterface, WeatherProviderInterface):
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5"
        self.timeout = 10.0

    async def _request_with_retry(self, url: str, params: Dict[str, Any], retries: int = 3, backoff: float = 1.5) -> Dict[str, Any]:
        params["appid"] = self.api_key
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(retries):
                try:
                    response = await client.get(url, params=params)
                    if response.status_code == 200:
                        return response.json()
                    elif response.status_code == 429:
                        logger.warning(f"OpenWeather rate limit hit (429), retrying attempt {attempt+1}")
                    else:
                        logger.error(f"OpenWeather response error status: {response.status_code}")
                except httpx.RequestError as e:
                    logger.error(f"OpenWeather network exception on attempt {attempt+1}: {e}")

                if attempt < retries - 1:
                    await asyncio.sleep(backoff ** attempt)
            
            logger.error(f"Failed to fetch from OpenWeather after {retries} retries.")
            return {}

    async def fetch_aqi(self, lat: float, lon: float) -> Dict[str, Any]:
        url = f"{self.base_url}/air_pollution"
        return await self._request_with_retry(url, {"lat": lat, "lon": lon})

    async def fetch_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        url = f"{self.base_url}/weather"
        return await self._request_with_retry(url, {"lat": lat, "lon": lon, "units": "metric"})
