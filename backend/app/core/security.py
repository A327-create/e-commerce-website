from fastapi import HTTPException, status
from app.models.user import UserModel
from app.models.refresh_token import Refresh_Token_Model
from app.schemas.refresh_token import Token, RefreshTokenSchema
from sqlalchemy import select, update, text
from app.schemas.user import UserRegister
from sqlalchemy.ext.asyncio import AsyncSession
from pwdlib import PasswordHash
from jwt.exceptions import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from datetime import datetime, timedelta, timezone
from app.core.config import settings 
from datetime import datetime, timedelta
from sqlalchemy import select
from app.models.refresh_token import Refresh_Token_Model

password_hash = PasswordHash.recommended()
def hash_password(password):
    return password_hash.hash(password)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: int | timedelta = None):
    
    if isinstance(expires_delta, int):
        expires_delta = timedelta(minutes=expires_delta)

    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta

    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "access"})

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        # 🔍 required data check
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return payload

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

