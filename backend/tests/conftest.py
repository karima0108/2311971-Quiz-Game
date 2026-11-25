import pytest

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base, get_db
from models import (
    User,
    Quiz,
    Question,
    Group,
    GroupMembership,
    GroupPermission,
)
from jwt_handler import create_access_token

from routers.auth import router as auth_router
from routers.quizzes import router as quizzes_router
from routers.admin import router as admin_router
from routers.admin_dashboard import router as admin_dashboard_router
from routers.admin_users import router as admin_users_router
from routers.audit_logs import router as audit_logs_router
from routers.attempts import router as attempts_router
from routers.groups import router as groups_router
from routers.groups import student_router


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def app(db_session):
    test_app = FastAPI()

    test_app.include_router(auth_router)
    test_app.include_router(quizzes_router)
    test_app.include_router(admin_router)
    test_app.include_router(admin_dashboard_router)
    test_app.include_router(admin_users_router)
    test_app.include_router(audit_logs_router)
    test_app.include_router(attempts_router)
    test_app.include_router(groups_router)
    test_app.include_router(student_router)

    def override_get_db():
        yield db_session

    test_app.dependency_overrides[get_db] = override_get_db

    return test_app


@pytest.fixture
def client(app):
    return TestClient(app)


@pytest.fixture
def admin_user(db_session):
    user = User(
        email="admin-test@example.com",
        hashed_password="test-password",
        role="admin",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def student_user(db_session):
    user = User(
        email="student-test@example.com",
        hashed_password="test-password",
        role="user",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def another_student(db_session):
    user = User(
        email="another-student@example.com",
        hashed_password="test-password",
        role="user",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def quiz(db_session):
    item = Quiz(
        title="RBAC Test Quiz",
        description="Quiz for automated security tests",
        is_published=True,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


@pytest.fixture
def question(db_session, quiz):
    item = Question(
        quiz_id=quiz.id,
        question_text="Which option is correct?",
        options=["Option A", "Option B"],
        correct_option=0,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


def make_auth_headers(user):
    token = create_access_token({"sub": str(user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(admin_user):
    return make_auth_headers(admin_user)


@pytest.fixture
def student_headers(student_user):
    return make_auth_headers(student_user)


@pytest.fixture
def another_student_headers(another_student):
    return make_auth_headers(another_student)
