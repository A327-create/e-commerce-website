from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.favorite_repo import (
    toggle_favorite, get_user_favorites, is_favorited
)

async def toggle_fav(db: AsyncSession, user_id: int, product_id: int):
    return await toggle_favorite(db, user_id, product_id)

async def my_favorites(db: AsyncSession, user_id: int):
    favs = await get_user_favorites(db, user_id)
    return [fav.product for fav in favs]

async def check_favorited(db: AsyncSession, user_id: int, product_id: int):
    return await is_favorited(db, user_id, product_id)