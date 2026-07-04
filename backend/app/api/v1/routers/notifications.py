import uuid
from fastapi import APIRouter, Depends, Query, Body, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.notification_service import NotificationService
from app.dependencies.auth import get_current_user
from app.database.models.models import User

router = APIRouter(tags=["Notification Center"])

@router.get("/notifications")
async def get_notifications(
    unread_only: bool = Query(False, description="Filter to unread cards only"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.get_notifications(current_user.id, unread_only)
    return {
        "success": True,
        "message": "Notifications retrieved.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.patch("/notifications/{notification_id}/read")
async def mark_as_read(
    notification_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.mark_as_read(current_user.id, notification_id)
    return {
        "success": True,
        "message": "Notification marked as read.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.patch("/notifications/read-all")
async def mark_all_as_read(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.mark_all_as_read(current_user.id)
    return {
        "success": True,
        "message": "All notifications marked as read.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.delete_notification(current_user.id, notification_id)
    return {
        "success": True,
        "message": "Notification soft deleted.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.get("/users/notifications")
async def get_user_preferences(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.get_user_settings(current_user.id)
    return {
        "success": True,
        "message": "User notification preferences retrieved.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.patch("/users/notifications")
async def update_user_preferences(
    preferences: str = Body(..., description="Target preferences setting value"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    service = NotificationService(db)
    res = await service.update_user_settings(current_user.id, preferences)
    return {
        "success": True,
        "message": "User notification preferences updated.",
        "data": res,
        "metadata": {},
        "errors": []
    }
