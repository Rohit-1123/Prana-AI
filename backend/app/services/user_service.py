import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import User, UserSettings, AuditLog
from app.database.repositories.repositories import UserRepository
from app.services.password_service import PasswordService
from app.exceptions.handlers import APIException

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register_user(self, data: dict) -> User:
        # Check if email exists
        existing = await self.user_repo.get_by_email(data["email"])
        if existing:
            raise APIException(message="A user with this email address already exists.", status_code=400)

        hashed_pass = PasswordService.hash_password(data["password"])
        new_user = User(
            id=uuid.uuid4(),
            email=data["email"],
            hashed_password=hashed_pass,
            full_name=data["full_name"],
            role="Citizen",
            organization=data.get("organization"),
            phone=data.get("phone"),
            status="active"
        )
        self.db.add(new_user)
        await self.db.flush()

        # Initialize settings
        settings = UserSettings(
            id=uuid.uuid4(),
            user_id=new_user.id,
            theme="system",
            language="en",
            timezone="IST",
            measurement_units="metric",
            notification_preferences="all",
            map_preferences="{}"
        )
        self.db.add(settings)
        return new_user

    async def authenticate_user(self, email: str, plain_password: str) -> User:
        user = await self.user_repo.get_by_email(email)
        if not user:
            raise APIException(message="Invalid email credentials provided.", status_code=401)
        
        if not PasswordService.verify_password(plain_password, user.hashed_password):
            raise APIException(message="Invalid password credentials provided.", status_code=401)

        user.last_login = datetime.now(timezone.utc)
        self.db.add(user)
        return user

    async def update_profile(self, user_id: uuid.UUID, data: dict) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise APIException(message="Target user profile not found.", status_code=404)

        for field, value in data.items():
            if value is not None and hasattr(user, field):
                setattr(user, field, value)

        self.db.add(user)
        return user

    async def update_settings(self, user_id: uuid.UUID, data: dict) -> UserSettings:
        query = select(UserSettings).filter(UserSettings.user_id == user_id)
        result = await self.db.execute(query)
        settings = result.scalars().first()
        if not settings:
            raise APIException(message="UserSettings profile not found.", status_code=404)

        for field, value in data.items():
            if value is not None and hasattr(settings, field):
                setattr(settings, field, value)

        self.db.add(settings)
        return settings

    async def log_session_activity(self, user_id: uuid.UUID, action: str, ip: str, device: str):
        audit = AuditLog(
            id=uuid.uuid4(),
            user_id=user_id,
            action=action,
            entity="User",
            entity_id=str(user_id),
            ip_address=ip,
            device=device
        )
        self.db.add(audit)
        await self.db.flush()

    async def get_active_sessions(self, user_id: uuid.UUID) -> List[AuditLog]:
        query = select(AuditLog).filter(AuditLog.user_id == user_id).order_by(AuditLog.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())
