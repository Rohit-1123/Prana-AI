from abc import ABC, abstractmethod
from typing import Dict, Any, List

class ModelAdapterInterface(ABC):
    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the prediction inference using features list mapping."""
        pass

class XGBoostAdapter(ModelAdapterInterface):
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        # Simple mock prediction model logic
        base_aqi = features.get("historical_avg_aqi", 130)
        humidity = features.get("latest_humidity", 50.0)
        temp = features.get("latest_temperature", 25.0)

        # Apply mock model weights logic
        predicted_aqi = int(base_aqi + (temp * 0.5) - (humidity * 0.1))
        
        return {
            "predicted_aqi": max(min(predicted_aqi, 500), 0),
            "confidence_score": 0.93,
            "prediction_model": "XGBoost",
            "version": "1.0.0"
        }
