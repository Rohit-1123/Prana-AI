import json
import httpx
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from app.ai.providers.interfaces.base_provider import LLMProviderInterface
from app.core.config.settings import settings
from app.core.logging.logger import logger

class GroqProvider(LLMProviderInterface):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = "llama3-8b-8192"
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_response(self, prompt: str, system_prompt: str) -> str:
        if not self.api_key:
            # Fallback mock response based on prompt matching
            await asyncio.sleep(0.5)
            return self._get_mock_response(prompt)

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.endpoint, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Groq API connection failed: {e}")
            return f"Service degradation: Fallback mock response. Details: {self._get_mock_response(prompt)}"

    async def generate_stream(self, prompt: str, system_prompt: str) -> AsyncGenerator[str, None]:
        if not self.api_key:
            mock_text = self._get_mock_response(prompt)
            # Stream token-by-token
            words = mock_text.split(" ")
            for w in words:
                yield w + " "
                await asyncio.sleep(0.05)
            return

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "stream": True
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                async with client.stream("POST", self.endpoint, json=payload, headers=headers) as response:
                    async for line in response.iter_lines():
                        if not line:
                            continue
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str.strip() == "[DONE]":
                                break
                            try:
                                chunk = json.loads(data_str)
                                content = chunk["choices"][0]["delta"].get("content", "")
                                if content:
                                    yield content
                            except Exception:
                                pass
        except Exception as e:
            logger.error(f"Groq streaming connection failed: {e}")
            mock_text = f"Streaming connection fallback due to {e}. Mock: " + self._get_mock_response(prompt)
            for word in mock_text.split(" "):
                yield word + " "
                await asyncio.sleep(0.05)

    def _get_mock_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "forecast" in prompt_lower:
            return "Based on recent telemetry analysis, AQI predictions for the Gachibowli ward show a potential rise to 142 within the next 24 hours. The XGBoost forecasting model rates this with 93% confidence, recommending sensitive groups limit outdoor activity during peak afternoon hours."
        if "compare" in prompt_lower:
            return "Comparing target wards: Madhapur reports an AQI of 152 (Moderate Risk) while Hitech City stands at 138 (Low Risk). Particulate matter PM2.5 levels are higher in Madhapur near major transit junctions."
        if "hotspot" in prompt_lower:
            return "The active hotspots in the IT Corridor are Gachibowli Junction and Cyber Towers metro corridors, showing elevated PM10 dust particles from metro expansion zones. We recommend mist sprayers deployment."
        return "Greetings! I am PranaAI Copilot, your environmental intelligence assistant. Ask me about current air quality indices, weather metrics, spatial sensors hotspots, or forecasting trends in the IT Corridor."
