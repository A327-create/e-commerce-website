from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_admin_user
from app.schemas.products import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import (
    add_product,
    fetch_all_products,
    fetch_featured_products,
    fetch_product_by_id,
    edit_product,
    remove_product
)
from typing import List
from sqlalchemy import select
from app.models.products import Product

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product.category).distinct())
    categories = result.scalars().all()
    return categories

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured(db: AsyncSession = Depends(get_db)):
    return await fetch_featured_products(db)

@router.get("", response_model=List[ProductResponse])
async def get_products(
    q: str = Query(default=""),
    db: AsyncSession = Depends(get_db)
):
    return await fetch_all_products(db, search=q)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    
):
    return await fetch_product_by_id(db, product_id)

@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await add_product(db, data)

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await edit_product(db, product_id, data)

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await remove_product(db, product_id)