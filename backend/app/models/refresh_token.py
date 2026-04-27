from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base
from datetime import datetime

class Refresh_Token_Model(Base):
    __tablename__ = "refresh_token"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(Text, unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["UserModel"] = relationship(back_populates="tokens")