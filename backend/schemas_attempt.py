from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class AnswerSubmission(BaseModel):
    question_id: int = Field(gt=0)
    selected_option: int = Field(ge=0)


class AttemptSubmission(BaseModel):
    answers: list[AnswerSubmission] = Field(min_length=1)



class AttemptResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quiz_id: int
    quiz_title: str
    score: int
    total_questions: int
    correct_answers: int
    submitted_at: datetime
