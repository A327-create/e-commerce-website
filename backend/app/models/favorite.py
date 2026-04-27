from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))

    user: Mapped["UserModel"] = relationship(back_populates="favorites")
    product: Mapped["Product"] = relationship(back_populates="favorites")