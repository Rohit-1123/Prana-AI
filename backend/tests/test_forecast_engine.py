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

def test_current_forecast_missing_params():
    response = client.get("/api/v1/forecast/current")
    assert response.status_code == 422

def test_current_forecast_success():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/current", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "predicted_aqi" in data["data"]
    assert "confidence" in data["data"]

def test_timeline_forecast():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/timeline", params={"location_id": loc_id, "horizon": 24})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_forecast_comparison():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/comparison", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "difference" in data["data"]
    assert "percentage_change" in data["data"]

def test_forecast_confidence():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/confidence", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["overall_confidence"] == 0.93

def test_forecast_analytics():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/analytics", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "average_aqi" in data["data"]

def test_forecast_table():
    loc_id = str(uuid.uuid4())
    response = client.get("/api/v1/forecast/table", params={"location_id": loc_id})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_model_info():
    response = client.get("/api/v1/forecast/model")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "model_name" in data["data"]
