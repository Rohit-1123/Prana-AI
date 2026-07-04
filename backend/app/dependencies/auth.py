from fastapi import Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.token_service import TokenService
from app.database.repositories.repositories import UserRepository
from app.exceptions.handlers import APIException
from app.database.models.models import User

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_async_db)
) -> User:
    if not credentials:
        raise APIException(
            message="Bearer credentials signatures are missing.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    token = credentials.credentials
    payload = TokenService.decode_token(token)
    if not payload or payload.get("type") != "access":
        raise APIException(
            message="Provided access token signature is invalid or expired.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise APIException(
            message="Invalid token payload fields.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise APIException(
            message="Target user profile corresponding to token was not found.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    if user.status != "active":
        raise APIException(
            message="User account status is currently inactive.",
            status_code=status.HTTP_403_FORBIDDEN
        )

    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)) -> User:
        if user.role not in self.allowed_roles:
            raise APIException(
                message=f"Insufficient permissions. Requires: {', '.join(self.allowed_roles)}.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        return user
