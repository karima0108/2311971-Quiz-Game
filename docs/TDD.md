
# Technical Design Document (TDD)
## Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Project Type | Web-Based Quiz Management and Assessment System |
| Document Type | Technical Design Document |
| Version | MVP and Beta |
| Frontend | React 19, TypeScript 7, Vite 8 |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | SQLite (local development) / PostgreSQL (deployment) |
| Authentication | JWT, Refresh Tokens |
| Password Hashing | Argon2 with Password Pepper |
| Testing | Pytest |
| API Documentation | `/api/docs` |
| Repository | https://github.com/karima0108/2311971-Quiz-Game |

---

# 1. Introduction

## 1.1 Purpose

The purpose of this Technical Design Document (TDD) is to describe the technical architecture, system components, database design, API structure, security mechanisms, and development approach of the Quiz Game application.

This document covers both MVP and Beta releases.

The MVP establishes the core quiz and question management functionality. The Beta release extends the system with authentication, role-based access control, administrative features, student functionality, group management, session management, and audit logging.

## 1.2 Project Overview

The Quiz Game is a web-based application that allows users to manage quizzes and questions and provides additional administrative and student functionalities.

The application follows a client-server architecture.

The frontend is developed using React and TypeScript. The backend is developed using Python and FastAPI. SQLAlchemy is used for database operations.

The system is divided into two development releases:

### MVP (Mid-term Release)

The MVP focuses on:
- Quiz creation.
- Quiz retrieval.
- Quiz updating.
- Quiz deletion.
- Question creation.
- Question retrieval.
- Question updating.
- Question deletion.
- Request validation.
- REST API development.
- Backend health checking.

### Beta (Final Release)

The Beta release extends the MVP with:
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Refresh token management.
- Role-Based Access Control.
- Admin dashboard.
- Admin account management.
- User management.
- Student profile management.
- Student quiz attempts and results.
- Group and membership management.
- Group-based permissions.
- Session management.
- Audit logging.

## 1.3 Design Goals

The main technical design goals are:

- Maintain a modular application structure.
- Separate frontend and backend responsibilities.
- Provide reusable API communication.
- Maintain database consistency.
- Implement secure authentication and authorization.
- Support future feature expansion.
- Keep the codebase maintainable and testable.

---

# 2. System Architecture

## 2.1 Architecture Overview

The application follows a three-layer client-server architecture.

### Presentation Layer

The presentation layer is developed using:
- React.
- TypeScript.
- Vite.
- React components.
- Authentication context.
- API service module.

It handles user interactions and displays application data.

### Application Layer

The application layer is developed using:
- Python.
- FastAPI.
- SQLAlchemy.
- Pydantic.
- Backend routers.
- Service modules.
- Authentication and authorization dependencies.

It handles API requests, validation, business logic, authentication, authorization, and database communication.

### Data Layer

The data layer uses a relational database.

- SQLite is used as the local development fallback.
- PostgreSQL is used when configured for deployment.
- SQLAlchemy manages database models and operations.

## 2.2 High-Level Architecture

```text
+--------------------------------------------------+
|                 Client Browser                   |
|                                                  |
|  +--------------------------------------------+  |
|  |         React + TypeScript Frontend        |  |
|  |                                            |  |
|  |  Pages / Components / AuthContext          |  |
|  |                                            |  |
|  |  API Service (src/services/api.ts)          |  |
|  +--------------------------------------------+  |
+-------------------------+------------------------+
                          |
                          | HTTP / REST API
                          | JSON Requests
                          v
+--------------------------------------------------+
|                  FastAPI Backend                 |
|                                                  |
|  +--------------------------------------------+  |
|  |                API Routers                 |  |
|  |                                            |  |
|  | Auth | Quizzes | Admin | Groups | Attempts  |  |
|  | Audit Logs | User Management                |  |
|  +--------------------------------------------+  |
|                          |                       |
|  +--------------------------------------------+  |
|  |       Authentication and Authorization     |  |
|  |                                            |  |
|  | JWT | Password Hashing | RBAC | Permissions |  |
|  +--------------------------------------------+  |
|                          |                       |
|  +--------------------------------------------+  |
|  |             Service Layer                   |  |
|  |                                            |  |
|  | Quiz Service | Attempt Service              |  |
|  +--------------------------------------------+  |
|                          |                       |
|  +--------------------------------------------+  |
|  |        SQLAlchemy Models and Schemas        |  |
|  +--------------------------------------------+  |
+-------------------------+------------------------+
                          |
                          | SQLAlchemy
                          v
+--------------------------------------------------+
|               Relational Database               |
|                                                  |
|       SQLite / PostgreSQL (Supabase)             |
+--------------------------------------------------+
```

## 2.3 Request Processing Workflow

A typical request follows this process:

1. The user performs an action through the frontend.
2. The React component calls the API service.
3. The API service sends an HTTP request to the FastAPI backend.
4. FastAPI identifies the appropriate router.
5. Pydantic validates incoming request data where applicable.
6. Authentication and authorization dependencies run when required.
7. The router performs the required operation or calls a service module.
8. SQLAlchemy communicates with the database.
9. The backend returns a JSON response.
10. The frontend updates the interface based on the response.

## 2.4 MVP and Beta Architecture

The MVP uses the same basic client-server architecture but focuses on quiz and question management.

The Beta release retains the existing architecture and adds:

- Authentication router.
- Admin routers.
- User management router.
- Group management router.
- Student attempt router.
- Audit log router.
- Authentication and authorization dependencies.
- Security utilities.
- Additional database models.
- Service modules for application operations.

---

# 3. Technology Stack

## 3.1 MVP Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Programming Language | TypeScript | Frontend development |
| Build Tool | Vite | Frontend development and build |
| Backend | FastAPI | REST API |
| Backend Language | Python | Server-side development |
| ORM | SQLAlchemy | Database operations |
| Validation | Pydantic | Request and response validation |
| Database | SQLite / PostgreSQL | Data storage |
| API Documentation | Swagger UI / OpenAPI | API testing and documentation |

## 3.2 Beta Technology Stack

The Beta release retains the MVP technology stack and adds the following:

| Component | Technology | Purpose |
|---|---|---|
| Authentication | PyJWT | JWT generation and validation |
| Password Hashing | pwdlib | Password hashing and verification |
| Hashing Algorithm | Argon2 | Secure password hashing |
| Password Protection | HMAC-SHA256 Pepper | Additional password protection |
| Session Management | SQLAlchemy | Refresh session storage |
| Testing | Pytest | Automated backend testing |
| Database Driver | Psycopg | PostgreSQL connectivity |

## 3.3 Frontend Dependencies

The frontend uses:
- React.
- React DOM.
- TypeScript.
- Vite.

The frontend development and production build scripts are maintained in `package.json`.

## 3.4 Backend Dependencies

The backend uses:
- FastAPI.
- SQLAlchemy.
- Psycopg Binary.
- pwdlib with Argon2.
- PyJWT.
- Pytest for development testing.

---

# 4. Project Structure

## 4.1 Overall Project Structure

```text
2311971-Quiz-Game/
|
|-- frontend/
|   |
|   |-- src/
|   |   |
|   |   |-- components/
|   |   |   |-- AdminDashboard.tsx
|   |   |   |-- AdminManagement.tsx
|   |   |   |-- AuditLogs.tsx
|   |   |   |-- GroupManagement.tsx
|   |   |   |-- LoginForm.tsx
|   |   |   |-- QuestionManager.tsx
|   |   |   |-- QuizForm.tsx
|   |   |   |-- QuizList.tsx
|   |   |   |-- StudentAttemptHistory.tsx
|   |   |   |-- StudentGroups.tsx
|   |   |   |-- StudentProfile.tsx
|   |   |   |-- StudentQuizAttempt.tsx
|   |   |   |-- UserManagement.tsx
|   |   |
|   |   |-- context/
|   |   |   |-- AuthContext.tsx
|   |   |
|   |   |-- services/
|   |   |   |-- api.ts
|   |   |
|   |   |-- types/
|   |   |   |-- attempt.ts
|   |   |   |-- auditLog.ts
|   |   |   |-- quiz.ts
|   |   |
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- index.css
|   |
|   |-- package.json
|   |-- tsconfig.json
|   |-- vite.config.ts
|
|-- backend/
|   |
|   |-- routers/
|   |   |-- admin.py
|   |   |-- admin_dashboard.py
|   |   |-- admin_users.py
|   |   |-- attempts.py
|   |   |-- audit_logs.py
|   |   |-- auth.py
|   |   |-- groups.py
|   |   |-- quizzes.py
|   |
|   |-- services/
|   |   |-- attempt_service.py
|   |   |-- quiz_service.py
|   |
|   |-- tests/
|   |   |-- conftest.py
|   |   |-- test_admin_user_management.py
|   |   |-- test_audit_logs.py
|   |   |-- test_auth_security.py
|   |   |-- test_groups.py
|   |   |-- test_rbac.py
|   |   |-- test_security.py
|   |
|   |-- auth_config.py
|   |-- create_admin.py
|   |-- database.py
|   |-- dependencies.py
|   |-- jwt_handler.py
|   |-- main.py
|   |-- migrations.py
|   |-- models.py
|   |-- schemas.py
|   |-- schemas_attempt.py
|   |-- security.py
|   |-- requirements.txt
|   |-- requirements-dev.txt
|
|-- docs/
|   |-- PRD.md
|   |-- SRS.md
|   |-- TDD.md
|
|-- README.md
```

The project structure above excludes environment files, virtual environments, generated database files, and temporary backup files.

## 4.2 Frontend Responsibilities

### components/

Contains reusable user interface components for:
- Quiz management.
- Question management.
- Admin dashboard.
- User management.
- Group management.
- Student functionality.
- Audit logs.

### context/

Contains shared application context.

`AuthContext.tsx` manages frontend authentication-related state and information.

### services/

`api.ts` centralizes communication with the backend API.

### types/

Contains TypeScript type definitions for quiz, attempt, and audit log data.

## 4.3 Backend Responsibilities

### routers/

Contains FastAPI route modules grouped by application functionality.

### services/

Contains reusable business logic.

### tests/

Contains automated backend tests.

### models.py

Defines SQLAlchemy database models.

### schemas.py and schemas_attempt.py

Define Pydantic schemas used for request and response validation.

### database.py

Configures the SQLAlchemy database connection and session management.

### dependencies.py

Contains authentication and authorization dependencies.

### security.py

Handles password hashing and verification.

### jwt_handler.py

Handles JWT creation and verification.

### auth_config.py

Contains authentication configuration.

### migrations.py

Contains database migration and compatibility helpers.

---

# 5. Database Design

## 5.1 Database Overview

The application uses SQLAlchemy ORM for database operations.

The database configuration supports:
- SQLite as a local development fallback.
- PostgreSQL when a database URL is configured.

The system uses relational tables and foreign-key relationships to maintain data consistency.

## 5.2 MVP Database Models

### 5.2.1 Quiz

The Quiz model stores quiz information.

| Field | Description |
|---|---|
| id | Primary key |
| title | Quiz title |
| description | Quiz description |
| is_published | Publication status |
| created_at | Creation timestamp |

The Quiz model has a one-to-many relationship with Question.

### 5.2.2 Question

The Question model stores quiz questions.

| Field | Description |
|---|---|
| id | Primary key |
| quiz_id | Foreign key referencing Quiz |
| question_text | Question content |
| options | Answer options stored as JSON |
| correct_option | Index of the correct answer |

Each Question belongs to one Quiz.

## 5.3 Beta Database Models

The Beta release extends the database with additional models.

### 5.3.1 User

The User model stores registered user information.

| Field | Description |
|---|---|
| id | Primary key |
| email | Unique email address |
| name | User name |
| hashed_password | Secure password hash |
| role | User role |
| is_active | Account status |
| is_banned | Ban status |
| ban_reason | Reason for banning |
| banned_at | Ban timestamp |
| banned_by | ID of the administrator who banned the user |
| created_at | Account creation timestamp |

Supported primary roles:
- `admin`
- `user`

The frontend identifies regular users as Students.

### 5.3.2 RefreshSession

The RefreshSession model stores refresh session information.

| Field | Description |
|---|---|
| id | Primary key |
| user_id | Foreign key referencing User |
| token_hash | Unique hashed refresh token |
| created_at | Session creation timestamp |
| expires_at | Session expiration timestamp |
| revoked_at | Session revocation timestamp |
| replaced_by_token_hash | Replacement token hash |

Refresh token values are stored as hashes rather than raw tokens.

### 5.3.3 QuizAttempt

The QuizAttempt model stores submitted quiz attempts.

| Field | Description |
|---|---|
| id | Primary key |
| user_id | Foreign key referencing User |
| quiz_id | Foreign key referencing Quiz |
| score | Calculated score |
| total_questions | Total number of questions |
| correct_answers | Number of correct answers |
| submitted_at | Submission timestamp |

### 5.3.4 QuizAnswer

The QuizAnswer model stores individual submitted answers.

| Field | Description |
|---|---|
| id | Primary key |
| attempt_id | Foreign key referencing QuizAttempt |
| question_id | Foreign key referencing Question |
| selected_option | Selected answer index |
| is_correct | Whether the selected answer is correct |

### 5.3.5 Group

The Group model stores group information.

| Field | Description |
|---|---|
| id | Primary key |
| name | Unique group name |
| description | Group description |
| owner_id | Foreign key referencing User |
| created_at | Creation timestamp |

### 5.3.6 GroupMembership

The GroupMembership model manages group membership.

| Field | Description |
|---|---|
| group_id | Foreign key referencing Group |
| user_id | Foreign key referencing User |
| created_at | Membership creation timestamp |

A unique constraint prevents duplicate membership for the same user and group.

### 5.3.7 GroupPermission

The GroupPermission model stores group-level permissions.

| Field | Description |
|---|---|
| group_id | Foreign key referencing Group |
| permission | Permission name |
| created_at | Creation timestamp |

A unique constraint prevents duplicate permissions within the same group.

### 5.3.8 AuditLog

The AuditLog model stores important system activities.

| Field | Description |
|---|---|
| id | Primary key |
| actor_id | Foreign key referencing User |
| action | Activity type |
| target_type | Type of affected resource |
| target_id | Identifier of affected resource |
| description | Activity description |
| details | Additional JSON information |
| ip_address | Request IP address |
| created_at | Activity timestamp |

## 5.4 Database Relationships

The main database relationships are:

- One Quiz can contain multiple Questions.
- One User can have multiple RefreshSessions.
- One User can have multiple QuizAttempts.
- One Quiz can have multiple QuizAttempts.
- One QuizAttempt can contain multiple QuizAnswers.
- One Group can have multiple GroupMembership records.
- One User can belong to multiple Groups.
- One Group can have multiple GroupPermission records.
- One User can generate multiple AuditLog records.

## 5.5 Data Integrity

The database uses:
- Primary keys.
- Foreign keys.
- Unique constraints.
- Indexed columns where appropriate.
- Cascade behavior for related records where configured.

The system uses database relationships to maintain consistency when records are created, updated, or deleted.

---

# 6. Backend Design

## 6.1 Backend Architecture

The backend is developed using FastAPI.

The application separates API endpoints into router modules and uses SQLAlchemy for database access.

The backend is responsible for:
- Receiving API requests.
- Validating request data.
- Processing business logic.
- Authentication.
- Authorization.
- Database operations.
- Returning JSON responses.

## 6.2 MVP Backend Modules

### Quiz Router

The quiz router handles:
- Creating quizzes.
- Retrieving quizzes.
- Updating quizzes.
- Deleting quizzes.
- Retrieving quiz management information.

### Question Management

The question endpoints handle:
- Adding questions.
- Retrieving questions.
- Updating questions.
- Deleting questions.

### Database Module

The database module:
- Reads the database URL from environment configuration.
- Supports SQLite fallback.
- Supports PostgreSQL through Psycopg.
- Creates SQLAlchemy engine and database sessions.

## 6.3 Beta Backend Modules

### Authentication Router

`routers/auth.py` handles:
- User registration.
- Login.
- Current user profile retrieval.
- Profile updates.
- Password changes.
- Token refresh.
- Logout.
- Session retrieval.
- Session revocation.
- Demo login.

### Admin Router

`routers/admin.py` handles administrator account management.

### Admin Dashboard Router

`routers/admin_dashboard.py` provides dashboard statistics.

### Admin User Management Router

`routers/admin_users.py` handles:
- User retrieval.
- User searching.
- Account status updates.
- Role updates.
- User banning.
- User unbanning.
- Bulk banning.
- Bulk unbanning.

### Group Router

`routers/groups.py` handles both administrative and student group operations.

### Attempt Router

`routers/attempts.py` handles student quiz attempt submission and personal attempt history.

### Audit Log Router

`routers/audit_logs.py` handles audit log retrieval.

## 6.4 Service Layer

The service layer separates reusable business logic from API route definitions.

### quiz_service.py

Contains quiz-related business logic.

### attempt_service.py

Handles:
- Quiz availability checks.
- Question retrieval.
- Submission validation.
- Answer correctness checking.
- Score calculation.
- Attempt persistence.
- Attempt history retrieval.

## 6.5 Main Application

`main.py` initializes the FastAPI application.

It is responsible for:
- Creating the application instance.
- Configuring CORS.
- Initializing database metadata.
- Running the group owner migration helper.
- Registering application routers.
- Providing root and health endpoints.
- Configuring API documentation.

---

# 7. REST API Design

The application exposes REST APIs through FastAPI.

API requests and responses use JSON where applicable.

## 7.1 MVP Quiz APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quizzes` | Retrieve quizzes |
| GET | `/api/quizzes/{quiz_id}` | Retrieve individual quiz |
| GET | `/api/quizzes/{quiz_id}/management` | Retrieve quiz management information |
| POST | `/api/quizzes` | Create quiz |
| PATCH | `/api/quizzes/{quiz_id}` | Update quiz |
| DELETE | `/api/quizzes/{quiz_id}` | Delete quiz |

## 7.2 MVP Question APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quizzes/{quiz_id}/questions` | Add a question |
| GET | `/api/questions/{question_id}` | Retrieve a question |
| PATCH | `/api/questions/{question_id}` | Update a question |
| DELETE | `/api/questions/{question_id}` | Delete a question |

## 7.3 Beta Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Retrieve current user |
| PATCH | `/api/auth/me` | Update current user |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/refresh` | Refresh access authentication |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/sessions` | Retrieve active sessions |
| DELETE | `/api/auth/sessions/{session_id}` | Revoke one session |
| DELETE | `/api/auth/sessions` | Revoke all sessions |
| POST | `/api/auth/demo-login/{role}` | Demo login for an allowed role |

## 7.4 Beta Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admins` | Retrieve administrator accounts |
| POST | `/api/admins` | Create administrator |
| DELETE | `/api/admins/{admin_id}` | Delete administrator |
| GET | `/api/admin/dashboard/stats` | Retrieve dashboard statistics |

## 7.5 Beta User Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Retrieve or search users |
| GET | `/api/admin/users/{user_id}` | Retrieve user details |
| PATCH | `/api/admin/users/{user_id}/status` | Update account status |
| PATCH | `/api/admin/users/{user_id}/role` | Update role |
| PATCH | `/api/admin/users/{user_id}/ban` | Ban user |
| PATCH | `/api/admin/users/{user_id}/unban` | Unban user |
| POST | `/api/admin/users/bulk-ban` | Bulk ban |
| POST | `/api/admin/users/bulk-unban` | Bulk unban |

## 7.6 Beta Group APIs

### Admin Group APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/groups` | Create group |
| GET | `/api/admin/groups` | Retrieve groups |
| GET | `/api/admin/groups/{group_id}` | Retrieve group details |
| PATCH | `/api/admin/groups/{group_id}` | Update group |
| DELETE | `/api/admin/groups/{group_id}` | Delete group |
| GET | `/api/admin/groups/{group_id}/members` | Retrieve members |
| POST | `/api/admin/groups/{group_id}/members` | Add member |
| DELETE | `/api/admin/groups/{group_id}/members/{user_id}` | Remove member |
| GET | `/api/admin/groups/{group_id}/permissions` | Retrieve permissions |
| POST | `/api/admin/groups/{group_id}/permissions` | Assign permission |
| DELETE | `/api/admin/groups/{group_id}/permissions/{permission}` | Revoke permission |

### Student Group APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/groups` | Create owned group |
| PATCH | `/api/groups/{group_id}` | Update owned group |
| DELETE | `/api/groups/{group_id}` | Delete owned group |
| GET | `/api/groups/{group_id}/members` | Retrieve owned group members |
| POST | `/api/groups/{group_id}/members` | Add member |
| DELETE | `/api/groups/{group_id}/members/{user_id}` | Remove member |
| GET | `/api/groups/me` | Retrieve own groups |
| GET | `/api/groups/me/permissions` | Retrieve own group permissions |
| GET | `/api/groups/resources` | Access permitted group resources |

## 7.7 Beta Student Attempt APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quizzes/{quiz_id}/attempts` | Submit quiz attempt |
| GET | `/api/attempts/me` | Retrieve personal attempt history |

## 7.8 Beta Audit Log APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/audit-logs` | Retrieve audit logs |
| GET | `/api/admin/audit-logs/{log_id}` | Retrieve individual audit log |

## 7.9 API Response and Error Handling

The backend returns JSON responses with appropriate HTTP status codes.

Common status codes:

| Status Code | Description |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required or invalid credentials |
| 403 | Access forbidden |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation error |
| 500 | Internal server error |

---

# 8. Frontend Design

## 8.1 Frontend Architecture

The frontend is developed using React and TypeScript.

The application uses reusable components to separate individual interface responsibilities.

The API service module centralizes backend communication.

## 8.2 MVP Frontend Design

The MVP frontend focuses on:
- Quiz listing.
- Quiz creation.
- Quiz editing.
- Quiz deletion.
- Question management.
- API response handling.
- Input validation feedback.

## 8.3 Beta Frontend Design

The Beta release extends the frontend with the following components.

### Authentication

`LoginForm.tsx` provides the login interface.

`AuthContext.tsx` manages shared authentication-related state.

### Admin Dashboard

`AdminDashboard.tsx` displays administrative statistics.

### Admin Management

`AdminManagement.tsx` provides administrator management functionality.

### User Management

`UserManagement.tsx` provides user search and account management interfaces.

### Quiz and Question Management

`QuizList.tsx`, `QuizForm.tsx`, and `QuestionManager.tsx` handle quiz and question operations.

### Group Management

`GroupManagement.tsx` and `StudentGroups.tsx` provide group-related interfaces.

### Student Features

The following components support student functionality:
- `StudentQuizAttempt.tsx`
- `StudentAttemptHistory.tsx`
- `StudentProfile.tsx`

### Audit Logs

`AuditLogs.tsx` displays administrative audit information.

## 8.4 API Communication

The frontend uses `src/services/api.ts` to centralize API requests.

This approach helps:
- Reduce repeated API request code.
- Keep API communication separate from UI components.
- Maintain consistent request handling.
- Simplify future API changes.

---

# 9. Validation and Error Handling

## 9.1 Backend Validation

Pydantic schemas are used to validate incoming request data.

The backend validates:
- Required fields.
- Quiz information.
- Question information.
- User registration data.
- Authentication requests.
- User roles.
- Group information.
- Group membership.
- Group permissions.
- Quiz attempt submissions.

## 9.2 MVP Validation

The MVP focuses on:
- Required quiz fields.
- Question text.
- Answer options.
- Correct option index.
- Quiz and question existence.
- Request body validation.

## 9.3 Beta Validation

The Beta release additionally validates:
- Email normalization.
- Duplicate email registration.
- Password verification.
- Account status.
- Access token validity.
- Refresh session validity.
- Role-based authorization.
- Group ownership.
- Group membership.
- Permission availability.
- Quiz attempt completeness.
- Duplicate submitted question IDs.
- Selected answer option indexes.

## 9.4 Error Handling

The backend returns appropriate HTTP status codes and error messages.

The frontend displays understandable feedback for:
- Invalid input.
- Failed requests.
- Authentication failures.
- Authorization failures.
- Missing resources.
- Database or server errors.

Internal server details and sensitive configuration values should not be exposed to users.

---

# 10. Security Design

## 10.1 MVP Security

The MVP includes basic API request validation and backend error handling.

The backend validates incoming requests before performing database operations.

## 10.2 Beta Authentication

The Beta release implements JWT-based access authentication.

The login process follows these steps:

1. The user submits email and password.
2. The backend retrieves the corresponding user account.
3. The submitted password is verified.
4. The backend checks whether the account is active and not banned.
5. The backend generates an access JWT.
6. A refresh session is created.
7. The refresh token is stored as a hash in the database.
8. The refresh token is delivered through an HttpOnly cookie.

The access token is used as a bearer token for protected API requests.

## 10.3 Password Hashing

The system uses pwdlib with Argon2 password hashing.

A server-side password pepper is applied using HMAC-SHA256 before hashing.

The password verification process supports legacy Argon2 hashes and can upgrade them to the peppered hash format.

Raw passwords are not stored in the database.

## 10.4 JWT Security

The `jwt_handler.py` module handles JWT creation and verification.

The access token includes relevant authentication claims, such as:
- User subject.
- User ID.
- Email.
- Role.
- Session identifier.
- Expiration time.

The backend validates the token before allowing protected operations.

## 10.5 Refresh Token Security

The refresh token system:
- Generates cryptographically secure random tokens.
- Stores token hashes in the database.
- Uses an HttpOnly cookie.
- Uses a seven-day refresh session expiration.
- Rotates refresh tokens during refresh operations.
- Revokes the previous refresh session.
- Supports individual session revocation.
- Supports revocation of all active sessions.

In production:
- The refresh cookie uses the Secure attribute.
- SameSite is configured as None.
- The cookie is restricted to the authentication API path.

## 10.6 Role-Based Access Control

The system supports two primary roles:

- Admin
- User (Student)

The `dependencies.py` module provides authorization dependencies.

### get_current_user

Validates the access token, session, and user account status.

### require_admin

Allows access only to Admin users.

### require_student

Allows access to regular user accounts.

### get_optional_user

Provides optional authenticated user information where supported.

### require_permission

Checks group membership and the requested group-level permission.

Admin users can bypass group-level permission checks where applicable.

## 10.7 Account Protection

The system checks:
- Whether the account is active.
- Whether the account is banned.
- Whether the session is valid.
- Whether the user has the required role.
- Whether the user has the required group permission.

Unauthorized requests are rejected by the backend.

## 10.8 Environment Configuration

Sensitive configuration values are managed through environment variables.

Examples include:
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `PASSWORD_PEPPER`
- `FRONTEND_URL`
- Authentication configuration values.

Environment files and secret values must not be committed to the public repository.

---

# 11. Testing Strategy

## 11.1 MVP Testing

The MVP testing focuses on core quiz functionality.

The following operations are tested:
- Quiz creation.
- Quiz retrieval.
- Quiz updating.
- Quiz deletion.
- Question creation.
- Question retrieval.
- Question updating.
- Question deletion.
- Input validation.
- Health endpoint.
- API response correctness.

## 11.2 Beta Backend Testing

The Beta release extends testing to:
- User registration.
- Login and authentication.
- Password hashing and verification.
- JWT validation.
- Refresh token rotation.
- Session revocation.
- Role-based access control.
- Admin user management.
- Group management.
- Group permission enforcement.
- Audit logging.
- Student quiz attempts.
- Result calculation.

## 11.3 Automated Testing

The backend uses pytest for automated testing.

Current backend test modules include:

| Test File | Testing Area |
|---|---|
| `test_auth_security.py` | Authentication security |
| `test_security.py` | Password and security functionality |
| `test_rbac.py` | Role-based access control |
| `test_admin_user_management.py` | Admin user management |
| `test_groups.py` | Group management |
| `test_audit_logs.py` | Audit log functionality |

`conftest.py` provides shared test configuration and fixtures.

## 11.4 Frontend Testing

Frontend functionality should be checked for:
- Component rendering.
- User interactions.
- API communication.
- Authentication state.
- Role-based navigation.
- Form validation.
- Success and error feedback.

## 11.5 Integration Testing

Integration testing verifies communication between:
- Frontend and backend.
- Backend and database.
- Authentication and protected endpoints.
- Admin functionality and authorization dependencies.
- Student quiz submission and result storage.
- Group membership and permission checks.

## 11.6 Manual API Testing

FastAPI Swagger documentation can be used to test API endpoints.

The documentation is available at:

`http://127.0.0.1:8000/api/docs`

---

# 12. Deployment Strategy

## 12.1 Development Environment

### Backend

The backend can be started locally using:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
fastapi dev main.py
```

The backend development server runs at:

`http://127.0.0.1:8000`

### Frontend

The frontend can be started using:

```powershell
cd frontend
npm install
npm run dev
```

The frontend development server runs at:

`http://localhost:5173`

## 12.2 Database Configuration

The database connection is configured through the `DATABASE_URL` environment variable.

When no database URL is provided, the backend uses its SQLite fallback.

For deployment, PostgreSQL can be configured through the environment.

The PostgreSQL connection uses the Psycopg driver.

## 12.3 Production Configuration

The production environment requires appropriate configuration for:
- Database connection.
- JWT secret.
- Password pepper.
- Frontend origin.
- Production cookie security settings.

Sensitive environment variables must be configured through the deployment platform rather than committed to source control.

## 12.4 API Documentation

The backend provides:
- Swagger UI at `/api/docs`.
- ReDoc at `/api/redoc`.
- OpenAPI JSON at `/api/openapi.json`.

These interfaces can be used for API inspection and testing.

---

# 13. Version Control and Development Workflow

## 13.1 Version Control

Git is used for source code version control.

GitHub hosts the project repository.

Repository:

`https://github.com/karima0108/2311971-Quiz-Game`

## 13.2 Branching Strategy

Feature development uses separate branches.

Branches should follow an issue-numbered naming convention.

Example:

```text
feat/#5-quiz-management
feat/#8-admin-auth-rbac
```

## 13.3 Development Workflow

The development workflow follows these steps:

1. Select or create a GitHub issue.
2. Create a feature branch from the updated main branch.
3. Implement the required feature.
4. Test the implementation locally.
5. Review changed files.
6. Commit the changes with a meaningful message.
7. Push the feature branch.
8. Open a Pull Request.
9. Review and merge the changes.

## 13.4 Commit Messages

Commit messages should describe the purpose of the changes.

Examples:

```text
feat: implement quiz management
feat: add admin authentication
feat: implement role-based access control
fix: resolve authentication validation issue
docs: update technical design document
```

## 13.5 Documentation

The project documentation is maintained under the `docs/` directory.

The main documents are:
- `PRD.md`
- `SRS.md`
- `TDD.md`

These documents describe the product requirements, software requirements, and technical design of the project.

---

# 14. Future Improvements

Possible future improvements include:

- More advanced quiz analytics.
- Additional question types.
- Improved reporting and visualization.
- Enhanced quiz customization.
- Improved accessibility.
- Performance optimization.
- Expanded automated test coverage.
- Native mobile application support.
- Multiplayer quiz functionality.
- Additional integrations with external learning platforms.

These improvements are not required for the currently implemented MVP and Beta scope.

---

# 15. Conclusion

This Technical Design Document describes the architecture, technology stack, project structure, database design, backend implementation, API design, frontend structure, security mechanisms, testing strategy, and deployment approach of the Quiz Game application.

The MVP establishes the core quiz and question management system.

The Beta release extends the existing system with authentication, authorization, administrative features, student functionality, quiz attempts, group management, session management, and audit logging.

Together, the MVP and Beta releases provide a modular and maintainable foundation for the Quiz Game application and its future development.
