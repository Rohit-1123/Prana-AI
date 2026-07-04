def validate_coordinates(lat: float, lon: float) -> bool:
    """Verifies that latitude and longitude coordinate scopes fall within standard geographic boundaries."""
    return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0
