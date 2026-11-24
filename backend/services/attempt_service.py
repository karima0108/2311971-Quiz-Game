from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import Quiz, Question, QuizAttempt, QuizAnswer


def submit_quiz_attempt(
    db: Session,
    user_id: int,
    quiz_id: int,
    submitted_answers: list,
):
    quiz = db.query(Quiz).filter(
        Quiz.id == quiz_id,
        Quiz.is_published == True,
    ).first()

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Published quiz not found",
        )

    questions = db.query(Question).filter(
        Question.quiz_id == quiz_id
    ).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This quiz has no questions",
        )

    question_map = {question.id: question for question in questions}

    submitted_ids = [answer.question_id for answer in submitted_answers]

    if len(submitted_ids) != len(set(submitted_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate question answers are not allowed",
        )

    if set(submitted_ids) != set(question_map.keys()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must answer every question in this quiz",
        )

    correct_answers = 0
    answer_records = []

    for answer in submitted_answers:
        question = question_map.get(answer.question_id)

        if answer.selected_option >= len(question.options):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid option for question {question.id}",
            )

        is_correct = answer.selected_option == question.correct_option

        if is_correct:
            correct_answers += 1

        answer_records.append(
            QuizAnswer(
                question_id=question.id,
                selected_option=answer.selected_option,
                is_correct=is_correct,
            )
        )

    total_questions = len(questions)

    attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=correct_answers,
        total_questions=total_questions,
        correct_answers=correct_answers,
    )

    attempt.answers = answer_records

    try:
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
    except Exception:
        db.rollback()
        raise

    return attempt


def get_student_attempts(db: Session, user_id: int):
    return (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user_id)
        .order_by(QuizAttempt.submitted_at.desc())
        .all()
    )
