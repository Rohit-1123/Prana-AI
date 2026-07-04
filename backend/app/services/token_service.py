import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from app.core.config.settings import settings
from app.core.logging.logger import logger
from app.cache.redis import cache

ALGORITHM = "HS256"

class TokenService:
    @staticmethod
    def create_access_token(user_id: str, role: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {
            "exp": expire,
            "sub": str(user_id),
            "role": role,
            "type": "access"
        }
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(days=30) # 30 days refresh lifecycle
        token_id = str(uuid.uuid4())
        to_encode = {
            "exp": expire,
            "sub": str(user_id),
            "jti": token_id,
            "type": "refresh"
        }
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def revoke_refresh_token(jti: str, expire_seconds: int = 3600 * 24 * 30) -> bool:
        """Saves blacklisted JWT IDs to Redis cache to prevent replay/reuse."""
        key = f"blacklist:token:{jti}"
        return await cache.set(key, "revoked", expire_seconds)

    @staticmethod
    async def is_refresh_token_revoked(jti: str) -> bool:
        key = f"blacklist:token:{jti}"
        status = await cache.get(key)
        return status is not None

    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError as e:
            logger.error(f"JWT signature verification failed: {e}")
            return None
