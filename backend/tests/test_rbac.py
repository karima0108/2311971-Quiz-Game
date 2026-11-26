from models import QuizAttempt


def test_admin_dashboard_requires_authentication(client):
    response = client.get("/api/admin/dashboard/stats")
    assert response.status_code == 401


def test_student_cannot_access_admin_dashboard(client, student_headers):
    response = client.get(
        "/api/admin/dashboard/stats",
        headers=student_headers,
    )
    assert response.status_code == 403


def test_admin_can_access_admin_dashboard(client, admin_headers):
    response = client.get(
        "/api/admin/dashboard/stats",
        headers=admin_headers,
    )
    assert response.status_code == 200


def test_student_cannot_create_quiz(client, student_headers):
    response = client.post(
        "/api/quizzes",
        headers=student_headers,
        json={
            "title": "Unauthorized Quiz",
            "description": "Student should not create this",
            "is_published": True,
        },
    )
    assert response.status_code == 403


def test_student_cannot_access_quiz_management(
    client, student_headers, quiz
):
    response = client.get(
        f"/api/quizzes/{quiz.id}/management",
        headers=student_headers,
    )
    assert response.status_code == 403


def test_admin_can_access_quiz_management(
    client, admin_headers, quiz, question
):
    response = client.get(
        f"/api/quizzes/{quiz.id}/management",
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["questions"][0]["correct_option"] == 0


def test_public_quiz_detail_does_not_expose_correct_answer(
    client, quiz, question
):
    response = client.get(f"/api/quizzes/{quiz.id}")

    assert response.status_code == 200
    data = response.json()
    assert "correct_option" not in data["questions"][0]


def test_admin_cannot_access_student_attempts(client, admin_headers):
    response = client.get(
        "/api/attempts/me",
        headers=admin_headers,
    )
    assert response.status_code == 403


def test_student_sees_only_own_attempts(
    client,
    db_session,
    student_user,
    another_student,
    student_headers,
    quiz,
):
    own_attempt = QuizAttempt(
        user_id=student_user.id,
        quiz_id=quiz.id,
        score=100,
        total_questions=1,
        correct_answers=1,
    )

    other_attempt = QuizAttempt(
        user_id=another_student.id,
        quiz_id=quiz.id,
        score=0,
        total_questions=1,
        correct_answers=0,
    )

    db_session.add_all([own_attempt, other_attempt])
    db_session.commit()

    response = client.get(
        "/api/attempts/me",
        headers=student_headers,
    )

    assert response.status_code == 200
    attempts = response.json()

    assert len(attempts) == 1
    assert attempts[0]["score"] == 100

def test_banned_student_cannot_access_protected_endpoints(
    client,
    db_session,
    student_user,
    student_headers,
):
    student_user.is_banned = True
    db_session.commit()

    response = client.get(
        "/api/attempts/me",
        headers=student_headers,
    )

    assert response.status_code == 403

def test_banned_student_cannot_access_protected_endpoints(
    client,
    db_session,
    student_user,
    student_headers,
):
    student_user.is_banned = True
    db_session.commit()

    response = client.get(
        "/api/attempts/me",
        headers=student_headers,
    )

    assert response.status_code == 403

def test_student_cannot_submit_attempt_for_another_user(
    client,
    db_session,
    student_user,
    another_student,
    student_headers,
    quiz,
    question,
):
    response = client.post(
        f"/api/quizzes/{quiz.id}/attempts",
        headers=student_headers,
        json={
            "user_id": another_student.id,
            "answers": [
                {
                    "question_id": question.id,
                    "selected_option": 0,
                }
            ],
        },
    )

    assert response.status_code == 200

    attempt = (
        db_session.query(QuizAttempt)
        .filter(QuizAttempt.quiz_id == quiz.id)
        .first()
    )

    assert attempt is not None
    assert attempt.user_id == student_user.id
    assert attempt.user_id != another_student.id
