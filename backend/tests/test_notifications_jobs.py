import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_async_db
from app.dependencies.auth import get_current_user
from app.database.models.models import User, Notification, Alert, UserSettings
from unittest.mock import AsyncMock, MagicMock

# Global mock user role (can be updated in tests)
_MOCK_USER_ROLE = "Citizen"

# Mock DB dependency
async def override_get_async_db():
    db = MagicMock()

    async def mock_execute(query, *args, **kwargs):
        query_str = str(query).lower()
        if "from notifications" in query_str:
            n = Notification(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                title="Test High AQI Alert",
                message="Particulate levels exceeded safe threshold of 150.",
                priority="high",
                type="aqi",
                read_status=False
            )
            return MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[n]), first=MagicMock(return_value=n))))
        elif "from alerts" in query_str:
            a = Alert(
                id=uuid.uuid4(),
                location_id=uuid.uuid4(),
                alert_type="high_aqi",
                severity="high",
                aqi_trigger=156,
                status="active",
                resolved=False
            )
            return MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[a]), first=MagicMock(return_value=a))))
        else:
            s = UserSettings(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                notification_preferences="all"
            )
            return MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[s]), first=MagicMock(return_value=s))))

    db.execute = mock_execute
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.add = MagicMock()
    db.delete = AsyncMock()
    yield db

# Mock User dependency
async def override_get_current_user():
    return User(
        id=uuid.uuid4(),
        email="citizen@prana.ai",
        hashed_password="hashed_password",
        full_name="Citizen User",
        role=_MOCK_USER_ROLE,
        status="active"
    )

@pytest.fixture(autouse=True)
def setup_overrides():
    app.dependency_overrides[get_async_db] = override_get_async_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield
    app.dependency_overrides.pop(get_async_db, None)
    app.dependency_overrides.pop(get_current_user, None)

client = TestClient(app)

def test_get_notifications():
    response = client.get("/api/v1/notifications")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_mark_as_read():
    notif_id = str(uuid.uuid4())
    response = client.patch(f"/api/v1/notifications/{notif_id}/read")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["read_status"] is True

def test_mark_all_as_read():
    response = client.patch("/api/v1/notifications/read-all")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_delete_notification():
    notif_id = str(uuid.uuid4())
    response = client.delete(f"/api/v1/notifications/{notif_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_user_preferences():
    response = client.get("/api/v1/users/notifications")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "notification_preferences" in data["data"]

def test_update_user_preferences():
    payload = "high_priority_only"
    response = client.patch("/api/v1/users/notifications", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["notification_preferences"] == payload

def test_get_active_alerts():
    response = client.get("/api/v1/alerts/active")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_get_alerts_history():
    response = client.get("/api/v1/alerts/history")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_get_health_advisories():
    response = client.get("/api/v1/alerts/health", params={"aqi": 125})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "advisories" in data["data"]

def test_jobs_admin_protection():
    # Role Citizen is default, should return 403 Forbidden
    response = client.get("/api/v1/jobs")
    assert response.status_code == 403
    assert "Only administrators" in response.json()["message"]

def test_jobs_admin_allowed():
    global _MOCK_USER_ROLE
    _MOCK_USER_ROLE = "Administrator"
    try:
        response = client.get("/api/v1/jobs")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
    finally:
        _MOCK_USER_ROLE = "Citizen"

def test_retry_job():
    global _MOCK_USER_ROLE
    _MOCK_USER_ROLE = "Administrator"
    try:
        job_id = "job_02b3c4d5-6789-0abc-def1-2345678901bc"
        response = client.post(f"/api/v1/jobs/retry/{job_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "retrying"
    finally:
        _MOCK_USER_ROLE = "Citizen"
