from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # Kept for compatibility with the existing database.
    is_published = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    questions = relationship(
        "Question",
        back_populates="quiz",
        cascade="all, delete-orphan",
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_option = Column(Integer, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")