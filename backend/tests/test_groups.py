
def create_group(client, admin_headers, name="CSE Group"):
    response = client.post(
        "/api/admin/groups",
        json={
            "name": name,
            "description": "Test group",
        },
        headers=admin_headers,
    )
    assert response.status_code == 201
    return response.json()


def test_unauthenticated_user_cannot_manage_groups(client):
    response = client.get("/api/admin/groups")
    assert response.status_code == 401


def test_student_cannot_manage_groups(client, student_headers):
    response = client.get(
        "/api/admin/groups",
        headers=student_headers,
    )
    assert response.status_code == 403


def test_admin_can_create_update_and_delete_group(
    client,
    admin_headers,
):
    group = create_group(client, admin_headers)

    group_id = group["id"]

    update_response = client.patch(
        f"/api/admin/groups/{group_id}",
        json={"name": "Updated CSE Group"},
        headers=admin_headers,
    )

    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated CSE Group"

    delete_response = client.delete(
        f"/api/admin/groups/{group_id}",
        headers=admin_headers,
    )

    assert delete_response.status_code == 204


def test_admin_cannot_create_duplicate_group(
    client,
    admin_headers,
):
    create_group(client, admin_headers, "CSE Group")

    response = client.post(
        "/api/admin/groups",
        json={"name": "cse group"},
        headers=admin_headers,
    )

    assert response.status_code == 409


def test_admin_can_add_and_remove_student(
    client,
    admin_headers,
    student_headers,
    student_user,
):
    group = create_group(client, admin_headers)
    group_id = group["id"]

    add_response = client.post(
        f"/api/admin/groups/{group_id}/members",
        json={"user_id": student_user.id},
        headers=admin_headers,
    )

    assert add_response.status_code == 201

    duplicate_response = client.post(
        f"/api/admin/groups/{group_id}/members",
        json={"user_id": student_user.id},
        headers=admin_headers,
    )

    assert duplicate_response.status_code == 409

    remove_response = client.delete(
        f"/api/admin/groups/{group_id}/members/{student_user.id}",
        headers=admin_headers,
    )

    assert remove_response.status_code == 200


def test_admin_can_assign_and_revoke_permission(
    client,
    admin_headers,
):
    group = create_group(client, admin_headers)
    group_id = group["id"]

    assign_response = client.post(
        f"/api/admin/groups/{group_id}/permissions",
        json={"permission": "group:resources:read"},
        headers=admin_headers,
    )

    assert assign_response.status_code == 201

    duplicate_response = client.post(
        f"/api/admin/groups/{group_id}/permissions",
        json={"permission": "group:resources:read"},
        headers=admin_headers,
    )

    assert duplicate_response.status_code == 409

    revoke_response = client.delete(
        f"/api/admin/groups/{group_id}/permissions/group:resources:read",
        headers=admin_headers,
    )

    assert revoke_response.status_code == 200


def test_student_can_only_view_own_groups_and_permissions(
    client,
    admin_headers,
    student_headers,
    student_user,
    another_student,
):
    student_group = create_group(
        client,
        admin_headers,
        "Student A Group",
    )

    another_group = create_group(
        client,
        admin_headers,
        "Student B Group",
    )

    # Add each student to a separate group.
    for group, user in [
        (student_group, student_user),
        (another_group, another_student),
    ]:
        response = client.post(
            f"/api/admin/groups/{group['id']}/members",
            json={"user_id": user.id},
            headers=admin_headers,
        )
        assert response.status_code == 201

    # Assign different permissions to each group.
    for group, permission in [
        (student_group, "group:resources:read"),
        (another_group, "group:private:read"),
    ]:
        response = client.post(
            f"/api/admin/groups/{group['id']}/permissions",
            json={"permission": permission},
            headers=admin_headers,
        )
        assert response.status_code == 201

    # Student A must see only their own group.
    groups_response = client.get(
        "/api/groups/me",
        headers=student_headers,
    )

    assert groups_response.status_code == 200
    assert len(groups_response.json()) == 1
    assert groups_response.json()[0]["id"] == student_group["id"]

    # Student A must see only their own permissions.
    permissions_response = client.get(
        "/api/groups/me/permissions",
        headers=student_headers,
    )

    assert permissions_response.status_code == 200
    assert permissions_response.json()["permissions"] == [
        "group:resources:read"
    ]

def test_student_cannot_access_admin_group_routes(
    client,
    student_headers,
):
    response = client.post(
        "/api/admin/groups",
        json={"name": "Unauthorized Group"},
        headers=student_headers,
    )

    assert response.status_code == 403

def test_student_without_permission_cannot_access_resources(
    client,
    admin_headers,
    student_headers,
    student_user,
):
    group = create_group(client, admin_headers)

    client.post(
        f"/api/admin/groups/{group['id']}/members",
        json={"user_id": student_user.id},
        headers=admin_headers,
    )

    response = client.get(
        "/api/groups/resources",
        headers=student_headers,
    )

    assert response.status_code == 403


def test_student_with_permission_can_access_resources(
    client,
    admin_headers,
    student_headers,
    student_user,
):
    group = create_group(client, admin_headers)

    client.post(
        f"/api/admin/groups/{group['id']}/members",
        json={"user_id": student_user.id},
        headers=admin_headers,
    )

    client.post(
        f"/api/admin/groups/{group['id']}/permissions",
        json={"permission": "group:resources:read"},
        headers=admin_headers,
    )

    response = client.get(
        "/api/groups/resources",
        headers=student_headers,
    )

    assert response.status_code == 200
    assert response.json()["resources"] == [
        {
            "group_id": group["id"],
            "group_name": group["name"],
        }
    ]
