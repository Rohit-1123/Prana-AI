import pytest
import uuid
from datetime import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_async_db
from app.dependencies.auth import get_current_user
from app.database.models.models import User, Location, Report
from unittest.mock import AsyncMock, MagicMock

# Mock DB dependency
async def override_get_async_db():
    db = MagicMock()

    async def mock_execute(query, *args, **kwargs):
        query_str = str(query).lower()
        if "from locations" in query_str:
            loc = Location(
                id=uuid.uuid4(),
                name="Gachibowli",
                latitude=17.44,
                longitude=78.34,
                category="Commercial"
            )
            return MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[loc]), first=MagicMock(return_value=loc))))
        else:
            rep = Report(
                id=uuid.uuid4(),
                user_id=uuid.uuid4(),
                report_name="Daily Environmental Report - Gachibowli",
                report_type="daily_summary",
                status="completed",
                export_format="pdf",
                location_scope="Gachibowli"
            )
            return MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[rep]), first=MagicMock(return_value=rep))))

    db.execute = mock_execute
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.add = MagicMock()
    yield db

# Mock User dependency
async def override_get_current_user():
    return User(
        id=uuid.uuid4(),
        email="reporter@prana.ai",
        hashed_password="hashed_password",
        full_name="Reporter User",
        role="Researcher",
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

def test_get_templates():
    response = client.get("/api/v1/reports/templates")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_generate_report():
    loc_id = str(uuid.uuid4())
    payload = {
        "report_type": "daily_summary",
        "location_id": loc_id,
        "export_format": "pdf"
    }
    response = client.post("/api/v1/reports/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "report_id" in data["data"]

def test_get_preview():
    report_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/reports/{report_id}/preview")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "executive_summary" in data["data"]

def test_download_report():
    report_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/reports/{report_id}/download", params={"format_type": "csv"})
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]

def test_get_history():
    response = client.get("/api/v1/reports/history")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_schedule_report():
    payload = {
        "template_id": "daily_summary",
        "cron": "0 0 * * *"
    }
    response = client.post("/api/v1/reports/schedule", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "schedule_id" in data["data"]

def test_list_schedules():
    response = client.get("/api/v1/reports/schedules")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
