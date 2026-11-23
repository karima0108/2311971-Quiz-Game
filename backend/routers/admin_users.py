from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import User, RefreshSession
from schemas import UserResponse


router = APIRouter(
    prefix="/api/admin/users",
    tags=["Admin User Management"],
)


@router.get("", response_model=list[UserResponse])
def list_users(
    search: str | None = Query(default=None, max_length=255),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    query = db.query(User).order_by(User.id)

    if search and search.strip():
        query = query.filter(
            User.email.ilike(f"%{search.strip()}%")
        )

    return query.all()


@router.patch("/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    target_user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if target_user.id == current_admin.id and not is_active:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account",
        )

    if target_user.role == "admin" and not is_active:
        active_admin_count = db.query(User).filter(
            User.role == "admin",
            User.is_active.is_(True),
        ).count()

        if active_admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="The last active admin cannot be deactivated",
            )

    target_user.is_active = is_active

    if not is_active:
        db.query(RefreshSession).filter(
            RefreshSession.user_id == target_user.id,
            RefreshSession.revoked_at.is_(None),
        ).update(
            {"revoked_at": datetime.now(timezone.utc)},
            synchronize_session=False,
        )

    db.commit()
    db.refresh(target_user)

    return target_user
