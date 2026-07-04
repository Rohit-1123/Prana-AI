import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

class PredictionAgent:
    def __init__(self):
        self.name = "Prediction Agent"
        self.models = {}
        self.feature_names = None
        self.load_models()

    def load_models(self):
        """Loads serialized XGBoost forecast models and feature name mappings."""
        try:
            model_dir = "models"
            if os.path.exists(os.path.join(model_dir, "feature_names.pkl")):
                self.feature_names = joblib.load(os.path.join(model_dir, "feature_names.pkl"))
                
            for label in ["24h", "48h", "72h"]:
                model_path = os.path.join(model_dir, f"model_aqi_{label}.pkl")
                if os.path.exists(model_path):
                    self.models[label] = joblib.load(model_path)
                    print(f"Prediction Agent: Loaded {label} model successfully.")
        except Exception as e:
            print(f"Prediction Agent warning: Failed to load models ({e}). Using mathematical fallback.")

    def predict_forecasts(self, current_metrics: dict) -> dict:
        """
        Predicts AQI levels for 24h, 48h, and 72h horizons.
        Fails safe with mathematical/meteorological trend equations if ML models are unavailable.
        """
        predictions = {}
        confidences = {"24h": 0.88, "48h": 0.79, "72h": 0.68}
        
        # Current status
        current_aqi = current_metrics.get("aqi", 100)
        ward_name = current_metrics.get("ward", "Ward 1")
        weather = current_metrics.get("weather_condition", "Sunny")
        wind_speed = current_metrics.get("wind_speed", 5.0)
        traffic = current_metrics.get("traffic_congestion", 50.0)
        industry = current_metrics.get("industrial_emissions", 30.0)
        construction = current_metrics.get("construction_activity", 40.0)
        
        # 1. Try ML Prediction if models are available
        if self.models and self.feature_names:
            try:
                # Prepare a single row dataframe matching the training schema
                row_dict = {feat: 0.0 for feat in self.feature_names}
                
                # Assign continuous metrics
                row_dict["temperature"] = current_metrics.get("temperature", 25.0)
                row_dict["humidity"] = current_metrics.get("humidity", 50.0)
                row_dict["wind_speed"] = wind_speed
                row_dict["wind_direction"] = current_metrics.get("wind_direction", 180.0)
                row_dict["uv_index"] = current_metrics.get("uv_index", 2)
                row_dict["traffic_congestion"] = traffic
                row_dict["construction_activity"] = construction
                row_dict["industrial_emissions"] = industry
                row_dict["dust_level"] = current_metrics.get("dust_level", 20.0)
                row_dict["hour"] = datetime.now().hour if 'datetime' in globals() else 12
                row_dict["month"] = datetime.now().month if 'datetime' in globals() else 6
                row_dict["day_of_week"] = datetime.now().weekday() if 'datetime' in globals() else 2
                row_dict["aqi"] = current_aqi
                
                # Assign categorical variables (weather condition)
                weather_col = f"weather_condition_{weather}"
                if weather_col in row_dict:
                    row_dict[weather_col] = 1.0
                    
                # Assign categorical variables (ward)
                ward_col = f"ward_{ward_name}"
                if ward_col in row_dict:
                    row_dict[ward_col] = 1.0
                    
                df_inference = pd.DataFrame([row_dict])
                
                for label, model in self.models.items():
                    pred_val = model.predict(df_inference)[0]
                    # Clamp values realistically between 10 and 500
                    predictions[label] = max(10, min(500, int(pred_val)))
                    
            except Exception as e:
                print(f"Prediction Agent inference failed: {e}. Falling back to trend equations.")
                
        # 2. Fallback / Mock Formula Execution (Failsafe)
        if not predictions:
            # We base future predictions on traffic, weather patterns, and regression trends
            # Good weather and high winds disperse pollutants, high humidity/fog traps them
            weather_dilution = 0.95 if weather == "Sunny" else 1.05
            if weather == "Windy" or wind_speed > 10.0:
                weather_dilution = 0.82
            elif weather == "Foggy":
                weather_dilution = 1.25
            elif weather == "Rainy":
                weather_dilution = 0.75 # Washout effect
                
            # Diurnal trends (mocked lead forecasts)
            # +24h forecast (same time tomorrow, usually close with slight weather/traffic changes)
            predictions["24h"] = max(10, min(500, int(current_aqi * weather_dilution * (1.0 + np.random.normal(0, 0.05)))))
            
            # +48h forecast
            predictions["48h"] = max(10, min(500, int(current_aqi * weather_dilution * 1.05 * (1.0 + np.random.normal(0, 0.08)))))
            
            # +72h forecast
            predictions["72h"] = max(10, min(500, int(current_aqi * weather_dilution * 0.97 * (1.0 + np.random.normal(0, 0.12)))))

        # Format output
        results = []
        for label, val in predictions.items():
            hours = int(label.replace("h", ""))
            results.append({
                "horizon_hours": hours,
                "predicted_aqi": val,
                "confidence_score": confidences[label],
                "trend": "Rising" if val > current_aqi else "Falling" if val < current_aqi else "Stable"
            })
            
        return {
            "ward": ward_name,
            "current_aqi": current_aqi,
            "forecast": results
        }
