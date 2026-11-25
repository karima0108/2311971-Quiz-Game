
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import User, Quiz


router = APIRouter(
    prefix="/api/admin/dashboard",
    tags=["Admin Dashboard"],
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    total_users = db.query(User).count()

    total_students = db.query(User).filter(
        User.role == "user"
    ).count()

    active_users = db.query(User).filter(
        User.is_active.is_(True)
    ).count()

    total_admins = db.query(User).filter(
        User.role == "admin"
    ).count()

    banned_users = db.query(User).filter(
        User.is_banned.is_(True)
    ).count()

    total_quizzes = db.query(Quiz).count()

    published_quizzes = db.query(Quiz).filter(
        Quiz.is_published.is_(True)
    ).count()

    return {
        "total_users": total_users,
        "total_students": total_students,
        "active_users": active_users,
        "total_admins": total_admins,
        "banned_users": banned_users,
        "total_quizzes": total_quizzes,
        "published_quizzes": published_quizzes,
    }
