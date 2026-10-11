# Software Requirements Specification (SRS)
## Quiz Game 

**Document Version:** 1.0  
**Status:** Proposed / Planning  
**Project Type:** Solo Course Project

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements of Quiz Game. It defines the expected behavior of the MVP and Beta releases and provides a basis for implementation and testing.

### 1.2 Scope

Quiz Game is a web-based application for quiz creation, question management, quiz attempts, score calculation, and user management. The frontend will use React.js with TypeScript, and the backend will use FastAPI with Python. The system will use REST APIs for communication and SQLite for data storage.

Authentication, authorization, role-based access control (RBAC), and security scopes will be implemented to protect restricted operations and data.

### 1.3 Definitions

- **REST API:** An HTTP-based interface used to communicate with the backend.
- **Authentication:** Verification of a user's identity.
- **Authorization:** Verification of whether a user is permitted to perform an action.
- **RBAC:** Role-Based Access Control, where permissions depend on a user's assigned role.
- **Security Scope:** A permission required to perform a protected operation.
- **MVP:** Minimum Viable Product for the mid-term assessment.
- **Beta:** Extended release for the final assessment.
- **CRUD:** Create, Read, Update, and Delete.

## 2. Overall Description

### 2.1 Product Perspective

The system will contain three main components:

1. **Frontend:** React.js with TypeScript for the user interface.
2. **Backend:** FastAPI with Python for REST APIs, business logic, validation, authentication, and authorization.
3. **Database:** SQLite for storing application data.

The frontend will send HTTP requests to the backend. The backend will validate the requests, apply business rules, interact with the database, and return JSON responses.

### 2.2 User Classes

| User Class | Responsibilities | Release |
|---|---|---|
| API Tester | Tests core quiz APIs using Swagger UI or Postman. | MVP |
| Student | Views published quizzes, submits answers, and views personal results. | Beta |
| Teacher | Creates and manages owned quizzes and views their results. | Beta |
| Admin | Manages user accounts, roles, and account status. | Beta |

### 2.3 Operating Environment

- Frontend: React.js with TypeScript.
- Backend: Python with FastAPI.
- Database: SQLite.
- API documentation and testing: FastAPI Swagger UI and/or Postman.
- Development environment: Local development environment.
- Final environment: Deployment or reproducible demonstration environment selected during implementation.

### 2.4 Constraints

- The final application must demonstrate REST APIs, authentication, authorization, RBAC, security scopes, and frontend-backend integration.
- The initial question format will be MCQ with one correct option per question.
- The project will avoid unnecessary technologies and features outside the course requirements.

## 3. Functional Requirements

Each requirement is assigned to the release in which it is planned to be implemented.

### 3.1 Quiz Management

- **FR-01 (MVP):** The system shall allow a quiz to be created with a title, description, and publishing status.
- **FR-02 (MVP):** The system shall return a list of quizzes.
- **FR-03 (MVP):** The system shall return the details of a selected quiz.
- **FR-04 (MVP):** The system shall allow a quiz to be updated.
- **FR-05 (MVP):** The system shall allow a quiz to be deleted.
- **FR-06 (Beta):** The system shall allow an authorized teacher to publish or unpublish a quiz they own.
- **FR-07 (Beta):** The system shall allow students to view published quizzes through the student-facing application.

### 3.2 Question and Option Management

- **FR-08 (MVP):** The system shall allow MCQ questions and answer options to be added to a quiz.
- **FR-09 (MVP):** The system shall allow questions and options to be retrieved, updated, and deleted.
- **FR-10 (MVP):** The system shall validate that a question belongs to the specified quiz and that an option belongs to the specified question.
- **FR-11 (Beta):** The system shall allow only an authorized teacher to manage questions and options for a quiz they own.

### 3.3 Quiz Attempts and Results

- **FR-12 (MVP):** The system shall accept selected option IDs for a quiz attempt.
- **FR-13 (MVP):** The backend shall calculate the score by comparing submitted options with the stored correct options.
- **FR-14 (MVP):** The system shall reject invalid quiz IDs and invalid question-option relationships.
- **FR-15 (Beta):** The system shall store each student's quiz attempt and calculated result.
- **FR-16 (Beta):** A student shall be able to view only their own results.
- **FR-17 (Beta):** A teacher shall be able to view results only for quizzes they own.
- **FR-18 (MVP/Beta):** Correct-answer information shall not be included in student-facing quiz responses before submission; the backend shall enforce this when the student-facing API is implemented.

### 3.4 Authentication and User Management

- **FR-19 (Beta):** The system shall allow users to register with the required account information.
- **FR-20 (Beta):** The system shall authenticate users and issue a JWT access token after successful login.
- **FR-21 (Beta):** The system shall provide an endpoint for retrieving the current authenticated user's profile.
- **FR-22 (Beta):** The system shall support Student, Teacher, and Admin roles.
- **FR-23 (Beta):** The system shall allow an authorized admin to list users, assign roles, and activate or deactivate accounts.
- **FR-24 (Beta):** The system shall reject missing, invalid, or expired tokens on protected endpoints.

### 3.5 Authorization, RBAC, and Security Scopes

- **FR-25 (Beta):** The system shall check user roles before allowing role-restricted operations.
- **FR-26 (Beta):** The system shall check required security scopes before allowing protected operations.
- **FR-27 (Beta):** The system shall verify quiz ownership before allowing a teacher to update or delete a quiz or manage its questions.
- **FR-28 (Beta):** The system shall prevent non-admin users from managing user accounts or assigning roles.
- **FR-29 (Beta):** The system shall enforce authorization on the backend and shall not rely only on hidden frontend controls.

### 3.6 Frontend and Backend Integration

- **FR-30 (Beta):** The frontend shall provide pages for the available quiz-related operations.
- **FR-31 (Beta):** The frontend shall provide role-appropriate views for Students, Teachers, and Admins.
- **FR-32 (Beta):** The frontend shall display loading, empty, success, and error states where appropriate.
- **FR-33 (Beta):** The frontend shall communicate with the FastAPI backend through REST APIs.
- **FR-34 (Beta):** The frontend shall send authentication tokens with protected requests.

## 4. Non-Functional Requirements

- **NFR-01 (MVP):** API request and response bodies shall use JSON with consistent data structures.
- **NFR-02 (MVP):** The backend shall return appropriate HTTP status codes.
- **NFR-03 (MVP):** Invalid input shall be validated, and error responses shall not expose sensitive internal implementation details.
- **NFR-04 (Beta):** Passwords shall be stored as secure hashes and never as plaintext.
- **NFR-05 (Beta):** Authorization decisions shall be enforced on the backend for every protected request.
- **NFR-06 (Beta):** Students shall not be able to access other students' results.
- **NFR-07 (MVP/Beta):** The application shall separate frontend, API, business logic, and data-access responsibilities.
- **NFR-08 (MVP/Beta):** The system shall remain practical and manageable within the course timeline.

## 5. Permission Matrix (Beta)

| Action | Student | Teacher | Admin |
|---|---|---|---|
| View published quizzes | Yes | Yes | As required |
| Submit a quiz attempt | Yes | No by default | No by default |
| View own results | Yes | No by default | As required for administration |
| Create a quiz | No | Yes | Not required by default |
| Update/delete own quizzes | No | Yes | Not required by default |
| Manage questions for own quizzes | No | Yes | Not required by default |
| View results for owned quizzes | No | Yes | As required for administration |
| List/manage user accounts | No | No | Yes |
| Assign roles | No | No | Yes |
| Activate/deactivate accounts | No | No | Yes |

Administrative access to quiz content or results is not assumed unless explicitly implemented and documented.

## 6. Security Scopes (Beta)

The backend will define and enforce scopes such as the following:

| Scope | Permission |
|---|---|
| `quiz:read` | Read quizzes visible to the current user. |
| `quiz:create` | Create a quiz. |
| `quiz:update_own` | Update a quiz owned by the current user. |
| `quiz:delete_own` | Delete a quiz owned by the current user. |
| `question:manage_own` | Manage questions and options for an owned quiz. |
| `attempt:submit` | Submit a quiz attempt. |
| `result:read_own` | Read the current user's own results. |
| `result:read_quiz` | Read results for a quiz owned by the current user. |
| `user:manage` | List and manage user accounts. |
| `role:assign` | Assign or change user roles. |

A scope alone does not establish resource ownership. The backend must verify both the required permission and the relevant ownership or user identity.

## 7. Data Requirements

The planned data entities are:

### 7.1 Quiz
- Quiz ID
- Title
- Description
- Publishing status
- Creation timestamp
- Owner ID (Beta)

### 7.2 Question
- Question ID
- Quiz ID
- Question text

### 7.3 Option
- Option ID
- Question ID
- Option text
- Correct-option indicator used by the backend

### 7.4 User (Beta)
- User ID
- Name
- Email
- Password hash
- Role
- Account status
- Creation timestamp

### 7.5 Attempt (Beta)
- Attempt ID
- Quiz ID
- Student ID
- Score
- Total questions
- Submission timestamp

### 7.6 AttemptAnswer (Beta)
- Answer ID
- Attempt ID
- Question ID
- Selected option ID

The correct-option indicator shall not be exposed in student-facing quiz responses before submission.

## 8. API Response and Error Requirements

| Situation | Expected HTTP Status |
|---|---|
| Successful read or update | `200 OK` |
| Resource created | `201 Created` |
| Successful deletion without a response body | `204 No Content` |
| Resource not found | `404 Not Found` |
| Missing or invalid token | `401 Unauthorized` (Beta) |
| Insufficient role or permission | `403 Forbidden` (Beta) |
| Duplicate account email | `409 Conflict` (Beta) |
| Invalid request data | `422 Unprocessable Entity` |

The exact response schemas will be finalized during implementation and documented in FastAPI Swagger UI.

## 9. Acceptance Criteria

### 9.1 MVP Acceptance Criteria

- Quiz CRUD endpoints work locally.
- Questions and options can be managed through the API.
- The backend calculates scores for submitted answers.
- Invalid data and resource references return appropriate errors.
- The endpoints can be demonstrated through Swagger UI or Postman.

### 9.2 Beta Acceptance Criteria

- Registration and login work with JWT authentication.
- Protected endpoints reject missing or invalid tokens.
- Role and scope restrictions are enforced on the backend.
- Teachers cannot modify quizzes owned by other teachers.
- Students cannot access other students' results.
- Correct answers are not exposed before submission.
- The React frontend communicates with the FastAPI backend.
- Main user workflows and permission restrictions pass testing.
- The integrated application can be demonstrated in the selected final environment.

## 10. Out of Scope

AI/ML features, LLMs, RAG, AI-generated questions, payment processing, live multiplayer competition, advanced proctoring, and complex analytics are excluded from the planned requirements.

## 11. Requirements Status

All requirements in this document describe the planned implementation. Their status will be updated as development and testing progress.

