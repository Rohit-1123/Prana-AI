import os
import json
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import User, City, Ward, Infrastructure, HistoricalAQI
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash

def seed_database(db: Session):
    print("Seeding database for Hyderabad MVP...")
    
    # Check if already seeded
    if db.query(City).count() > 0:
        print("Database already seeded. Skipping.")
        return
        
    # 1. Create default users
    admin_password = get_password_hash("admin123")
    citizen_password = get_password_hash("citizen123")
    
    admin_user = User(
        email="admin@prana.ai",
        name="Hyderabad Environment Commissioner",
        hashed_password=admin_password,
        role="Municipal Officer"
    )
    pcb_user = User(
        email="pcb@prana.ai",
        name="PCB Inspector Hyderabad",
        hashed_password=admin_password,
        role="Pollution Control Board"
    )
    citizen_user = User(
        email="citizen@prana.ai",
        name="Citizen Rohit",
        hashed_password=citizen_password,
        role="Citizen"
    )
    
    db.add_all([admin_user, pcb_user, citizen_user])
    db.commit()
    print("Users seeded.")
    
    # 2. Create City (Hyderabad)
    city = City(
        name="Hyderabad",
        state="Telangana",
        country="India",
        latitude=17.4401,
        longitude=78.3489
    )
    db.add(city)
    db.commit()
    db.refresh(city)
    print("City (Hyderabad) seeded.")
    
    # 3. Create Hyderabad Focus Area Wards
    # Actual coordinates for Hyderabad locations
    ward_details = {
        "Gachibowli": {"lat": 17.4401, "lng": 78.3489, "pop": 120000, "area": 14.5, "green": 24.5, "number": 1},
        "Hitech City": {"lat": 17.4504, "lng": 78.3809, "pop": 95000, "area": 8.2, "green": 12.0, "number": 2},
        "Financial District": {"lat": 17.4190, "lng": 78.3429, "pop": 45000, "area": 11.2, "green": 28.0, "number": 3},
        "Madhapur": {"lat": 17.4483, "lng": 78.3915, "pop": 160000, "area": 12.0, "green": 9.5, "number": 4},
        "Kondapur": {"lat": 17.4622, "lng": 78.3572, "pop": 110000, "area": 10.4, "green": 18.0, "number": 5},
        "Nanakramguda": {"lat": 17.4172, "lng": 78.3562, "pop": 65000, "area": 7.8, "green": 22.0, "number": 6},
        "Jubilee Hills": {"lat": 17.4325, "lng": 78.4075, "pop": 85000, "area": 9.0, "green": 20.0, "number": 7},
        "Banjara Hills": {"lat": 17.4165, "lng": 78.4350, "pop": 90000, "area": 10.0, "green": 18.0, "number": 8},
        "Begumpet": {"lat": 17.4448, "lng": 78.4600, "pop": 45000, "area": 6.5, "green": 10.0, "number": 9},
        "Secunderabad": {"lat": 17.4399, "lng": 78.4983, "pop": 65000, "area": 8.0, "green": 12.5, "number": 10},
        "Charminar": {"lat": 17.3616, "lng": 78.4747, "pop": 250000, "area": 12.0, "green": 5.0, "number": 11},
        "Kukatpally": {"lat": 17.4855, "lng": 78.4100, "pop": 180000, "area": 11.5, "green": 8.5, "number": 12},
        "Uppal": {"lat": 17.4019, "lng": 78.5602, "pop": 150000, "area": 13.0, "green": 14.0, "number": 13},
        "LB Nagar": {"lat": 17.3457, "lng": 78.5522, "pop": 130000, "area": 12.5, "green": 11.0, "number": 14},
        "Nampally": {"lat": 17.3918, "lng": 78.4678, "pop": 110000, "area": 9.5, "green": 7.0, "number": 15},
        "Miyapur": {"lat": 17.4966, "lng": 78.3483, "pop": 145000, "area": 10.0, "green": 15.0, "number": 16},
        "Mehdipatnam": {"lat": 17.3971, "lng": 78.4316, "pop": 165000, "area": 10.5, "green": 13.0, "number": 17}
    }
    
    wards_db = {}
    for name, info in ward_details.items():
        lat = info["lat"]
        lng = info["lng"]
        
        # Geofencing bounding box polygon
        geojson = {
            "type": "Feature",
            "properties": {"name": name},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [lng - 0.012, lat - 0.012],
                    [lng + 0.012, lat - 0.012],
                    [lng + 0.012, lat + 0.012],
                    [lng - 0.012, lat + 0.012],
                    [lng - 0.012, lat - 0.012]
                ]]
            }
        }
        
        ward = Ward(
            city_id=city.id,
            name=name,
            ward_number=info["number"],
            boundary_geojson=json.dumps(geojson),
            population=info["pop"],
            area_sqkm=info["area"],
            green_cover_pct=info["green"]
        )
        db.add(ward)
        db.commit()
        db.refresh(ward)
        wards_db[name] = ward
        
    print("Hyderabad Wards seeded.")
    
    # 4. Create Infrastructure items with Hyderabad locations
    infra_data = [
        # Gachibowli
        ("AIG Hospitals Gachibowli", "Hospital", 17.4425, 78.3455, {"beds": 800}),
        ("IIIT Hyderabad", "School", 17.4475, 78.3485, {"students": 2500}),
        ("Himgiri Hospitals", "Hospital", 17.4350, 78.3420, {"beds": 120}),
        
        # Hitech City
        ("Raheja Mindspace IT Park", "Industry", 17.4490, 78.3780, {"workers": 50000, "emissions": "Low"}),
        ("CHIREC International School", "School", 17.4580, 78.3710, {"students": 3000}),
        ("Cyber Towers Metro Station Construction", "Construction", 17.4504, 78.3809, {"contractor": "L&T", "permit": "HYD-2026-M88"}),
        
        # Financial District
        ("Continental Hospital", "Hospital", 17.4175, 78.3435, {"beds": 750}),
        ("Oakridge International School", "School", 17.4125, 78.3395, {"students": 2800}),
        ("Wipro Circle Construction Zone", "Construction", 17.4190, 78.3429, {"permit": "HYD-2026-W33", "contractor": "HCC"}),
        
        # Madhapur
        ("Medicover Hospitals Madhapur", "Hospital", 17.4475, 78.3905, {"beds": 400}),
        ("Manthan International School", "School", 17.4390, 78.3930, {"students": 1500}),
        
        # Kondapur
        ("Care Hospitals Kondapur", "Hospital", 17.4640, 78.3560, {"beds": 350}),
        ("Sanskriti The School", "School", 17.4680, 78.3610, {"students": 1100}),
        
        # Nanakramguda
        ("US Consulate Complex", "Industry", 17.4180, 78.3585, {"facility": "Government"}),
        ("Delhi Public School", "School", 17.4105, 78.3535, {"students": 3500})
    ]
    
    for name, infra_type, lat, lng, details in infra_data:
        # Match infrastructure coordinates to nearest ward in database
        matched_ward = None
        min_dist = float('inf')
        for w_name, w_obj in wards_db.items():
            w_info = ward_details[w_name]
            dist = (lat - w_info["lat"])**2 + (lng - w_info["lng"])**2
            if dist < min_dist:
                min_dist = dist
                matched_ward = w_obj
                
        infra = Infrastructure(
            ward_id=matched_ward.id,
            name=name,
            type=infra_type,
            latitude=lat,
            longitude=lng,
            details=json.dumps(details)
        )
        db.add(infra)
        
    db.commit()
    print("Hyderabad infrastructure points seeded.")
    
    # 5. Load and seed Historical AQI from datasets/aqi_dataset.csv
    # Ingest the last 30 days of hourly data for Hyderabad wards
    dataset_path = "datasets/aqi_dataset.csv"
    if os.path.exists(dataset_path):
        print(f"Reading dataset: {dataset_path}")
        df = pd.read_csv(dataset_path)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        max_time = df['timestamp'].max()
        cutoff_time = max_time - pd.Timedelta(days=30)
        df_seed = df[df['timestamp'] >= cutoff_time].copy()
        
        records = []
        for idx, row in df_seed.iterrows():
            ward_name = row['ward']
            ward_obj = wards_db.get(ward_name)
            if not ward_obj:
                continue
                
            aqi_record = HistoricalAQI(
                ward_id=ward_obj.id,
                timestamp=row['timestamp'].to_pydatetime(),
                pm2_5=int(row['pm2_5']),
                pm10=int(row['pm10']),
                aqi=int(row['aqi']),
                temperature=float(row['temperature']),
                humidity=float(row['humidity']),
                wind_speed=float(row['wind_speed']),
                wind_direction=float(row['wind_direction']),
                uv_index=int(row['uv_index']),
                weather_condition=row['weather_condition'],
                traffic_congestion=float(row['traffic_congestion']),
                construction_activity=float(row['construction_activity']),
                industrial_emissions=float(row['industrial_emissions']),
                dust_level=float(row['dust_level'])
            )
            records.append(aqi_record)
            
        print(f"Ingesting {len(records)} historical records into SQLite...")
        db.bulk_save_objects(records)
        db.commit()
        print("Hyderabad AQI history seeded successfully.")
    else:
        print("Error: datasets/aqi_dataset.csv not found. Running generator first is required.")

if __name__ == "__main__":
    db = SessionLocal()
    # Re-create tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    try:
        seed_database(db)
    finally:
        db.close()
