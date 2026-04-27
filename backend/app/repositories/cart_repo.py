from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.cart import Cart, CartItem

async def get_or_create_cart(db: AsyncSession, user_id: int) -> Cart:
    result = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(selectinload(Cart.items))
    )
    cart = result.scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    return cart

async def add_item_to_cart(db: AsyncSession, cart_id: int, product_id: int, quantity: int) -> CartItem:
    result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id
        )
    )
    item = result.scalar_one_or_none()

    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart_id, product_id=product_id, quantity=quantity)
        db.add(item)

    await db.commit()
    await db.refresh(item)
    return item

async def get_cart_with_items(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
    )
    return result.scalar_one_or_none()

async def remove_item_from_cart(db: AsyncSession, cart_id: int, item_id: int) -> bool:
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == item_id,
            CartItem.cart_id == cart_id
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        return False
    await db.delete(item)
    await db.commit()
    return True