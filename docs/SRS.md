# Software Requirements Specification (SRS) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Software Requirements Specification (SRS) |
| Version | MVP + Beta |
| Status | Draft |
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for Quiz Game. It specifies the expected system behaviour, API requirements, data validation rules, user permissions, and acceptance criteria for the MVP and Beta releases.

### 1.2 Scope

Quiz Game is a web application for managing and attempting multiple-choice quizzes. The backend exposes REST APIs, validates incoming data, stores quiz information, and calculates scores. The frontend provides the user interface.

The MVP supports core quiz operations and local execution. The Beta adds authentication, roles, profile features, security scopes, and deployment.

### 1.3 Definitions

- **MVP:** Minimum Viable Product for the mid-term demonstration.
- **Beta:** Extended release for the final demonstration.
- **REST API:** HTTP-based interface for communication between frontend and backend.
- **MCQ:** Multiple-choice question.
- **RBAC:** Role-Based Access Control.
- **Scope:** A specific permission required to perform a protected action.
- **Guest:** A user who is not authenticated.
- **Student:** An authenticated user who participates in quizzes.
- **Admin:** An authenticated user who manages quiz content and user access.

## 2. Overall Description

### 2.1 Product Perspective

The application consists of:

1. A React + TypeScript frontend.
2. A FastAPI + Python backend.
3. A database for storing quizzes, questions, users, and attempts.
4. REST APIs for communication between frontend and backend.
5. An authentication and authorization layer introduced in Beta.

### 2.2 User Classes

| User Class | Capabilities | Release |
|---|---|---|
| Guest | Browse published quizzes and view public quiz details. | MVP/Beta |
| Student | Attempt quizzes and view results. In Beta, access personal history and profile. | MVP/Beta |
| Admin | Manage quizzes and questions. In Beta, manage user accounts and roles. | MVP/Beta |

During the MVP, roles are conceptual only; secure authentication and enforcement of these permissions are Beta requirements. Any MVP management endpoints must remain local to the development environment.

### 2.3 Operating Environment

- Frontend: Modern web browser.
- Frontend development server: Vite.
- Backend runtime: Python with FastAPI.
- Backend development server: Uvicorn.
- Data storage: A relational database.
- Version control: Git and GitHub.
- Beta hosting: A suitable web hosting platform.

## 3. Functional Requirements

Each requirement is assigned a unique ID and a release.

### 3.1 Quiz Listing and Details

**FR-01 — List Quizzes (MVP)**  
The system shall return a list of available published quizzes.

**FR-02 — View Quiz Details (MVP)**  
The system shall return a quiz's title, description, and associated questions.

**FR-03 — Hide Answer Keys (MVP)**  
The quiz-taking API shall not expose correct-answer information before submission.

### 3.2 Quiz Management

**FR-04 — Create Quiz (MVP)**  
The system shall allow quiz creation through a REST API.

**FR-05 — Update Quiz (MVP)**  
The system shall allow an existing quiz's editable fields to be updated.

**FR-06 — Delete Quiz (MVP)**  
The system shall allow a quiz to be deleted. Related data must be handled consistently.

**FR-07 — Create Question (MVP)**  
The system shall allow an MCQ question to be added to a quiz.

**FR-08 — Update Question (MVP)**  
The system shall allow question text, options, and correct-answer configuration to be updated.

**FR-09 — Delete Question (MVP)**  
The system shall allow a question to be removed from a quiz.

### 3.3 Quiz Attempts and Results

**FR-10 — Submit Answers (MVP)**  
The system shall accept the quiz identifier and the participant's selected answers.

**FR-11 — Calculate Score (MVP)**  
The backend shall compare submitted answers with stored correct answers and calculate the score.

**FR-12 — Return Result (MVP)**  
The system shall return the score and the number of correct answers after submission.

**FR-13 — Reject Invalid Submissions (MVP)**  
The system shall reject invalid quiz identifiers, unknown question identifiers, and answer options that do not belong to the relevant question.

**FR-14 — Store Attempts (Beta)**  
The system shall store quiz attempts with the authenticated user's ID, score, and submission time.

**FR-15 — View Attempt History (Beta)**  
The system shall allow a student to view their own previous attempts.

### 3.4 Authentication and Profile

**FR-16 — User Registration (Beta)**  
The system shall allow a user to register with a name, valid email address, and password.

**FR-17 — User Login (Beta)**  
The system shall verify credentials and return an appropriate authentication response.

**FR-18 — Protected Requests (Beta)**  
The system shall require valid authentication for protected endpoints.

**FR-19 — User Profile (Beta)**  
The system shall allow an authenticated user to view their own profile.

**FR-20 — User Dashboard (Beta)**  
The system shall display the user's profile and available personal quiz statistics.

### 3.5 Roles, Permissions, and Administration

**FR-21 — Student/Admin Roles (Beta)**  
The system shall support the `student` and `admin` roles.

**FR-22 — Role-Based Authorization (Beta)**  
The system shall restrict administrative actions to authorized Admin users.

**FR-23 — Permission Scopes (Beta)**  
Protected operations shall require appropriate scopes, such as `quiz:read`, `quiz:manage`, `attempt:create`, `attempt:read:own`, and `user:manage`.

**FR-24 — User Management (Beta)**  
An Admin shall be able to view users and manage their roles using protected endpoints.

**FR-25 — Prevent Unauthorized Access (Beta)**  
A user shall not be able to view another user's private profile or attempt history by changing an ID in the request.

## 4. Non-Functional Requirements

**NFR-01 — Usability**  
The frontend shall provide clear labels, submission feedback, and understandable error messages.

**NFR-02 — Performance**  
The system shall support normal classroom demonstration workloads without unnecessary delays.

**NFR-03 — Validation**  
The backend shall validate request bodies, required fields, data types, and identifier values.

**NFR-04 — Error Handling**  
The API shall return suitable HTTP status codes and structured error responses.

**NFR-05 — Security**  
Beta passwords shall be stored as secure hashes. Plain-text passwords shall never be stored or returned.

**NFR-06 — Authorization**  
All protected operations shall enforce permissions on the backend; hiding a frontend button alone shall not count as authorization.

**NFR-07 — Data Integrity**  
Scores shall be calculated by the backend using stored answer keys. Client-submitted scores shall not be trusted.

**NFR-08 — Maintainability**  
API routes, data models, business logic, and frontend API calls shall be organized into understandable modules.

**NFR-09 — Compatibility**  
The application shall run in a modern browser and use JSON for API communication.

**NFR-10 — Configuration**  
Environment-specific settings and secrets shall be kept out of source code.

**NFR-11 — Testing**  
Core API operations and Beta authorization rules shall be tested before the final demonstration.

**NFR-12 — Deployment**  
The Beta release shall be deployable using documented configuration and startup instructions.

## 5. External Interface Requirements

### 5.1 User Interface

The frontend shall provide:

- A quiz listing page.
- A quiz details and attempt interface.
- A result display.
- Quiz-management forms for Admin functionality.
- Beta login and registration forms.
- A Beta user profile and dashboard.
- Clear loading, success, empty, and error states.

### 5.2 Software Interfaces

The frontend shall communicate with FastAPI through HTTP requests and JSON responses. The backend shall expose API documentation through FastAPI's OpenAPI/Swagger interface during development.

### 5.3 Communication

- HTTP methods: `GET`, `POST`, `PATCH`, and `DELETE`.
- Request/response format: JSON.
- Authentication for Beta protected routes: Bearer access token.
- Validation errors: appropriate `4xx` status codes.

## 6. REST API Requirements

The following is the proposed API contract. All paths are relative to the backend host.

### 6.1 MVP Endpoints

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| GET | `/api/quizzes` | List published quizzes | MVP |
| GET | `/api/quizzes/{quiz_id}` | Get quiz details and safe question data | MVP |
| POST | `/api/quizzes` | Create a quiz | MVP |
| PATCH | `/api/quizzes/{quiz_id}` | Update a quiz | MVP |
| DELETE | `/api/quizzes/{quiz_id}` | Delete a quiz | MVP |
| POST | `/api/quizzes/{quiz_id}/questions` | Add a question | MVP |
| PATCH | `/api/questions/{question_id}` | Update a question | MVP |
| DELETE | `/api/questions/{question_id}` | Delete a question | MVP |
| POST | `/api/quizzes/{quiz_id}/submit` | Submit answers and calculate score | MVP |
| GET | `/api/health` | Check backend availability | MVP |

Quiz-management endpoints are unauthenticated only for local MVP development and must not be publicly exposed in that state.

### 6.2 Beta Endpoints

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Beta |
| POST | `/api/auth/login` | Authenticate a user | Beta |
| GET | `/api/users/me` | View own profile | Beta |
| PATCH | `/api/users/me` | Update own profile | Beta |
| GET | `/api/users/me/attempts` | View own quiz history | Beta |
| GET | `/api/users/me/dashboard` | View personal statistics | Beta |
| GET | `/api/admin/users` | List users | Beta |
| PATCH | `/api/admin/users/{user_id}/role` | Update a user's role | Beta |

Every protected Beta endpoint must authenticate the caller and check the required role and permission scope.

## 7. Data Requirements

The application shall use a relational database with the following logical entities:

### 7.1 Quiz

- `id`: unique identifier.
- `title`: required quiz title.
- `description`: optional description.
- `is_published`: publication status.
- `created_at`: creation timestamp.

### 7.2 Question

- `id`: unique identifier.
- `quiz_id`: reference to the associated quiz.
- `question_text`: required question text.
- `options`: the available answer options.
- `correct_option`: the correct option, stored securely on the backend.

### 7.3 User (Beta)

- `id`: unique identifier.
- `name`: display name.
- `email`: unique email address.
- `password_hash`: secure password hash.
- `role`: `student` or `admin`.
- `created_at`: account creation timestamp.

### 7.4 Quiz Attempt (Beta)

- `id`: unique identifier.
- `user_id`: reference to the student.
- `quiz_id`: reference to the quiz.
- `score`: backend-calculated score.
- `total_questions`: total questions in the attempt.
- `submitted_at`: submission timestamp.

## 8. Permission Matrix — Beta

| Action | Guest | Student | Admin |
|---|---|---|---|
| Browse published quizzes | Allow | Allow | Allow |
| View safe quiz details | Allow | Allow | Allow |
| Submit quiz answers | Not allowed | Allow | Allow |
| View own profile | Not allowed | Allow | Allow |
| View own attempt history | Not allowed | Allow | Allow |
| Create or edit quizzes | Not allowed | Not allowed | Allow |
| Manage questions | Not allowed | Not allowed | Allow |
| Manage user roles | Not allowed | Not allowed | Allow |
| View another user's private history | Not allowed | Not allowed | Only if explicitly authorized for administration |

The backend shall enforce this matrix. Beta administrative routes shall require both a valid authenticated identity and the appropriate permission scope.

## 9. Validation and Error Handling

| Situation | Expected response |
|---|---|
| Invalid request body | `422 Unprocessable Entity` |
| Quiz or question not found | `404 Not Found` |
| Missing or invalid authentication token | `401 Unauthorized` |
| Authenticated user lacks permission | `403 Forbidden` |
| Duplicate email during registration | `409 Conflict` |
| Successful resource creation | `201 Created` |
| Successful read/update | `200 OK` |
| Successful deletion with no response body | `204 No Content` |

The exact status code for a particular error shall be consistent with the API contract. Error messages must not reveal passwords, tokens, or other secrets.

## 10. Acceptance Criteria

### MVP Acceptance Criteria

- **AC-01:** The quiz list is returned by the backend and displayed by the frontend.
- **AC-02:** Quiz details and questions load successfully.
- **AC-03:** Quiz and question CRUD operations work through the REST API.
- **AC-04:** A valid answer submission returns a backend-calculated score.
- **AC-05:** Invalid identifiers and malformed requests are handled correctly.
- **AC-06:** Correct answers are not exposed by the quiz-taking response before submission.
- **AC-07:** The frontend and backend run locally using documented instructions.

### Beta Acceptance Criteria

- **AC-08:** A user can register and log in.
- **AC-09:** Protected routes reject unauthenticated requests.
- **AC-10:** Students cannot use Admin-only operations.
- **AC-11:** Protected operations check the required scopes.
- **AC-12:** A student can view their own profile and attempt history.
- **AC-13:** A student cannot access another user's private data by changing request identifiers.
- **AC-14:** The deployed application can be demonstrated successfully.

## 11. Constraints and Dependencies

- The project must use React + TypeScript and FastAPI + Python.
- The backend shall be the source of truth for scoring and authorization.
- Beta authentication and role-based access control must be tested before deployment.
- All planned features must be labelled MVP or Beta.
- Features outside the PRD's scope require instructor/team approval before implementation.

