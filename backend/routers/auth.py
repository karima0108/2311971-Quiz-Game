
import hashlib
import secrets
import os
from dotenv import load_dotenv

load_dotenv()

from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response,
    Cookie,
)
from sqlalchemy.orm import Session

from database import get_db
from models import User, RefreshSession
from schemas import (
    LoginRequest,
    SignupRequest,
    PasswordChangeRequest,
    UserProfileUpdate,
    TokenResponse,
    UserResponse,
    SessionResponse,
)
from security import (
    hash_password,
    verify_password,
    verify_password_and_update,
)
from jwt_handler import create_access_token
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================
# REFRESH TOKEN CONFIGURATION
# =========================

REFRESH_TOKEN_EXPIRE_DAYS = 7


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_refresh_token() -> str:
    return secrets.token_urlsafe(64)


def set_refresh_cookie(response: Response, token: str):
    is_production = os.getenv("ENVIRONMENT") == "production"

    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=is_production,
        samesite="none" if is_production else "lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/auth",
    )


def create_refresh_session(db: Session, user: User):
    token = create_refresh_token()
    token_hash = hash_refresh_token(token)

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    session = RefreshSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )

    db.add(session)

    return token, session


# =========================
# USER SIGNUP
# =========================

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    email = data.email.strip().lower()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    new_user = User(
        email=email,
        hashed_password=hash_password(data.password),
        role="user",
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully",
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role
    }


# =========================
# USER LOGIN
# =========================

@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    email = data.email.strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password and upgrade legacy hash if necessary.
    password_valid, upgraded_hash = verify_password_and_update(
        data.password,
        user.hashed_password,
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Save the upgraded pepper-based password hash.
    if upgraded_hash:
        user.hashed_password = upgraded_hash

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive"
        )

    # Reject banned users during login.
    if user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been banned"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    refresh_token, refresh_session = create_refresh_session(
        db,
        user
    )

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    set_refresh_cookie(response, refresh_token)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
# GET CURRENT USER PROFILE
# =========================

@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


# =========================
# UPDATE CURRENT USER PROFILE
# =========================

@router.put("/me", response_model=UserResponse)
def update_my_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name is not None:
        current_user.name = data.name.strip() or None

    db.commit()
    db.refresh(current_user)

    return current_user


# =========================
# CHANGE PASSWORD
# =========================

@router.post("/change-password")
def change_password(
    data: PasswordChangeRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        data.current_password,
        current_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different",
        )

    current_user.hashed_password = hash_password(data.new_password)

    # Revoke all active refresh sessions.
    now = datetime.now(timezone.utc)

    db.query(RefreshSession).filter(
        RefreshSession.user_id == current_user.id,
        RefreshSession.revoked_at.is_(None),
    ).update(
        {"revoked_at": now},
        synchronize_session=False,
    )

    # Clear refresh token cookie.
    is_production = os.getenv("ENVIRONMENT") == "production"

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        httponly=True,
        secure=is_production,
        samesite="none" if is_production else "lax",
    )

    db.commit()

    return {
        "message": "Password changed successfully. Please log in again."
    }


# =========================
# REFRESH ACCESS TOKEN + ROTATION
# =========================

@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing"
        )

    old_hash = hash_refresh_token(refresh_token)

    session = db.query(RefreshSession).filter(
        RefreshSession.token_hash == old_hash
    ).first()

    if not session or session.revoked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    now = datetime.now(timezone.utc)
    expires_at = session.expires_at

    # Handle database timestamps that may be timezone-naive.
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= now:
        session.revoked_at = now
        db.commit()

        response.delete_cookie(
            key="refresh_token",
            path="/api/auth"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )

    user = db.query(User).filter(
        User.id == session.user_id
    ).first()

    if not user or not user.is_active:
        session.revoked_at = now
        db.commit()

        response.delete_cookie(
            key="refresh_token",
            path="/api/auth"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive or unavailable"
        )

    # Reject banned users and revoke their refresh session.
    if user.is_banned:
        session.revoked_at = now
        db.commit()

        response.delete_cookie(
            key="refresh_token",
            path="/api/auth"
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been banned"
        )

    # Generate a replacement refresh token.
    new_refresh_token, new_session = create_refresh_session(
        db,
        user
    )

    # Revoke the old session and record its replacement.
    session.revoked_at = now
    session.replaced_by_token_hash = new_session.token_hash

    # Create a new 15-minute access token.
    access_token = create_access_token({
        "sub": str(user.id),
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    set_refresh_cookie(response, new_refresh_token)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
# USER LOGOUT
# =========================

@router.post("/logout")
def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if refresh_token:
        token_hash = hash_refresh_token(refresh_token)

        session = db.query(RefreshSession).filter(
            RefreshSession.token_hash == token_hash
        ).first()

        if session and session.revoked_at is None:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()

    is_production = os.getenv("ENVIRONMENT") == "production"

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        httponly=True,
        secure=is_production,
        samesite="none" if is_production else "lax"
    )

    return {
        "message": "Logged out successfully"
    }


# =========================
# ACTIVE USER SESSIONS
# =========================

@router.get("/sessions", response_model=list[SessionResponse])
def get_active_sessions(
    current_user: User = Depends(get_current_user),
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    current_token_hash = (
        hash_refresh_token(refresh_token)
        if refresh_token else None
    )

    now = datetime.now(timezone.utc)

    sessions = db.query(RefreshSession).filter(
        RefreshSession.user_id == current_user.id,
        RefreshSession.revoked_at.is_(None),
        RefreshSession.expires_at > now
    ).order_by(RefreshSession.created_at.desc()).all()

    return [
        {
            "id": session.id,
            "created_at": session.created_at,
            "expires_at": session.expires_at,
            "is_current": session.token_hash == current_token_hash
        }
        for session in sessions
    ]


# =========================
# REVOKE A SPECIFIC SESSION
# =========================

@router.delete("/sessions/{session_id}")
def revoke_session(
    session_id: int,
    response: Response,
    current_user: User = Depends(get_current_user),
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    session = db.query(RefreshSession).filter(
        RefreshSession.id == session_id,
        RefreshSession.user_id == current_user.id,
        RefreshSession.revoked_at.is_(None),
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    session.revoked_at = datetime.now(timezone.utc)

    if refresh_token and session.token_hash == hash_refresh_token(refresh_token):
        is_production = os.getenv("ENVIRONMENT") == "production"

        response.delete_cookie(
            key="refresh_token",
            path="/api/auth",
            httponly=True,
            secure=is_production,
            samesite="none" if is_production else "lax",
        )

    db.commit()

    return {"message": "Session revoked successfully"}


# =========================
# REVOKE ALL ACTIVE SESSIONS
# =========================

@router.delete("/sessions")
def revoke_all_sessions(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    db.query(RefreshSession).filter(
        RefreshSession.user_id == current_user.id,
        RefreshSession.revoked_at.is_(None),
    ).update(
        {"revoked_at": now},
        synchronize_session=False,
    )

    is_production = os.getenv("ENVIRONMENT") == "production"

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        httponly=True,
        secure=is_production,
        samesite="none" if is_production else "lax",
    )

    db.commit()

    return {"message": "All sessions revoked successfully"}


# =========================
# DEMO LOGIN
# =========================

@router.post("/demo-login/{role}", response_model=TokenResponse)
def demo_login(
    role: str,
    response: Response,
    db: Session = Depends(get_db),
):
    if role not in ("admin", "user"):
        raise HTTPException(
            status_code=404,
            detail="Demo role not found"
        )

    prefix = "DEMO_ADMIN" if role == "admin" else "DEMO_USER"

    email = os.getenv(f"{prefix}_EMAIL", "").strip().lower()
    password = os.getenv(f"{prefix}_PASSWORD", "")

    if not email or not password:
        raise HTTPException(
            status_code=503,
            detail="Demo login is not configured"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user or user.role != role:
        raise HTTPException(
            status_code=503,
            detail="Demo account configuration is invalid"
        )

    return login(
        LoginRequest(email=email, password=password),
        response,
        db
    )
