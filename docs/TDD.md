# Technical Design Document (TDD)
## Quiz Game

**Project Name:** Quiz Game  
**Document:** Technical Design Document  
**Status:** Proposed Design  
**Frontend:** React + TypeScript  
**Backend:** FastAPI + Python  
**Architecture:** REST API-based client-server architecture  
**Release Plan:** MVP (Mid-term) and Beta (Final)

---

## 1. Introduction

### 1.1 Purpose

This Technical Design Document describes the proposed architecture, technology stack, database design, API structure, security mechanisms, and implementation plan for the Quiz Game application.

The document provides a technical blueprint for developing the application in two releases: MVP and Beta.

### 1.2 Project Overview

Quiz Game is a web-based application that allows users to participate in multiple-choice quizzes and view their results. Authorized users will be able to create and manage quizzes and questions.

The application will use React with TypeScript for the frontend and FastAPI with Python for the backend. The frontend and backend will communicate through REST APIs.

### 1.3 Scope

The technical design covers:

- Frontend and backend architecture.
- Database entities and relationships.
- REST API endpoints and data formats.
- Quiz submission and score calculation.
- Input validation and error handling.
- Authentication, authorization, and Role-Based Access Control (RBAC).
- Testing and deployment strategy.

**Implementation status:** This document describes the planned design. Features must be marked as implemented only after they have been developed and tested.

---

## 2. System Architecture

### 2.1 Architecture Overview

The application will follow a client-server architecture with separate frontend, backend, and database layers.

```text
+--------------------------------+
|         User / Browser         |
+--------------------------------+
                |
                v
+--------------------------------+
| Frontend: React + TypeScript   |
| - Quiz interface               |
| - Answer selection             |
| - Result display               |
| - Admin interface              |
+--------------------------------+
                |
                | HTTP / JSON
                | REST API
                v
+--------------------------------+
| Backend: FastAPI + Python      |
| - API endpoints                |
| - Business logic               |
| - Quiz scoring                 |
| - Authentication and RBAC      |
| - Input validation             |
+--------------------------------+
                |
                v
+--------------------------------+
|          Database              |
| - Users                        |
| - Quizzes                      |
| - Questions                    |
| - Quiz Attempts                |
+--------------------------------+
```

**Status:** Proposed architecture.

### 2.2 Frontend Layer

The frontend will be developed using React and TypeScript.

Responsibilities:

- Display available quizzes.
- Show quiz questions and answer options.
- Allow users to select and submit answers.
- Display scores and quiz results.
- Provide quiz and question management interfaces for authorized users.
- Display validation errors and API responses.
- Provide registration, login, and profile interfaces in Beta.

The frontend will communicate with the backend through HTTP requests and JSON data.

### 2.3 Backend Layer

The backend will use FastAPI and Python.

Responsibilities:

- Expose REST API endpoints.
- Validate incoming requests.
- Retrieve and update application data.
- Apply quiz and scoring rules.
- Enforce authentication and authorization.
- Verify role and permission requirements.
- Return structured JSON responses.
- Handle application errors.

The backend will be responsible for calculating scores. The frontend must not be trusted to determine the final score.

### 2.4 Database Layer

A relational database will store users, quizzes, questions, and quiz attempts.

**Proposed database approach:**
- SQLite may be used for initial local development if permitted by the project requirements.
- PostgreSQL may be used for deployment if supported by the chosen hosting environment.

The final database choice must be confirmed before implementation. Database access will be handled through the backend rather than directly from the frontend.

---

## 3. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Frontend language | TypeScript | Type safety |
| Backend framework | FastAPI | REST API development |
| Backend language | Python | Business logic |
| API data format | JSON | Frontend-backend communication |
| API documentation | FastAPI OpenAPI/Swagger UI | API inspection and testing |
| Database | SQLite or PostgreSQL | Persistent data storage |
| Version control | Git and GitHub | Source code and collaboration |
| Testing | Pytest and frontend testing tools | Automated testing |
| Deployment | To be selected | Hosting the application |

**Status:** React, TypeScript, FastAPI, Python, and REST APIs are the required project technologies. The remaining choices are proposed and should be confirmed with the team and instructor.

---

## 4. Proposed Project Structure

The following is a proposed folder structure. It should be adjusted to match the actual repository and the selected FastAPI/React template.

```text
2311971-Quiz-Game/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── UserForm.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── quiz.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── quizzes.py
│   │   │   ├── questions.py
│   │   │   ├── auth.py
│   │   │   └── users.py
│   │   ├── models/
│   │   │   ├── quiz.py
│   │   │   ├── question.py
│   │   │   ├── user.py
│   │   │   └── attempt.py
│   │   ├── schemas/
│   │   │   ├── quiz.py
│   │   │   ├── question.py
│   │   │   ├── user.py
│   │   │   └── attempt.py
│   │   ├── services/
│   │   │   └── scoring.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
│
├── docs/
│   ├── 01-prd.md
│   ├── 02-srs.md
│   └── 03-tdd.md
│
└── README.md
```

**Status:** Proposed structure, not a statement that these files already exist. Actual paths may differ depending on the repository template.

---

## 5. Database Design

### 5.1 Overview

The proposed database contains four main entities:

1. User
2. Quiz
3. Question
4. QuizAttempt

These entities support quiz management, participation, and result tracking.

### 5.2 User Entity

Stores account information for registered users.

| Field | Type | Description |
|---|---|---|
| id | Integer / UUID | Primary key |
| name | String | User's display name |
| email | String | Unique email address |
| password_hash | String | Securely hashed password |
| role | String / Enum | Student or Admin |
| created_at | Timestamp | Account creation time |

**Release:** Beta.

Passwords must never be stored as plain text. The `password_hash` field will store a password hash generated using an appropriate password-hashing algorithm.

### 5.3 Quiz Entity

Stores quiz information.

| Field | Type | Description |
|---|---|---|
| id | Integer / UUID | Primary key |
| title | String | Quiz title |
| description | Text | Quiz description |
| is_published | Boolean | Whether the quiz is available to participants |
| created_by | Foreign key | Reference to the creating user |
| created_at | Timestamp | Creation time |

**Release:** Core quiz functionality in MVP; ownership and role-based restrictions in Beta.

### 5.4 Question Entity

Stores questions and their answer options.

| Field | Type | Description |
|---|---|---|
| id | Integer / UUID | Primary key |
| quiz_id | Foreign key | Reference to the associated quiz |
| question_text | Text | Question statement |
| option_a | String | First option |
| option_b | String | Second option |
| option_c | String | Third option |
| option_d | String | Fourth option |
| correct_option | String | Correct option identifier |

**Release:** MVP.

The correct answer must not be exposed in the public quiz response before submission. The backend will use the correct answer to calculate the result.

### 5.5 QuizAttempt Entity

Stores a user's completed quiz attempt.

| Field | Type | Description |
|---|---|---|
| id | Integer / UUID | Primary key |
| user_id | Foreign key | Reference to the user |
| quiz_id | Foreign key | Reference to the quiz |
| score | Integer | Number of correct answers |
| total_questions | Integer | Total questions answered |
| submitted_at | Timestamp | Submission time |

**Release:** Basic result handling in MVP; persistent user-linked history and dashboard in Beta.

A detailed answer-by-answer history can be added later if required by the final requirements.

### 5.6 Entity Relationships

```text
User
 |
 | 1
 |
 |------< Quiz
 |        created_by
 |
 | 1
 |
 |------< QuizAttempt >------ Quiz
             N                  1
                                |
                                | 1
                                |
                                v
                             Question
```

Relationship summary:

- One user may create multiple quizzes.
- One quiz may contain multiple questions.
- One user may have multiple quiz attempts.
- One quiz may have multiple quiz attempts.

**Status:** Proposed relational design. The exact implementation will depend on the chosen ORM and database schema.

---

## 6. REST API Design

### 6.1 API Conventions

The backend will expose REST endpoints under the `/api` prefix.

Conventions:

- JSON will be used for request and response bodies.
- HTTP methods will represent the intended operation.
- Appropriate HTTP status codes will be returned.
- Path parameters will identify specific resources.
- Request data will be validated by FastAPI/Pydantic schemas.
- Error responses will provide useful messages without exposing sensitive internal details.

The endpoint definitions below are proposed. They are not evidence that the routes have already been implemented.

### 6.2 Quiz Endpoints

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| GET | `/api/quizzes` | List published quizzes | MVP |
| GET | `/api/quizzes/{quiz_id}` | Retrieve quiz details | MVP |
| POST | `/api/quizzes` | Create a quiz | MVP |
| PUT | `/api/quizzes/{quiz_id}` | Update a quiz | MVP |
| DELETE | `/api/quizzes/{quiz_id}` | Delete a quiz | MVP |
| POST | `/api/quizzes/{quiz_id}/questions` | Add a question to a quiz | MVP |

Creation, editing, and deletion endpoints will require suitable access controls. For the MVP, these may be restricted to a development or admin workflow; proper user authentication and RBAC are planned for Beta.

### 6.3 Question Endpoints

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| PUT | `/api/questions/{question_id}` | Update a question | MVP |
| DELETE | `/api/questions/{question_id}` | Delete a question | MVP |

These endpoints will validate the question data and verify that the target question exists.

### 6.4 Quiz Submission Endpoint

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| POST | `/api/quizzes/{quiz_id}/submit` | Submit answers and calculate a score | MVP |

The backend will receive the user's selected answers, compare them with the correct answers, calculate the score, and return the result.

### 6.5 Authentication and User Endpoints

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Beta |
| POST | `/api/auth/login` | Authenticate a user | Beta |
| GET | `/api/users/me` | Retrieve the current user's profile | Beta |
| GET | `/api/users/me/attempts` | Retrieve the current user's quiz history | Beta |
| GET | `/api/admin/users` | Admin-only user listing | Beta |

The final authentication mechanism, token configuration, and exact response formats will be confirmed during implementation.

### 6.6 Example: Retrieve Quizzes

**Request**

```http
GET /api/quizzes
Accept: application/json
```

**Example response**

```json
[
  {
    "id": 1,
    "title": "General Knowledge Quiz",
    "description": "A short general knowledge quiz"
  }
]
```

**Expected response:** `200 OK`

This example shows the proposed public quiz response. The actual response may include additional fields.

### 6.7 Example: Create a Quiz

**Request**

```http
POST /api/quizzes
Content-Type: application/json
```

**Example request body**

```json
{
  "title": "General Knowledge Quiz",
  "description": "A short general knowledge quiz"
}
```

**Example response**

```json
{
  "id": 1,
  "title": "General Knowledge Quiz",
  "description": "A short general knowledge quiz"
}
```

**Expected response:** `201 Created`

The exact request and response fields will depend on the final Pydantic schema.

### 6.8 Example: Submit a Quiz

**Request**

```http
POST /api/quizzes/1/submit
Content-Type: application/json
```

**Example request body**

```json
{
  "answers": [
    {
      "question_id": 1,
      "selected_option": "A"
    },
    {
      "question_id": 2,
      "selected_option": "C"
    }
  ]
}
```

**Example response**

```json
{
  "quiz_id": 1,
  "score": 1,
  "total_questions": 2,
  "percentage": 50.0
}
```

**Expected response:** `200 OK`

The numbers above are illustrative. The backend must calculate the actual score using the stored correct answers rather than trusting a score supplied by the frontend.

---

## 7. Quiz Submission and Scoring Logic

### 7.1 Proposed Workflow

```text
User opens a published quiz
            |
            v
Frontend requests quiz questions
            |
            v
Backend returns question text and options
            |
            v
User selects answers
            |
            v
Frontend submits selected answers
            |
            v
Backend validates the submission
            |
            v
Backend compares answers with correct answers
            |
            v
Backend calculates score and percentage
            |
            v
Frontend displays the result
```

**Release:** MVP.

### 7.2 Scoring Algorithm

The proposed scoring process is:

1. Verify that the quiz exists and is available.
2. Validate the submitted question IDs and selected options.
3. Retrieve the correct answers from the database.
4. Compare each submitted answer with its corresponding correct answer.
5. Increment the score for each correct answer.
6. Calculate the percentage.
7. Return the result to the frontend.

Percentage calculation:

\[
\text{Percentage} =
\frac{\text{Score}}{\text{Total Questions}} \times 100
\]

The implementation must handle an empty quiz or zero-question submission safely to avoid division by zero.

### 7.3 Important Rules

- A submitted question must belong to the requested quiz.
- Invalid option identifiers must be rejected.
- The client must not be allowed to submit its own score as the authoritative result.
- Duplicate or missing answers must be handled according to the final submission rules.
- The correct answers must not be revealed in the initial quiz response.

---

## 8. Authentication, Authorization, and RBAC

### 8.1 Authentication

**Release:** Beta.

Authentication will verify the identity of registered users. The proposed design uses email and password login with a signed access token, such as a JWT.

Planned workflow:

1. A user registers with a name, email, and password.
2. The backend validates the registration details.
3. The password is stored as a secure hash.
4. The user logs in with their credentials.
5. The backend verifies the credentials and issues an access token.
6. Protected endpoints validate the token before processing requests.

**Status:** Planned for Beta; not claimed as implemented.

### 8.2 Authorization

Authorization determines whether an authenticated user has permission to perform a particular operation.

Examples:

- A student may view published quizzes.
- A student may submit answers and view their own results.
- An admin may create, edit, publish, and delete quizzes.
- An admin may manage questions and access authorized user-management functions.

### 8.3 Role-Based Access Control (RBAC)

The proposed roles are:

| Role | Permissions |
|---|---|
| Student | View published quizzes, submit quizzes, view own profile and attempt history |
| Admin | Create and manage quizzes and questions; access authorized administrative functions |

The backend must enforce permissions. Hiding a button in the frontend alone is not a security control.

### 8.4 Security Scopes and Permissions

**Release:** Beta.

The backend will use appropriate FastAPI dependencies and security scopes or equivalent permission checks for protected routes.

Illustrative permission design:

| Scope / Permission | Intended access |
|---|---|
| `quizzes:read` | Read accessible quizzes |
| `quizzes:write` | Create or update quizzes |
| `questions:write` | Create or update questions |
| `profile:read` | Read the current user's profile |
| `attempts:read` | Read permitted quiz attempt records |
| `users:manage` | Perform authorized user-management operations |

These names are proposed examples. The final scope names and enforcement rules will be aligned with the implemented authorization design.

### 8.5 Additional Security Measures

Planned security measures include:

- Password hashing.
- Input validation.
- Authentication for protected routes.
- Role and permission checks on the backend.
- Restricting users to their own profile and attempt history unless authorized otherwise.
- Avoiding exposure of passwords, tokens, and internal exception details.
- Configuring secrets through environment variables rather than committing them to GitHub.

**Release:** Core security controls planned for Beta.

---

## 9. Validation and Error Handling

### 9.1 Input Validation

The backend will validate incoming requests using Pydantic schemas.

Examples of validation rules:

- Quiz titles must not be empty.
- Required fields must be present.
- Email addresses must have a valid format during registration.
- Selected answer options must be valid identifiers.
- Referenced quiz and question records must exist.
- Submitted questions must belong to the relevant quiz.

### 9.2 HTTP Status Codes

| Status Code | Meaning | Example |
|---|---|---|
| `200 OK` | Request completed successfully | Retrieve quiz or submit answers |
| `201 Created` | Resource created successfully | Create a quiz |
| `400 Bad Request` | Invalid request or business rule violation | Invalid submission |
| `401 Unauthorized` | Authentication is missing or invalid | Invalid access token |
| `403 Forbidden` | User lacks permission | Student attempts an admin-only operation |
| `404 Not Found` | Resource does not exist | Unknown quiz ID |
| `422 Unprocessable Entity` | Request data fails validation | Missing or invalid required fields |
| `500 Internal Server Error` | Unexpected server-side failure | Unhandled backend error |

The final implementation may use different status codes where appropriate, provided the behavior is consistent and documented.

### 9.3 Error Response Example

```json
{
  "detail": "Quiz not found"
}
```

The frontend will display a useful error message to the user. Unexpected internal errors must not reveal sensitive implementation details.

---

## 10. Frontend Design

### 10.1 Main Components

The proposed frontend components are:

- `QuizCard`: Displays a quiz summary.
- `QuestionCard`: Displays a question and answer options.
- `UserForm`: Collects user input when needed.
- `HomePage`: Displays available quizzes.
- `QuizPage`: Handles quiz participation.
- `ResultPage`: Displays score and percentage.
- `DashboardPage`: Displays user information and attempt history in Beta.

The final component list may change during implementation.

### 10.2 API Service Layer

API calls will be organized in a shared service module, such as `services/api.ts`, rather than being duplicated across multiple components.

The service layer will handle:

- Sending HTTP requests.
- Encoding JSON request bodies.
- Processing JSON responses.
- Handling failed requests.
- Attaching authentication credentials to protected requests in Beta.

### 10.3 User Interface Behavior

The interface should provide:

- Loading indicators during requests.
- Clear validation and error messages.
- A clear quiz submission action.
- A result view after successful submission.
- Accessible form labels and controls.
- A usable layout on common desktop and mobile screen sizes.

---

## 11. Testing Strategy

Testing will be performed throughout development.

### 11.1 Backend Testing

The proposed backend testing framework is Pytest.

Planned tests:

- Verify that quiz endpoints return expected responses.
- Verify quiz and question creation and validation.
- Verify correct score calculation.
- Verify incorrect answers are not counted as correct.
- Verify nonexistent quiz and question IDs are handled.
- Verify malformed submissions are rejected.
- Test authentication and role permissions in Beta.
- Verify students cannot access restricted administrative endpoints.

### 11.2 Frontend Testing

Frontend tests will verify:

- Quiz lists render correctly.
- Questions and answer options are displayed.
- Users can select answers.
- Submission results are displayed.
- Loading and error states are handled.
- Protected interfaces behave appropriately in Beta.

### 11.3 Integration Testing

Integration tests will verify that the frontend and backend work together through the REST API.

Examples:

- Retrieve quizzes and display them in the interface.
- Submit selected answers and display the backend-calculated result.
- Verify that invalid requests show understandable errors.
- Verify that protected requests are rejected when credentials or permissions are insufficient in Beta.

### 11.4 Release Acceptance Checks

**MVP acceptance checks:**

- The frontend and backend run locally.
- Quiz data can be retrieved through the API.
- Required quiz and question operations work.
- Quiz answers can be submitted.
- Scores are calculated by the backend.
- Validation and basic error handling work.

**Beta acceptance checks:**

- Registration and login work.
- Protected API endpoints validate authentication.
- Student and Admin permissions are enforced.
- Users can view their own profile and attempt history.
- Security and integration tests pass.
- The application is deployed to the selected hosting environment.

**Status:** These are planned tests and acceptance criteria, not claims that the tests have already passed.

---

## 12. Deployment Strategy

### 12.1 MVP Deployment

The MVP will be developed and tested locally.

Planned steps:

1. Set up the required Python environment.
2. Install backend dependencies.
3. Configure and start the database.
4. Start the FastAPI server.
5. Install frontend dependencies.
6. Start the React development server.
7. Verify API communication and core quiz functionality.

### 12.2 Beta Deployment

**Status:** Planned.

The Beta release will be prepared for deployment to a suitable hosting environment.

Planned steps:

1. Select hosting providers for the frontend and backend.
2. Configure the production database.
3. Set required environment variables and secrets.
4. Configure frontend-to-backend API communication.
5. Configure production CORS settings and HTTPS.
6. Apply database migrations if a migration tool is used.
7. Run automated tests.
8. Deploy the frontend and backend.
9. Verify authentication, permissions, and core features in the deployed application.

The final hosting providers and deployment commands will be documented after they are selected.

---

## 13. Release Plan

### 13.1 MVP — Mid-term Release

The MVP focuses on the core quiz experience and the REST API.

Planned scope:

- React and TypeScript frontend.
- FastAPI and Python backend.
- Quiz listing and detail retrieval.
- Quiz and question CRUD operations.
- Answer submission.
- Backend score calculation.
- Basic validation and error handling.
- Local development and testing.

### 13.2 Beta — Final Release

The Beta release extends the MVP with user accounts, access controls, and deployment.

Planned scope:

- User registration and login.
- Authentication and signed access tokens.
- Student and Admin roles.
- RBAC and security scopes/permissions.
- User profile and dashboard.
- Quiz attempt history.
- Authorized administrative user management.
- Expanded automated tests.
- Deployment to a selected hosting environment.

**Release rule:** A feature should be marked *Implemented* only after the relevant code exists and its behavior has been verified. Otherwise, retain the *Planned* status.

---

## 14. Assumptions and Technical Decisions

The following decisions remain subject to confirmation during development:

1. The exact database and ORM.
2. The final frontend and backend folder structure.
3. The final API request and response schemas.
4. The authentication and token configuration.
5. The exact permission and scope names.
6. The selected deployment platform.
7. Whether quiz attempts will store only aggregate scores or detailed answer history.

The design will be updated if the implementation or instructor's requirements change.

---

## 15. Conclusion

This document defines a proposed technical design for Quiz Game using React, TypeScript, FastAPI, Python, and REST APIs.

The MVP will focus on core quiz operations and backend score calculation. The Beta release will introduce authentication, authorization, RBAC, security scopes/permissions, user dashboards, expanded testing, and deployment.

The design will serve as a reference during implementation and will be updated to reflect verified technical decisions and completed features.

