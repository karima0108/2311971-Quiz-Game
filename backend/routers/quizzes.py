

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_admin, get_optional_user
from schemas import (
    QuizCreate,
    QuizUpdate,
    QuizPublic,
    QuizDetail,
    QuizManagementDetail,
    QuestionCreate,
    QuestionUpdate,
    QuestionAdminResponse,
)
from services import quiz_service


router = APIRouter(prefix="/api", tags=["Quizzes"])


# =========================
# QUIZ CRUD
# =========================

# READ ALL QUIZZES - PUBLIC
@router.get("/quizzes", response_model=list[QuizPublic])
def get_quizzes(
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    is_admin = current_user is not None and current_user.role == "admin"
    return quiz_service.get_all_quizzes(db, include_unpublished=is_admin)

# READ SINGLE QUIZ - PUBLIC
@router.get("/quizzes/{quiz_id}", response_model=QuizDetail)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    is_admin = current_user is not None and current_user.role == "admin"
    return quiz_service.get_quiz_by_id(
        db, quiz_id, include_unpublished=is_admin
    )


# READ QUIZ WITH ADMIN QUESTION DETAILS - ADMIN ONLY

@router.get(
    "/quizzes/{quiz_id}/management",
    response_model=QuizManagementDetail,
)

def get_quiz_management(
    quiz_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.get_quiz_for_management(db, quiz_id)

# CREATE QUIZ - ADMIN ONLY
@router.post(
    "/quizzes",
    response_model=QuizPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_quiz(
    data: QuizCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.create_quiz(db, data)

# UPDATE QUIZ - ADMIN ONLY
@router.patch("/quizzes/{quiz_id}", response_model=QuizPublic)
def update_quiz(
    quiz_id: int,
    data: QuizUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.update_quiz(db, quiz_id, data)


# DELETE QUIZ - ADMIN ONLY
@router.delete("/quizzes/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.delete_quiz(db, quiz_id)

# =========================
# QUESTION CRUD
# =========================

# CREATE QUESTION - ADMIN ONLY
@router.post(
    "/quizzes/{quiz_id}/questions",
    response_model=QuestionAdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_question(
    quiz_id: int,
    data: QuestionCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.create_question(db, quiz_id, data)

# READ SINGLE QUESTION - ADMIN ONLY
@router.get(
    "/questions/{question_id}",
    response_model=QuestionAdminResponse,
)
def get_question(
    question_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.get_question_by_id(db, question_id)


# UPDATE QUESTION - ADMIN ONLY
@router.patch(
    "/questions/{question_id}",
    response_model=QuestionAdminResponse,
)
def update_question(
    question_id: int,
    data: QuestionUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.update_question(db, question_id, data)


# DELETE QUESTION - ADMIN ONLY
@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return quiz_service.delete_question(db, question_id)


