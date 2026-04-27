from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.favorite import Favorite

async def toggle_favorite(db: AsyncSession, user_id: int, product_id: int):
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user_id,
            Favorite.product_id == product_id
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"favorited": False}
    else:
        fav = Favorite(user_id=user_id, product_id=product_id)
        db.add(fav)
        await db.commit()
        return {"favorited": True}

async def get_user_favorites(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == user_id)
        .options(selectinload(Favorite.product))
    )
    return result.scalars().all()

async def is_favorited(db: AsyncSession, user_id: int, product_id: int) -> bool:
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user_id,
            Favorite.product_id == product_id
        )
    )
    return result.scalar_one_or_none() is not None