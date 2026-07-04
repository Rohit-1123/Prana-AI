import os
import joblib
from app.core.llm import LLMClient

class ExplanationAgent:
    def __init__(self):
        self.name = "Explanation Agent"
        self.llm = LLMClient()
        self.feature_importances = None
        self.load_feature_importances()

    def load_feature_importances(self):
        try:
            imp_path = "models/feature_importances.pkl"
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
        
        # Draft a prompt for LLM explanation
        prompt = f"""
        Explain the air quality state for {ward}.
        Current AQI: {aqi} (Previous AQI was {previous_aqi}).
        Local factors:
        - Traffic Congestion: {traffic}%
        - Industrial Emissions: {industry}%
        - Construction Activity: {construction}%
        - Dust Level: {dust}
        - Wind Speed: {wind} m/s
        - Weather Condition: {weather}
        
        The mathematical contribution calculation shows:
        - Traffic: {contributions['traffic']}%
        - Industrial: {contributions['industrial']}%
        - Construction: {contributions['construction']}%
        - Dust: {contributions['dust']}%
        - Meteorology (Atmospheric dispersion): {contributions['meteorology']}%
        
        Provide a concise, professional executive narrative explaining why the AQI is at {aqi}, what the primary driver is ({driver_labels[main_driver]}), and how meteorology is playing a role.
        """
        
        system_instruction = "You are PranaAI's Explanation Agent, specializing in SHAP and feature attribution metrics for smart cities."
        narrative = self.llm.generate_text(prompt, system_instruction)
        
        return {
            "ward": ward,
            "current_aqi": aqi,
            "previous_aqi": previous_aqi,
            "aqi_change": aqi - previous_aqi,
            "primary_driver": driver_labels[main_driver],
            "feature_attributions": contributions,
            "narrative_explanation": narrative
        }
