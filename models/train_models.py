import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb

def train_and_save_models():
    print("Starting ML Model Training Pipeline...")
    
    # Load dataset
    dataset_path = "datasets/aqi_dataset.csv"
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Run generate_dataset.py first.")
        sys.exit(1)
        
    df = pd.read_csv(dataset_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Sort data chronologically for proper lagged feature creation
    df = df.sort_values(by=['ward', 'timestamp']).reset_index(drop=True)
    
    # Feature engineering: Add lags and time features
    df['hour'] = df['timestamp'].dt.hour
    df['month'] = df['timestamp'].dt.month
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    # Target variables: Lead AQI (t+24, t+48, t+72)
    df['aqi_lead_24'] = df.groupby('ward')['aqi'].shift(-24)
    df['aqi_lead_48'] = df.groupby('ward')['aqi'].shift(-48)
    df['aqi_lead_72'] = df.groupby('ward')['aqi'].shift(-72)
    
    # Drop rows with NaN targets due to shifting at the end of the time series
    df_clean = df.dropna(subset=['aqi_lead_24', 'aqi_lead_48', 'aqi_lead_72']).reset_index(drop=True)
    
    # Define features
    features = [
        'temperature', 'humidity', 'wind_speed', 'wind_direction', 'uv_index',
        'traffic_congestion', 'construction_activity', 'industrial_emissions',
        'dust_level', 'hour', 'month', 'day_of_week', 'aqi'
    ]
    
    # One-hot encode weather_condition and ward
    df_encoded = pd.get_dummies(df_clean, columns=['weather_condition', 'ward'], drop_first=False)
    
    # Update feature list with encoded columns
    encoded_features = [col for col in df_encoded.columns if col in features or 
                        col.startswith('weather_condition_') or col.startswith('ward_')]
    
    print(f"Features used for training ({len(encoded_features)}): {encoded_features}")
    
    os.makedirs("models", exist_ok=True)
    
    # Save features list
    joblib.dump(encoded_features, "models/feature_names.pkl")
    
    # We will train separate models for 24h, 48h, 72h predictions
    targets = {
        "24h": "aqi_lead_24",
        "48h": "aqi_lead_48",
        "72h": "aqi_lead_72"
    }
    
    evaluation_metrics = {}
    
    # Let's train a current model for explainability/attribution as well
    print("Training current AQI proxy model (for explainability and attribution mapping)...")
    X = df_encoded[encoded_features]
    y = df_clean['aqi']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest Regressor
    rf_current = RandomForestRegressor(n_estimators=50, max_depth=12, random_state=42, n_jobs=-1)
    rf_current.fit(X_train, y_train)
    
    # Save the current proxy model
    joblib.dump(rf_current, "models/model_aqi_current.pkl")
    
    # Save feature importances for current model
    importances = rf_current.feature_importances_
    feat_imp = pd.Series(importances, index=encoded_features).to_dict()
    joblib.dump(feat_imp, "models/feature_importances.pkl")
    
    for label, target_col in targets.items():
        print(f"\nTraining model for {label} forecast ({target_col})...")
        X = df_encoded[encoded_features]
        y = df_encoded[target_col]
        
        # Chronological train/test split (80% train, 20% test)
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
        
        # Train XGBoost regressor for performance, and RF as secondary/fallback
        # Using a moderate tree structure to keep file sizes and training time very fast
        model = xgb.XGBRegressor(
            n_estimators=80,
            max_depth=6,
            learning_rate=0.08,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        
        # Evaluate
        preds = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        mae = mean_absolute_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        
        print(f"Model {label} Evaluation:")
        print(f"  RMSE: {rmse:.4f}")
        print(f"  MAE:  {mae:.4f}")
        print(f"  R²:   {r2:.4f}")
        
        evaluation_metrics[label] = {
            "RMSE": round(rmse, 4),
            "MAE": round(mae, 4),
            "R2": round(r2, 4)
        }
        
        # Save model
        joblib.dump(model, f"models/model_aqi_{label}.pkl")
        
    joblib.dump(evaluation_metrics, "models/evaluation_metrics.pkl")
    print("\nAll models trained and saved to models/ folder.")

if __name__ == "__main__":
    train_and_save_models()
