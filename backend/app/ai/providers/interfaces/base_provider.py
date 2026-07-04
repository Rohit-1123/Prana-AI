from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any

class LLMProviderInterface(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str, system_prompt: str) -> str:
        """Generates a complete response string from the provider."""
        pass

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: str) -> AsyncGenerator[str, None]:
        """Streams response tokens chronologically."""
        pass
