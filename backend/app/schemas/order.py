from pydantic import BaseModel
from datetime import datetime

class OrderCreate(BaseModel):
    cart_id: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    model_config = {"from_attributes": True}

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_price: float
    status: str
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}

