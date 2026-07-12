import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL configuration
# Fallback to SQLite database locally
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./prana.db")
sync_db_url = DATABASE_URL.replace("sqlite+aiosqlite://", "sqlite://")

# If using SQLite, we need connect_args={"check_same_thread": False}
if sync_db_url.startswith("sqlite"):
    engine = create_engine(
        sync_db_url, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(sync_db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
