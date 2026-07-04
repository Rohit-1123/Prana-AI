import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.services.location_service import LocationService
from unittest.mock import AsyncMock

# Mock search service lookup
LocationService.search_by_name = AsyncMock(return_value=[
    {
        "name": "Gachibowli, Hyderabad, Telangana, India",
        "latitude": 17.4401,
        "longitude": 78.3489,
        "postal_code": "500032",
        "category": "Commercial",
        "status": "active"
    }
])

client = TestClient(app)

def test_mission_control_summary_missing_params():
    response = client.get("/api/v1/mission-control/summary")
    assert response.status_code == 422

def test_locations_search_missing_params():
    response = client.get("/api/v1/locations/search")
    assert response.status_code == 422

def test_locations_search_success():
    response = client.get("/api/v1/locations/search", params={"q": "Gachibowli"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) > 0
    assert data["data"][0]["name"] == "Gachibowli, Hyderabad, Telangana, India"
