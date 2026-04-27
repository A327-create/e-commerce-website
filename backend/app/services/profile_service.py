from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.auth_repo import update_user
from app.core.security import verify_password, hash_password
from app.schemas.user import ProfileUpdate, PasswordChange

async def update_profile(db: AsyncSession, user, data: ProfileUpdate):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    return await update_user(db, user.id, update_data)

async def change_password(db: AsyncSession, user, data: PasswordChange):
    if not verify_password(data.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if not validate_password(data.new_password):
        raise HTTPException(status_code=400, detail=password_error_message())
    hashed = hash_password(data.new_password)
    return await update_user(db, user.id, {"password": hashed})