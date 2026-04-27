from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    old_price: Optional[float] = None
    category: str
    image: Optional[str] = None
    description: Optional[str] = None
    stock: int = 0
    rating: float = 0.0
    orders: int = 0
    is_featured: bool = False

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    old_price: Optional[float] = None
    category: str
    image: Optional[str] = None
    description: Optional[str] = None
    stock: int = 0
    rating: float = 0.0
    orders: int = 0
    is_featured: bool = False

    model_config = {"from_attributes": True}

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    category: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    stock: Optional[int] = None
    rating: Optional[float] = None
    orders: Optional[int] = None
    is_featured: Optional[bool] = None