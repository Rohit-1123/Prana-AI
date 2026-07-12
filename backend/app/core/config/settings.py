import os
from typing import List, Optional
from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load .env file searching upwards from current directory
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "PranaAI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # PostgreSQL Database configurations
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: str = "prana_db"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info) -> str:
        if isinstance(v, str) and v:
            return v
        data = info.data
        if not data.get('POSTGRES_PASSWORD'):
            raise ValueError("POSTGRES_PASSWORD must be set in environment variables")
        return f"postgresql+asyncpg://{data.get('POSTGRES_USER')}:{data.get('POSTGRES_PASSWORD')}@{data.get('POSTGRES_SERVER')}:{data.get('POSTGRES_PORT')}/{data.get('POSTGRES_DB')}"

    # Redis configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    # Security JWT tokens settings
    SECRET_KEY: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # External Provider Configs
    OPENWEATHER_API_KEY: Optional[str] = None
    NOMINATIM_USER_AGENT: str = "PranaAI-Environmental-Intelligence-Platform"
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "qwen/qwen3-32b"


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

