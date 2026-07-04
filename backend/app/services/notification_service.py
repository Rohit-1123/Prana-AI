import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import Notification, Alert, UserSettings
from app.exceptions.handlers import APIException
from app.core.logging.logger import logger

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_notifications(self, user_id: uuid.UUID, unread_only: bool = False) -> List[Dict[str, Any]]:
        query = select(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.read_status == False)
        query = query.order_by(Notification.created_at.desc())
        
        res = await self.db.execute(query)
        notifications = res.scalars().all()
        return [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "priority": n.priority,
                "type": n.type,
                "read_status": n.read_status,
                "created_at": n.created_at
            }
            for n in notifications
        ]

    async def mark_as_read(self, user_id: uuid.UUID, notification_id: uuid.UUID) -> Dict[str, Any]:
        query = select(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id)
        res = await self.db.execute(query)
        notif = res.scalars().first()
        if not notif:
            raise APIException("Notification not found.", status_code=404)
        notif.read_status = True
        await self.db.commit()
        return {"id": str(notification_id), "read_status": True}

    async def mark_all_as_read(self, user_id: uuid.UUID) -> Dict[str, Any]:
        query = select(Notification).filter(Notification.user_id == user_id, Notification.read_status == False)
        res = await self.db.execute(query)
        unread = res.scalars().all()
        for u in unread:
            u.read_status = True
        await self.db.commit()
        return {"count": len(unread), "read_status": True}

    async def delete_notification(self, user_id: uuid.UUID, notification_id: uuid.UUID) -> Dict[str, Any]:
        query = select(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id)
        res = await self.db.execute(query)
        notif = res.scalars().first()
        if not notif:
            raise APIException("Notification not found.", status_code=404)
        # Soft delete simulation (remove from db for now)
        await self.db.delete(notif)
        await self.db.commit()
        return {"id": str(notification_id), "deleted": True}

    async def get_user_settings(self, user_id: uuid.UUID) -> Dict[str, Any]:
        query = select(UserSettings).filter(UserSettings.user_id == user_id)
        res = await self.db.execute(query)
        settings = res.scalars().first()
        if not settings:
            settings = UserSettings(user_id=user_id, notification_preferences="all")
            self.db.add(settings)
            await self.db.commit()
            await self.db.refresh(settings)

        return {
            "notification_preferences": settings.notification_preferences
        }

    async def update_user_settings(self, user_id: uuid.UUID, preferences: str) -> Dict[str, Any]:
        query = select(UserSettings).filter(UserSettings.user_id == user_id)
        res = await self.db.execute(query)
        settings = res.scalars().first()
        if not settings:
            settings = UserSettings(user_id=user_id, notification_preferences=preferences)
            self.db.add(settings)
        else:
            settings.notification_preferences = preferences
        await self.db.commit()
        return {"notification_preferences": settings.notification_preferences}


class AlertService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_alerts(self) -> List[Dict[str, Any]]:
        # Active unresolved alerts
        query = select(Alert).filter(Alert.resolved == False).order_by(Alert.severity.desc())
        res = await self.db.execute(query)
        alerts = res.scalars().all()
        return [
            {
                "id": str(a.id),
                "location_id": str(a.location_id),
                "alert_type": a.alert_type,
                "severity": a.severity,
                "aqi_trigger": a.aqi_trigger,
                "status": a.status,
                "resolved": a.resolved,
                "created_at": a.created_at
            }
            for a in alerts
        ]

    async def get_alerts_history(self) -> List[Dict[str, Any]]:
        query = select(Alert).order_by(Alert.created_at.desc())
        res = await self.db.execute(query)
        alerts = res.scalars().all()
        return [
            {
                "id": str(a.id),
                "location_id": str(a.location_id),
                "alert_type": a.alert_type,
                "severity": a.severity,
                "status": a.status,
                "resolved": a.resolved,
                "created_at": a.created_at
            }
            for a in alerts
        ]

    async def get_health_advisories(self, aqi: int) -> Dict[str, Any]:
        # Rule engine for subgroups
        if aqi <= 50:
            status = "Good"
            children = "Air quality is ideal for outdoor games and playground activities."
            seniors = "No precautionary actions needed; enjoy outdoor exercises."
            asthma = "Normal activities. Indoor levels remain safe."
            general = "Enjoy standard outdoor activities."
        elif aqi <= 100:
            status = "Moderate"
            children = "Extremely sensitive children should consider limiting prolonged outdoor activity."
            seniors = "Normal operations. Monitor for any breathing discomfort."
            asthma = "Sensitive individuals should watch for symptoms like wheezing or coughing."
            general = "Air quality is acceptable; low risk for the public."
        elif aqi <= 150:
            status = "Unhealthy for Sensitive Groups"
            children = "Reduce heavy outdoor activities; plan more indoor periods."
            seniors = "Sensitive individuals should limit prolonged exertion outdoors."
            asthma = "Keep quick-relief medicine nearby. Consider moving activities indoors."
            general = "Sensitive groups may experience health effects; others unlikely."
        else:
            status = "Unhealthy"
            children = "Avoid all outdoor physical education and recess. Keep windows closed."
            seniors = "Limit outdoor exposure; stay indoors in cooled spaces."
            asthma = "Move all exercises indoors. Keep asthma action plan ready."
            general = "Everyone may begin to experience health effects; limit prolonged outdoor exposure."

        return {
            "aqi": aqi,
            "status": status,
            "advisories": {
                "children": children,
                "senior_citizens": seniors,
                "asthma_patients": asthma,
                "outdoor_workers": "Wear certified masks; take regular indoor breaks.",
                "general_public": general
            }
        }
