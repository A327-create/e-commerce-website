from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.review_service import add_review, fetch_product_reviews
from typing import List

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/{product_id}", response_model=ReviewResponse)
async def create_review(
    product_id: int,
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await add_review(db, current_user.id, product_id, data.rating, data.comment)

@router.get("/{product_id}", response_model=List[ReviewResponse])
async def get_reviews(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await fetch_product_reviews(db, product_id)