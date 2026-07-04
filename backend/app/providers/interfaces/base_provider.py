from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

class AQIProviderInterface(ABC):
    @abstractmethod
    async def fetch_aqi(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetches raw air quality data from the provider."""
        pass

class WeatherProviderInterface(ABC):
    @abstractmethod
    async def fetch_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetches raw meteorological weather data from the provider."""
        pass

class GeocodingProviderInterface(ABC):
    @abstractmethod
    async def geocode(self, query: str) -> List[Dict[str, Any]]:
        """Resolves location name query into coordinate features."""
        pass

    @abstractmethod
    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        """Resolves coordinates into an address hierarchy dictionary."""
        pass
