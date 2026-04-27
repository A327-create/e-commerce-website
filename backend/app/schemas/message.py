from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SenderInfo(BaseModel):
    id: int
    fullname: Optional[str] = None
    username: str

    model_config = {"from_attributes": True}

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: datetime
    sender_name: Optional[str] = None  
    receiver: Optional[SenderInfo] = None  

    model_config = {"from_attributes": True}