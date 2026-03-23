"""
APScheduler — The Reminder Engine.
Runs check_reminders() every 60 seconds in a background thread.
Checks which medicines have a reminder_time matching the current HH:MM.
"""

from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from database import SessionLocal
from models import Medicine

scheduler = BackgroundScheduler()


# ─── In-memory store for triggered reminders (accessible via API) ───
triggered_reminders: list[dict] = []


def notify(med: Medicine):
    """
    Notification handler — currently logs to console and stores in memory.
    Swap this for SendGrid (email), Twilio (SMS), or Firebase (push) in production.
    """
    message = {
        "id": med.id,
        "medicine_name": med.medicine_name,
        "dosage": med.dosage,
        "reminder_time": med.reminder_time,
        "triggered_at": datetime.now().isoformat(),
    }
    triggered_reminders.append(message)

    # Keep only the last 50 reminders in memory
    if len(triggered_reminders) > 50:
        triggered_reminders.pop(0)

    print(f"🔔 [REMINDER] Take {med.medicine_name} — {med.dosage} (scheduled: {med.reminder_time})")


def check_reminders():
    """
    Runs every 60 seconds. Gets the current time as HH:MM,
    queries the database for matching medicines, and fires notifications.
    """
    now = datetime.now().strftime("%H:%M")
    db = SessionLocal()
    try:
        meds = db.query(Medicine).filter(Medicine.reminder_time == now).all()
        for med in meds:
            notify(med)
        if meds:
            print(f"⏰ [{now}] Triggered {len(meds)} reminder(s)")
        else:
            print(f"⏰ [{now}] No reminders due")
    except Exception as e:
        print(f"❌ Scheduler error: {e}")
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler with a 60-second interval job."""
    scheduler.add_job(
        check_reminders,
        "interval",
        seconds=60,
        id="reminder_check",
        replace_existing=True,
    )
    scheduler.start()
    print("✅ APScheduler started — checking reminders every 60 seconds")


def stop_scheduler():
    """Shut down the scheduler cleanly — no orphaned threads."""
    scheduler.shutdown(wait=False)
    print("🛑 APScheduler stopped")
