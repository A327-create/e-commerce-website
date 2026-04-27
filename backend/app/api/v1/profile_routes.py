from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_admin_user
from app.schemas.user import ProfileUpdate, PasswordChange, UserResponse
from app.services.profile_service import update_profile, change_password
from app.repositories.auth_repo import get_all_users

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=UserResponse)
async def get_profile(current_user=Depends(get_current_user)):
    return current_user

@router.patch("", response_model=UserResponse)
async def edit_profile(
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return await update_profile(db, current_user, data)

@router.patch("/password")
async def update_password(
    data: PasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    await change_password(db, current_user, data)
    return {"message": "Password updated successfully"}

@router.get("/admin/users")
async def get_users(admin=Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    return await get_all_users(db)
