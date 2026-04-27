from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserRegister, UserLogin, UserResponse, AuthResponse, LogoutRequest
from app.schemas.refresh_token import Token, RefreshTokenSchema  
from app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    logout_user
)
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=AuthResponse)
async def register(
    user: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    try:
        new_user = await register_user(
            db=db,
            username=user.username,
            email=user.email,
            password=user.password,
            fullname=user.fullname
        )
        return new_user

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=AuthResponse)
async def login(
    user: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    try:
        tokens = await login_user(
            db=db,
            email=user.email,
            password=user.password
        )
        return tokens

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(data: RefreshTokenSchema, db: AsyncSession = Depends(get_db)):
    try:
        return await refresh_access_token(data.refresh_token, db)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout")
async def logout(data: LogoutRequest, db: AsyncSession = Depends(get_db)):
    return await logout_user(db, data.refresh_token)

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user = Depends(get_current_user)
):
    return current_user

@router.get("/test")
async def test():
    return {"msg": "working"}
