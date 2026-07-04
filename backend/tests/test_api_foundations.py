from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_endpoint():
    # Database is sqlite (offline sync engine on startup)
    # Redis cache pings fallback
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "database" in data["data"]
    assert "redis" in data["data"]

def test_version_endpoint():
    response = client.get("/api/v1/system/version")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["version"] == "1.0.0"
    assert data["data"]["api_version"] == "v1"

def test_middleware_logging():
    response = client.get("/")
    assert "X-Request-ID" in response.headers
    assert "X-Response-Time-Ms" in response.headers
