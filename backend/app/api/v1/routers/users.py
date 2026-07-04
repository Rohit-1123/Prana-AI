import uuid
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.dependencies.auth import get_current_user
from app.database.models.models import User
from app.database.schemas.auth_schemas import (
    UpdateProfileRequest,
    UpdateSettingsRequest
)
from app.services.user_service import UserService
from sqlalchemy import delete
from app.database.models.models import AuditLog

router = APIRouter(prefix="/users", tags=["User Profiles"])

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "message": "User profile retrieved successfully.",
        "data": {
            "id": str(current_user.id),
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "organization": current_user.organization,
            "phone": current_user.phone,
            "avatar": current_user.avatar,
            "status": current_user.status,
            "created_at": current_user.created_at
        },
        "metadata": {},
        "errors": []
    }

@router.patch("/me")
async def update_me(
    payload: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    user_service = UserService(db)
    updated = await user_service.update_profile(current_user.id, payload.model_dump(exclude_unset=True))
    await db.commit()

    return {
        "success": True,
        "message": "Profile parameters updated.",
        "data": {
            "full_name": updated.full_name,
            "organization": updated.organization,
            "phone": updated.phone,
            "avatar": updated.avatar
        },
        "metadata": {},
        "errors": []
    }

@router.patch("/settings")
async def update_settings(
    payload: UpdateSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    user_service = UserService(db)
    settings = await user_service.update_settings(current_user.id, payload.model_dump(exclude_unset=True))
    await db.commit()

    return {
        "success": True,
        "message": "Settings preferences updated.",
        "data": {
            "theme": settings.theme,
            "language": settings.language,
            "timezone": settings.timezone,
            "measurement_units": settings.measurement_units
        },
        "metadata": {},
        "errors": []
    }

@router.get("/sessions")
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    user_service = UserService(db)
    sessions = await user_service.get_active_sessions(current_user.id)
    return {
        "success": True,
        "message": "Active sessions list compiled.",
        "data": [
            {
                "id": str(s.id),
                "action": s.action,
                "ip_address": s.ip_address,
                "device": s.device,
                "timestamp": s.created_at
            }
            for s in sessions
        ],
        "metadata": {},
        "errors": []
    }

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    query = delete(AuditLog).filter(AuditLog.id == session_id, AuditLog.user_id == current_user.id)
    await db.execute(query)
    await db.commit()
    return {
        "success": True,
        "message": f"Session {session_id} deleted successfully.",
        "data": None,
        "metadata": {},
        "errors": []
    }

@router.delete("/sessions")
async def delete_all_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    query = delete(AuditLog).filter(AuditLog.user_id == current_user.id)
    await db.execute(query)
    await db.commit()
    return {
        "success": True,
        "message": "All user session logs cleared.",
        "data": None,
        "metadata": {},
        "errors": []
    }
