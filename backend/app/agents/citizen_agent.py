import re
import unicodedata
from difflib import get_close_matches
from typing import List, Optional
from app.core.llm import LLMClient

LANGUAGE_NAMES = {"en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil", "kn": "Kannada"}

# CPCB National AQI bands: (upper bound, category, colour, advice)
AQI_BANDS = [
    (50, "Good", "#10B981", "Air is clean. Outdoor activity is fine for everyone."),
    (100, "Satisfactory", "#84CC16", "Air is acceptable. Very sensitive people may feel minor discomfort."),
    (200, "Moderate", "#FBBF24", "People with asthma, heart disease, children and older adults should limit long or intense outdoor exertion."),
    (300, "Poor", "#F97316", "Most people may feel breathing discomfort on long exposure. Reduce outdoor exercise; sensitive groups should stay indoors."),
    (400, "Very Poor", "#EF4444", "Avoid outdoor activity. Wear an N95 mask if you must go out and keep windows closed."),
    (10_000, "Severe", "#991B1B", "Health emergency level. Stay indoors, run an air purifier if available, and avoid all outdoor exertion."),
]


def aqi_band(aqi: int):
    return next(b for b in AQI_BANDS if aqi <= b[0])


def _describe(loc: dict) -> str:
    parts = [f"{loc['name']}" + (f" ({loc['city']})" if loc.get("city") else ""), f"AQI {loc['aqi']} ({aqi_band(loc['aqi'])[1]})"]
    for key, label, unit in (("pm2_5", "PM2.5", " µg/m³"), ("pm10", "PM10", " µg/m³"), ("temperature", "temp", "°C"),
                             ("humidity", "humidity", "%"), ("wind_speed", "wind", " m/s"), ("forecast_24h", "AQI in 24h", "")):
        if loc.get(key) is not None:
            parts.append(f"{label} {loc[key]}{unit}")
    if loc.get("weather_condition"):
        parts.append(loc["weather_condition"])
    return ", ".join(parts)


def _norm(text: str) -> str:
    text = unicodedata.normalize("NFKD", text.lower())
    return re.sub(r"[^a-z0-9 ]+", " ", "".join(c for c in text if not unicodedata.combining(c)))


def mentions(query: str, label: str) -> bool:
    """True if the query names `label`, tolerating case, accents and small typos (multi-word names by whole-phrase, then per-word)."""
    q, lab = f" {_norm(query)} ", _norm(label).strip()
    if not lab:
        return False
    if f" {lab} " in q:
        return True
    words = q.split()
    n = len(lab.split())
    grams = [" ".join(words[i:i + n]) for i in range(len(words) - n + 1)]
    return bool(get_close_matches(lab, grams, n=1, cutoff=0.8))


class CitizenAdvisoryAgent:
    def __init__(self):
        self.name = "Citizen Advisory Agent"
        self.llm = LLMClient()

    def get_health_advisory(self, focus: dict, citizen_query: str, locations: Optional[List[dict]] = None,
                            history: Optional[List[dict]] = None, language: str = "en") -> dict:
        """Answers a citizen question grounded in live readings; works offline with a data-driven reply."""
        aqi = int(focus["aqi"])
        _, rating, color, advice = aqi_band(aqi)
        locations = locations or []

        # Cleaner places nearby (same city when known), best first
        same_city = [l for l in locations if l["name"] != focus["name"] and (not focus.get("city") or l.get("city") == focus.get("city"))]
        cleaner = sorted((l for l in same_city if l["aqi"] <= aqi - 10), key=lambda l: l["aqi"])[:3]  # ignore trivial differences
        routes = [{"name": l["name"], "aqi": int(l["aqi"]), "reason": f"{aqi - int(l['aqi'])} AQI points cleaner than {focus['name']} right now"} for l in cleaner]

        system = (
            "You are PranaAI's Citizen Advisory Agent, an air-quality and health assistant for Indian cities. "
            "Answer ONLY from the live readings provided; never invent numbers, places or sources. "
            "AQI is India's CPCB National AQI (Good ≤50, Satisfactory ≤100, Moderate ≤200, Poor ≤300, Very Poor ≤400, Severe >400). "
            "Be direct and practical: 2-4 short sentences, plain text, no tables or markdown headings. "
            "Suggest alternatives within the same city. If the user asks about another place or city, answer about it from the readings listed for it, even if it differs from the focus location; never suggest travelling to a different city for cleaner air. "
            "If the question is about a place not in the data, say you don't have live readings for it. "
            "You give general guidance, not medical diagnosis; for symptoms suggest seeing a doctor. "
            f"Reply in {LANGUAGE_NAMES.get(language, 'English')}."
        )
        # Same-city places in detail; other cities only as averages so advice stays local
        other_cities: dict = {}
        for l in locations:
            if l.get("city") and l.get("city") != focus.get("city"):
                other_cities.setdefault(l["city"], []).append(l["aqi"])
        city_avgs = "\n".join(f"- {c}: average AQI {round(sum(v) / len(v))}" for c, v in other_cities.items())
        nearby = same_city[:30] if focus.get("city") else locations[:30]
        # Places/cities the user names in the question get full readings, even in another city
        asked = [l for l in locations if l["name"] != focus["name"] and l not in nearby
                 and (mentions(citizen_query, l["name"]) or (l.get("city") and mentions(citizen_query, l["city"])))]
        context = (
            f"Focus location: {_describe(focus)}\n"
            f"Health guidance for this band: {advice}\n"
            "Other places in the same city:\n" + ("\n".join(f"- {_describe(l)}" for l in nearby) or "- none") + "\n"
            "Places the user asked about (other cities, full live readings):\n" + ("\n".join(f"- {_describe(l)}" for l in asked) or "- none") + "\n"
            "Other cities (far away, for comparison only):\n" + (city_avgs or "- none")
        )
        messages = [{"role": "system", "content": system}, {"role": "system", "content": context}]
        messages += [{"role": t["role"], "content": t["text"]} for t in (history or [])[-6:]]
        messages.append({"role": "user", "content": citizen_query})

        reply = self.llm.chat(messages)
        if not reply:
            # Offline: still answer from the real numbers
            reply = f"{focus['name']} is at AQI {aqi} ({rating}). {advice}"
            if focus.get("forecast_24h") is not None:
                reply += f" Forecast for the next 24 hours: around AQI {focus['forecast_24h']}."
            if cleaner:
                reply += f" Cleanest nearby right now: {cleaner[0]['name']} (AQI {cleaner[0]['aqi']})."

        return {
            "ward": focus["name"],
            "aqi": aqi,
            "air_quality_rating": rating,
            "rating_color": color,
            "query": citizen_query,
            "advisory_response": reply,
            "recommended_clean_routes": routes,
        }


if __name__ == "__main__":
    agent = CitizenAdvisoryAgent()
    agent.llm.api_key = ""  # exercise the offline path
    out = agent.get_health_advisory(
        {"name": "Anand Vihar", "city": "Delhi", "aqi": 254, "forecast_24h": 222},
        "Can I jog?", [{"name": "Saket", "city": "Delhi", "aqi": 180}, {"name": "Bandra", "city": "Mumbai", "aqi": 60}],
    )
    assert out["air_quality_rating"] == "Poor"
    assert [r["name"] for r in out["recommended_clean_routes"]] == ["Saket"]  # other city excluded
    assert "254" in out["advisory_response"] and "Saket" in out["advisory_response"]
    assert aqi_band(50)[1] == "Good" and aqi_band(401)[1] == "Severe"
    assert mentions("how is dehli today", "Delhi") and mentions("Is BANDRA ok?", "Bandra") and not mentions("hello", "Delhi")
    print("citizen_agent ok")
