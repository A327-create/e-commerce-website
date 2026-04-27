from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)  # 1-5 only
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}