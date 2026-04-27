from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.products_repo import (
    create_product,
    get_all_products,
    get_featured_products,
    get_product_by_id,
    update_product,
    delete_product
)
from app.schemas.products import ProductCreate, ProductUpdate
async def add_product(db: AsyncSession, data: ProductCreate):
    return await create_product(db, data)
async def fetch_all_products(db: AsyncSession, search: str = ""):
    return await get_all_products(db, search)

async def fetch_featured_products(db: AsyncSession):
    return await get_featured_products(db)

async def fetch_product_by_id(db: AsyncSession, product_id: int):
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

async def edit_product(db: AsyncSession, product_id: int, data: ProductUpdate):
    product = await update_product(db, product_id, data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

async def remove_product(db: AsyncSession, product_id: int):
    deleted = await delete_product(db, product_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return {"message": "Product deleted successfully"}