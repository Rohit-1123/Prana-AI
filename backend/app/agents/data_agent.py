import pandas as pd
import numpy as np

class DataIntelligenceAgent:
    def __init__(self):
        self.name = "Data Intelligence Agent"

    def clean_and_validate(self, raw_data: dict) -> dict:
        """
        Validates environmental data inputs, applies range checks,
        imputes outliers, and flags anomalies.
        """
        cleaned = raw_data.copy()
        anomalies = []
        
        # 1. Temperature Validation (-10C to 55C)
        if "temperature" in cleaned:
            val = cleaned["temperature"]
            if val is None or not (-10 <= val <= 55):
                anomalies.append(f"Temperature anomaly detected: {val}")
                cleaned["temperature"] = 25.0 # Default fallback
                
        # 2. Humidity Validation (0% to 100%)
        if "humidity" in cleaned:
            val = cleaned["humidity"]
            if val is None or not (0 <= val <= 100):
                anomalies.append(f"Humidity anomaly detected: {val}")
                cleaned["humidity"] = 55.0 # Default fallback
                
        # 3. Wind Speed Validation (0 to 150 km/h)
        if "wind_speed" in cleaned:
            val = cleaned["wind_speed"]
            if val is None or not (0 <= val <= 150):
                anomalies.append(f"Wind speed anomaly detected: {val}")
                cleaned["wind_speed"] = 8.0
                
        # 4. AQI Validation (0 to 500)
        if "aqi" in cleaned:
            val = cleaned["aqi"]
            if val is None or not (0 <= val <= 1000):
                anomalies.append(f"AQI outlier detected: {val}")
                cleaned["aqi"] = max(0, min(500, val or 150))
                
        # 5. Traffic Congestion (0 to 100)
        if "traffic_congestion" in cleaned:
            val = cleaned["traffic_congestion"]
            if val is None or not (0 <= val <= 100):
                anomalies.append(f"Traffic index out of range: {val}")
                cleaned["traffic_congestion"] = 50.0
                
        # 6. Industrial Emissions (0 to 100)
        if "industrial_emissions" in cleaned:
            val = cleaned["industrial_emissions"]
            if val is None or not (0 <= val <= 100):
                anomalies.append(f"Industrial index anomaly: {val}")
                cleaned["industrial_emissions"] = 30.0

        # Log errors / alerts if present
        cleaned["is_valid"] = True
        cleaned["anomalies_flagged"] = anomalies
        return cleaned

    def merge_datasets(self, list_of_dfs: list) -> pd.DataFrame:
        """
        Merge GIS, traffic, and weather dataframes chronologically.
        """
        if not list_of_dfs:
            return pd.DataFrame()
        
        merged = list_of_dfs[0]
        for df in list_of_dfs[1:]:
            # Assuming outer merge on timestamp and ward
            merged = pd.merge(merged, df, on=["timestamp", "ward"], how="outer")
            
        # Forward fill and back fill temporal gaps
        merged = merged.sort_values(by=["ward", "timestamp"])
        merged = merged.groupby("ward", group_keys=False).apply(lambda group: group.ffill().bfill())
        return merged
