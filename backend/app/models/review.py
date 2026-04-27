from sqlalchemy import String, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    rating: Mapped[int] = mapped_column(Integer)  # 1-5
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["UserModel"] = relationship(back_populates="reviews")
    product: Mapped["Product"] = relationship(back_populates="reviews")