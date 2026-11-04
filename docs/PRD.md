# Product Requirements Document (PRD) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Product Requirements Document (PRD) |
| Version | MVP + Beta |
| Status | Updated Draft |
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |
| Database | SQLite (MVP) |
| Architecture | Client–Server with REST API |

## 1. Product Overview

Quiz Game is a web-based application designed to provide a structured platform for creating and managing multiple-choice quizzes. The application separates the frontend interface from backend operations through REST APIs.

The project is developed in two releases:

- **MVP (Mid-term):** Focuses on Admin-side quiz and question management. Admin users can create, view, update, and delete quizzes and questions through a React frontend connected to a FastAPI backend. Data is stored in a local database.
- **Beta (Final):** Extends the MVP with authentication, role-based access control (RBAC), permission scopes, an Admin dashboard, user-management functionality, and deployment.

## 2. Problem Statement

Managing quiz content manually can be difficult when quiz information and questions are stored in separate places. Quiz managers need a consistent way to create, organize, update, and remove quiz content.

Quiz Game addresses this problem by providing a centralized quiz-management interface backed by REST APIs and persistent data storage.

## 3. Product Goals

1. Provide an intuitive interface for managing quizzes and their questions.
2. Support complete CRUD operations for quiz and question resources.
3. Maintain persistent quiz data through a database.
4. Separate frontend presentation and backend business logic.
5. Provide clear validation and error handling.
6. Introduce authentication and role-based permissions in the Beta release.
7. Maintain a manageable, testable codebase suitable for a university project demonstration.

## 4. Target Users

### 4.1 Admin / Quiz Manager

The Admin is responsible for managing quiz content.

**MVP responsibilities:**
- Create quizzes.
- View the quiz list and individual quiz details.
- Update quiz information.
- Delete quizzes.
- Add questions to a quiz.
- View, update, and delete questions.

**Beta responsibilities:**
- Log in securely.
- Access the Admin dashboard.
- Perform authorized management operations.
- Manage user accounts and roles when permitted.

### 4.2 Student

Student functionality is planned for the Beta release.

**Planned Beta responsibilities:**
- Register and log in.
- Access features permitted by the Student role.
- View their own profile and relevant dashboard information.

Quiz participation, answer submission, scoring, and attempt history will be included only if confirmed in the final project requirements and implemented.

### 4.3 Guest

A guest is a user who has not authenticated. Public access to quiz information will be defined as part of the Beta access-control design. The MVP is intended for local Admin-management demonstration, not public use.

## 5. User Stories

### 5.1 Admin User Stories — MVP

- **US-01:** As an Admin, I want to create a quiz so that I can add new quiz content.
- **US-02:** As an Admin, I want to view the quiz list so that I can manage existing quizzes.
- **US-03:** As an Admin, I want to view a quiz's details so that I can inspect its information.
- **US-04:** As an Admin, I want to update a quiz so that I can correct or modify its information.
- **US-05:** As an Admin, I want to delete a quiz so that unnecessary content can be removed.
- **US-06:** As an Admin, I want to add questions to a quiz so that the quiz contains relevant questions.
- **US-07:** As an Admin, I want to view questions so that I can review existing content.
- **US-08:** As an Admin, I want to update questions so that I can correct question text or answer options.
- **US-09:** As an Admin, I want to delete questions so that outdated questions can be removed.

### 5.2 Admin User Stories — Beta

- **US-10:** As an Admin, I want to log in so that I can access protected management features.
- **US-11:** As an Admin, I want to access an Admin dashboard so that I can view administrative information.
- **US-12:** As an Admin, I want to manage user accounts and roles so that users receive appropriate permissions.
- **US-13:** As an Admin, I want protected operations to require appropriate permissions so that unauthorized users cannot perform administrative actions.

### 5.3 Student User Stories — Beta

- **US-14:** As a Student, I want to register and log in so that I can access my account.
- **US-15:** As a Student, I want to view my profile so that I can access my account information.
- **US-16:** As a Student, I want to see relevant personal dashboard information.

### 5.4 User Story Summary

| User Story | Feature | Release |
|---|---|---|
| US-01–US-09 | Quiz and question management | MVP |
| US-10–US-13 | Admin authentication and administration | Beta |
| US-14–US-16 | Student account and profile | Beta |

## 6. Scope and Release Plan

### 6.1 MVP — Mid-term Release

The MVP includes:

- React + TypeScript Admin interface.
- FastAPI + Python backend.
- REST API communication using JSON.
- Quiz creation, listing, detail retrieval, updating, and deletion.
- Question creation, retrieval, updating, and deletion.
- SQLite database integration.
- Input validation and basic error handling.
- Local frontend and backend execution.
- Local development-only protection for management endpoints.

**MVP limitations:**

- No user registration or login.
- No production-ready authentication or RBAC.
- No Student dashboard.
- No quiz attempt or answer-submission workflow.
- No backend score-calculation feature.
- No implemented publish/unpublish workflow.
- Management endpoints must not be exposed publicly without proper authentication and authorization.

### 6.2 Beta — Final Release

The planned Beta scope includes:

- Admin authentication and login.
- Secure password hashing.
- Token-based authentication.
- Admin and Student roles.
- Role-Based Access Control (RBAC).
- Permission scopes for protected operations.
- Admin dashboard.
- Authorized user-management functionality.
- Student profile functionality.
- Expanded validation and security testing.
- Production database configuration.
- Frontend and backend deployment.

Any additional student quiz-participation features will be added only if confirmed by the final requirements.

## 7. Functional Features

| ID | Feature | Description | Release |
|---|---|---|---|
| F-01 | Quiz Listing | Display the available quiz records in the management interface. | MVP |
| F-02 | Quiz Details | Retrieve and display an individual quiz's information. | MVP |
| F-03 | Create Quiz | Create a quiz with its required information. | MVP |
| F-04 | Update Quiz | Modify existing quiz information. | MVP |
| F-05 | Delete Quiz | Remove an existing quiz. | MVP |
| F-06 | Create Question | Add an MCQ question to a quiz. | MVP |
| F-07 | View Question | Retrieve an individual question for management. | MVP |
| F-08 | Update Question | Modify question text, options, or correct-option information. | MVP |
| F-09 | Delete Question | Remove an existing question. | MVP |
| F-10 | Input Validation | Validate incoming data and handle invalid requests. | MVP |
| F-11 | Authentication | Authenticate registered users. | Beta |
| F-12 | RBAC | Enforce access according to user roles. | Beta |
| F-13 | Permission Scopes | Enforce permissions for protected API operations. | Beta |
| F-14 | Admin Dashboard | Provide administrative information and navigation. | Beta |
| F-15 | User Management | Manage authorized user accounts and roles. | Beta |
| F-16 | Student Profile | Provide personal account information. | Beta |
| F-17 | Deployment | Deploy the application with appropriate security and database configuration. | Beta |

## 8. Non-Functional Requirements

- **Usability:** The interface should be easy to understand and navigate.
- **Performance:** Normal quiz and question management requests should respond promptly under typical demonstration workloads.
- **Reliability:** Invalid requests and missing resources should return appropriate errors instead of crashing the application.
- **Data Integrity:** Quiz and question information must be stored consistently.
- **Security:** Protected operations must be authorized by the backend before public deployment.
- **Maintainability:** Frontend components, backend routes, schemas, and database models should remain organized.
- **Compatibility:** The application should work in modern web browsers.
- **Scalability:** The architecture should allow future features to be added without requiring a complete redesign.

## 9. Out of Scope

The following are not included in the current MVP:

- Student quiz participation.
- Answer submission and score calculation.
- Quiz publishing and unpublishing.
- User registration and login.
- Student/Admin permission enforcement.
- User profile and dashboard.
- AI-generated questions or AI-based grading.
- Live multiplayer competitions.
- Real-time chat or video.
- Payment or subscription functionality.
- Native Android or iOS applications.

## 10. Success Criteria

The MVP will be considered successful when:

1. The frontend can communicate with the FastAPI backend.
2. The Admin interface can retrieve and display quiz records.
3. Quiz CRUD operations work through REST APIs.
4. Question CRUD operations work through REST APIs.
5. Quiz and question data persist in the database.
6. Invalid input and missing resources are handled appropriately.
7. The application can be started and demonstrated locally.
8. The GitHub feature branch and pull request follow the project workflow.

The Beta will be considered successful when its planned authentication, authorization, dashboard, user-management, testing, and deployment requirements have been implemented and verified.

## 11. Assumptions and Constraints

- React + TypeScript and FastAPI + Python are the required technologies.
- The MVP is developed for a university course demonstration.
- SQLite is used for local MVP data persistence.
- The backend is responsible for data validation and database operations.
- The MVP management access check is intended only for local development.
- Authentication and production authorization must be implemented before exposing management endpoints publicly.
- Beta requirements may be refined based on instructor feedback.

## 12. Dependencies

- Python and backend dependencies.
- Node.js and npm.
- React and TypeScript.
- FastAPI and SQLAlchemy.
- SQLite for local persistence.
- Git and GitHub.
- A suitable hosting platform and persistent database for Beta deployment.

## 13. Release Summary

| Area | MVP | Beta |
|---|---|---|
| React + TypeScript frontend | Included | Retained |
| FastAPI backend | Included | Retained |
| REST API integration | Included | Retained |
| Quiz CRUD | Included | Retained |
| Question CRUD | Included | Retained |
| SQLite persistence | Included | Development database may be replaced |
| Local development | Included | Supported |
| Authentication | Not included | Planned |
| Admin/Student RBAC | Not included | Planned |
| Permission scopes | Not included | Planned |
| Admin dashboard | Not included | Planned |
| User management | Not included | Planned |
| Student profile | Not included | Planned |
| Production deployment | Not included | Planned |

## 14. Conclusion

Quiz Game's MVP provides a functional foundation for quiz-content administration through a React and TypeScript frontend, a FastAPI backend, REST APIs, and database persistence. The Beta release will extend this foundation with authentication, role-based permissions, administrative features, and deployment.