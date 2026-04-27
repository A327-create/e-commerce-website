from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base
from typing import List
from datetime import datetime
from app.models.cart import Cart
from app.models.order import Order

class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    fullname: Mapped[str] = mapped_column(String(255), nullable=True)
    password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tokens: Mapped[List["Refresh_Token_Model"]] = relationship(back_populates="user")
    cart: Mapped["Cart"] = relationship(back_populates="user", uselist=False)
    orders: Mapped[list["Order"]] = relationship(back_populates="user")
    reviews: Mapped[list["Review"]] = relationship(back_populates="user")
    favorites: Mapped[list["Favorite"]] = relationship(back_populates="user")
    # sent_messages: Mapped[list["Message"]] = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    # received_messages: Mapped[list["Message"]] = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")