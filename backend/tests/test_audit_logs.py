from models import AuditLog


def create_audit_log(
    db_session,
    actor_id,
    action="quiz.created",
    target_type="quiz",
    target_id="101",
    description="Test audit log",
    details=None,
):
    log = AuditLog(
        actor_id=actor_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        description=description,
        details=details,
        ip_address="127.0.0.1",
    )
    db_session.add(log)
    db_session.commit()
    db_session.refresh(log)
    return log


def test_audit_logs_requires_authentication(client):
    response = client.get("/api/admin/audit-logs")
    assert response.status_code == 401


def test_student_cannot_access_audit_logs(
    client, student_headers
):
    response = client.get(
        "/api/admin/audit-logs",
        headers=student_headers,
    )
    assert response.status_code == 403


def test_admin_can_list_audit_logs(
    client, db_session, admin_headers, admin_user
):
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
    )

    response = client.get(
        "/api/admin/audit-logs",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["action"] == "quiz.created"
    assert data["items"][0]["description"] == "Test audit log"


def test_admin_can_view_audit_log_details(
    client, db_session, admin_headers, admin_user
):
    log = create_audit_log(
        db_session,
        actor_id=admin_user.id,
        details={"title": "Test Quiz"},
    )

    response = client.get(
        f"/api/admin/audit-logs/{log.id}",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == log.id
    assert data["actor_id"] == admin_user.id
    assert data["action"] == "quiz.created"
    assert data["details"] == {"title": "Test Quiz"}


def test_audit_log_details_returns_404_for_missing_log(
    client, admin_headers
):
    response = client.get(
        "/api/admin/audit-logs/99999",
        headers=admin_headers,
    )

    assert response.status_code == 404


def test_admin_can_filter_audit_logs_by_action(
    client, db_session, admin_headers, admin_user
):
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
        action="quiz.created",
    )
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
        action="user.banned",
        target_type="user",
    )

    response = client.get(
        "/api/admin/audit-logs",
        params={"action": "user.banned"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["action"] == "user.banned"


def test_admin_can_filter_audit_logs_by_actor(
    client, db_session, admin_headers, admin_user, student_user
):
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
    )
    create_audit_log(
        db_session,
        actor_id=student_user.id,
        action="auth.login_success",
    )

    response = client.get(
        "/api/admin/audit-logs",
        params={"actor_id": student_user.id},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["actor_id"] == student_user.id


def test_admin_can_filter_audit_logs_by_target_type(
    client, db_session, admin_headers, admin_user
):
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
        target_type="quiz",
    )
    create_audit_log(
        db_session,
        actor_id=admin_user.id,
        action="user.banned",
        target_type="user",
    )

    response = client.get(
        "/api/admin/audit-logs",
        params={"target_type": "user"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["target_type"] == "user"


def test_audit_logs_pagination(
    client, db_session, admin_headers, admin_user
):
    for index in range(7):
        create_audit_log(
            db_session,
            actor_id=admin_user.id,
            target_id=str(index),
        )

    response = client.get(
        "/api/admin/audit-logs",
        params={"page": 1, "page_size": 3},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data["items"]) == 3
    assert data["total"] == 7
    assert data["page"] == 1
    assert data["page_size"] == 3
    assert data["total_pages"] == 3


def test_audit_logs_are_immutable_through_api(
    client, db_session, admin_headers, admin_user
):
    log = create_audit_log(
        db_session,
        actor_id=admin_user.id,
    )

    post_response = client.post(
        "/api/admin/audit-logs",
        headers=admin_headers,
        json={"action": "fake.action"},
    )
    patch_response = client.patch(
        f"/api/admin/audit-logs/{log.id}",
        headers=admin_headers,
        json={"description": "Modified"},
    )
    delete_response = client.delete(
        f"/api/admin/audit-logs/{log.id}",
        headers=admin_headers,
    )

    assert post_response.status_code == 405
    assert patch_response.status_code == 405
    assert delete_response.status_code == 405

    db_session.refresh(log)
    assert log.description == "Test audit log"
