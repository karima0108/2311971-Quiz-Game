# Technical Design Document (TDD)
## Quiz Game 

**Document Version:** 1.0  
**Status:** Proposed / Planning  
**Project Type:** Solo Course Project

## 1. Technical Overview

Quiz Game will be a web application consisting of a frontend, backend, and database.

- **Frontend:** React.js with TypeScript.
- **Backend:** Python with FastAPI.
- **Database:** SQLite.
- **Communication:** REST APIs using HTTP and JSON.
- **Security:** JWT authentication, RBAC, and security scopes.

The MVP will focus on the core quiz REST APIs. The Beta release will add authentication, authorization, user roles, security scopes, frontend integration, and final testing or deployment.

## 2. System Architecture

### 2.1 Architecture Diagram

```text
User / Web Browser
        |
        v
React.js + TypeScript Frontend
        |
        | HTTP Requests / JSON Responses
        v
FastAPI Backend
        |
        |-- API Routers
        |-- Request and Response Schemas
        |-- Business Logic and Scoring
        |-- Authentication and Authorization (Beta)
        |-- Data Access
        |
        v
SQLite Database
```

### 2.2 Frontend Responsibilities

The React frontend will:

- Display role-appropriate pages and forms.
- Allow users to interact with quizzes and results.
- Communicate with backend endpoints through REST APIs.
- Use TypeScript interfaces for API data.
- Display loading indicators, success messages, and error messages.
- Manage the user's authentication state and send tokens with protected requests.

Frontend restrictions are for usability only. Actual access control will be enforced by the backend.

### 2.3 Backend Responsibilities

The FastAPI backend will:

- Define and expose REST API endpoints.
- Validate incoming requests.
- Apply quiz, question, scoring, and account business rules.
- Read and write data in SQLite.
- Calculate quiz scores on the server.
- Authenticate users and validate JWTs in Beta.
- Enforce roles, security scopes, and resource ownership in Beta.
- Return appropriate HTTP status codes and JSON responses.

### 2.4 Database Responsibilities

SQLite will store quiz information, questions, answer options, users, attempts, and results as required by each release. Relationships and validation rules will help maintain data integrity.

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface |
| Frontend Language | TypeScript | Type-safe frontend development |
| Backend | FastAPI | REST API development |
| Backend Language | Python | Application logic |
| Database | SQLite | Persistent data storage |
| API Format | HTTP and JSON | Frontend-backend communication |
| Authentication | JWT access tokens | User authentication |
| Authorization | RBAC and security scopes | Permission enforcement |
| API Testing | Swagger UI and/or Postman | Endpoint testing |
| Deployment | To be selected | Final demonstration or hosting |

Specific package versions and the deployment provider will be selected during implementation.

## 4. Proposed Project Structure

```text
quiz-game/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── App.tsx
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── models/
│   │   ├── services/
│   │   ├── db/
│   │   └── security/
│   └── tests/
│
└── README.md
```

**Directory purposes:**

- `routers/`: Defines API endpoints.
- `schemas/`: Defines request and response validation schemas.
- `models/`: Defines database models.
- `services/`: Contains business logic, including score calculation.
- `db/`: Contains database configuration and connection logic.
- `security/`: Contains password hashing, JWT validation, and authorization checks.
- `services/` in the frontend: Contains centralized API request functions.
- `types/`: Contains TypeScript interfaces and types.
- `pages/`: Contains the main frontend pages.

This is a proposed structure and may be adjusted during development.

## 5. Database Design

The following entities are planned. Exact database types, constraints, and ORM choices will be finalized during implementation.

### 5.1 Quiz (MVP)

| Field | Description |
|---|---|
| `id` | Primary key |
| `title` | Quiz title |
| `description` | Optional quiz description |
| `is_published` | Indicates whether the quiz is published |
| `created_at` | Creation timestamp |

**Beta addition:** `owner_id`, a foreign key identifying the teacher who owns the quiz.

### 5.2 Question (MVP)

| Field | Description |
|---|---|
| `id` | Primary key |
| `quiz_id` | Foreign key referencing `Quiz.id` |
| `question_text` | Question text |

### 5.3 Option (MVP)

| Field | Description |
|---|---|
| `id` | Primary key |
| `question_id` | Foreign key referencing `Question.id` |
| `option_text` | Answer option text |
| `is_correct` | Backend-only indicator used for score calculation |

For the initial version, each question will have one correct option.

### 5.4 User (Beta)

| Field | Description |
|---|---|
| `id` | Primary key |
| `name` | User's display name |
| `email` | Unique login identifier |
| `password_hash` | Securely hashed password |
| `role` | `student`, `teacher`, or `admin` |
| `is_active` | Indicates whether the account is active |
| `created_at` | Account creation timestamp |

### 5.5 Attempt (Beta)

| Field | Description |
|---|---|
| `id` | Primary key |
| `quiz_id` | Foreign key referencing `Quiz.id` |
| `student_id` | Foreign key referencing `User.id` |
| `score` | Score calculated by the backend |
| `total_questions` | Number of questions included in scoring |
| `submitted_at` | Submission timestamp |

### 5.6 AttemptAnswer (Beta)

| Field | Description |
|---|---|
| `id` | Primary key |
| `attempt_id` | Foreign key referencing `Attempt.id` |
| `question_id` | Foreign key referencing `Question.id` |
| `selected_option_id` | Foreign key referencing `Option.id` |

### 5.7 Data Integrity Rules

- Each question must belong to an existing quiz.
- Each option must belong to an existing question.
- A submitted option must belong to the question being answered.
- Each MCQ must have one correct option.
- In Beta, each quiz must have an owner.
- In Beta, each attempt must be associated with the authenticated student.
- The backend must verify user identity before returning personal results.
- Correct-option information must not be exposed in student-facing quiz responses before submission.

## 6. REST API Design

The proposed base path is `/api`. These endpoints describe the planned API and should be updated if the implementation changes.

### 6.1 MVP Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check API availability |
| `POST` | `/api/quizzes` | Create a quiz |
| `GET` | `/api/quizzes` | List quizzes |
| `GET` | `/api/quizzes/{quiz_id}` | Retrieve quiz details |
| `PUT` | `/api/quizzes/{quiz_id}` | Update a quiz |
| `DELETE` | `/api/quizzes/{quiz_id}` | Delete a quiz |
| `GET` | `/api/quizzes/{quiz_id}/questions` | List questions in a quiz |
| `POST` | `/api/quizzes/{quiz_id}/questions` | Add a question and its options |
| `PUT` | `/api/questions/{question_id}` | Update a question and/or its options |
| `DELETE` | `/api/questions/{question_id}` | Delete a question |
| `POST` | `/api/quizzes/{quiz_id}/attempts` | Submit answers and calculate a score |

The MVP is intended for local development and assessment. Its endpoints must not be considered production-secure until the Beta authorization controls are implemented.

### 6.2 Beta Authentication Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a student account | Public |
| `POST` | `/api/auth/token` | Authenticate and issue a JWT | Public |
| `GET` | `/api/auth/me` | Retrieve the current user's profile | Authenticated user |

Public registration will create Student accounts by default. Teacher and Admin roles will be assigned through an authorized process rather than accepting privileged roles from public registration requests.

### 6.3 Beta Quiz and Result Endpoints

| Method | Endpoint | Purpose | Required Access |
|---|---|---|---|
| `GET` | `/api/quizzes` | List quizzes visible to the user | Authenticated; filtered by role |
| `POST` | `/api/quizzes` | Create a quiz | Teacher + `quiz:create` |
| `PUT` | `/api/quizzes/{quiz_id}` | Update a quiz | Owning Teacher + `quiz:update_own` |
| `DELETE` | `/api/quizzes/{quiz_id}` | Delete a quiz | Owning Teacher + `quiz:delete_own` |
| `POST` | `/api/quizzes/{quiz_id}/questions` | Add questions/options | Owning Teacher + `question:manage_own` |
| `POST` | `/api/quizzes/{quiz_id}/attempts` | Submit answers | Student + `attempt:submit` |
| `GET` | `/api/results/me` | View personal results | Student + `result:read_own` |
| `GET` | `/api/quizzes/{quiz_id}/results` | View results for an owned quiz | Owning Teacher + `result:read_quiz` |
| `GET` | `/api/admin/users` | List user accounts | Admin + `user:manage` |
| `PATCH` | `/api/admin/users/{user_id}/role` | Assign a user role | Admin + `role:assign` |
| `PATCH` | `/api/admin/users/{user_id}/status` | Activate/deactivate an account | Admin + `user:manage` |

Question update and delete endpoints will also apply the appropriate Beta authorization checks.

## 7. Authentication and Authorization Design (Beta)

### 7.1 Authentication Flow

1. A user submits login credentials.
2. The backend verifies the submitted password against the stored password hash.
3. If the credentials are valid and the account is active, the backend issues a JWT access token with an expiration time.
4. The frontend sends the token in the `Authorization: Bearer <token>` header when calling protected endpoints.
5. The backend validates the token and identifies the current user before processing the request.

The frontend can clear its authentication state on logout. Server-side token revocation is not planned unless required later.

### 7.2 Role-Based Access Control

**Student**
- View published quizzes.
- Submit quiz attempts.
- View personal results.

**Teacher**
- Create quizzes.
- Manage quizzes and questions they own.
- View results for their own quizzes.

**Admin**
- List and manage user accounts.
- Assign roles.
- Activate or deactivate accounts.

### 7.3 Security Scopes

| Scope | Description |
|---|---|
| `quiz:read` | Read quizzes visible to the current user |
| `quiz:create` | Create a quiz |
| `quiz:update_own` | Update a quiz owned by the current user |
| `quiz:delete_own` | Delete a quiz owned by the current user |
| `question:manage_own` | Manage questions/options for an owned quiz |
| `attempt:submit` | Submit a quiz attempt |
| `result:read_own` | Read the current user's results |
| `result:read_quiz` | Read results for an owned quiz |
| `user:manage` | List and manage user accounts |
| `role:assign` | Assign or change user roles |

The backend will use reusable FastAPI dependencies or equivalent authorization checks to enforce roles and scopes. Resource ownership will be checked against the database; a scope alone does not establish ownership.

### 7.4 Security Rules

- Store passwords only as secure hashes.
- Reject missing, invalid, or expired tokens on protected endpoints.
- Return `401 Unauthorized` for unauthenticated requests.
- Return `403 Forbidden` for authenticated users who lack the required permission.
- Never trust a score, role, or answer-correctness value submitted by the frontend.
- Do not expose correct-option indicators before a student submits the quiz.
- Prevent students from accessing other students' results.
- Enforce all authorization rules on the backend, even if the frontend hides restricted controls.

## 8. Quiz Scoring Workflow

1. Receive the quiz ID and selected option IDs.
2. Verify that the quiz exists.
3. Validate that every submitted question belongs to the quiz.
4. Validate that each selected option belongs to its corresponding question.
5. Compare submitted options with the correct options stored in the database.
6. Calculate the score on the backend.
7. In Beta, store the attempt and score with the authenticated student's ID.
8. Return the score and total question count without exposing other users' private information.

## 9. Error Handling

| Condition | Expected HTTP Status |
|---|---|
| Successful read/update | `200 OK` |
| Resource created | `201 Created` |
| Successful deletion without response body | `204 No Content` |
| Resource not found | `404 Not Found` |
| Invalid request data or invalid relationships | `422 Unprocessable Entity` |
| Missing, invalid, or expired token | `401 Unauthorized` (Beta) |
| Insufficient role/scope or failed ownership check | `403 Forbidden` (Beta) |
| Duplicate account email | `409 Conflict` (Beta) |
| Unexpected server error | `500 Internal Server Error` |

Unexpected errors must not expose sensitive implementation details to users.

## 10. Frontend-Backend Integration (Beta)

- Keep API calls in a centralized frontend service/module.
- Define TypeScript interfaces for users, quizzes, questions, options, attempts, and results.
- Configure the backend base URL through an environment variable.
- Use JSON consistently for request and response bodies.
- Send JWTs with protected requests.
- Display loading indicators and success/error messages.
- Use role-aware navigation while relying on backend authorization for actual security.
- Test the frontend workflows against the running FastAPI backend.

## 11. Testing Strategy

### 11.1 MVP Testing

- Test quiz creation, listing, retrieval, updating, and deletion.
- Test question and option management.
- Test valid answer submissions and backend score calculation.
- Test invalid IDs and invalid question-option relationships.
- Test malformed requests and expected error responses.
- Verify that API documentation is available through Swagger UI.

### 11.2 Beta Testing

- Test successful and unsuccessful registration and login.
- Test missing, invalid, and expired tokens.
- Verify that each role can access only its permitted operations.
- Verify that a teacher cannot modify another teacher's quiz.
- Verify that a student cannot access another student's results.
- Verify that correct answers are not exposed before submission.
- Verify that the frontend handles successful responses and API errors.
- Test the integrated application in the selected final environment.

## 12. Implementation Plan

### 12.1 MVP — Mid-term

1. Create the FastAPI application and configure SQLite.
2. Define quiz, question, and option schemas/models.
3. Implement quiz CRUD endpoints.
4. Implement question and option management.
5. Implement answer submission and backend score calculation.
6. Test the APIs locally using Swagger UI or Postman.

### 12.2 Beta — Final

1. Add the user model, registration, login, password hashing, and JWT validation.
2. Add roles, scopes, and reusable authorization checks.
3. Add quiz ownership and result privacy rules.
4. Add attempt/result persistence and admin user-management endpoints.
5. Build the React.js frontend with TypeScript.
6. Integrate frontend pages with the FastAPI REST APIs.
7. Run functional, integration, and permission tests.
8. Deploy the application or prepare a reproducible final demonstration.

## 13. Design Decisions and Limitations

- The initial version supports MCQs with one correct option per question.
- SQLite is selected to keep development and local testing simple.
- The MVP prioritizes core API functionality.
- The Beta completes the required authentication, authorization, RBAC, security scopes, and frontend-backend integration.
- AI, ML, LLM/RAG, payment processing, live multiplayer, and advanced proctoring are excluded.
- This document describes the proposed design and will be updated if implementation decisions materially change.

