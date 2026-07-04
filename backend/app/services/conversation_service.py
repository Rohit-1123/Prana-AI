import uuid
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.models import AIConversation, AIMessage
from app.exceptions.handlers import APIException

class ConversationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_conversations(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        query = select(AIConversation).filter(AIConversation.user_id == user_id).order_by(AIConversation.created_at.desc())
        res = await self.db.execute(query)
        convs = res.scalars().all()
        return [
            {
                "id": str(c.id),
                "title": c.title,
                "created_at": c.created_at
            }
            for c in convs
        ]

    async def create_conversation(self, user_id: uuid.UUID, title: str = "New Conversation") -> Dict[str, Any]:
        conv = AIConversation(id=uuid.uuid4(), user_id=user_id, title=title)
        self.db.add(conv)
        await self.db.commit()
        await self.db.refresh(conv)
        return {
            "id": str(conv.id),
            "title": conv.title,
            "created_at": conv.created_at
        }

    async def get_messages(self, conversation_id: uuid.UUID) -> List[Dict[str, Any]]:
        query = select(AIMessage).filter(AIMessage.conversation_id == conversation_id).order_by(AIMessage.created_at.asc())
        res = await self.db.execute(query)
        messages = res.scalars().all()
        return [
            {
                "id": str(m.id),
                "role": m.role,
                "message": m.message,
                "model_used": m.model_used,
                "created_at": m.created_at
            }
            for m in messages
        ]

    async def save_message(
        self, conversation_id: uuid.UUID, role: str, message: str, model_used: Optional[str] = None
    ) -> Dict[str, Any]:
        msg = AIMessage(
            id=uuid.uuid4(),
            conversation_id=conversation_id,
            role=role,
            message=message,
            model_used=model_used
        )
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return {
            "id": str(msg.id),
            "role": msg.role,
            "message": msg.message,
            "model_used": msg.model_used,
            "created_at": msg.created_at
        }

    async def patch_title(self, conversation_id: uuid.UUID, title: str) -> Dict[str, Any]:
        query = select(AIConversation).filter(AIConversation.id == conversation_id)
        res = await self.db.execute(query)
        conv = res.scalars().first()
        if not conv:
            raise APIException("Conversation not found.", status_code=404)
        conv.title = title
        await self.db.commit()
        await self.db.refresh(conv)
        return {"id": str(conv.id), "title": conv.title}

    async def delete_conversation(self, conversation_id: uuid.UUID) -> Dict[str, Any]:
        query = select(AIConversation).filter(AIConversation.id == conversation_id)
        res = await self.db.execute(query)
        conv = res.scalars().first()
        if not conv:
            raise APIException("Conversation not found.", status_code=404)
        await self.db.delete(conv)
        await self.db.commit()
        return {"id": str(conversation_id), "deleted": True}
