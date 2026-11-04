# Technical Design Document (TDD) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Technical Design Document (TDD) |
| Version | MVP + Beta |
| Status | Updated Draft |
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |
| ORM | SQLAlchemy |
| Database | SQLite (MVP) |
| Architecture | Client–Server Architecture |
| Communication | REST API using JSON |

## 1. Introduction

### 1.1 Purpose

This document describes the technical architecture, technology stack, application structure, database design, REST API design, validation, security considerations, and testing strategy for Quiz Game.

It separates the currently implemented MVP design from the planned Beta architecture so that the document accurately reflects the project implementation.

### 1.2 Project Overview

Quiz Game is a web-based quiz-management application. The MVP provides an Admin interface for managing quizzes and multiple-choice questions.

The frontend is developed using React and TypeScript. The backend uses FastAPI and Python, while SQLAlchemy handles database operations. The frontend communicates with the backend through REST APIs, and SQLite provides persistent local storage.

The planned Beta release will introduce authentication, role-based authorization, permission scopes, an Admin dashboard, user management, and deployment.

### 1.3 Design Scope

This document covers:

- Application architecture.
- Frontend and backend technologies.
- Project directory structure.
- Database entities and relationships.
- REST API endpoints.
- Request and response handling.
- Input validation and error handling.
- Local development security restrictions.
- Testing and deployment strategy.
- Planned Beta architecture.

## 2. System Architecture

### 2.1 Architecture Overview

The application follows a client-server architecture with three primary layers:

1. **Presentation Layer:** React and TypeScript provide the Admin interface.
2. **Application Layer:** FastAPI handles HTTP requests, validation, application logic, and database operations.
3. **Data Layer:** SQLAlchemy communicates with the SQLite database.

### 2.2 Architecture Diagram

```text
+-----------------------------------+
|          Admin / Browser          |
+-----------------------------------+
                  |
                  v
+-----------------------------------+
|       Frontend: React + TS        |
|                                   |
|  - Quiz Management Interface      |
|  - Question Management Interface  |
|  - Forms and User Interactions    |
|  - API Request Handling           |
+-----------------------------------+
                  |
                  | HTTP / JSON
                  | REST API
                  v
+-----------------------------------+
|        Backend: FastAPI           |
|                                   |
|  - API Routes                     |
|  - Request Validation             |
|  - Application Logic              |
|  - Access Check                   |
|  - Database Operations            |
+-----------------------------------+
                  |
                  v
+-----------------------------------+
|       SQLAlchemy ORM              |
+-----------------------------------+
                  |
                  v
+-----------------------------------+
|          SQLite Database          |
|                                   |
|  - Quiz Records                   |
|  - Question Records               |
+-----------------------------------+
```

### 2.3 Request Processing Workflow

A typical quiz-management request follows this process:

1. The Admin performs an action in the React interface.
2. The frontend sends an HTTP request to the corresponding API endpoint.
3. Vite forwards development requests under `/api` to the FastAPI backend.
4. FastAPI receives the request and validates its parameters or request body.
5. The backend performs the required database operation using SQLAlchemy.
6. The backend returns a JSON response and an appropriate HTTP status code.
7. The frontend processes the response and updates the interface.

## 3. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend Library | React | Build the user interface |
| Frontend Language | TypeScript | Add static type checking |
| Build Tool | Vite | Run and build the frontend |
| Backend Framework | FastAPI | Develop REST APIs |
| Backend Language | Python | Backend application logic |
| ORM | SQLAlchemy | Database interaction |
| Database | SQLite | Local persistent storage |
| Data Validation | Pydantic | Validate API request and response data |
| API Format | JSON | Frontend-backend communication |
| API Documentation | Swagger UI / OpenAPI | Inspect and test API endpoints |
| Version Control | Git and GitHub | Track changes and collaborate |
| API Testing | Swagger UI / Postman | Test REST endpoints |

## 4. Project Structure

The current implementation uses a relatively simple structure.

```text
2311971-Quiz-Game/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   │
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── quiz_game.db
│
├── docs/
│   ├── PRD.md
│   ├── SRS.md
│   └── TDD.md
│
├── .gitignore
└── README.md
```

**Note:** This represents the simplified MVP structure. Local virtual-environment files and other generated files are not included. The database file is local development data and should not be committed to the repository.

### 4.1 Frontend Responsibilities

The frontend is responsible for:

- Displaying quiz information.
- Providing quiz creation and editing forms.
- Displaying question information.
- Providing question creation and editing forms.
- Sending API requests.
- Displaying success, loading, empty, and error states.

### 4.2 Backend Responsibilities

The backend is responsible for:

- Exposing REST API endpoints.
- Validating request data.
- Retrieving quiz and question records.
- Creating, updating, and deleting records.
- Checking whether requested resources exist.
- Restricting MVP management operations to the local development environment.

## 5. Database Design

### 5.1 Database Overview

The MVP uses SQLite as its local database and SQLAlchemy as the Object Relational Mapper (ORM).

The current database design focuses on two main entities:

1. Quiz
2. Question

The Admin User entity is planned for the Beta release when authentication is introduced.

### 5.2 Quiz Entity

The Quiz entity stores the main information about each quiz.

| Attribute | Description |
|---|---|
| `id` | Unique quiz identifier |
| `title` | Quiz title |
| `description` | Quiz description |
| `is_published` | Boolean field retained in the model/database for compatibility |

The `is_published` field does not mean that a publish/unpublish workflow is currently implemented.

### 5.3 Question Entity

The Question entity stores the questions associated with a quiz.

| Attribute | Description |
|---|---|
| `id` | Unique question identifier |
| `quiz_id` | Identifier of the associated quiz |
| `question_text` | The question statement |
| `options` | JSON collection containing the answer options |
| `correct_option` | Zero-based integer index of the correct answer |

**Options representation:**

The answer options are stored in an `options` JSON field rather than in four separate database columns.

Example:

```json
{
  "question_text": "Which language is used with React?",
  "options": [
    "Python",
    "TypeScript",
    "Java",
    "C++"
  ],
  "correct_option": 1
}
```

Here, `correct_option: 1` identifies the second option because the index starts at zero.

### 5.4 Entity Relationship

```text
+----------------------+
|        QUIZ          |
+----------------------+
| id (Primary Key)     |
| title                |
| description          |
| is_published         |
+----------------------+
           |
           | One-to-Many
           |
           v
+----------------------+
|      QUESTION        |
+----------------------+
| id (Primary Key)     |
| quiz_id (Foreign Key)|
| question_text        |
| options (JSON)       |
| correct_option      |
+----------------------+
```

**Relationship:**

- One quiz can contain multiple questions.
- Each question belongs to an associated quiz.
- The `quiz_id` field connects a question to its quiz.

### 5.5 Planned Beta Database Extension

The following entity is planned for Beta and is not part of the current MVP database design.

**User Entity**

| Attribute | Description |
|---|---|
| `id` | Unique user identifier |
| `name` | User's display name |
| `email` | Unique email address |
| `password_hash` | Securely hashed password |
| `role` | User role, such as Admin or Student |

The Beta design may introduce a relationship between users and administrative activities. The final schema will be confirmed during implementation.

## 6. Backend Design

### 6.1 Backend Framework

FastAPI is used to build the backend REST API.

It provides:

- HTTP route handling.
- Request and response validation.
- Automatic OpenAPI documentation.
- Integration with Python application logic.
- Database integration through SQLAlchemy.

### 6.2 Database Access

SQLAlchemy is used to interact with the SQLite database.

The backend uses the database configuration and session-management logic to perform database operations. Models define the database entities, while schemas validate incoming and outgoing API data.

### 6.3 Backend Modules

| File | Responsibility |
|---|---|
| `main.py` | Defines FastAPI application and API routes |
| `models.py` | Defines SQLAlchemy database models |
| `schemas.py` | Defines Pydantic validation schemas |
| `database.py` | Configures database connection and sessions |

## 7. REST API Design

### 7.1 API Conventions

- API routes use the `/api` prefix.
- JSON is used for request and response bodies.
- HTTP methods represent CRUD operations.
- Resource IDs are passed through URL path parameters.
- Pydantic schemas validate request data.
- Appropriate HTTP status codes indicate operation results.

### 7.2 MVP API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend availability |
| GET | `/api/quizzes` | Retrieve quiz list |
| GET | `/api/quizzes/{quiz_id}` | Retrieve quiz details |
| GET | `/api/quizzes/{quiz_id}/management` | Retrieve management information for a quiz |
| POST | `/api/quizzes` | Create a quiz |
| PATCH | `/api/quizzes/{quiz_id}` | Update a quiz |
| DELETE | `/api/quizzes/{quiz_id}` | Delete a quiz |
| POST | `/api/quizzes/{quiz_id}/questions` | Create a question under a quiz |
| GET | `/api/questions/{question_id}` | Retrieve a question |
| PATCH | `/api/questions/{question_id}` | Update a question |
| DELETE | `/api/questions/{question_id}` | Delete a question |

The exact request and response fields are defined by the backend schemas.

### 7.3 Quiz Creation Example

**Request**

```http
POST /api/quizzes
Content-Type: application/json
```

**Example body**

```json
{
  "title": "General Knowledge",
  "description": "A general knowledge quiz"
}
```

The backend validates the information and stores the new quiz record.

### 7.4 Question Creation Example

**Request**

```http
POST /api/quizzes/1/questions
Content-Type: application/json
```

**Example body**

```json
{
  "question_text": "Which language is used with React?",
  "options": [
    "Python",
    "TypeScript",
    "Java",
    "C++"
  ],
  "correct_option": 1
}
```

The backend verifies the associated quiz and validates the submitted question data before storing it.

### 7.5 Local Development Access Restriction

The current MVP includes a development-only management access check.

The check allows management operations only when the application is running in the development environment and the request originates from the local loopback host.

This is a temporary development safeguard. It is not user authentication, JWT validation, or production-ready RBAC.

Before public deployment, these routes must be protected using actual authentication and backend authorization.

### 7.6 Planned Beta API Design

The Beta release may introduce API groups for:

- Admin login.
- Current user information.
- Admin dashboard information.
- User listing and role management.
- Protected administrative operations.

Exact endpoint paths and request schemas will be finalized during Beta development.

## 8. Frontend Design

### 8.1 Frontend Architecture

The frontend uses React components to display and manage application data.

TypeScript is used to define data types and improve the reliability of frontend code.

The application communicates with the backend using HTTP requests.

### 8.2 API Communication

The frontend communicates with the backend using the configured API base path.

During local development, Vite is configured to proxy requests beginning with `/api` to the FastAPI server at:

```text
http://localhost:8000
```

The frontend development server runs at:

```text
http://localhost:5173
```

This allows the frontend to communicate with the backend without hardcoding a different server address in every component.

### 8.3 Frontend Responsibilities

- Display existing quizzes.
- Submit quiz creation requests.
- Submit quiz update requests.
- Submit quiz deletion requests.
- Display question information.
- Submit question creation, update, and deletion requests.
- Handle API responses.
- Display appropriate messages for failed requests.

## 9. Validation and Error Handling

### 9.1 Request Validation

Pydantic schemas are used to validate incoming API data.

Examples of validation include:

- Required quiz information must be provided.
- Required question text must be provided.
- Answer options must follow the expected data structure.
- The correct-option index must refer to a valid option.
- Resource identifiers must refer to existing records.

### 9.2 Error Handling

| HTTP Status | Meaning | Example |
|---|---|---|
| `200 OK` | Request successful | Retrieve or update a resource |
| `201 Created` | Resource created | Create a quiz or question |
| `204 No Content` | Successful deletion without response body | Delete a resource |
| `403 Forbidden` | Access is rejected | Local development access check fails |
| `404 Not Found` | Resource not found | Invalid quiz or question ID |
| `422 Unprocessable Entity` | Request validation failed | Invalid request body |
| `500 Internal Server Error` | Unexpected backend error | Unhandled server-side exception |

The actual status code depends on the route implementation and should remain consistent with the API behavior.

## 10. Security Design

### 10.1 MVP Security

The MVP does not include a complete authentication system.

Current safeguards:

- Management operations are restricted to local development.
- Request data is validated.
- Resource existence is checked before operations.
- Secrets and local database files should not be committed to GitHub.

The current development-only access check must not be treated as production security.

### 10.2 Planned Beta Security

The Beta release will introduce:

- Admin authentication.
- Secure password hashing.
- Token-based authentication.
- Admin and Student roles.
- Role-Based Access Control.
- Permission scopes.
- Backend enforcement of protected operations.
- Secure environment-variable configuration.
- HTTPS for deployed application communication.

The backend must enforce authorization. Hiding a frontend button is not sufficient to protect an API endpoint.

## 11. Testing Strategy

### 11.1 Backend API Testing

The backend endpoints should be tested using Swagger UI and Postman.

Test cases include:

- Health endpoint availability.
- Quiz creation.
- Quiz retrieval.
- Quiz updating.
- Quiz deletion.
- Question creation.
- Question retrieval.
- Question updating.
- Question deletion.
- Invalid request data.
- Nonexistent resource IDs.
- Local development access restrictions.

### 11.2 Frontend Testing

The frontend should be checked for:

- Correct quiz-list rendering.
- Correct question display.
- Form input handling.
- Successful creation and updating.
- Successful deletion.
- Error-message display.
- Correct interface updates after API responses.

### 11.3 Integration Testing

Integration testing verifies that the React frontend and FastAPI backend work together.

The testing process should confirm that:

1. Frontend requests reach the correct backend endpoints.
2. The backend returns the expected response.
3. The frontend processes the response correctly.
4. Database changes persist after successful operations.

### 11.4 Beta Testing

Beta testing will additionally cover:

- Login and authentication.
- Invalid or missing tokens.
- Admin and Student access restrictions.
- Permission scopes.
- User-management authorization.
- Production configuration and deployment.

## 12. Deployment Strategy

### 12.1 MVP Local Setup

The MVP is developed and tested locally.

**Backend:**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
fastapi dev main.py
```

The backend is available at:

```text
http://127.0.0.1:8000
```

Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

**Frontend:**

```powershell
cd frontend
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```

### 12.2 Beta Deployment

The Beta deployment plan includes:

1. Select frontend and backend hosting providers.
2. Configure a persistent production database.
3. Set environment variables and secrets.
4. Configure the frontend API base URL.
5. Configure CORS and HTTPS.
6. Implement and verify authentication and authorization.
7. Run backend and frontend tests.
8. Deploy the frontend and backend.
9. Test the deployed application.

SQLite is suitable for the local MVP. A persistent production database, such as PostgreSQL, should be considered for deployment, especially on hosting platforms where local files may not persist.

## 13. Version Control and Development Workflow

Git and GitHub are used to manage project development.

The feature-development workflow is:

1. Create or select a GitHub issue.
2. Create a feature branch.
3. Implement the required feature.
4. Test the implementation locally.
5. Commit the changes with a meaningful message.
6. Push the feature branch to GitHub.
7. Create a pull request.
8. Review the changes.
9. Merge the pull request into the main branch after approval and successful checks.

The MVP quiz-management implementation is maintained in the feature branch and pull request created for that work.

## 14. Future Improvements

Possible future improvements include:

- Authentication and role management.
- Student quiz participation.
- Answer submission and backend scoring, if included in the final requirements.
- Quiz publishing and unpublishing.
- Quiz attempt records.
- Expanded automated testing.
- Production deployment.
- Improved dashboard and reporting functionality.

These improvements are not considered implemented until their code and behavior have been verified.

## 15. Conclusion

The Quiz Game technical design uses React, TypeScript, FastAPI, Python, SQLAlchemy, and SQLite to implement an Admin-oriented quiz-management system.

The MVP focuses on quiz and question CRUD operations, REST API communication, validation, and database persistence. The Beta release will extend the system with authentication, RBAC, permission scopes, administrative functionality, and deployment.

This document should be updated whenever a significant technical decision or implementation change is made.