from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.review import Review
from app.models.products import Product

async def create_review(db: AsyncSession, user_id: int, product_id: int, rating: int, comment: str = None):
    existing = await db.execute(
        select(Review).where(
            Review.user_id == user_id,
            Review.product_id == product_id
        )
    )
    if existing.scalar_one_or_none():
        return None  # already reviewed

    review = Review(user_id=user_id, product_id=product_id, rating=rating, comment=comment)
    db.add(review)

    await db.flush()
    avg_result = await db.execute(
        select(func.avg(Review.rating)).where(Review.product_id == product_id)
    )
    avg_rating = avg_result.scalar() or 0

    product_result = await db.execute(select(Product).where(Product.id == product_id))
    product = product_result.scalar_one_or_none()
    if product:
        product.rating = round(avg_rating * 2, 1) 

    await db.commit()
    await db.refresh(review)
    return review

async def get_product_reviews(db: AsyncSession, product_id: int):
    result = await db.execute(
        select(Review).where(Review.product_id == product_id)
    )
    return result.scalars().all()