import os
import joblib
from app.core.llm import LLMClient
from app.core.config.settings import REPO_ROOT
from app.agents.citizen_agent import aqi_band
from app.services.aqi_service import main_pollutant

class ExplanationAgent:
    def __init__(self):
        self.name = "Explanation Agent"
        self.llm = LLMClient()
        self.feature_importances = None
        self.load_feature_importances()

    def load_feature_importances(self):
        try:
            imp_path = str(REPO_ROOT / "models" / "feature_importances.pkl")
            if os.path.exists(imp_path):
                self.feature_importances = joblib.load(imp_path)
        except Exception as e:
            print(f"Explanation Agent warning: Failed to load feature importances ({e}).")

    def explain_aqi_state(self, current_metrics: dict, previous_aqi: int = 120) -> dict:
        """
        Explains current AQI spikes or dips.
        Maps feature contributions and queries the LLM for a narrative explainability report.
        """
        ward = current_metrics.get("ward", "Ward 1")
        aqi = current_metrics.get("aqi", 150)
        
        # Calculate dynamic SHAP-like feature impacts for this specific record
        # Features are: Traffic, Industry, Construction, Weather, Dust
        traffic = current_metrics.get("traffic_congestion", 50.0)
        industry = current_metrics.get("industrial_emissions", 30.0)
        construction = current_metrics.get("construction_activity", 40.0)
        dust = current_metrics.get("dust_level", 20.0)
        wind = current_metrics.get("wind_speed", 5.0)
        weather = current_metrics.get("weather_condition", "Sunny")
        
        # Simple attribution calculations based on coefficients
        traffic_contrib = traffic * 0.65
        industry_contrib = industry * 1.1
        construction_contrib = construction * 0.45
        dust_contrib = dust * 0.35
        meteorology_contrib = 40.0 # Base temperature/humidity impact
        
        # Adjust meteorology based on wind and conditions
        if wind < 3.0:
            meteorology_contrib += 30.0 # Stagnant conditions trap air
        elif wind > 10.0:
            meteorology_contrib -= 25.0 # High dispersion
            
        if weather == "Foggy":
            meteorology_contrib += 40.0
        elif weather == "Rainy":
            meteorology_contrib -= 30.0
            
        total = traffic_contrib + industry_contrib + construction_contrib + dust_contrib + max(5.0, meteorology_contrib)
        
        contributions = {
            "traffic": round((traffic_contrib / total) * 100, 1),
            "industrial": round((industry_contrib / total) * 100, 1),
            "construction": round((construction_contrib / total) * 100, 1),
            "dust": round((dust_contrib / total) * 100, 1),
            "meteorology": round((max(5.0, meteorology_contrib) / total) * 100, 1)
        }
        
        # Determine main driver
        main_driver = max(contributions, key=contributions.get)
        driver_labels = {
            "traffic": "Vehicular Congestion",
            "industrial": "Factory Emissions",
            "construction": "Infrastructure Development Dust",
            "dust": "Fugitive Soil/Road Dust",
            "meteorology": "Atmospheric Inversion/Low Wind Dispersion"
        }
        
        # Narrative is grounded in measured/modelled readings only (no seed-database activity figures)
        pm25, pm10 = current_metrics.get("pm2_5"), current_metrics.get("pm10")
        category = aqi_band(int(aqi))[1]
        pollutant = main_pollutant(pm25, pm10) if pm25 is not None and pm10 is not None else "PM2.5"
        humidity = current_metrics.get("humidity")
        temp = current_metrics.get("temperature")
        f24 = current_metrics.get("forecast_24h")
        facts = [
            f"AQI {aqi} ({category}, India CPCB scale); 24 hours ago it was {previous_aqi}",
            f"PM2.5 {pm25} µg/m³, PM10 {pm10} µg/m³; the main pollutant is {pollutant}",
            f"Wind {wind} m/s, humidity {humidity}%, temperature {temp}°C, {weather}",
        ]
        if f24 is not None:
            facts.append(f"Model forecast: AQI around {f24} in 24 hours")
        system_instruction = (
            "You are PranaAI's Explanation Agent. Explain air quality to a city resident or official in 3-4 plain-text "
            "sentences: no markdown, no bullet points, no headings. Use ONLY the facts given. Do not invent numbers, "
            "and do not name specific local sources such as traffic, construction or factories, because no source "
            "measurements are available. You may explain in general terms how low wind, high humidity or heat affect dispersion. "
            "Always use the exact category given for the AQI."
        )
        narrative = self.llm.chat([
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Explain the air quality state for {ward}.\n" + "\n".join(f"- {f}" for f in facts)},
        ], max_tokens=500)
        if not narrative:
            change = aqi - previous_aqi
            trend = "about the same as" if abs(change) < 10 else ("higher than" if change > 0 else "lower than")
            narrative = f"Air quality in {ward} is {category} (AQI {aqi}), {trend} 24 hours ago ({previous_aqi}). The main pollutant is {pollutant}."
            if wind is not None and wind < 2.5:
                narrative += f" Calm air ({wind} m/s) is letting pollution build up near the ground."
            if f24 is not None:
                narrative += f" The model expects around AQI {f24} in 24 hours."

        return {
            "ward": ward,
            "current_aqi": aqi,
            "previous_aqi": previous_aqi,
            "aqi_change": aqi - previous_aqi,
            "primary_driver": driver_labels[main_driver],
            "feature_attributions": contributions,
            "narrative_explanation": narrative
        }
