from typing import Optional
from redis.asyncio import Redis, ConnectionPool
from app.core.config.settings import settings
from app.core.logging.logger import logger

# Global Connection Pool
pool: Optional[ConnectionPool] = None

def init_redis_pool():
    global pool
    try:
        redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        pool = ConnectionPool.from_url(redis_url, max_connections=20, decode_responses=True)
        logger.info(f"Initialized Redis connection pool targeting {redis_url}")
    except Exception as e:
        logger.error(f"Failed to initialize Redis connection pool: {e}")

class RedisCache:
    def __init__(self):
        self._client: Optional[Redis] = None

    @property
    def client(self) -> Redis:
        if self._client is None:
            if pool is None:
                init_redis_pool()
            self._client = Redis(connection_pool=pool)
        return self._client

    async def get(self, key: str) -> Optional[str]:
        try:
            return await self.client.get(key)
        except Exception as e:
            logger.error(f"Redis get failed for key {key}: {e}")
            return None

    async def set(self, key: str, value: str, expire_seconds: int = 3600) -> bool:
        try:
            await self.client.set(key, value, ex=expire_seconds)
            return True
        except Exception as e:
            logger.error(f"Redis set failed for key {key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        try:
            await self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis delete failed for key {key}: {e}")
            return False

    async def ping(self) -> bool:
        try:
            return await self.client.ping()
        except Exception as e:
            logger.error(f"Redis ping failed: {e}")
            return False

# Scoped cache instance
cache = RedisCache()
