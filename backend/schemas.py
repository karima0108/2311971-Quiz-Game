from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


# =========================
# QUESTION SCHEMAS
# =========================

class QuestionCreate(BaseModel):
    question_text: str = Field(min_length=1)
    options: list[str] = Field(min_length=2)
    correct_option: int = Field(ge=0)

    @field_validator("question_text")
    @classmethod
    def validate_question_text(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Question text cannot be empty")

        return value

    @field_validator("options")
    @classmethod
    def validate_options(cls, values):
        values = [value.strip() for value in values]

        if any(not value for value in values):
            raise ValueError("Options cannot be empty")

        return values


class QuestionUpdate(BaseModel):
    question_text: str | None = Field(
        default=None,
        min_length=1,
    )

    options: list[str] | None = Field(
        default=None,
        min_length=2,
    )

    correct_option: int | None = Field(
        default=None,
        ge=0,
    )

    @field_validator("question_text")
    @classmethod
    def validate_question_text(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Question text cannot be empty")

        return value

    @field_validator("options")
    @classmethod
    def validate_options(cls, values):
        if values is None:
            return values

        values = [value.strip() for value in values]

        if any(not value for value in values):
            raise ValueError("Options cannot be empty")

        return values


class QuestionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_text: str
    options: list[str]


class QuestionAdminResponse(QuestionPublic):
    correct_option: int


# =========================
# QUIZ SCHEMAS
# =========================

class QuizCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    is_published: bool = False

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Quiz title cannot be empty")

        return value


class QuizUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = None
    is_published: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Quiz title cannot be empty")

        return value


class QuizPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    created_at: datetime
    is_published: bool


class QuizDetail(QuizPublic):
    questions: list[QuestionPublic]


class QuizManagementDetail(QuizPublic):
    questions: list[QuestionAdminResponse]

# =========================
# AUTHENTICATION SCHEMAS
# =========================

class LoginRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)

    
class SignupRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=8)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str | None = None
    role: str
    is_active: bool
    created_at: datetime

class UserProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)

class SessionResponse(BaseModel):
    id: int
    created_at: datetime
    expires_at: datetime
    is_current: bool
