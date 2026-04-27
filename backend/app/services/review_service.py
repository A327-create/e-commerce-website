from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.review_repo import create_review, get_product_reviews

async def add_review(db: AsyncSession, user_id: int, product_id: int, rating: int, comment: str = None):
    review = await create_review(db, user_id, product_id, rating, comment)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    return review

async def fetch_product_reviews(db: AsyncSession, product_id: int):
    return await get_product_reviews(db, product_id)