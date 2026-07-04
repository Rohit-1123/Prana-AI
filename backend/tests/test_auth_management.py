import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.password_service import PasswordService

client = TestClient(app)

def test_password_hashing():
    pwd = "my_secure_password"
    hashed = PasswordService.hash_password(pwd)
    assert PasswordService.verify_password(pwd, hashed) is True
    assert PasswordService.verify_password("wrong_pwd", hashed) is False

def test_public_demo_accessibility():
    # Public endpoints should always be accessible without authorization headers
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_protected_routes_unauthorized():
    # Protected profiles /me should return 401 Unauthorized if token is absent
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401

def test_token_rotation_invalid():
    # Attempting to refresh using dummy signatures fails
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": "dummy_refresh_signature"})
    assert response.status_code == 401
