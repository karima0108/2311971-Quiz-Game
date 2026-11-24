from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import require_student
from models import User
from schemas_attempt import AttemptSubmission, AttemptResult
from services.attempt_service import (
    submit_quiz_attempt,
    get_student_attempts,
)


router = APIRouter(prefix="/api", tags=["Student Attempts"])


@router.post(
    "/quizzes/{quiz_id}/attempts",
    response_model=AttemptResult,
)
def create_quiz_attempt(
    quiz_id: int,
    submission: AttemptSubmission,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    return submit_quiz_attempt(
        db=db,
        user_id=current_user.id,
        quiz_id=quiz_id,
        submitted_answers=submission.answers,
    )


@router.get(
    "/attempts/me",
    response_model=list[AttemptResult],
)
def read_my_attempts(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    return get_student_attempts(
        db=db,
        user_id=current_user.id,
    )
