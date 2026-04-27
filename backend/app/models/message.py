from sqlalchemy import String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sender: Mapped["UserModel"] = relationship("UserModel", foreign_keys=[sender_id])
    receiver: Mapped["UserModel"] = relationship("UserModel", foreign_keys=[receiver_id])