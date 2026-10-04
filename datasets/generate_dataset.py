import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data():
    print("Generating synthetic environmental dataset for Hyderabad (IT Corridor)...")
    np.random.seed(42)
    
    # Configurations matching Hyderabad MVP requirements
    wards = [
        "Gachibowli", "Hitech City", "Financial District", "Madhapur", "Kondapur", "Nanakramguda",
        "Jubilee Hills", "Banjara Hills", "Begumpet", "Secunderabad", "Charminar", "Kukatpally",
        "Uppal", "LB Nagar", "Nampally", "Miyapur", "Mehdipatnam"
    ]
    start_date = datetime(2025, 1, 1, 0, 0, 0)
    end_date = datetime(2025, 12, 31, 23, 0, 0)
    hours = int((end_date - start_date).total_seconds() / 3600) + 1
    
    data = []
    
    # Base profiles for Hyderabad neighborhoods
    ward_profiles = {
        "Gachibowli": {"traffic_base": 65, "ind_base": 5, "const_base": 50, "green_base": 30},
        "Hitech City": {"traffic_base": 85, "ind_base": 3, "const_base": 60, "green_base": 18},
        "Financial District": {"traffic_base": 60, "ind_base": 2, "const_base": 75, "green_base": 28},
        "Madhapur": {"traffic_base": 80, "ind_base": 8, "const_base": 45, "green_base": 15},
        "Kondapur": {"traffic_base": 55, "ind_base": 2, "const_base": 55, "green_base": 25},
        "Nanakramguda": {"traffic_base": 50, "ind_base": 2, "const_base": 80, "green_base": 22},
        "Jubilee Hills": {"traffic_base": 45, "ind_base": 1, "const_base": 30, "green_base": 35},
        "Banjara Hills": {"traffic_base": 50, "ind_base": 2, "const_base": 35, "green_base": 30},
        "Begumpet": {"traffic_base": 75, "ind_base": 10, "const_base": 40, "green_base": 12},
        "Secunderabad": {"traffic_base": 80, "ind_base": 15, "const_base": 45, "green_base": 10},
        "Charminar": {"traffic_base": 85, "ind_base": 20, "const_base": 20, "green_base": 5},
        "Kukatpally": {"traffic_base": 70, "ind_base": 12, "const_base": 50, "green_base": 14},
        "Uppal": {"traffic_base": 65, "ind_base": 18, "const_base": 45, "green_base": 16},
        "LB Nagar": {"traffic_base": 60, "ind_base": 8, "const_base": 55, "green_base": 18},
        "Nampally": {"traffic_base": 75, "ind_base": 6, "const_base": 30, "green_base": 11},
        "Miyapur": {"traffic_base": 50, "ind_base": 4, "const_base": 65, "green_base": 22},
        "Mehdipatnam": {"traffic_base": 70, "ind_base": 5, "const_base": 40, "green_base": 15}
    }
    
    weather_conditions = ["Sunny", "Cloudy", "Rainy", "Windy", "Foggy"]
    weather_probs = [0.55, 0.22, 0.13, 0.07, 0.03] # Hyderabad weather profile (mostly sunny/cloudy, rare fog)
    
    current_time = start_date
    for h in range(hours):
        month = current_time.month
        hour = current_time.hour
        
        # Diurnal temperature variations in Hyderabad
        # Hot summer: March to June. Monsoon: July to October. Winter: November to February.
        if month in [3, 4, 5, 6]:
            temp_base = 32
        elif month in [11, 12, 1, 2]:
            temp_base = 22
        else:
            temp_base = 28
            
        temp = temp_base + 7 * np.sin((hour - 6) / 24 * 2 * np.pi) + np.random.normal(0, 1.2)
        humidity = max(10, min(95, 75 - (temp - 20) * 1.8 + np.random.normal(0, 2.5)))
        
        # Wind speed and directions
        wind_speed = max(0.5, 4.5 + 2.5 * np.sin(h / 120) + np.random.normal(0, 1.2))
        wind_direction = (160 + 80 * np.sin(h / 180) + np.random.normal(0, 12)) % 360
        
        # UV index peaks at noon
        is_sunny = np.random.choice([True, False], p=[0.75, 0.25])
        uv = max(0, int(11 * np.sin((hour - 6) / 12 * np.pi) * (0.95 if is_sunny else 0.4))) if 6 <= hour <= 18 else 0
        
        cond = np.random.choice(weather_conditions, p=weather_probs)
        if temp < 16 and humidity > 85 and cond != "Rainy":
            cond = "Foggy"
        elif cond == "Rainy":
            humidity = max(80, humidity)
            uv = max(0, uv - 4)
            
        for ward in wards:
            profile = ward_profiles[ward]
            
            # Traffic profiles (peaks at 9-11 AM and 6-8 PM for office commute)
            if 9 <= hour <= 11 or 18 <= hour <= 20:
                traffic_hour_coeff = 1.35
            elif 12 <= hour <= 17 or 21 <= hour <= 22:
                traffic_hour_coeff = 0.85
            else:
                traffic_hour_coeff = 0.15
                
            traffic = max(5, min(100, profile["traffic_base"] * traffic_hour_coeff + np.random.normal(0, 4.5)))
            
            # Construction activity (daytime focus)
            const_hour_coeff = 1.25 if 8 <= hour <= 18 else 0.05
            construction = max(0, min(100, profile["const_base"] * const_hour_coeff + np.random.normal(0, 3.5)))
            
            # Industrial emissions (very low in IT corridor)
            ind_hour_coeff = 1.0 if 7 <= hour <= 21 else 0.6
            industry = max(0, min(100, profile["ind_base"] * ind_hour_coeff + np.random.normal(0, 1.5)))
            
            # Dust levels (heavy road dust entrained by construction and traffic)
            dust_base = construction * 0.5 + traffic * 0.25
            if cond == "Rainy":
                dust = max(2, dust_base * 0.12 + np.random.normal(0, 1))
            elif wind_speed > 10.0:
                dust = max(8, dust_base * 1.45 + (wind_speed - 10.0) * 1.5 + np.random.normal(0, 2))
            else:
                dust = max(4, dust_base * 0.75 + np.random.normal(0, 1.5))
                
            # Particulate matter calculation
            pm25_raw = (
                traffic * 0.75 + 
                construction * 0.55 + 
                industry * 0.8 + 
                dust * 0.4 - 
                wind_speed * 1.5 - 
                profile["green_base"] * 0.25 - 
                (20 if cond == "Rainy" else 0)
            )
            pm25 = max(5, int(pm25_raw + 20 + np.random.normal(0, 5)))
            
            pm10_raw = (
                pm25 * 1.35 + 
                construction * 0.75 + 
                dust * 0.95 - 
                wind_speed * 1.0
            )
            pm10 = max(10, int(pm10_raw + 15 + np.random.normal(0, 6.5)))
            
            # Compute AQI
            if pm25 <= 30:
                aqi = int((pm25 / 30) * 50)
            elif pm25 <= 60:
                aqi = int(50 + ((pm25 - 30) / 30) * 50)
            elif pm25 <= 90:
                aqi = int(100 + ((pm25 - 60) / 30) * 100)
            elif pm25 <= 120:
                aqi = int(200 + ((pm25 - 90) / 30) * 100)
            else:
                aqi = int(300 + min(200, ((pm25 - 120) / 100) * 200))
                
            data.append({
                "timestamp": current_time,
                "ward": ward,
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": round(wind_direction, 1),
                "uv_index": uv,
                "weather_condition": cond,
                "traffic_congestion": round(traffic, 1),
                "construction_activity": round(construction, 1),
                "industrial_emissions": round(industry, 1),
                "dust_level": round(dust, 1),
                "pm2_5": pm25,
                "pm10": pm10,
                "aqi": aqi
            })
            
        current_time += timedelta(hours=1)
        
    df = pd.DataFrame(data)
    os.makedirs("datasets", exist_ok=True)
    filepath = "datasets/aqi_dataset.csv"
    df.to_csv(filepath, index=False)
    print(f"Dataset compiled and saved to {filepath}. Shape: {df.shape}")

if __name__ == "__main__":
    generate_synthetic_data()
