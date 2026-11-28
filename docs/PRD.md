
# Product Requirements Document (PRD) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Product Requirements Document (PRD) |
| Version | MVP + Beta |
| Status | Updated Draft – Implemented Features |
| Frontend | React 19.3 + TypeScript 7.0 |
| Build Tool | Vite 8.3 |
| Backend | FastAPI + Python |
| ORM | SQLAlchemy |
| Database | SQLite (Local Development) / PostgreSQL (Deployment) |
| Authentication | JWT-based Authentication |
| Authorization | Role-Based Access Control (RBAC) and Group Permissions |
| Architecture | Client–Server with REST API |

## 1. Product Overview

Quiz Game is a web-based application designed to provide a platform for creating, managing, and participating in multiple-choice quizzes. It supports two primary user roles: Admin and Student.

The application uses a React and TypeScript frontend connected to a FastAPI backend through REST APIs. SQLAlchemy handles database operations, while the database configuration supports SQLite for local development and PostgreSQL for deployment.

The project was developed in two releases:

- **MVP (Mid-term):** Focused on Admin-side quiz and question management, including create, view, update, and delete operations.
- **Beta (Final):** Extended the MVP with authentication, role-based access control, user management, Admin dashboard, group management, quiz attempts, scoring, attempt history, audit logging, and deployment configuration.

## 2. Problem Statement

Managing quiz content manually can be difficult when quiz information and questions are stored in separate places. Quiz managers need a consistent way to create, organize, update, and remove quiz content.

Students also need a platform where they can access their accounts, participate in available quizzes, view their results, and manage their groups.

Quiz Game addresses these requirements by providing a centralized quiz-management and participation platform with authentication, authorization, and persistent data storage.

## 3. Product Goals

1. Provide an intuitive interface for managing quizzes and questions.
2. Support complete CRUD operations for quiz and question resources.
3. Allow registered Students to participate in published quizzes.
4. Automatically calculate quiz results based on submitted answers.
5. Maintain personal quiz attempt history.
6. Provide secure authentication and role-based authorization.
7. Allow Admins to manage users, roles, groups, and administrative permissions.
8. Allow Students to create and manage their own groups.
9. Maintain persistent data through a configurable database.
10. Separate frontend presentation, backend business logic, and database operations.
11. Provide validation, error handling, and security controls.
12. Maintain a manageable and testable codebase suitable for a university project.

## 4. Target Users

### 4.1 Admin / Quiz Manager

The Admin is responsible for managing quiz content and administrative operations.

**Responsibilities:**

- Log in securely.
- Access the Admin dashboard.
- Create, view, update, and delete quizzes.
- Add, view, update, and delete questions.
- View and manage user accounts.
- Change user roles and account status.
- Ban and unban users.
- Create and manage groups.
- Add or remove Students from groups.
- Assign and revoke group permissions.
- View administrative audit logs.

### 4.2 Student

Students are registered users who can access student-specific features.

**Responsibilities:**

- Register and log in.
- View and update their profile information.
- Change their password.
- Manage their active login sessions.
- View available published quizzes.
- Participate in published quizzes.
- Submit answers to all questions in a quiz.
- Receive automatically calculated quiz results.
- View their own quiz attempt history.
- Create groups.
- Add or remove members from groups they own.
- Update or delete their own groups.
- View their group memberships and permissions.
- Access resources when the required group permission is available.

**Group ownership restriction:** A Student can update, delete, and manage members only in groups they own. Students cannot assign or revoke group permissions.

### 4.3 Guest

A guest is a user who has not authenticated.

- Guests can access only the endpoints and information that do not require authentication.
- Registration and login are available to allow guests to become authenticated users.
- Protected Student and Admin operations require authentication and appropriate authorization.

## 5. User Stories

### 5.1 Admin User Stories — MVP

- **US-01:** As an Admin, I want to create a quiz so that I can add new quiz content.
- **US-02:** As an Admin, I want to view the quiz list so that I can manage existing quizzes.
- **US-03:** As an Admin, I want to view quiz details so that I can inspect quiz information.
- **US-04:** As an Admin, I want to update a quiz so that I can modify its information.
- **US-05:** As an Admin, I want to delete a quiz so that unnecessary content can be removed.
- **US-06:** As an Admin, I want to add questions to a quiz.
- **US-07:** As an Admin, I want to view existing questions.
- **US-08:** As an Admin, I want to update question text and answer options.
- **US-09:** As an Admin, I want to delete outdated questions.

### 5.2 Admin User Stories — Beta

- **US-10:** As an Admin, I want to log in securely to access protected features.
- **US-11:** As an Admin, I want to access an Admin dashboard to view administrative information.
- **US-12:** As an Admin, I want to manage user accounts and roles.
- **US-13:** As an Admin, I want to activate, deactivate, ban, or unban user accounts.
- **US-14:** As an Admin, I want to manage groups and their members.
- **US-15:** As an Admin, I want to assign and revoke group permissions.
- **US-16:** As an Admin, I want to view audit logs to review recorded administrative activities.
- **US-17:** As an Admin, I want protected operations to require appropriate authorization.

### 5.3 Student User Stories — Beta

- **US-18:** As a Student, I want to register and log in to access my account.
- **US-19:** As a Student, I want to view and update my profile.
- **US-20:** As a Student, I want to change my password and manage my login sessions.
- **US-21:** As a Student, I want to view available published quizzes.
- **US-22:** As a Student, I want to participate in a quiz and submit my answers.
- **US-23:** As a Student, I want to receive my quiz score and result.
- **US-24:** As a Student, I want to view my previous quiz attempts.
- **US-25:** As a Student, I want to create my own groups.
- **US-26:** As a Student, I want to add or remove members from groups I own.
- **US-27:** As a Student, I want to update or delete groups I own.
- **US-28:** As a Student, I want to view my group memberships and available permissions.
- **US-29:** As a Student, I want to access group resources when I have the required permission.

### 5.4 User Story Summary

| User Story | Feature | Release |
|---|---|---|
| US-01–US-09 | Quiz and question management | MVP |
| US-10–US-17 | Admin authentication and administration | Beta |
| US-18–US-24 | Student account and quiz participation | Beta |
| US-25–US-29 | Group management and permissions | Beta |

## 6. Scope and Release Plan

### 6.1 MVP — Mid-term Release

The MVP includes:

- React and TypeScript Admin interface.
- FastAPI and Python backend.
- REST API communication using JSON.
- Quiz creation, listing, detail retrieval, updating, and deletion.
- Question creation, retrieval, updating, and deletion.
- SQLAlchemy database integration.
- SQLite local database support.
- Input validation and basic error handling.
- Local frontend and backend execution.
- Development-only access restriction for management endpoints.

**MVP limitations:**

- No complete user authentication system.
- No production-ready RBAC.
- No Student quiz participation workflow.
- No automated quiz scoring.
- No Student group management.
- No production-ready authorization for public management access.

### 6.2 Beta — Final Release

The implemented Beta scope extends the MVP with:

**Authentication and Account Management**
- Student registration and login.
- Admin login.
- JWT-based access authentication.
- Refresh-token session management.
- Secure password hashing using Argon2 with password peppering.
- Profile viewing and updating.
- Password changing.
- Logout and session revocation.

**Authorization and Administration**
- Admin and Student role separation.
- Backend-enforced RBAC.
- Protected API operations.
- Admin dashboard statistics.
- User listing and account management.
- User role and status management.
- User ban and unban functionality.
- Administrative audit logs.

**Group Management**
- Admin group creation and management.
- Admin member management.
- Admin group permission assignment and revocation.
- Student group creation.
- Student owner-only group update and deletion.
- Student owner-only member addition and removal.
- Student group and permission retrieval.
- Permission-protected group resources.

**Student Quiz Participation**
- Viewing available published quizzes.
- Submitting answers to quizzes.
- Validating submitted answers.
- Automatic score calculation.
- Saving quiz attempts and individual answers.
- Viewing personal attempt history.

**Database and Deployment**
- Configurable database connection.
- SQLite local fallback.
- PostgreSQL deployment support.
- Environment-based configuration.
- Frontend and backend deployment configuration.

## 7. Functional Features

| ID | Feature | Description | Release |
|---|---|---|---|
| F-01 | Quiz Listing | Display available quiz records. | MVP |
| F-02 | Quiz Details | Retrieve individual quiz information. | MVP |
| F-03 | Create Quiz | Create a quiz with required information. | MVP |
| F-04 | Update Quiz | Modify existing quiz information. | MVP |
| F-05 | Delete Quiz | Remove an existing quiz. | MVP |
| F-06 | Create Question | Add an MCQ question to a quiz. | MVP |
| F-07 | View Question | Retrieve an individual question. | MVP |
| F-08 | Update Question | Modify question text, options, or correct answer. | MVP |
| F-09 | Delete Question | Remove an existing question. | MVP |
| F-10 | Input Validation | Validate incoming data and handle invalid requests. | MVP |
| F-11 | Authentication | Register and authenticate users. | Beta |
| F-12 | RBAC | Enforce access according to user roles. | Beta |
| F-13 | Permission Scopes | Enforce group-based permissions for protected resources. | Beta |
| F-14 | Admin Dashboard | Display administrative statistics. | Beta |
| F-15 | User Management | Manage user accounts, roles, and status. | Beta |
| F-16 | Student Profile | View and update personal account information. | Beta |
| F-17 | Session Management | Refresh, revoke, and manage login sessions. | Beta |
| F-18 | Group Management | Create, update, delete, and manage groups. | Beta |
| F-19 | Group Membership | Add, remove, and view group members. | Beta |
| F-20 | Group Permissions | Assign, revoke, and retrieve group permissions. | Beta |
| F-21 | Quiz Attempts | Allow Students to submit answers to published quizzes. | Beta |
| F-22 | Automatic Scoring | Calculate correct answers and quiz results. | Beta |
| F-23 | Attempt History | Store and display a Student's own quiz attempts. | Beta |
| F-24 | Audit Logging | Record relevant authentication and administrative activities. | Beta |
| F-25 | Deployment | Support deployment with environment-based configuration. | Beta |

## 8. Non-Functional Requirements

- **Usability:** The interface should be easy to understand and navigate for both Admins and Students.
- **Performance:** Normal application requests should respond promptly under typical academic demonstration workloads.
- **Reliability:** Invalid requests and missing resources should return appropriate errors.
- **Data Integrity:** Quiz, question, user, group, membership, and attempt records must maintain consistent relationships.
- **Security:** Authentication and authorization must be enforced by the backend.
- **Password Security:** Passwords must be stored as secure hashes rather than plaintext.
- **Session Security:** Refresh tokens must be stored securely and support expiration and revocation.
- **Maintainability:** Frontend components, API services, backend routers, schemas, services, and database models should remain organized.
- **Compatibility:** The application should work in modern web browsers and supported development environments.
- **Scalability:** The architecture should allow future functionality to be added without a complete redesign.

## 9. Out of Scope

The following features are not included in the current implemented project scope:

- AI-generated questions.
- AI-based grading.
- Live multiplayer quiz competitions.
- Real-time chat or video communication.
- Payment or subscription functionality.
- Native Android or iOS applications.
- A complete quiz publishing and unpublishing management workflow.
- Student assignment of group permissions.

**Note:** The database retains an `is_published` field, and Student quiz attempts are restricted to published quizzes. However, a separate publish/unpublish management workflow is not implemented.

## 10. Success Criteria

The MVP is considered successful when:

1. The frontend communicates with the FastAPI backend.
2. Quiz records can be retrieved and displayed.
3. Quiz CRUD operations work through REST APIs.
4. Question CRUD operations work through REST APIs.
5. Quiz and question data persist in the database.
6. Invalid input and missing resources are handled appropriately.
7. The application can run locally.
8. The GitHub feature branch and pull request follow the project workflow.

The Beta is considered successful when:

1. Admin and Student authentication work.
2. Protected endpoints enforce authentication and authorization.
3. Passwords are securely hashed.
4. User roles and account status can be managed.
5. Admin dashboard information is available.
6. Admins can manage users and groups.
7. Admins can assign and revoke group permissions.
8. Students can create and manage their own groups.
9. Students can participate in published quizzes.
10. Quiz results are calculated and stored correctly.
11. Students can view their own attempt history.
12. Audit logs record relevant activities.
13. The application supports the configured deployment database.

## 11. Assumptions and Constraints

- React and TypeScript are used for the frontend.
- FastAPI and Python are used for the backend.
- SQLAlchemy is used for database operations.
- Pydantic schemas are used for request and response validation.
- SQLite is the local development fallback database.
- PostgreSQL is supported through the configured database URL.
- The backend is responsible for authentication, authorization, validation, and database operations.
- User roles are stored as `admin` and `user`; the application refers to ordinary users as Students.
- Student group management is restricted to the group owner.
- Group permissions are assigned and revoked by Admins.
- Student quiz attempts require an authenticated Student account.
- Students can view their own attempt history through the personal attempt endpoint.

## 12. Dependencies

- Python and backend dependencies.
- Node.js and npm.
- React 19.3 and React DOM.
- TypeScript 7.0.
- Vite 8.3.
- FastAPI.
- SQLAlchemy.
- Psycopg PostgreSQL driver.
- pwdlib with Argon2 support.
- PyJWT.
- pytest for backend development testing.
- SQLite for local development.
- PostgreSQL for configured deployment.
- Git and GitHub.
- Suitable frontend and backend hosting platforms.

## 13. Release Summary

| Area | MVP | Beta |
|---|---|---|
| React + TypeScript frontend | Included | Retained |
| FastAPI backend | Included | Retained |
| REST API integration | Included | Retained |
| Quiz CRUD | Included | Retained |
| Question CRUD | Included | Retained |
| SQLite persistence | Included | Local fallback |
| PostgreSQL support | Not included | Included |
| Local development | Included | Supported |
| Authentication | Not included | Implemented |
| Admin/Student RBAC | Not included | Implemented |
| Group permissions | Not included | Implemented |
| Admin dashboard | Not included | Implemented |
| User management | Not included | Implemented |
| Student profile | Not included | Implemented |
| Group management | Not included | Implemented |
| Quiz participation | Not included | Implemented |
| Automatic scoring | Not included | Implemented |
| Attempt history | Not included | Implemented |
| Audit logging | Not included | Implemented |
| Deployment configuration | Not included | Implemented |

## 14. Conclusion

Quiz Game has evolved from an Admin-oriented quiz-management MVP into a web-based quiz management and participation platform.

The MVP established quiz and question CRUD operations through a React and TypeScript frontend, FastAPI backend, REST APIs, and database persistence.

The Beta extends this foundation with authentication, RBAC, user management, group management, permission scopes, Student quiz participation, automatic scoring, attempt history, audit logging, and deployment configuration.

The application provides separate experiences for Admins and Students while enforcing access restrictions through backend authorization.
