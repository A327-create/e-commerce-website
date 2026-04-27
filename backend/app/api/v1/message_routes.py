from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_admin_user
from app.schemas.message import MessageCreate, MessageResponse
from app.services.message_service import (
    send_to_admin, reply_to_user,
    get_my_conversations, get_chat
)
from typing import List

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("/send", response_model=MessageResponse)
async def send_message(
    data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await send_to_admin(db, current_user.id, data.content)

@router.get("/", response_model=List[MessageResponse])
async def my_conversations(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await get_my_conversations(db, current_user.id)

@router.get("/chat/{other_id}", response_model=List[MessageResponse])
async def chat_history(
    other_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await get_chat(db, current_user.id, other_id)

@router.post("/reply/{user_id}", response_model=MessageResponse)
async def admin_reply(
    user_id: int,
    data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await reply_to_user(db, admin.id, user_id, data.content)

@router.get("/admin/all", response_model=List[MessageResponse])
async def all_messages(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await get_my_conversations(db, admin.id)