from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.repositories.order_repo import (
    create_order_from_cart, get_user_orders,
    get_all_orders, get_order_by_id, update_order_status
)
from app.repositories.cart_repo import get_cart_with_items
from app.models.cart import Cart

async def place_order(db: AsyncSession, user_id: int):
    # cart load karo products ke saath
    result = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(
            selectinload(Cart.items).selectinload(
                __import__('app.models.cart', fromlist=['CartItem']).CartItem.product
            )
        )
    )
    cart = result.scalar_one_or_none()

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    return await create_order_from_cart(db, user_id, cart)

async def my_orders(db: AsyncSession, user_id: int):
    return await get_user_orders(db, user_id)

async def all_orders(db: AsyncSession):
    return await get_all_orders(db)

async def order_detail(db: AsyncSession, order_id: int):
    order = await get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

async def change_order_status(db: AsyncSession, order_id: int, status: str):
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid: {valid_statuses}")
    order = await update_order_status(db, order_id, status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order