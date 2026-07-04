from app.core.llm import LLMClient

class CitizenAdvisoryAgent:
    def __init__(self):
        self.name = "Citizen Advisory Agent"
        self.llm = LLMClient()

    def get_health_advisory(self, current_metrics: dict, citizen_query: str) -> dict:
        """
        Generates personalized health advice, activity guidelines, and clean route mapping.
        """
        ward = current_metrics.get("ward", "Ward 1")
        aqi = current_metrics.get("aqi", 150)
        temp = current_metrics.get("temperature", 25.0)
        weather = current_metrics.get("weather_condition", "Sunny")
        
        # Categorize health rating
        if aqi <= 50:
            rating = "Good"
            color = "#4ADE80"
        elif aqi <= 100:
            rating = "Satisfactory"
            color = "#A855F7"
        elif aqi <= 200:
            rating = "Moderate"
            color = "#FACC15"
        elif aqi <= 300:
            rating = "Poor"
            color = "#EF4444"
        else:
            rating = "Very Poor / Severe"
            color = "#EF4444"
            
        prompt = f"""
        You are the Citizen Advisory Agent for PranaAI. Provide a helpful, caring, yet scientifically accurate response to this citizen query.
        Citizen Query: "{citizen_query}"
        Citizen Location: {ward}
        Current Environmental Context:
        - Local AQI: {aqi} ({rating} category)
        - Temperature: {temp}°C
        - Weather: {weather}
        
        Address the citizen's query directly (e.g., if they asked about jogging, schools, mask recommendations, outdoor activities).
        Suggest a practical tip, and recommend using green pathways or staying indoors based on their specific local AQI of {aqi}.
        Keep the tone polite, engaging, and clear.
        """
        
        system_instruction = "You are PranaAI's Citizen Advisory Agent, representing a friendly, localized virtual environmental assistant."
        response_text = self.llm.generate_text(prompt, system_instruction)
        
        # Clean route mock suggestions
        suggested_routes = [
            {
                "name": "Eco-Park Corridor",
                "aqi": int(aqi * 0.7),
                "reason": "Dense canopy absorbs heavy-duty particulates"
            },
            {
                "name": "Saraswati Residential Lane",
                "aqi": int(aqi * 0.8),
                "reason": "Low traffic density and setback distance from primary roads"
            }
        ]
        
        return {
            "ward": ward,
            "aqi": aqi,
            "air_quality_rating": rating,
            "rating_color": color,
            "query": citizen_query,
            "advisory_response": response_text,
            "recommended_clean_routes": suggested_routes
        }
