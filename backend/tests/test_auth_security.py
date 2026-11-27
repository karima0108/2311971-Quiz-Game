from security import hash_password, verify_password
from models import AuditLog, RefreshSession
from routers.auth import create_refresh_session
from jwt_handler import create_access_token

def test_failed_password_change_creates_audit_log(
    client,
    db_session,
    student_user,
    student_headers,
):
    student_user.hashed_password = hash_password("correct-password")
    db_session.commit()

    response = client.post(
        "/api/auth/change-password",
        headers=student_headers,
        json={
            "current_password": "wrong-password",
            "new_password": "new-password-123",
        },
    )

    assert response.status_code == 400

    audit_log = db_session.query(AuditLog).filter(
        AuditLog.actor_id == student_user.id,
        AuditLog.action == "auth.password_change_failed",
    ).first()

    assert audit_log is not None

def test_successful_password_change_creates_audit_log(
    client,
    db_session,
    student_user,
    student_headers,
):
    student_user.hashed_password = hash_password("correct-password")
    db_session.commit()

    response = client.post(
        "/api/auth/change-password",
        headers=student_headers,
        json={
            "current_password": "correct-password",
            "new_password": "new-password-123",
        },
    )

    assert response.status_code == 200

    assert verify_password(
        "new-password-123",
        student_user.hashed_password,
    )

    audit_log = db_session.query(AuditLog).filter(
        AuditLog.actor_id == student_user.id,
        AuditLog.action == "auth.password_changed",
    ).first()

    assert audit_log is not None

def test_revoking_session_invalidates_access_token(
    client,
    db_session,
    student_user,
    student_headers,
):
    session = db_session.query(RefreshSession).filter(
        RefreshSession.user_id == student_user.id,
        RefreshSession.revoked_at.is_(None),
    ).first()

    assert session is not None

    revoke_response = client.delete(
        f"/api/auth/sessions/{session.id}",
        headers=student_headers,
    )

    assert revoke_response.status_code == 200

    protected_response = client.get(
        "/api/auth/me",
        headers=student_headers,
    )

    assert protected_response.status_code == 401


def test_logout_invalidates_access_token(
    client,
    db_session,
    student_user,
):
    refresh_token, session = create_refresh_session(
        db_session,
        student_user,
    )

    access_token = create_access_token({
        "sub": str(student_user.id),
        "user_id": student_user.id,
        "email": student_user.email,
        "role": student_user.role,
        "sid": session.id,
    })

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    client.cookies.set("refresh_token", refresh_token)

    logout_response = client.post(
       "/api/auth/logout",
       headers=headers,
    )

    assert logout_response.status_code == 200

    protected_response = client.get(
        "/api/auth/me",
        headers=headers,
    )

    assert protected_response.status_code == 401