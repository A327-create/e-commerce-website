from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.favorite_service import toggle_fav, my_favorites
from app.schemas.products import ProductResponse
from typing import List

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.post("/{product_id}")
async def toggle_favorite(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await toggle_fav(db, current_user.id, product_id)

@router.get("", response_model=List[ProductResponse])
async def get_favorites(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await my_favorites(db, current_user.id)