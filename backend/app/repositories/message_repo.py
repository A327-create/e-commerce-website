from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload
from app.models.message import Message
from app.models.user import UserModel
from sqlalchemy.orm import selectinload

async def send_message(db: AsyncSession, sender_id: int, receiver_id: int, content: str):
    msg = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

async def get_conversation(db: AsyncSession, user1_id: int, user2_id: int):
    result = await db.execute(
        select(Message).where(
            or_(
                and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
                and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
            )
        )
        .options(selectinload(Message.sender), selectinload(Message.receiver))  
        .order_by(Message.created_at)
    )
    return result.scalars().all()

async def get_user_conversations(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Message).where(
            or_(Message.sender_id == user_id, Message.receiver_id == user_id)
        )
        .options(selectinload(Message.sender), selectinload(Message.receiver))  
        .order_by(Message.created_at.desc())
    )
    messages = result.scalars().all()
    seen = set()
    conversations = []
    for msg in messages:
        other_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
        if other_id not in seen:
            seen.add(other_id)
            conversations.append(msg)
    return conversations

async def get_admin_user(db: AsyncSession):
    result = await db.execute(
        select(UserModel).where(UserModel.is_admin == True)
    )
    return result.scalar_one_or_none()

async def mark_as_read(db: AsyncSession, message_ids: list):
    from sqlalchemy import update
    await db.execute(
        update(Message).where(Message.id.in_(message_ids)).values(is_read=True)
    )
    await db.commit()