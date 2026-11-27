
import re
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.orm import Session

from database import get_db
from models import User, RefreshSession, GroupMembership, GroupPermission
from jwt_handler import verify_access_token


bearer_scheme = HTTPBearer(auto_error=False)



def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise credentials_exception

    try:
        payload = verify_access_token(credentials.credentials)
        user_id = int(payload.get("sub"))
        session_id = int(payload.get("sid"))
    except Exception:
        raise credentials_exception

    refresh_session = db.query(RefreshSession).filter(
        RefreshSession.id == session_id,
        RefreshSession.user_id == user_id,
        RefreshSession.revoked_at.is_(None),
        RefreshSession.expires_at > datetime.now(timezone.utc),
    ).first()

    if not refresh_session:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()

    if not user or not user.is_active:
        raise credentials_exception

    if user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been banned",
        )

    return user



def require_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user



def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials is None:
        return None

    try:
        payload = verify_access_token(credentials.credentials)
        user_id = int(payload.get("sub"))
        session_id = int(payload.get("sid"))
    except Exception:
        return None

    refresh_session = db.query(RefreshSession).filter(
        RefreshSession.id == session_id,
        RefreshSession.user_id == user_id,
        RefreshSession.revoked_at.is_(None),
        RefreshSession.expires_at > datetime.now(timezone.utc),
    ).first()

    if not refresh_session:
        return None

    user = db.query(User).filter(User.id == user_id).first()

    if not user or not user.is_active or user.is_banned:
        return None

    return user



def require_student(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required",
        )

    return current_user


# =========================
# FINE-GRAINED PERMISSIONS
# =========================

def require_permission(permission_name: str):
    if (
        not isinstance(permission_name, str)
        or len(permission_name) > 100
        or not re.fullmatch(
            r"[a-z][a-z0-9_-]*(?:[:.][a-z][a-z0-9_-]*)*",
            permission_name,
        )
    ):
        raise ValueError("Invalid permission name")

    def permission_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        # Admins retain their existing unrestricted access.
        if current_user.role == "admin":
            return current_user

        if current_user.role != "user":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied",
            )

        has_permission = (
            db.query(GroupPermission)
            .join(
                GroupMembership,
                GroupPermission.group_id == GroupMembership.group_id,
            )
            .filter(
                GroupMembership.user_id == current_user.id,
                GroupPermission.permission == permission_name,
            )
            .first()
        )

        if not has_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have the required permission",
            )

        return current_user

    return permission_checker
