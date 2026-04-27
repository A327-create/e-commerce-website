from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.message_repo import (
    send_message, get_conversation,
    get_user_conversations, get_admin_user
)

async def send_to_admin(db: AsyncSession, sender_id: int, content: str):
    admin = await get_admin_user(db)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return await send_message(db, sender_id, admin.id, content)

async def reply_to_user(db: AsyncSession, admin_id: int, receiver_id: int, content: str):
    return await send_message(db, admin_id, receiver_id, content)

async def get_my_conversations(db: AsyncSession, user_id: int):
    return await get_user_conversations(db, user_id)

async def get_chat(db: AsyncSession, user_id: int, other_id: int):
    return await get_conversation(db, user_id, other_id)