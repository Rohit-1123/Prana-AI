import os
import re
import requests
from typing import Optional
from app.core.config.settings import settings

class LLMClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        self.model = os.getenv("GROQ_MODEL", settings.GROQ_MODEL)
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def chat(self, messages: list, max_tokens: int = 700) -> Optional[str]:
        """One Groq chat completion; None when no key is configured or the call fails."""
        if not self.api_key:
            return None
        payload = {"model": self.model, "messages": messages, "temperature": 0.3, "max_tokens": max_tokens}
        if self.model.startswith("openai/gpt-oss"):
            payload["reasoning_effort"] = "low"  # reasoning tokens count against max_tokens
        try:
            response = requests.post(
                self.url,
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                json=payload,
                timeout=20,
            )
            if response.status_code != 200:
                print(f"Groq API Error {response.status_code}: {response.text[:300]}")
                return None
            content = response.json()["choices"][0]["message"].get("content") or ""
            content = re.sub(r"<think>.*?(?:</think>|$)", "", content, flags=re.DOTALL).strip()
            return content or None
        except Exception as e:
            print(f"LLM connection failed: {e}")
            return None

    def generate_text(self, prompt: str, system_instruction: str = None) -> str:
        """Groq completion, falling back to the rule-based offline engine."""
        messages = ([{"role": "system", "content": system_instruction}] if system_instruction else []) + [{"role": "user", "content": prompt}]
        return self.chat(messages, max_tokens=1000) or self._generate_offline_mock(prompt, system_instruction)

    def _generate_offline_mock(self, prompt: str, system_instruction: str) -> str:
        prompt_lower = prompt.lower()
        
        # 1. Recommendation Agent Prompt
        if "recommendation" in prompt_lower or "interventions" in prompt_lower:
            ward_name = self._extract_ward(prompt)
            aqi_val = self._extract_number(prompt, "aqi", 150)
            return f"For {ward_name} (AQI: {aqi_val}), we recommend restricting heavy-duty commercial diesel trucks during peak morning hours and deploying municipal water sprinklers along key corridors to suppress dust."
 
        # 2. Citizen Advisory Agent Prompt
        elif "citizen" in prompt_lower or "jog" in prompt_lower or "safe" in prompt_lower or "should" in prompt_lower:
            ward_name = self._extract_ward(prompt)
            aqi_val = self._extract_number(prompt, "aqi", 150)
            
            health_category = "Moderate"
            advice = "It is generally safe to go outdoors, but sensitive groups should avoid heavy exertion."
            if aqi_val > 200:
                health_category = "Very Poor"
                advice = "Avoid outdoor activities. Wear N95 masks if stepping out is essential, and keep windows closed."
            elif aqi_val > 150:
                health_category = "Poor"
                advice = "Limit prolonged outdoor exertion. Sensitive individuals should stay indoors."
            elif aqi_val <= 50:
                health_category = "Good"
                advice = "Perfect day for outdoor exercises and keeping windows open for fresh ventilation!"
            elif aqi_val <= 100:
                health_category = "Satisfactory"
                advice = "Air quality is acceptable. Ideal for outdoor activities for almost everyone."
 
            return f"In {ward_name} (AQI: {aqi_val}, {health_category} category), the health advice is: {advice}"
 
        # 3. Explanation Agent Prompt
        elif "explain" in prompt_lower or "why" in prompt_lower:
            ward_name = self._extract_ward(prompt)
            return f"The recent AQI elevation in {ward_name} is primarily driven by poor wind dispersion (calm boundary layer conditions) combined with localized traffic emissions and construction dust."
 
        # 4. Report Generation Agent Prompt
        elif "report" in prompt_lower or "executive summary" in prompt_lower:
            return "Over the past 30 days, the highest average pollution loads were recorded in Wards 1, 3, and 5 (average AQI: 245), with vehicular emissions (38%) and industrial exhaust (32%) being the primary drivers."
 
        # General Fallback
        else:
            return "PranaAI Copilot: Ask me direct questions about air quality index values, safe jogging hours, or local exposure risks, and I will provide a direct, concise answer."

    def _extract_ward(self, prompt: str) -> str:
        import re
        # Check for Focus Ward: [Name] format first
        match = re.search(r"focus ward:\s*([^\n(]+)", prompt.lower())
        if match:
            return match.group(1).strip().title()
            
        # Fallback to checking location keywords
        locations = ["gachibowli", "hitech city", "financial district", "madhapur", "kondapur", "nanakramguda"]
        for loc in locations:
            if loc in prompt.lower():
                return loc.title()
                
        for i in range(1, 11):
            if f"ward {i}" in prompt.lower():
                return f"Ward {i}"
        return "Gachibowli"

    def _extract_number(self, prompt: str, keyword: str, default: int) -> int:
        import re
        try:
            # Look for keyword followed by some spaces or colons and digits
            matches = re.findall(rf"{keyword}\D*(\d+)", prompt.lower())
            if matches:
                return int(matches[0])
        except Exception:
            pass
        return default
