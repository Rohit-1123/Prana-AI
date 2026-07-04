import time
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database.connection import get_async_db
from app.cache.redis import cache
from app.core.config.settings import settings
from app.core.logging.logger import logger

router = APIRouter(prefix="/system", tags=["System Health"])

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_async_db)):
    db_status = "offline"
    redis_status = "offline"

    # Ping database asynchronously
    try:
        start = time.time()
        await db.execute(text("SELECT 1"))
        db_status = f"online (ping: {(time.time() - start)*1000:.1f}ms)"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")

    # Ping Redis asynchronously
    try:
        if await cache.ping():
            redis_status = "online"
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")

    return {
        "success": True,
        "message": "Health status checks compiled successfully.",
        "data": {
            "status": "healthy" if "online" in db_status and redis_status == "online" else "degraded",
            "database": db_status,
            "redis": redis_status,
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT
        },
        "metadata": {
            "timestamp": time.time()
        },
        "errors": []
    }

@router.get("/version")
async def get_version():
    return {
        "success": True,
        "message": "System version information retrieved.",
        "data": {
            "version": "1.0.0",
            "api_version": "v1",
            "environment": settings.ENVIRONMENT
        },
        "metadata": {},
        "errors": []
    }
