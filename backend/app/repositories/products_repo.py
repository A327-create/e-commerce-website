from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.products import Product
from app.schemas.products import ProductCreate, ProductUpdate

async def create_product(
    db: AsyncSession, 
    data: ProductCreate
):
    new_product = Product(**data.model_dump())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

async def get_all_products(db: AsyncSession, search: str = ""):
    query = select(Product)
    if search:
        query = query.where(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.category.ilike(f"%{search}%")
            )
        )
    result = await db.execute(query)
    return result.scalars().all()

async def get_featured_products(db: AsyncSession):
    result = await db.execute(
        select(Product).where(Product.is_featured == True)
    )
    return result.scalars().all()

async def get_product_by_id(db: AsyncSession, product_id: int):
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    return result.scalar_one_or_none()

async def update_product(db: AsyncSession, product_id: int, data: ProductUpdate):
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    await db.commit()
    await db.refresh(product)
    return product

async def delete_product(db: AsyncSession, product_id: int) -> bool:
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        return False
    await db.delete(product)
    await db.commit()
    return True

