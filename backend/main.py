"""
Medicine Reminder App — FastAPI Entry Point.
Starts the server, configures CORS, mounts routes, manages the scheduler lifecycle,
and serves the React frontend build as static files.
"""

import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import engine, Base
from api.routes import router
from scheduler import start_scheduler, stop_scheduler


# ─── Paths ───
# Frontend build output directory (relative to backend/)
FRONTEND_BUILD_DIR = Path(__file__).parent.parent / "frontend" / "dist"


# ─── Lifespan: runs on startup and shutdown ───
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: Create database tables and start the APScheduler.
    Shutdown: Stop the scheduler cleanly.
    """
    # Startup
    Base.metadata.create_all(bind=engine)
    print("📦 Database tables created")
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()


# ─── App Instance ───
app = FastAPI(
    title="💊 Medicine Reminder API",
    description="A prototype API for scheduling medicine reminders",
    version="1.0.0",
    lifespan=lifespan,
)


# ─── CORS Middleware ───
# Allows the Vite dev server (port 5173) to call FastAPI (port 8000) during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── API Routes (mounted under /api prefix) ───
app.include_router(router, prefix="/api")


# ─── Serve React Frontend ───
if FRONTEND_BUILD_DIR.exists():
    # Serve static assets (JS, CSS, images) from the build directory
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_BUILD_DIR / "assets")), name="static-assets")

    # Serve other static files at root level (favicon, etc.)
    @app.get("/vite.svg")
    async def vite_svg():
        return FileResponse(str(FRONTEND_BUILD_DIR / "vite.svg"))

    # Catch-all: serve index.html for any unmatched route (SPA client-side routing)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """
        Serves the React app's index.html for all non-API routes.
        This enables client-side routing (React Router).
        """
        file_path = FRONTEND_BUILD_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_BUILD_DIR / "index.html"))
else:
    # Fallback when frontend isn't built yet
    @app.get("/")
    def root():
        return {
            "status": "running",
            "app": "Medicine Reminder API",
            "message": "Frontend not built yet. Run 'npm run build' in the frontend/ directory.",
            "api_docs": "/docs",
        }
