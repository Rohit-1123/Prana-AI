from datetime import datetime, timezone

def get_utc_now() -> datetime:
    """Returns the current timezone-aware UTC timestamp."""
    return datetime.now(timezone.utc)
