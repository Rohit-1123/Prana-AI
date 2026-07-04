import pytest
import uuid
import json
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import get_async_db
from app.dependencies.auth import get_current_user
from app.database.models.models import User
from unittest.mock import AsyncMock, MagicMock

# Mock DB dependency
async def override_get_async_db():
    db = MagicMock()
    db.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[]), first=MagicMock(return_value=None)))))
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.add = MagicMock()
    yield db

# Mock User dependency
async def override_get_current_user():
    return User(
        id=uuid.uuid4(),
        email="test_user@prana.ai",
        hashed_password="hashed_password",
        full_name="Test User",
        role="Citizen",
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

def test_chat_interaction_missing_params():
    response = client.post("/api/v1/ai/chat", json={})
    assert response.status_code == 422

def test_chat_interaction_success_json():
    loc_id = str(uuid.uuid4())
    payload = {
        "prompt": "Show forecast details",
        "location_id": loc_id,
        "stream": False
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "response" in data["data"]

def test_chat_interaction_success_streaming():
    loc_id = str(uuid.uuid4())
    payload = {
        "prompt": "Compare locations",
        "location_id": loc_id,
        "stream": True
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]

def test_get_conversations():
    response = client.get("/api/v1/ai/conversations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)

def test_get_conversation_details():
    conv_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/ai/conversations/{conv_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
