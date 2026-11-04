import ipaddress
import os

from sqlalchemy import text
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Request,
    status,
)

from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from database import Base, engine, get_db
from models import Quiz, Question
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


app = FastAPI(title="Quiz Game API")
@app.get("/")
def root():
    return {
        "message": "Quiz Game API is running successfully!"
    }
frontend_origins = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origins],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


# =========================
# LOCAL MANAGEMENT ACCESS
# =========================

def check_management_access(request: Request):
    """Temporarily allow management operations for the MVP deployment."""
    return

# =========================
# HEALTH CHECK
# =========================

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/debug-db")
def debug_db(db: Session = Depends(get_db)):
    connection = db.execute(
        text("SELECT current_database(), current_user, current_schema()")
    ).fetchone()

    quiz_count = db.execute(
        text("SELECT COUNT(*) FROM public.quizzes")
    ).scalar()

    return {
        "connection": list(connection),
        "quiz_count": quiz_count,
        "quizzes": [
            {"id": q.id, "title": q.title}
            for q in db.query(Quiz).all()
        ],
    }


# =========================
# QUIZ CRUD
# =========================

# READ ALL QUIZZES
@app.get("/api/quizzes", response_model=list[QuizPublic])
def get_quizzes(db: Session = Depends(get_db)):
    return (
        db.query(Quiz)
        .order_by(Quiz.id.desc())
        .all()
    )


# READ SINGLE QUIZ
@app.get("/api/quizzes/{quiz_id}", response_model=QuizDetail)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
):
    quiz = (
        db.query(Quiz)
        .options(joinedload(Quiz.questions))
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found",
        )

    return quiz


# READ QUIZ WITH ADMIN QUESTION DETAILS
@app.get(
    "/api/quizzes/{quiz_id}/management",
    response_model=QuizManagementDetail,
)
def get_quiz_management(
    quiz_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    quiz = (
        db.query(Quiz)
        .options(joinedload(Quiz.questions))
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found",
        )

    return quiz


# CREATE QUIZ
@app.post(
    "/api/quizzes",
    response_model=QuizPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_quiz(
    data: QuizCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    quiz = Quiz(**data.model_dump())

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return quiz


# UPDATE QUIZ
@app.patch(
    "/api/quizzes/{quiz_id}",
    response_model=QuizPublic,
)
def update_quiz(
    quiz_id: int,
    data: QuizUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    quiz = (
        db.query(Quiz)
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found",
        )

    updates = data.model_dump(exclude_unset=True)

    if "title" in updates and updates["title"] is None:
        raise HTTPException(
            status_code=422,
            detail="Title cannot be null",
        )

    for key, value in updates.items():
        setattr(quiz, key, value)

    db.commit()
    db.refresh(quiz)

    return quiz


# DELETE QUIZ
@app.delete("/api/quizzes/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    quiz = (
        db.query(Quiz)
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found",
        )

    db.delete(quiz)
    db.commit()

    return {"message": "Quiz deleted successfully"}


# =========================
# QUESTION CRUD
# =========================

# CREATE QUESTION
@app.post(
    "/api/quizzes/{quiz_id}/questions",
    response_model=QuestionAdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_question(
    quiz_id: int,
    data: QuestionCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    quiz = (
        db.query(Quiz)
        .filter(Quiz.id == quiz_id)
        .first()
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found",
        )

    question = Question(
        quiz_id=quiz_id,
        **data.model_dump(),
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


# READ SINGLE QUESTION
@app.get(
    "/api/questions/{question_id}",
    response_model=QuestionAdminResponse,
)
def get_question(
    question_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return question


# UPDATE QUESTION
@app.patch(
    "/api/questions/{question_id}",
    response_model=QuestionAdminResponse,
)
def update_question(
    question_id: int,
    data: QuestionUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    updates = data.model_dump(exclude_unset=True)

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Question fields cannot be null",
        )

    # Validate the final combination of options and correct answer
    new_options = updates.get("options", question.options)
    new_correct = updates.get(
        "correct_option",
        question.correct_option,
    )

    if new_correct >= len(new_options):
        raise HTTPException(
            status_code=422,
            detail="correct_option must match an existing option index",
        )

    for key, value in updates.items():
        setattr(question, key, value)

    db.commit()
    db.refresh(question)

    return question


# DELETE QUESTION
@app.delete("/api/questions/{question_id}")
def delete_question(
    question_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    check_management_access(request)

    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    db.delete(question)
    db.commit()

    return {"message": "Question deleted successfully"}