# PranaAI — Urban Environmental Decision Intelligence Platform

> Predict. Explain. Act.

PranaAI is a production-ready, enterprise-grade, AI-powered Smart City Urban Environmental Decision Intelligence Platform. 

Standard environmental dashboards simply show reactive, historical AQI levels. PranaAI changes the paradigm by utilizing machine learning and a multi-agent framework to **predict** future trends, **explain** the causal drivers of pollution spikes, and enable administrators to **simulate** policy interventions in sandbox environments before deployment.

---

##  Key Features

*   **Interactive GIS Map (Leaflet + OpenStreetMap):** Live ward boundary polygons colored by local AQI levels, overlaying toggleable points of interest representing schools, hospitals, industrial plants, and construction zones.
*   **Hourly Predictions Engine (24h/48h/72h Forecasts):** Core gradient-boosted tree (XGBoost) regression models forecasting AQI horizons with confidence intervals.
*   **AI Explainability (SHAP Proxy & LLM Narrative):** Custom AI Explanation Agent inspecting local feature importances and generating natural language descriptions explaining *why* local conditions changed.
*   **Dynamic Source Attribution:** Quantitative splits showing the contribution of Traffic Congestion, Industrial Emissions, Road Dust, Construction, and Meteorological boundary dynamics.
*   **Policy Intervention Simulator:** Sandbox allowing commissioners to test actions (e.g. diesel truck bans) and view beneficiary metrics: population impact, schools safeguarded, and hospital benefits.
*   **Citizen AI Advisory Chat:** Real-time conversational interface providing health warnings and alternative green, low-exposure navigation pathways.
*   **Performance Auditing & Reports:** Dashboard to compile weekly/monthly performance indicators and export aggregated files in CSV formats.

---

##  Technology Stack

*   **Frontend:** React, Vite, TypeScript, TailwindCSS, Recharts, React Leaflet, Framer Motion.
*   **Backend:** FastAPI, Python, SQLAlchemy, JWT Security, Uvicorn, PyTest.
*   **Database:** PostgreSQL with PostGIS (SQLAlchemy models adapt to local SQLite database automatically).
*   **Machine Learning:** Scikit-Learn, XGBoost, Pandas, Numpy, Joblib.
*   **Containerization:** Docker, Docker Compose.

---

##  Repository Structure

```
PranaAI/
├── datasets/          # Synthetic dataset hourly generator
├── models/            # Trained XGBoost/Random Forest binaries and training script
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── core/      # Security, DB session, LLM client
│   │   ├── models/    # Database models
│   │   ├── schemas/   # Validation schemas
│   │   ├── routers/   # Endpoints (auth, map, simulator, chat, etc.)
│   │   ├── services/  # Database seeder
│   │   └── agents/    # The 7 AI Agents & Orchestrator
│   └── requirements.txt
├── frontend/          # React TypeScript dashboard client
├── docker/            # Docker configurations and Docker-compose
├── docs/              # 10 comprehensive architectural markdown modules
├── presentation/      # Presentation slide structure
├── demo/              # Interactive demo script
└── README.md          # Project main readme
```

---

##  Setting Up Locally

### Prerequisites
*   Python 3.11+
*   Node.js v18+ & NPM

### Step 1: Run Machine Learning Training
Before launching the server, generate the dataset and train the prediction models:
```bash
# 1. Install ML dependencies
pip install pandas numpy scikit-learn xgboost joblib

# 2. Generate 1-year hourly ward dataset (87,600 rows)
python datasets/generate_dataset.py

# 3. Train and serialize prediction & explainability models
python models/train_models.py
```

### Step 2: Spin Up Backend Server
```bash
cd backend/

# Install server dependencies
pip install -r requirements.txt

# Start FastAPI server (Automatic database seeding will occur on SQLite fallback)
python -m uvicorn app.main:app --reload
```
Swagger API docs will be available at `http://127.0.0.1:8000/docs`.

### Step 3: Spin Up Frontend Dashboard
```bash
cd frontend/

# Install client packages
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.
