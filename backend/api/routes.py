"""
REST API endpoint handlers for the Medicine Reminder app.

Routes:
  POST   /medicine      — Add a new medicine
  GET    /medicine      — List all medicines
  DELETE /medicine/{id} — Delete a medicine by ID
  GET    /reminders     — Get recently triggered reminders
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Medicine
from schemas import MedicineCreate, MedicineResponse
from scheduler import triggered_reminders

router = APIRouter()


@router.post("/medicine", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
def add_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    """
    Add a new medicine to the database.
    Pydantic validates the request body automatically — invalid data returns 422.
    """
    db_medicine = Medicine(
        medicine_name=medicine.medicine_name,
        dosage=medicine.dosage,
        reminder_time=medicine.reminder_time,
    )
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)  # Load auto-generated ID and created_at
    return db_medicine


@router.get("/medicine", response_model=List[MedicineResponse])
def get_medicines(db: Session = Depends(get_db)):
    """Return all medicines, ordered by creation date (newest first)."""
    medicines = db.query(Medicine).order_by(Medicine.created_at.desc()).all()
    return medicines


@router.delete("/medicine/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Delete a medicine by its ID. Returns 404 if not found."""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found"
        )
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}


@router.get("/reminders")
def get_triggered_reminders():
    """Return recently triggered reminders from the scheduler's in-memory store."""
    return triggered_reminders
