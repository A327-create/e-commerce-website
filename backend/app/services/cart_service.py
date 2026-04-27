from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.cart_repo import (
    get_or_create_cart, add_item_to_cart,
    get_cart_with_items, remove_item_from_cart
)

async def get_my_cart(db: AsyncSession, user_id: int):
    cart = await get_cart_with_items(db, user_id)
    if not cart:
        return await get_or_create_cart(db, user_id)
    return cart

async def add_to_cart(db: AsyncSession, user_id: int, product_id: int, quantity: int):
    cart = await get_or_create_cart(db, user_id)
    return await add_item_to_cart(db, cart.id, product_id, quantity)

async def remove_from_cart(db: AsyncSession, user_id: int, item_id: int):
    cart = await get_cart_with_items(db, user_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    removed = await remove_item_from_cart(db, cart.id, item_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item removed"}