from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_admin_user
from app.schemas.order import OrderResponse
from app.services.order_service import (
    place_order, my_orders, all_orders,
    order_detail, change_order_status
)
from typing import List
from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
async def create_order(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await place_order(db, current_user.id)

@router.get("/my", response_model=List[OrderResponse])
async def get_my_orders(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await my_orders(db, current_user.id)

@router.get("/all", response_model=List[OrderResponse])
async def get_all_orders(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await all_orders(db)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await order_detail(db, order_id)

@router.patch("/{order_id}/status")
async def update_status(
    order_id: int,
    data: StatusUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    return await change_order_status(db, order_id, data.status)