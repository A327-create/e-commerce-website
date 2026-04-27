from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email:  EmailStr
    password: str
    fullname: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    fullname: str | None
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    fullname: Optional[str] = None
    email: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class LogoutRequest(BaseModel):
    refresh_token: str