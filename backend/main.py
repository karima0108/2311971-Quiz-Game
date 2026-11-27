import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from migrations import migrate_group_owner_column
from models import QuizAttempt, QuizAnswer, AuditLog

from routers.auth import router as auth_router
from routers.quizzes import router as quizzes_router
from routers.admin import router as admin_router
from routers.admin_dashboard import router as admin_dashboard_router
from routers.admin_users import router as admin_users_router
from routers.audit_logs import router as audit_logs_router
from routers.attempts import router as attempts_router
from routers.groups import router as groups_router
from routers.groups import student_router


# =========================
# FASTAPI APPLICATION
# =========================

app = FastAPI(
    title="Quiz Game API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


# =========================
# CORS CONFIGURATION
# =========================

frontend_origins = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origins],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# DATABASE TABLE CREATION
# =========================

Base.metadata.create_all(bind=engine)

migrate_group_owner_column(engine)


# =========================
# ROUTER REGISTRATION
# =========================

app.include_router(auth_router)
app.include_router(quizzes_router)
app.include_router(admin_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_users_router)
app.include_router(audit_logs_router)
app.include_router(attempts_router)
app.include_router(groups_router)
app.include_router(student_router)


# =========================
# ROOT ENDPOINT
# =========================

@app.get("/")
def root():
    return {
        "message": "Quiz Game API is running successfully!"
    }


# =========================
# HEALTH CHECK
# =========================

@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }



