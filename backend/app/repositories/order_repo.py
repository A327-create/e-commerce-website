from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem

async def create_order_from_cart(db: AsyncSession, user_id: int, cart: Cart) -> Order:
    total = sum(item.product.price * item.quantity for item in cart.items)

    order = Order(user_id=user_id, total_price=total)
    db.add(order)
    await db.flush()  # id generate karne ke liye

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)

    for item in cart.items:
        await db.delete(item)

    await db.commit()
    await db.refresh(order)
    return order

async def get_user_orders(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == user_id)
        .options(selectinload(Order.items))
    )
    return result.scalars().all()

async def get_all_orders(db: AsyncSession):
    result = await db.execute(
        select(Order).options(selectinload(Order.items))
    )
    return result.scalars().all()

async def get_order_by_id(db: AsyncSession, order_id: int):
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items))
    )
    return result.scalar_one_or_none()

async def update_order_status(db: AsyncSession, order_id: int, status: str):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        return None
    order.status = status
    await db.commit()
    await db.refresh(order)
    return order