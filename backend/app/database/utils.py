from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

def paginate_query(query: Any, skip: int = 0, limit: int = 100) -> Any:
    """Applies offsets bounds pagination parameters onto a SQLAlchemy query."""
    return query.offset(skip).limit(limit)

def get_locations_within_radius_query(
    lat: float,
    lon: float,
    radius_meters: float,
    model_class: Any
) -> Any:
    """
    Returns locations matching spatial indexes falling within a specified radius
    using PostGIS geometry operators.
    """
    point_wkt = f"POINT({lon} {lat})"
    return select(model_class).filter(
        text(f"ST_DWithin(point_geom, ST_GeomFromText('{point_wkt}', 4326)::geography, {radius_meters})")
    )

def get_locations_in_bounding_box_query(
    min_lat: float,
    min_lon: float,
    max_lat: float,
    max_lon: float,
    model_class: Any
) -> Any:
    """
    Returns points falling within the coordinates bounding box.
    """
    bbox_wkt = f"POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, {max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))"
    return select(model_class).filter(
        text(f"ST_Contains(ST_GeomFromText('{bbox_wkt}', 4326), point_geom)")
    )
