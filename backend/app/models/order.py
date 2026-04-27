from sqlalchemy import DateTime, Float, Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    total_price: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete")
    user: Mapped["UserModel"] = relationship(back_populates="orders")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
