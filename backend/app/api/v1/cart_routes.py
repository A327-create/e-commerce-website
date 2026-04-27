from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.cart import CartItemAdd, CartItemResponse, CartResponse
from app.services.cart_service import get_my_cart, add_to_cart, remove_from_cart

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("", response_model=CartResponse)
async def view_cart(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await get_my_cart(db, current_user.id)

@router.post("/add", response_model=CartResponse)
async def add_item(
    data: CartItemAdd,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await add_to_cart(db, current_user.id, data.product_id, data.quantity)

@router.delete("/remove/{item_id}")
async def remove_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await remove_from_cart(db, current_user.id, item_id)