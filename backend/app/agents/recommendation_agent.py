from app.core.llm import LLMClient
from app.agents.attribution_agent import SourceAttributionAgent

class RecommendationAgent:
    def __init__(self):
        self.name = "Recommendation Agent"
        self.llm = LLMClient()
        self.attribution_agent = SourceAttributionAgent()

    def generate_recommendations(self, current_metrics: dict) -> dict:
        """
        Recommends interventions and estimates exact AQI reductions based on source attribution.
        """
        ward = current_metrics.get("ward", "Ward 1")
        aqi = current_metrics.get("aqi", 150)
        
        # Get source attribution splits
        attribution_data = self.attribution_agent.estimate_sources(current_metrics)
        splits = {item["source"]: item["percentage"] for item in attribution_data["attributions"]}
        
        # Interventions definitions with their respective efficiencies
        # e.g., Restricting trucks reduces Traffic contribution by 35%
        interventions = [
            {
                "id": "restrict_trucks",
                "name": "Restrict Heavy Commercial Trucks",
                "target_source": "Traffic",
                "efficiency": 0.35,
                "description": "Restrict heavy commercial diesel trucks on main arterial corridors during morning peak hours (08:00 - 11:00 AM).",
                "cost_level": "Low",
                "difficulty": "Medium"
            },
            {
                "id": "increase_transit",
                "name": "Increase Public Transport Frequency",
                "target_source": "Traffic",
                "efficiency": 0.15,
                "description": "Increase shuttle and metro frequencies by 25% to encourage transit shift.",
                "cost_level": "High",
                "difficulty": "Medium"
            },
            {
                "id": "water_sprinkling",
                "name": "Deploy Mist-Sprinklers / Water Sprinkling",
                "target_source": "Road Dust",
                "efficiency": 0.40,
                "description": "Sprinkle water mixed with organic dust-binders on major unpaved corridors and construction boundaries.",
                "cost_level": "Low",
                "difficulty": "Easy"
            },
            {
                "id": "const_inspection",
                "name": "Audit & Enforce Construction Dust Enclosures",
                "target_source": "Construction",
                "efficiency": 0.25,
                "description": "Deploy inspection squads to enforce windbreaks, green scaffolding, and vehicle wash stations at real estate projects.",
                "cost_level": "Medium",
                "difficulty": "Medium"
            },
            {
                "id": "industry_throttle",
                "name": "Throttle Factory Emissions (20% Production Cap)",
                "target_source": "Industrial Activity",
                "efficiency": 0.20,
                "description": "Impose 20% capacity reduction on non-essential manufacturing plants in the local industrial zone.",
                "cost_level": "High",
                "difficulty": "Hard"
            },
            {
                "id": "citizen_alert",
                "name": "Issue Health Alerts & Smart Commute Advisories",
                "target_source": "Traffic",
                "efficiency": 0.05,
                "description": "Broadcast alerts urging citizens to carpool, work from home, or adjust commute times.",
                "cost_level": "Low",
                "difficulty": "Easy"
            }
        ]
        
        # Calculate reductions
        recommended_actions = []
        for action in interventions:
            target = action["target_source"]
            # Look up split percentage
            split_pct = splits.get(target, 15.0)
            
            # Estimated AQI reduction = current_aqi * (split_pct/100) * efficiency
            reduction = int(aqi * (split_pct / 100) * action["efficiency"])
            # Ensure at least 1 AQI point is reduced if current AQI is non-zero
            reduction = max(1, reduction) if aqi > 30 else 0
            
            recommended_actions.append({
                "id": action["id"],
                "name": action["name"],
                "description": action["description"],
                "target_source": target,
                "estimated_aqi_reduction": reduction,
                "cost_level": action["cost_level"],
                "difficulty": action["difficulty"]
            })
            
        # Call LLM to generate an executive policy recommendation brief
        prompt = f"""
        Generate a professional policy intervention brief for the municipal administration of Prana City ({ward}).
        Current AQI: {aqi}.
        Source splits: {splits}.
        The computed actions list is: {recommended_actions}.
        
        Provide a structured, action-oriented plan detailing which interventions should be deployed first, their trade-offs, and estimated cumulative reduction in PM2.5/AQI.
        """
        
        system_instruction = "You are PranaAI's Recommendation Agent, an expert in environmental policy analysis and urban municipal interventions."
        brief = self.llm.generate_text(prompt, system_instruction)
        
        return {
            "ward": ward,
            "current_aqi": aqi,
            "recommendations": recommended_actions,
            "executive_policy_brief": brief
        }
