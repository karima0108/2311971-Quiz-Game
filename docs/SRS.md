# Software Requirements Specification (SRS) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Software Requirements Specification (SRS) |
| Version | MVP + Beta |
| Status | Updated Draft |
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |
| Database | SQLite (MVP) |

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements of Quiz Game. It defines the expected system behavior, user interactions, API requirements, data validation rules, and acceptance criteria for the MVP and planned Beta releases.

### 1.2 Scope

The MVP is an Admin-oriented quiz-management application. It allows an Admin to create, view, update, and delete quizzes and their associated multiple-choice questions.

The React frontend communicates with a FastAPI backend through REST APIs. The backend validates requests and stores data in a SQLite database.

The Beta release is planned to introduce authentication, Admin/Student roles, RBAC, permission scopes, an Admin dashboard, user management, and deployment.

### 1.3 Definitions

- **MVP:** Minimum Viable Product for the mid-term assessment.
- **Beta:** Planned extended release for the final assessment.
- **CRUD:** Create, Read, Update, and Delete.
- **REST API:** HTTP-based interface for communication between the frontend and backend.
- **MCQ:** Multiple-Choice Question.
- **RBAC:** Role-Based Access Control.
- **Admin:** User responsible for managing quiz and question content.
- **Scope:** A permission that determines whether an authenticated user may perform a protected operation.

## 2. Overall Description

### 2.1 Product Perspective

The application consists of three main layers:

1. **Frontend:** React and TypeScript provide the quiz-management interface.
2. **Backend:** FastAPI and Python expose REST endpoints, validate requests, and perform database operations.
3. **Database:** SQLite stores quiz and question records during the MVP.

The frontend and backend communicate using HTTP requests and JSON data.

### 2.2 User Classes

| User Class | Capabilities | Release |
|---|---|---|
| Admin (development workflow) | Manage quizzes and questions through the local management interface. | MVP |
| Admin (authenticated) | Manage quiz content and access authorized administrative functions. | Beta |
| Student | Access features permitted to the Student role. | Beta |

**MVP access limitation:** The current local management-access check is not a replacement for user authentication. The management endpoints must remain restricted to local development until proper authentication and authorization are implemented.

### 2.3 Operating Environment

- Operating system: Windows or another supported development environment.
- Frontend: Modern web browser.
- Frontend development server: Vite.
- Backend runtime: Python.
- Backend framework: FastAPI.
- Backend development server: FastAPI development server/Uvicorn.
- Database: SQLite for local MVP development.
- API format: JSON over HTTP.
- Version control: Git and GitHub.

## 3. Functional Requirements

### 3.1 Quiz Management

**FR-01 — Retrieve Quiz List (MVP)**

The system shall allow the frontend to request and display the available quiz records.

**FR-02 — Retrieve Quiz Details (MVP)**

The system shall allow the frontend to retrieve an individual quiz by its unique ID.

**FR-03 — Create Quiz (MVP)**

The system shall allow the management interface to submit quiz information to the backend. The backend shall validate the data and store the new quiz.

**FR-04 — Update Quiz (MVP)**

The system shall allow the management interface to update an existing quiz. The backend shall verify that the quiz exists before applying the update.

**FR-05 — Delete Quiz (MVP)**

The system shall allow the management interface to delete an existing quiz. The backend shall verify the target resource before deletion.

### 3.2 Question Management

**FR-06 — Create Question (MVP)**

The system shall allow the Admin to add a multiple-choice question to an existing quiz. The question information shall include question text, answer options, and the correct-option index.

**FR-07 — Retrieve Question (MVP)**

The system shall allow an individual question to be retrieved using its unique ID for management purposes.

**FR-08 — Update Question (MVP)**

The system shall allow the Admin to update an existing question's text, answer options, and correct-option information.

**FR-09 — Delete Question (MVP)**

The system shall allow the Admin to delete an existing question.

### 3.3 Validation and Error Handling

**FR-10 — Request Validation (MVP)**

The backend shall validate incoming request data using the defined schemas. Invalid data shall be rejected with an appropriate validation response.

**FR-11 — Missing Resource Handling (MVP)**

If a requested quiz or question does not exist, the backend shall return an appropriate not-found response.

**FR-12 — Health Check (MVP)**

The backend shall provide a health endpoint to confirm that the API is available.

### 3.4 Authentication and Administration

The following requirements are planned for Beta and are not part of the current MVP implementation.

**FR-13 — Admin Authentication (Beta)**

The system shall allow an authorized Admin to log in using valid credentials.

**FR-14 — Role-Based Authorization (Beta)**

The backend shall verify the authenticated user's role before allowing protected administrative operations.

**FR-15 — Permission Scopes (Beta)**

The backend shall enforce the required permission scopes for protected API operations.

**FR-16 — Admin Dashboard (Beta)**

The system shall provide an authenticated Admin dashboard.

**FR-17 — User Management (Beta)**

Authorized Admin users shall be able to access and manage user accounts according to their permissions.

**FR-18 — Student Profile (Beta)**

The system shall provide authenticated Student users with access to their own profile information.

## 4. Use Cases

### 4.1 UC-01 — View Quiz List

| Field | Description |
|---|---|
| Use Case ID | UC-01 |
| Actor | Admin (local MVP workflow) |
| Release | MVP |
| Preconditions | Frontend and backend are running. |

**Main Flow:**
1. The Admin opens the quiz-management interface.
2. The frontend sends a request to retrieve quizzes.
3. The backend processes the request.
4. The backend retrieves the quiz records from the database.
5. The backend returns the response.
6. The frontend displays the quiz list.

**Alternative Flow:**
- If no quiz records exist, the interface displays an empty state.
- If the API request fails, the interface displays an error message.

**Postcondition:** The quiz list is displayed when the request succeeds.

### 4.2 UC-02 — Create Quiz

| Field | Description |
|---|---|
| Use Case ID | UC-02 |
| Actor | Admin (local MVP workflow) |
| Release | MVP |
| Preconditions | The backend is running and the management interface is available. |

**Main Flow:**
1. The Admin selects the create-quiz action.
2. The Admin enters the quiz information.
3. The frontend sends the data to the backend.
4. The backend validates the request.
5. The backend creates the quiz record.
6. The backend returns the created resource.
7. The frontend updates the displayed quiz list.

**Alternative Flow:**
- If the request data is invalid, the backend returns a validation error.
- If the server is unavailable, the frontend displays an appropriate error.

**Postcondition:** A new quiz record is stored when creation succeeds.

### 4.3 UC-03 — Update Quiz

| Field | Description |
|---|---|
| Use Case ID | UC-03 |
| Actor | Admin (local MVP workflow) |
| Release | MVP |
| Preconditions | The selected quiz exists. |

**Main Flow:**
1. The Admin selects a quiz.
2. The Admin chooses the update action.
3. The frontend displays the existing quiz information.
4. The Admin modifies the required fields.
5. The frontend sends the update request.
6. The backend validates the request and updates the record.
7. The frontend displays the updated information.

**Alternative Flow:**
- If the quiz does not exist, the backend returns `404 Not Found`.
- If the request data is invalid, the backend returns a validation error.

**Postcondition:** The quiz is updated when the operation succeeds.

### 4.4 UC-04 — Delete Quiz

| Field | Description |
|---|---|
| Use Case ID | UC-04 |
| Actor | Admin (local MVP workflow) |
| Release | MVP |
| Preconditions | The selected quiz exists. |

**Main Flow:**
1. The Admin selects a quiz.
2. The Admin chooses the delete action.
3. The system requests confirmation if provided by the interface.
4. The frontend sends the delete request.
5. The backend verifies and deletes the quiz.
6. The frontend refreshes the quiz list.

**Alternative Flow:**
- If the quiz does not exist, the backend returns `404 Not Found`.
- If deletion fails, the frontend displays an error.

**Postcondition:** The quiz is removed when deletion succeeds.

### 4.5 UC-05 — Manage Questions

| Field | Description |
|---|---|
| Use Case ID | UC-05 |
| Actor | Admin (local MVP workflow) |
| Release | MVP |
| Preconditions | The associated quiz exists for question creation. |

**Main Flow:**
1. The Admin opens a quiz.
2. The Admin chooses to add or manage a question.
3. The Admin enters the question text and answer options.
4. The Admin selects the correct option.
5. The frontend sends the request to the backend.
6. The backend validates the data.
7. The backend creates or updates the question.
8. The frontend displays the updated question information.

**Alternative Flow:**
- If required question information is invalid, the backend returns a validation error.
- If the quiz or question does not exist, the backend returns an appropriate not-found response.

**Postcondition:** The question is created or updated when the operation succeeds.

### 4.6 UC-06 — Admin Authentication (Beta)

| Field | Description |
|---|---|
| Use Case ID | UC-06 |
| Actor | Admin |
| Release | Beta |
| Preconditions | Admin account and authentication service are available. |

**Main Flow:**
1. The Admin opens the login page.
2. The Admin enters credentials.
3. The frontend sends the login request.
4. The backend verifies the credentials.
5. The backend issues an authentication credential.
6. The Admin accesses authorized management functionality.

**Alternative Flow:**
- Invalid credentials are rejected.
- Missing or invalid authentication credentials prevent access to protected routes.

**Postcondition:** The Admin is authenticated if the credentials are valid.

## 5. External Interface Requirements

### 5.1 User Interface

The frontend shall provide:

- A quiz-management view.
- A quiz creation and editing interface.
- A question-management interface.
- Input fields for quiz and question information.
- Controls for creating, updating, and deleting resources.
- Loading, success, empty, and error states where appropriate.

### 5.2 Software Interfaces

| Interface | Purpose |
|---|---|
| React frontend | User interaction and presentation |
| FastAPI backend | REST API and application logic |
| SQLite database | Persistent MVP data storage |
| JSON | Data exchange between frontend and backend |
| Vite development server | Frontend development and API proxy configuration |

## 6. API Requirements

The following routes reflect the current MVP route design. They should be checked against `backend/main.py` before any future route changes.

### 6.1 MVP API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend availability |
| GET | `/api/quizzes` | Retrieve quiz list |
| GET | `/api/quizzes/{quiz_id}` | Retrieve quiz details |
| GET | `/api/quizzes/{quiz_id}/management` | Retrieve quiz management information |
| POST | `/api/quizzes` | Create a quiz |
| PATCH | `/api/quizzes/{quiz_id}` | Update a quiz |
| DELETE | `/api/quizzes/{quiz_id}` | Delete a quiz |
| POST | `/api/quizzes/{quiz_id}/questions` | Create a question |
| GET | `/api/questions/{question_id}` | Retrieve a question |
| PATCH | `/api/questions/{question_id}` | Update a question |
| DELETE | `/api/questions/{question_id}` | Delete a question |

**Access restriction:** Quiz-management routes use a local-development access check in the MVP. This is not production authentication. These routes must not be publicly exposed until real authentication and authorization are implemented.

### 6.2 Planned Beta API Capabilities

The following are proposed capabilities, not current MVP routes:

- Admin login.
- Current Admin profile.
- Admin dashboard data.
- User listing and role management.
- Protected quiz-management operations.

Exact paths and request schemas will be finalized during Beta implementation.

## 7. Data Requirements

### 7.1 Quiz

A quiz record contains the quiz information required by the current application, including its unique identifier, title, and description.

The model also retains an `is_published` field for compatibility with the existing database. A publish/unpublish workflow is not currently implemented.

### 7.2 Question

A question record contains:

- A unique identifier.
- The associated quiz identifier.
- Question text.
- An `options` collection containing the answer choices.
- A `correct_option` integer representing the zero-based index of the correct option.

For example, if the second option is correct, its index is `1`.

### 7.3 Data Integrity

- Each question must be associated with an existing quiz.
- Required text fields must be validated.
- The correct-option index must refer to a valid option.
- Quiz and question identifiers must uniquely identify their records.
- Database operations must preserve consistent relationships between quizzes and questions.

## 8. Non-Functional Requirements

- **NFR-01 Usability:** The interface should be simple and understandable.
- **NFR-02 Performance:** Normal CRUD requests should complete promptly under typical academic-demo workloads.
- **NFR-03 Reliability:** The backend should handle invalid input and missing resources without unexpected termination.
- **NFR-04 Maintainability:** Frontend, backend, schema, and database responsibilities should remain separated.
- **NFR-05 Data Persistence:** Successfully created or updated records should remain stored in the configured database.
- **NFR-06 Security:** The MVP management routes must remain local-only; Beta must introduce real authentication and authorization before public access.
- **NFR-07 Compatibility:** The application should run in a modern browser and supported Python/Node development environments.

## 9. Validation and Error Handling

The backend shall validate request bodies and resource identifiers.

| Condition | Expected Handling |
|---|---|
| Invalid request body | `422 Unprocessable Entity` |
| Missing quiz or question | `404 Not Found` |
| Unauthorized management access | `403 Forbidden` where the access check rejects the request |
| Successful read or update | Successful 2xx response |
| Successful creation | Successful 2xx response, typically `201 Created` |
| Successful deletion | Successful 2xx response; may use `204 No Content` |
| Unexpected server error | `500 Internal Server Error` |

The exact status code must follow the actual route implementation. The frontend should display understandable error messages without exposing internal server details.

## 10. Acceptance Criteria

### 10.1 MVP Acceptance Criteria

- **AC-01:** The backend health endpoint responds successfully.
- **AC-02:** The frontend can retrieve and display the quiz list.
- **AC-03:** An Admin can create a quiz through the interface.
- **AC-04:** An Admin can view an individual quiz.
- **AC-05:** An Admin can update an existing quiz.
- **AC-06:** An Admin can delete an existing quiz.
- **AC-07:** An Admin can add a question to an existing quiz.
- **AC-08:** An Admin can retrieve an individual question.
- **AC-09:** An Admin can update and delete a question.
- **AC-10:** Invalid request data and missing resources are handled appropriately.
- **AC-11:** Quiz and question data persist in the SQLite database.
- **AC-12:** Management routes remain restricted to local development.

### 10.2 Beta Acceptance Criteria

- **AC-13:** Admin login works with valid credentials.
- **AC-14:** Protected endpoints reject missing or invalid authentication.
- **AC-15:** Admin and Student permissions are enforced by the backend.
- **AC-16:** Permission scopes are checked for protected operations.
- **AC-17:** Authorized Admin users can access the dashboard and user-management features.
- **AC-18:** The deployed application uses secure configuration and persistent data storage.

These are requirements to verify; they are not claims that Beta features have already been implemented.

## 11. Testing Requirements

### 11.1 Manual API Testing

The API should be tested using Swagger UI and/or Postman.

Test cases should cover:

- Health check.
- Quiz creation, retrieval, update, and deletion.
- Question creation, retrieval, update, and deletion.
- Invalid request bodies.
- Nonexistent resource IDs.
- Local-only access restriction.

### 11.2 Frontend Testing

Verify that:

- Quiz records display correctly.
- Forms accept valid data.
- Successful operations update the interface.
- Invalid requests display useful errors.
- Empty and loading states behave appropriately.

### 11.3 Integration Testing

Verify that the React frontend communicates with FastAPI through the configured API routes and that successful changes are persisted in the database.

## 12. Constraints and Limitations

- The MVP does not include authentication or production-ready authorization.
- The MVP is intended for local development and demonstration.
- The current model's `is_published` field does not imply that publishing functionality exists.
- Quiz submission and scoring are not part of the implemented MVP.
- Beta functionality remains planned until implemented and tested.

## 13. Conclusion

This SRS defines the requirements for the Quiz Game MVP and planned Beta release. The MVP is limited to Admin-side quiz and question CRUD, REST API integration, validation, and database persistence. Beta will introduce authentication, authorization, administrative capabilities, and deployment.