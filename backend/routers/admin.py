from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User, RefreshSession
from schemas import UserResponse
from security import hash_password
from dependencies import require_admin


router = APIRouter(
    prefix="/api/admins",
    tags=["Admin Management"],
)


class AdminCreate(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=8)


@router.get("", response_model=list[UserResponse])
def list_admins(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    return (
        db.query(User)
        .filter(User.role == "admin")
        .order_by(User.id)
        .all()
    )


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_admin(
    data: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    email = data.email.strip().lower()

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email cannot be empty",
        )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already registered",
        )

    new_admin = User(
        email=email,
        hashed_password=hash_password(data.password),
        role="admin",
        is_active=True,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account",
        )

    target_admin = db.query(User).filter(
        User.id == admin_id,
        User.role == "admin",
    ).first()

    if not target_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found",
        )

    admin_count = db.query(User).filter(
        User.role == "admin",
        User.is_active == True,
    ).count()

    if admin_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The last active admin cannot be deleted",
        )

    db.query(RefreshSession).filter(
        RefreshSession.user_id == target_admin.id
    ).delete(synchronize_session=False)

    db.delete(target_admin)
    db.commit()

    return {"message": "Admin deleted successfully"}
