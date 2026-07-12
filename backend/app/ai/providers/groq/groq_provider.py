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
        self.model = settings.GROQ_MODEL
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
                content = data["choices"][0]["message"]["content"]
                import re
                content = re.sub(r"<think>.*?(?:</think>|$)", "", content, flags=re.DOTALL).strip()
                return content
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

        async def original_stream():
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

        # Stateful stream filter to strip <think>...</think> blocks
        in_think = False
        buffer = ""
        async for chunk in original_stream():
            buffer += chunk
            while True:
                if in_think:
                    if "</think>" in buffer:
                        parts = buffer.split("</think>", 1)
                        buffer = parts[1]
                        in_think = False
                        continue
                    else:
                        if len(buffer) > 8:
                            keep_len = min(8, len(buffer))
                            buffer = buffer[-keep_len:]
                        break
                else:
                    if "<think>" in buffer:
                        parts = buffer.split("<think>", 1)
                        yield_text = parts[0]
                        if yield_text:
                            yield yield_text
                        buffer = parts[1]
                        in_think = True
                        continue
                    else:
                        tag = "<think>"
                        max_match = 0
                        for i in range(1, len(tag)):
                            prefix = tag[:i]
                            if buffer.endswith(prefix):
                                max_match = i
                                break
                        if max_match > 0:
                            yield_text = buffer[:-max_match]
                            if yield_text:
                                yield yield_text
                            buffer = buffer[-max_match:]
                        else:
                            if buffer:
                                yield buffer
                                buffer = ""
                        break
        if not in_think and buffer:
            yield buffer

    def _get_mock_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "forecast" in prompt_lower:
            return "Recent telemetry analysis projects a potential rise in Gachibowli AQI to 142 within the next 24 hours."
        if "compare" in prompt_lower:
            return "Madhapur reports an AQI of 152 (Moderate Risk) while Hitech City reports 138 (Low Risk)."
        if "hotspot" in prompt_lower:
            return "Active hotspots in the IT Corridor are the Gachibowli Junction and Cyber Towers metro corridors."
        return "I am PranaAI Copilot. Ask me direct questions about air quality, weather, hotspots, or forecasting trends."
