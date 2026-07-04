import uuid
import json
from typing import Optional
from fastapi import APIRouter, Depends, Query, status, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_async_db
from app.services.conversation_service import ConversationService
from app.ai.providers.groq.groq_provider import GroqProvider
from app.ai.intent.detector import IntentDetector
from app.ai.tools.orchestrator import ToolOrchestrator
from app.ai.prompts.templates import SYSTEM_IDENTITY_PROMPT, build_contextual_prompt
from app.dependencies.auth import get_current_user
from app.database.models.models import User
from app.exceptions.handlers import APIException

router = APIRouter(prefix="/ai", tags=["AI Copilot Orchestration"])

@router.post("/chat")
async def chat_interaction(
    conversation_id: Optional[uuid.UUID] = Body(None, description="Active conversation UUID. Creates one if empty."),
    prompt: str = Body(..., min_length=1, description="User prompt text"),
    location_id: uuid.UUID = Body(..., description="Target Location centroid reference"),
    stream: bool = Body(False, description="Toggle streaming output chunks"),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    conv_service = ConversationService(db)
    
    # 1. Resolve active conversation ID or create new
    if not conversation_id:
        conv = await conv_service.create_conversation(current_user.id, title=prompt[:40])
        conversation_id = uuid.UUID(conv["id"])

    # Save user message to database
    await conv_service.save_message(conversation_id, role="user", message=prompt)

    # 2. Detect Intent & Gather Context Tools
    detector = IntentDetector()
    intent = detector.detect_intent(prompt)

    orchestrator = ToolOrchestrator(db)
    context_data = await orchestrator.gather_context_for_intent(intent, location_id)

    # 3. Prompt Builder
    system_prompt = SYSTEM_IDENTITY_PROMPT
    user_contextual_prompt = build_contextual_prompt(prompt, context_data)

    provider = GroqProvider()

    # 4. Handle Streaming Response
    if stream:
        async def stream_generator():
            full_response = ""
            async for token in provider.generate_stream(user_contextual_prompt, system_prompt):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"
            
            # Save final response message in background once stream resolves
            await conv_service.save_message(
                conversation_id, role="assistant", message=full_response, model_used="Llama 3.x"
            )

        return StreamingResponse(stream_generator(), media_type="text/event-stream")

    # 5. Handle standard Complete Response
    response_text = await provider.generate_response(user_contextual_prompt, system_prompt)
    await conv_service.save_message(
        conversation_id, role="assistant", message=response_text, model_used="Llama 3.x"
    )

    return {
        "success": True,
        "message": "AI Copilot response completed.",
        "data": {
            "conversation_id": str(conversation_id),
            "response": response_text,
            "model": "Llama 3.x"
        },
        "metadata": {},
        "errors": []
    }

@router.get("/conversations")
async def get_conversations(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    conv_service = ConversationService(db)
    convs = await conv_service.get_conversations(current_user.id)
    return {
        "success": True,
        "message": "Active user conversations retrieved.",
        "data": convs,
        "metadata": {},
        "errors": []
    }

@router.get("/conversations/{conversation_id}")
async def get_conversation_details(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    conv_service = ConversationService(db)
    messages = await conv_service.get_messages(conversation_id)
    return {
        "success": True,
        "message": "Conversation messages history retrieved.",
        "data": messages,
        "metadata": {},
        "errors": []
    }

@router.patch("/conversations/{conversation_id}")
async def rename_conversation(
    conversation_id: uuid.UUID,
    title: str = Body(..., embed=True, min_length=1),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    conv_service = ConversationService(db)
    res = await conv_service.patch_title(conversation_id, title)
    return {
        "success": True,
        "message": "Conversation renamed successfully.",
        "data": res,
        "metadata": {},
        "errors": []
    }

@router.delete("/conversations/{conversation_id}")
async def remove_conversation(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    conv_service = ConversationService(db)
    res = await conv_service.delete_conversation(conversation_id)
    return {
        "success": True,
        "message": "Conversation deleted successfully.",
        "data": res,
        "metadata": {},
        "errors": []
    }
