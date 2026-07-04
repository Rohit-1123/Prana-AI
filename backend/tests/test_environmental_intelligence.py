import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_async_db
from unittest.mock import AsyncMock, MagicMock

# Mock DB dependency
async def override_get_async_db():
    db = AsyncMock()
    db.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[]), first=MagicMock(return_value=None)))))
    yield db

@pytest.fixture(autouse=True)
def setup_overrides():
    app.dependency_overrides[get_async_db] = override_get_async_db
    yield
    app.dependency_overrides.pop(get_async_db, None)

client = TestClient(app)

def test_intelligence_overview_missing_params():
    response = client.get("/api/v1/environment/intelligence")
    assert response.status_code == 422

def test_intelligence_overview_success():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/intelligence", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "environmental_score" in data["data"]
    assert "risk_level" in data["data"]

def test_environmental_trends():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/trends", params={"location_id": loc_id, "period": 24})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"]["timeline"], list)

def test_location_comparison():
    loc1 = str(uuid.uuid4())
    loc2 = str(uuid.uuid4())
    response = client.get("/api/v1/environment/comparison", params={"location_ids": [loc1, loc2]})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_hotspot_detection():
    response = client.get("/api/v1/environment/hotspots")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_pollution_breakdown():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/pollution-breakdown", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "traffic" in data["data"]
    assert "industrial" in data["data"]

def test_environmental_indicators():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/indicators", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "pm2_5" in data["data"]
    assert "temperature" in data["data"]

def test_historical_analysis():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/history", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_statistics_retrieval():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/statistics", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "median_aqi" in data["data"]
    assert "standard_deviation" in data["data"]

def test_ai_insights():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/insights", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_risk_analysis():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/environment/risk", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "risk_score" in data["data"]
    assert "risk_category" in data["data"]
