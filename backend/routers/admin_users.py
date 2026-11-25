
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin
from models import User, RefreshSession
from schemas import UserResponse


router = APIRouter(
    prefix="/api/admin/users",
    tags=["Admin User Management"],
)


class BanUserRequest(BaseModel):
    reason: str = Field(min_length=3, max_length=1000)


class ChangeRoleRequest(BaseModel):
    role: str = Field(pattern="^(user|admin)$")


@router.get("")
def list_users(
    search: str | None = Query(default=None, max_length=255),
    role: str | None = Query(default=None, pattern="^(user|admin)$"),
    status: str | None = Query(
        default=None,
        pattern="^(active|inactive|banned|unbanned)$",
    ),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    query = db.query(User)

    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.name.ilike(search_term),
                User.email.ilike(search_term),
            )
        )

    if role:
        query = query.filter(User.role == role)

    if status == "active":
        query = query.filter(
            User.is_active.is_(True),
            User.is_banned.is_(False),
        )
    elif status == "inactive":
        query = query.filter(
            User.is_active.is_(False),
            User.is_banned.is_(False),
        )
    elif status == "banned":
        query = query.filter(User.is_banned.is_(True))
    elif status == "unbanned":
        query = query.filter(User.is_banned.is_(False))

    total = query.count()

    users = (
        query.order_by(User.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [
            UserResponse.model_validate(user).model_dump()
            for user in users
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.get("/{user_id}", response_model=UserResponse)
def get_user_details(
    user_id: int,
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

    return target_user


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
        raise HTTPException(
            status_code=403,
            detail="You cannot deactivate another admin",
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


@router.patch("/{user_id}/role", response_model=UserResponse)
def change_user_role(
    user_id: int,
    request: ChangeRoleRequest,
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

    if target_user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot change your own role",
        )

    if target_user.role == "admin":
        raise HTTPException(
            status_code=403,
            detail="You cannot change another admin's role",
        )

    if target_user.role == request.role:
        raise HTTPException(
            status_code=400,
            detail="User already has this role",
        )

    if request.role == "user":
        active_admin_count = db.query(User).filter(
            User.role == "admin",
            User.is_active.is_(True),
        ).count()

        if active_admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="The last active admin cannot be demoted",
            )

    target_user.role = request.role

    now = datetime.now(timezone.utc)

    db.query(RefreshSession).filter(
        RefreshSession.user_id == target_user.id,
        RefreshSession.revoked_at.is_(None),
    ).update(
        {"revoked_at": now},
        synchronize_session=False,
    )

    db.commit()
    db.refresh(target_user)

    return target_user


@router.patch("/{user_id}/ban", response_model=UserResponse)
def ban_user(
    user_id: int,
    request: BanUserRequest,
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

    if target_user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot ban your own account",
        )

    if target_user.role == "admin":
        raise HTTPException(
            status_code=403,
            detail="You cannot ban another admin",
        )

    if target_user.is_banned:
        raise HTTPException(
            status_code=400,
            detail="This user is already banned",
        )

    reason = request.reason.strip()

    if len(reason) < 3:
        raise HTTPException(
            status_code=422,
            detail="Ban reason must contain at least 3 characters",
        )

    now = datetime.now(timezone.utc)

    target_user.is_banned = True
    target_user.ban_reason = reason
    target_user.banned_at = now
    target_user.banned_by = current_admin.id

    db.query(RefreshSession).filter(
        RefreshSession.user_id == target_user.id,
        RefreshSession.revoked_at.is_(None),
    ).update(
        {"revoked_at": now},
        synchronize_session=False,
    )

    db.commit()
    db.refresh(target_user)

    return target_user


@router.patch("/{user_id}/unban", response_model=UserResponse)
def unban_user(
    user_id: int,
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

    if target_user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin accounts cannot be unbanned through this endpoint",
        )

    if not target_user.is_banned:
        raise HTTPException(
            status_code=400,
            detail="This user is not banned",
        )

    target_user.is_banned = False
    target_user.ban_reason = None
    target_user.banned_at = None
    target_user.banned_by = None

    db.commit()
    db.refresh(target_user)

    return target_user
