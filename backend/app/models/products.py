from sqlalchemy import String, Float, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    old_price: Mapped[float] = mapped_column(Float, nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    orders: Mapped[int] = mapped_column(Integer, default=0)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")
    favorites: Mapped[list["Favorite"]] = relationship(back_populates="product")
