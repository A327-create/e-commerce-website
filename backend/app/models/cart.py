from sqlalchemy import DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    items: Mapped[list["CartItem"]] = relationship(back_populates="cart", cascade="all, delete")
    user: Mapped["UserModel"] = relationship(back_populates="cart")

class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey("carts.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    cart: Mapped["Cart"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()

