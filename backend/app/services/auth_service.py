from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.token_repository import (
    save_refresh_token, 
    get_refresh_token,
    revoke_refresh_token,
    is_token_revoked
)
from app.repositories.auth_repo import (
    register,
    get_user_by_email, 
    get_user_by_id, 
    get_user_by_username
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token
)
from app.models.user import UserModel
from app.utils.helper import validate_password, password_error_message
from datetime import timedelta, datetime
from app.core.config import settings

async def register_user(
    db: AsyncSession,
    username: str,
    email: str,
    password: str,
    fullname: str | None = None
):

    existing_user = await get_user_by_email(db, email)
    if existing_user:
        raise Exception("Email already registered")

    existing_user_id = await get_user_by_username(db, username)
    if existing_user_id:
        raise Exception("Username already taken")

    if len(username) < 3:
        raise Exception("Username must be at least 3 characters")

    if not validate_password(password):
        raise Exception(password_error_message())

    hashed_password = hash_password(password)

    user = await register(
        db=db,
        username=username,
        email=email,
        password=hashed_password,
        fullname=fullname
    )

    access_data = {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "type": "access"
    }

    refresh_data = {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "type": "refresh"
    }

    access_token = create_access_token(
        access_data,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_refresh_token(
        refresh_data,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    await save_refresh_token(db, refresh_token, user.id)

    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

async def login_user(
    db: AsyncSession,
    email: str,
    password: str
):
    # 1. User check
    user = await get_user_by_email(db, email)

    if not user:
        raise Exception("Invalid email or password")

    # 2. Password verify
    if not verify_password(password, user.password):
        raise Exception("Invalid email or password")

    # 3. Token payload
    data = {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "type": "access"
    }

    refresh_data = {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "type": "refresh"
    }

    access_token = create_access_token(
        data,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_refresh_token(
        refresh_data,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    await save_refresh_token(db, refresh_token, user.id)

    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

async def refresh_access_token(db: AsyncSession, refresh_token: str):
    if await is_token_revoked(db, refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

    payload = verify_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    new_access_token = create_access_token({
        "sub": payload.get("sub"),
        "email": payload.get("email"),
        "is_admin": payload.get("is_admin")
    })

    return {"access_token": new_access_token, "token_type": "bearer"}

async def logout_user(db: AsyncSession, refresh_token: str):
    revoked = await revoke_refresh_token(db, refresh_token)
    if not revoked:
        raise HTTPException(status_code=400, detail="Invalid or already revoked token")
    return {"message": "Logged out successfully"}