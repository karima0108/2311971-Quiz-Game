from models import User

def test_admin_user_list_requires_authentication(client):
    response = client.get("/api/admin/users")
    assert response.status_code == 401


def test_student_cannot_access_admin_user_list(client, student_headers):
    response = client.get(
        "/api/admin/users",
        headers=student_headers,
    )
    assert response.status_code == 403


def test_admin_can_list_users(client, admin_headers, student_user):
    response = client.get(
        "/api/admin/users",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data
    assert data["total"] == 2


def test_admin_can_search_users_by_name(
    client, db_session, admin_headers, student_user
):
    student_user.name = "Test Student"
    db_session.commit()

    response = client.get(
        "/api/admin/users",
        params={"search": "Test Student"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["name"] == "Test Student"


def test_admin_can_search_users_by_email(
    client, admin_headers, student_user
):
    response = client.get(
        "/api/admin/users",
        params={"search": "student-test"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    assert response.json()["total"] == 1


def test_admin_can_filter_users_by_role(
    client, admin_headers, student_user
):
    response = client.get(
        "/api/admin/users",
        params={"role": "user"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert all(user["role"] == "user" for user in data["items"])


def test_admin_can_filter_users_by_banned_status(
    client, db_session, admin_headers, student_user
):
    student_user.is_banned = True
    db_session.commit()

    response = client.get(
        "/api/admin/users",
        params={"status": "banned"},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["is_banned"] is True


def test_admin_user_list_pagination(
    client, db_session, admin_headers, student_user, another_student
):
    for index in range(10):
        db_session.add(
            User(
                email=f"pagination-{index}@example.com",
                hashed_password="test-password",
                role="user",
                is_active=True,
            )
        )

    db_session.commit()

    response = client.get(
        "/api/admin/users",
        params={"page": 1, "page_size": 5},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data["items"]) == 5
    assert data["total"] == 13
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert data["total_pages"] == 3


def test_admin_can_view_user_details(
    client, admin_headers, student_user
):
    response = client.get(
        f"/api/admin/users/{student_user.id}",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == student_user.id
    assert data["email"] == student_user.email
    assert "hashed_password" not in data


def test_user_details_returns_404_for_missing_user(
    client, admin_headers
):
    response = client.get(
        "/api/admin/users/99999",
        headers=admin_headers,
    )

    assert response.status_code == 404


def test_admin_can_promote_student_to_admin(
    client, admin_headers, student_user
):
    response = client.patch(
        f"/api/admin/users/{student_user.id}/role",
        headers=admin_headers,
        json={"role": "admin"},
    )

    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_admin_cannot_change_own_role(
    client, admin_headers, admin_user
):
    response = client.patch(
        f"/api/admin/users/{admin_user.id}/role",
        headers=admin_headers,
        json={"role": "user"},
    )

    assert response.status_code == 400


def test_admin_cannot_change_another_admin_role(
    client, db_session, admin_headers, student_user
):
    another_admin = User(
        email="another-admin@example.com",
        hashed_password="test-password",
        role="admin",
        is_active=True,
    )
    db_session.add(another_admin)
    db_session.commit()
    db_session.refresh(another_admin)

    response = client.patch(
        f"/api/admin/users/{another_admin.id}/role",
        headers=admin_headers,
        json={"role": "user"},
    )

    assert response.status_code == 403


def test_admin_can_ban_and_unban_student(
    client, admin_headers, student_user
):
    ban_response = client.patch(
        f"/api/admin/users/{student_user.id}/ban",
        headers=admin_headers,
        json={"reason": "Violation of rules"},
    )

    assert ban_response.status_code == 200
    assert ban_response.json()["is_banned"] is True
    assert ban_response.json()["ban_reason"] == "Violation of rules"

    unban_response = client.patch(
        f"/api/admin/users/{student_user.id}/unban",
        headers=admin_headers,
    )

    assert unban_response.status_code == 200
    assert unban_response.json()["is_banned"] is False
    assert unban_response.json()["ban_reason"] is None


def test_admin_cannot_ban_own_account(
    client, admin_headers, admin_user
):
    response = client.patch(
        f"/api/admin/users/{admin_user.id}/ban",
        headers=admin_headers,
        json={"reason": "Testing own account"},
    )

    assert response.status_code == 400


def test_admin_cannot_ban_another_admin(
    client, db_session, admin_headers
):
    another_admin = User(
        email="second-admin@example.com",
        hashed_password="test-password",
        role="admin",
        is_active=True,
    )
    db_session.add(another_admin)
    db_session.commit()
    db_session.refresh(another_admin)

    response = client.patch(
        f"/api/admin/users/{another_admin.id}/ban",
        headers=admin_headers,
        json={"reason": "Testing admin protection"},
    )

    assert response.status_code == 403


def test_admin_cannot_deactivate_own_account(
    client, admin_headers, admin_user
):
    response = client.patch(
        f"/api/admin/users/{admin_user.id}/status",
        params={"is_active": "false"},
        headers=admin_headers,
    )

    assert response.status_code == 400


def test_admin_cannot_deactivate_another_admin(
    client, db_session, admin_headers
):
    another_admin = User(
        email="third-admin@example.com",
        hashed_password="test-password",
        role="admin",
        is_active=True,
    )
    db_session.add(another_admin)
    db_session.commit()
    db_session.refresh(another_admin)

    response = client.patch(
        f"/api/admin/users/{another_admin.id}/status",
        params={"is_active": "false"},
        headers=admin_headers,
    )

    assert response.status_code == 403


def test_admin_dashboard_statistics(
    client, db_session, admin_headers, student_user, another_student, quiz
):
    another_student.is_banned = True
    db_session.commit()

    response = client.get(
        "/api/admin/dashboard/stats",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total_users"] == 3
    assert data["total_students"] == 2
    assert data["total_admins"] == 1
    assert data["banned_users"] == 1
    assert data["total_quizzes"] == 1
    assert data["published_quizzes"] == 1
