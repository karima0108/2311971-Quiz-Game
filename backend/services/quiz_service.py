from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from models import Quiz, Question


# =========================
# QUIZ READ OPERATIONS
# =========================

def get_all_quizzes(db: Session, include_unpublished: bool = False):
    query = db.query(Quiz)

    if not include_unpublished:
        query = query.filter(Quiz.is_published.is_(True))

    return query.order_by(Quiz.id.desc()).all()

def get_quiz_by_id(db: Session, quiz_id: int, include_unpublished: bool = False):
    quiz = (
        db.query(Quiz)
        .options(joinedload(Quiz.questions))
        .filter(Quiz.id == quiz_id)
        .filter((Quiz.is_published.is_(True)) | (include_unpublished))
        .first()
    )

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return quiz


def get_quiz_for_management(db: Session, quiz_id: int):
    return get_quiz_by_id(db, quiz_id, include_unpublished=True)


# =========================
# QUIZ WRITE OPERATIONS
# =========================

def create_quiz(db: Session, data):
    quiz = Quiz(**data.model_dump())

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return quiz


def update_quiz(db: Session, quiz_id: int, data):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=422,
            detail="At least one field must be provided",
        )

    if "title" in updates and updates["title"] is None:
        raise HTTPException(status_code=422, detail="Title cannot be null")

    for key, value in updates.items():
        setattr(quiz, key, value)

    db.commit()
    db.refresh(quiz)

    return quiz


def delete_quiz(db: Session, quiz_id: int):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    db.delete(quiz)
    db.commit()

    return {"message": "Quiz deleted successfully"}


# =========================
# QUESTION CRUD OPERATIONS
# =========================

def create_question(db: Session, quiz_id: int, data):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question_data = data.model_dump()
    options = question_data["options"]
    correct_option = question_data["correct_option"]

    if not 0 <= correct_option < len(options):
        raise HTTPException(
            status_code=422,
            detail="correct_option must match an existing option index",
        )

    question = Question(
        quiz_id=quiz_id,
        **question_data,
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


def get_question_by_id(db: Session, question_id: int):
    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    return question


def update_question(db: Session, question_id: int, data):
    question = get_question_by_id(db, question_id)
    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=422,
            detail="At least one field must be provided",
        )

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Question fields cannot be null",
        )

    new_options = updates.get("options", question.options)
    new_correct = updates.get("correct_option", question.correct_option)

    if not 0 <= new_correct < len(new_options):
        raise HTTPException(
            status_code=422,
            detail="correct_option must match an existing option index",
        )

    for key, value in updates.items():
        setattr(question, key, value)

    db.commit()
    db.refresh(question)

    return question


def delete_question(db: Session, question_id: int):
    question = get_question_by_id(db, question_id)

    db.delete(question)
    db.commit()

    return {"message": "Question deleted successfully"}




