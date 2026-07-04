import pytest
import uuid
from app.database.models.models import User, City, Location
from app.database.repositories.repositories import UserRepository, CityRepository
from app.database.utils import get_locations_within_radius_query, get_locations_in_bounding_box_query
from app.database.schemas.schemas import UserCreate, CityCreate

def test_pydantic_schemas_validation():
    # 1. Test UserCreate validation
    user_data = {
        "email": "test@prana.ai",
        "full_name": "Test User",
        "password": "secure_password",
        "role": "Citizen"
    }
    schema = UserCreate(**user_data)
    assert schema.email == "test@prana.ai"
    assert schema.full_name == "Test User"

    # 2. Test CityCreate validation
    city_data = {
        "name": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "latitude": 17.44,
        "longitude": 78.34
    }
    city_schema = CityCreate(**city_data)
    assert city_schema.name == "Hyderabad"
    assert city_schema.country == "India"

def test_spatial_query_builders():
    # Verify spatial queries compile text syntax correctly
    radius_query = get_locations_within_radius_query(
        lat=17.44,
        lon=78.34,
        radius_meters=5000.0,
        model_class=Location
    )
    assert "ST_DWithin" in str(radius_query)

    bbox_query = get_locations_in_bounding_box_query(
        min_lat=17.40,
        min_lon=78.30,
        max_lat=17.50,
        max_lon=78.40,
        model_class=Location
    )
    assert "ST_Contains" in str(bbox_query)
