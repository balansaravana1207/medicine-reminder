"""
Pydantic schemas — validates and serializes HTTP data.
Separate from SQLAlchemy models: schemas define the API contract,
models define the storage structure.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class MedicineCreate(BaseModel):
    """Schema for creating a new medicine (request body for POST /medicine)."""
    medicine_name: str = Field(..., min_length=1, max_length=255, description="Name of the medicine")
    dosage: str = Field(..., min_length=1, max_length=100, description="Dosage information")
    reminder_time: str = Field(
        ...,
        pattern=r"^([01]\d|2[0-3]):([0-5]\d)$",
        description="Reminder time in HH:MM format (24-hour)"
    )


class MedicineResponse(BaseModel):
    """Schema for medicine response (what the API returns)."""
    id: int
    medicine_name: str
    dosage: str
    reminder_time: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
