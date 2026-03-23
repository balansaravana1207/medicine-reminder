"""
SQLAlchemy ORM models — maps Python classes to database tables.
"""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from database import Base


class Medicine(Base):
    """
    ORM model for the medicines table.
    Maps to storage — separate from Pydantic API schemas.
    """
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    medicine_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    reminder_time = Column(String(5), nullable=False)  # HH:MM format
    created_at = Column(DateTime(timezone=True), server_default=func.now())
