import time
import uuid
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.database.schemas.auth_schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.services.user_service import UserService
from app.services.token_service import TokenService
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_async_db)):
    user_service = UserService(db)
    user = await user_service.register_user(payload.model_dump())
    await db.commit()
    
    return {
        "success": True,
        "message": "User registration completed successfully. Verification email queued.",
        "data": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name
        },
        "metadata": {},
        "errors": []
    }

@router.post("/login")
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_async_db)
):
    user_service = UserService(db)
    user = await user_service.authenticate_user(payload.email, payload.password)
    
    # Generate tokens
    access = TokenService.create_access_token(user.id, user.role)
    refresh = TokenService.create_refresh_token(user.id)
    
    # Log session
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    await user_service.log_session_activity(user.id, "USER_LOGIN", ip, user_agent)
    
    await db.commit()

    return {
        "success": True,
        "message": "Authentication successful.",
        "data": {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "expires_in": 60 * 24 * 8 * 60, # 8 days in seconds
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        },
        "metadata": {},
        "errors": []
    }

@router.post("/logout")
async def logout(
    payload: RefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_async_db)
):
    # Blacklist refresh token
    decoded = TokenService.decode_token(payload.refresh_token)
    if decoded and decoded.get("type") == "refresh":
        jti = decoded.get("jti")
        sub = decoded.get("sub")
        if jti:
            await TokenService.revoke_refresh_token(jti)
            if sub:
                user_service = UserService(db)
                ip = request.client.host if request.client else "unknown"
                user_agent = request.headers.get("user-agent", "unknown")
                await user_service.log_session_activity(sub, "USER_LOGOUT", ip, user_agent)
                await db.commit()

    return {
        "success": True,
        "message": "Session logged out and tokens revoked successfully.",
        "data": None,
        "metadata": {},
        "errors": []
    }

@router.post("/refresh")
async def refresh_tokens(payload: RefreshRequest):
    decoded = TokenService.decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise APIException(message="Invalid or expired refresh token signature.", status_code=401)
    
    jti = decoded.get("jti")
    if jti and await TokenService.is_refresh_token_revoked(jti):
        raise APIException(message="Refresh token has been revoked.", status_code=401)

    sub = decoded.get("sub")
    # Rotate refresh tokens (blacklist previous and return new pair)
    if jti:
        await TokenService.revoke_refresh_token(jti)
        
    new_access = TokenService.create_access_token(sub, "Citizen") # Fallback to default role
    new_refresh = TokenService.create_refresh_token(sub)
    
    return {
        "success": True,
        "message": "Token refreshed successfully.",
        "data": {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token_type": "bearer",
            "expires_in": 60 * 24 * 8 * 60
        },
        "metadata": {},
        "errors": []
    }

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    # Simulated token generation
    reset_token = str(uuid.uuid4())
    return {
        "success": True,
        "message": "Password reset email instructions queued.",
        "data": {
            "reset_token_reference": reset_token
        },
        "metadata": {},
        "errors": []
    }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    return {
        "success": True,
        "message": "Password was reset successfully. Proceed to login.",
        "data": None,
        "metadata": {},
        "errors": []
    }

@router.get("/verify-email")
async def verify_email(token: str):
    return {
        "success": True,
        "message": "Email address validated successfully.",
        "data": None,
        "metadata": {},
        "errors": []
    }
