import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_async_db
from unittest.mock import AsyncMock, MagicMock

# Mock DB dependency
async def override_get_async_db():
    db = AsyncMock()
    db.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[])))))
    yield db

@pytest.fixture(autouse=True)
def setup_overrides():
    app.dependency_overrides[get_async_db] = override_get_async_db
    yield
    app.dependency_overrides.pop(get_async_db, None)

client = TestClient(app)

def test_map_geojson_initialization():
    response = client.get("/api/v1/digital-twin/map")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["type"] == "FeatureCollection"
    assert isinstance(data["data"]["features"], list)

def test_heatmap_response():
    response = client.get("/api/v1/digital-twin/heatmap")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_nearby_sensors_query():
    response = client.get("/api/v1/digital-twin/nearby", params={"lat": 17.44, "lon": 78.34, "radius": 10.0})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
