from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.refresh_token import Refresh_Token_Model
from datetime import datetime, timedelta, timezone
import jwt

def _extract_expiry(token: str) -> datetime:
    """
    JWT ko bina verify kiye sirf expiry nikalta hai.
    Signature verify pehle ho chuki hoti hai — yahan sirf 'exp' chahiye.
    """
    payload = jwt.decode(token, options={"verify_signature": False})
    exp = payload.get("exp")
    if exp is None:
        raise ValueError("Token mein 'exp' claim nahi hai")
    return datetime.fromtimestamp(exp, tz=timezone.utc).replace(tzinfo=None)

async def save_refresh_token(db: AsyncSession, token: str, user_id: int):
    expires_at = _extract_expiry(token)
 
    new_token = Refresh_Token_Model(
        token=token,
        user_id=user_id,
        expires_at=expires_at,  
    )
    db.add(new_token)
    await db.commit()

async def get_refresh_token(db: AsyncSession, token: str):
    result = await db.execute(
        select(Refresh_Token_Model).where(Refresh_Token_Model.token == token)
    )
    return result.scalar_one_or_none()

async def revoke_refresh_token(db: AsyncSession, token: str) -> bool:
    result = await db.execute(
        select(Refresh_Token_Model).where(
            Refresh_Token_Model.token == token,
            Refresh_Token_Model.is_revoked == False
        )
    )
    token_obj = result.scalar_one_or_none()

    if not token_obj:
        return False

    token_obj.is_revoked = True
    await db.commit()
    return True

async def is_token_revoked(db: AsyncSession, token: str) -> bool:
    result = await db.execute(
        select(Refresh_Token_Model).where(
            Refresh_Token_Model.token == token,
            Refresh_Token_Model.is_revoked == True
        )
    )
    return result.scalar_one_or_none() is not None