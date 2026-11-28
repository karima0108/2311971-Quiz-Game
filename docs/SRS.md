
# Software Requirements Specification (SRS)
## Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Project Type | Web-Based Quiz Management and Assessment System |
| Document Type | Software Requirements Specification |
| Version | MVP and Beta |
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Database | SQLite (local development) / PostgreSQL (deployment) |
| API Documentation | `/api/docs` |
| Repository | https://github.com/karima0108/2311971-Quiz-Game |

---

# 1. Introduction

## 1.1 Purpose

The purpose of this Software Requirements Specification (SRS) is to describe the functional and non-functional requirements of the Quiz Game application.

This document covers both the MVP (Mid-term) and Beta (Final) releases. It defines the system requirements, user interactions, API requirements, data requirements, and acceptance criteria for both releases.

The MVP establishes the core quiz management functionality. The Beta release extends the MVP by introducing authentication, role-based access control, administrative features, student functionality, group management, and additional security mechanisms.

## 1.2 Scope

The Quiz Game is a web-based application developed using React, TypeScript, FastAPI, and SQLAlchemy.

The system is developed in two releases.

### MVP (Mid-term Release)

The MVP focuses on the core quiz management functionality.

It includes:
- Creating quizzes.
- Viewing quiz lists.
- Retrieving individual quiz information.
- Updating quizzes.
- Deleting quizzes.
- Adding questions to quizzes.
- Retrieving questions.
- Updating questions.
- Deleting questions.
- Basic request validation.
- Backend health checking.
- REST API documentation.

### Beta (Final Release)

The Beta release extends the MVP with additional application functionality.

It includes:
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Refresh token management.
- Role-Based Access Control (RBAC).
- Admin dashboard.
- Admin account management.
- User management.
- User activation and deactivation.
- User banning and unbanning.
- Group and membership management.
- Group-based permissions.
- Student profile management.
- Student quiz attempts and result calculation.
- Student attempt history.
- Login session management.
- Audit logging.

The Beta release retains the core MVP quiz and question management features.

## 1.3 Definitions and Abbreviations

| Term | Definition |
|---|---|
| MVP | Minimum Viable Product |
| Beta | Extended release following the MVP |
| Admin | A user with administrative privileges |
| Student | A regular registered user |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| ORM | Object-Relational Mapping |
| SRS | Software Requirements Specification |
| Audit Log | A record of important system activities |
| Refresh Token | A token used to obtain a new access token |
| Group Permission | A permission assigned to a group |

---

# 2. Overall Description

## 2.1 Product Perspective

The Quiz Game is a standalone web-based application consisting of a frontend, backend API, and relational database.

The frontend communicates with the backend through REST API endpoints. The backend handles request processing, validation, business logic, authentication, authorization, and database operations.

The MVP provides the foundation for quiz and question management.

The Beta release extends the system with user authentication, role-based access, administrative management, student activities, group functionality, and audit logging.

## 2.2 User Classes

### 2.2.1 Admin

The Admin is responsible for managing the application.

Admin capabilities in the Beta release include:
- Secure login.
- Managing quizzes and questions.
- Viewing dashboard statistics.
- Managing registered users.
- Updating user roles and account status.
- Banning and unbanning users.
- Managing administrator accounts.
- Creating and managing groups.
- Managing group members and permissions.
- Viewing audit logs.

### 2.2.2 Student

A Student is a registered regular user of the application.

Student capabilities in the Beta release include:
- Creating an account and logging in.
- Viewing available quizzes.
- Attempting published quizzes.
- Submitting quiz answers.
- Viewing personal quiz attempt history.
- Updating profile information.
- Changing passwords.
- Managing login sessions.
- Creating and managing owned groups.
- Managing members of owned groups.
- Viewing group permissions and accessing permitted group resources.

### 2.2.3 Guest User

A Guest User is an unauthenticated visitor.

In the Beta release, a Guest User can access the registration and login functionality. Access to protected features requires authentication.

## 2.3 Operating Environment

### Client Side
- Modern web browsers such as Google Chrome, Microsoft Edge, and Firefox.
- React.
- TypeScript.
- Vite.

### Server Side
- Python.
- FastAPI.
- SQLAlchemy.
- Pydantic.
- PyJWT.
- pwdlib with Argon2 password hashing.

### Database
- SQLite for local development when no database URL is configured.
- PostgreSQL for deployment when configured through the database environment variable.
- Supabase PostgreSQL can be used as the hosted database.

---

# 3. Functional Requirements

Functional requirements are divided into MVP and Beta requirements to identify which features belong to each release.

## 3.1 MVP Functional Requirements

### FR-MVP-01: Create Quiz

The system shall allow an authorized user to create a new quiz by providing the required quiz information.

The system shall:
- Accept quiz title.
- Accept quiz description.
- Validate required information.
- Store the quiz in the database.
- Return the created quiz information.

### FR-MVP-02: Retrieve Quiz List

The system shall provide an API to retrieve the available quiz list.

The system shall return relevant quiz information stored in the database.

### FR-MVP-03: Retrieve Individual Quiz

The system shall allow a user to retrieve information about a specific quiz using its ID.

If the requested quiz does not exist, the system shall return an appropriate error response.

### FR-MVP-04: Update Quiz

The system shall allow an existing quiz to be updated.

The system shall:
- Identify the quiz using its ID.
- Validate the submitted information.
- Update the relevant fields.
- Return the updated quiz information.

### FR-MVP-05: Delete Quiz

The system shall allow an existing quiz to be deleted using its ID.

The system shall handle associated question records according to the configured database relationship.

### FR-MVP-06: Add Question

The system shall allow questions to be added to an existing quiz.

Each question shall contain:
- Question text.
- Answer options.
- Correct option index.
- Associated quiz ID.

### FR-MVP-07: Retrieve Question

The system shall allow a specific question to be retrieved using its ID.

### FR-MVP-08: Update Question

The system shall allow an existing question to be updated.

The system shall validate the submitted question information before updating the database.

### FR-MVP-09: Delete Question

The system shall allow an existing question to be deleted using its ID.

### FR-MVP-10: Input Validation

The system shall validate incoming API requests.

Invalid or incomplete data shall be rejected with appropriate error responses.

### FR-MVP-11: Backend Health Check

The system shall provide a health endpoint to verify that the backend application is running.

### FR-MVP-12: API Documentation

The system shall provide API documentation through FastAPI's interactive documentation interface.

## 3.2 Beta Functional Requirements

The Beta release shall retain all MVP functionality and introduce the following requirements.

### FR-BETA-01: User Registration

The system shall allow new users to register by providing the required account information.

The system shall:
- Validate the submitted information.
- Normalize email addresses.
- Prevent duplicate email registration.
- Store passwords as secure password hashes.
- Assign the regular user role by default.

### FR-BETA-02: User Login

The system shall allow registered users to log in using valid credentials.

The system shall:
- Verify the submitted password.
- Reject invalid credentials.
- Prevent inactive or banned users from logging in.
- Generate an access token.
- Create a refresh session.
- Record relevant authentication activities.

### FR-BETA-03: Authentication and Token Management

The system shall authenticate protected API requests using valid access tokens.

The system shall:
- Validate access tokens.
- Verify user identity.
- Verify session validity.
- Support refresh token rotation.
- Store hashed refresh tokens in the database.
- Store refresh tokens in HttpOnly cookies.
- Revoke sessions during logout.

### FR-BETA-04: Role-Based Access Control

The system shall support two primary account roles:
- Admin
- User (Student)

The system shall restrict administrative operations to authorized Admin users.

### FR-BETA-05: Authorization and Permission Checks

The system shall enforce authorization through backend dependencies.

The system shall:
- Restrict administrative endpoints to Admin users.
- Restrict student-specific endpoints to regular users.
- Verify group membership and permissions for protected group resources.
- Reject unauthorized requests with appropriate HTTP status codes.

### FR-BETA-06: Admin Dashboard

The system shall provide an administrative dashboard.

The dashboard shall retrieve relevant application statistics through the backend dashboard API.

### FR-BETA-07: Admin User Management

The system shall allow Admin users to manage registered accounts.

The system shall support:
- Retrieving user lists.
- Searching users.
- Viewing individual user details.
- Activating or deactivating accounts.
- Updating user roles.
- Banning users.
- Unbanning users.
- Bulk banning users.
- Bulk unbanning users.

### FR-BETA-08: Admin Account Management

The system shall provide administrator account management functionality.

Authorized administrators shall be able to:
- View administrator accounts.
- Create administrator accounts.
- Delete administrator accounts.

### FR-BETA-09: Student Profile Management

The system shall allow authenticated students to:
- View their profile.
- Update their name.
- Change their password.

The system shall verify the current password before accepting a password change.

### FR-BETA-10: Student Quiz Attempts

The system shall allow authenticated students to attempt published quizzes.

The system shall:
- Verify that the quiz exists and is published.
- Require at least one question.
- Reject duplicate question submissions.
- Require answers to all questions.
- Validate selected answer options.
- Compare submitted answers with correct options.
- Calculate the quiz result.
- Store the attempt and individual answers.

### FR-BETA-11: Student Attempt History

The system shall allow students to retrieve their own quiz attempt history.

The system shall:
- Return only the authenticated student's attempts.
- Display attempts in descending submission-time order.
- Include relevant quiz and result information.

### FR-BETA-12: Session Management

The system shall allow authenticated users to manage their own login sessions.

Users shall be able to:
- View active sessions.
- Identify the current session.
- Revoke a specific session.
- Revoke all active sessions.

### FR-BETA-13: Group Management

The system shall support group creation and management.

Students shall be able to:
- Create a group.
- Become a member of the group they create.
- Update groups they own.
- Delete groups they own.
- View members of their own groups.
- Add members by email.
- Remove members from their own groups.
- View their group memberships.

### FR-BETA-14: Admin Group Management

Admin users shall be able to:
- Create groups.
- View all groups.
- View individual group information.
- Update groups.
- Delete groups.
- View group members.
- Add or remove group members.
- View group permissions.
- Assign group permissions.
- Revoke group permissions.

### FR-BETA-15: Group-Based Permissions

The system shall support permission-based access for groups.

The system shall:
- Allow Admin users to assign permissions to groups.
- Allow Admin users to revoke group permissions.
- Allow authorized group members to access resources when the required permission exists.
- Allow Admin users to bypass group-level permission checks where applicable.

### FR-BETA-16: Audit Logging

The system shall record important system activities.

Audit records may include:
- Actor information.
- Action type.
- Target type and identifier.
- Description and additional details.
- IP address, when available.
- Activity timestamp.

Admin users shall be able to retrieve audit logs and individual audit log details.

---

# 4. Use Cases

## UC-01: Create and Manage Quiz

**Release:** MVP

**Actor:** Authorized User

**Precondition:** The backend application is running.

**Main Flow:**
1. The user accesses the quiz management functionality.
2. The user views the existing quiz list.
3. The user creates a new quiz or selects an existing quiz.
4. The user performs an available operation such as viewing, updating, or deleting.
5. The frontend sends the API request.
6. The backend validates the request.
7. The database is updated when required.
8. The system returns the operation result.

**Postcondition:** The requested quiz operation is completed.

## UC-02: Manage Questions

**Release:** MVP

**Actor:** Authorized User

**Precondition:** The target quiz exists.

**Main Flow:**
1. The user selects a quiz.
2. The user adds a new question or selects an existing question.
3. The user performs an available operation such as retrieving, updating, or deleting.
4. The backend validates the request.
5. The database is updated.
6. The system returns the operation result.

**Postcondition:** The requested question operation is completed.

## UC-03: User Registration

**Release:** Beta

**Actor:** Guest User

**Precondition:** The user does not already have an account.

**Main Flow:**
1. The user opens the registration interface.
2. The user provides the required information.
3. The frontend sends the registration request.
4. The backend validates the information.
5. The backend checks for duplicate email addresses.
6. The password is securely hashed.
7. The user account is created with the regular user role.
8. The system returns the registration result.

**Postcondition:** A new user account is created.

## UC-04: User Login

**Release:** Beta

**Actor:** Admin or Student

**Precondition:** The user has a valid account.

**Main Flow:**
1. The user opens the login page.
2. The user enters email and password.
3. The frontend sends the login request.
4. The backend verifies the credentials.
5. The backend checks account status.
6. The backend creates an access token and refresh session.
7. The frontend receives the authentication result.
8. The user accesses the appropriate application interface.

**Postcondition:** The user is authenticated.

## UC-05: Admin Quiz and User Management

**Release:** Beta

**Actor:** Admin

**Precondition:** The Admin is authenticated.

**Main Flow:**
1. The Admin opens the administrative interface.
2. The Admin selects quiz or user management.
3. The Admin views the relevant information.
4. The Admin performs an available management operation.
5. The backend checks authorization.
6. The backend validates the request.
7. The database is updated.
8. Relevant audit information is recorded where applicable.
9. The frontend displays the operation result.

**Postcondition:** The requested administrative operation is completed.

## UC-06: Student Quiz Attempt

**Release:** Beta

**Actor:** Student

**Precondition:** The Student is authenticated and the quiz is published.

**Main Flow:**
1. The Student views available quizzes.
2. The Student selects a quiz.
3. The Student answers all questions.
4. The Student submits the answers.
5. The backend validates the submission.
6. The backend calculates the score.
7. The attempt and answers are stored.
8. The result is returned to the frontend.

**Postcondition:** The quiz attempt and result are recorded.

## UC-07: Group Management

**Release:** Beta

**Actor:** Student or Admin

**Precondition:** The user is authenticated.

**Main Flow:**
1. The user opens group management.
2. The user views group information.
3. A Student creates or manages a group they own, or an Admin manages groups through administrative functionality.
4. The backend verifies the user's role or ownership.
5. The backend validates the requested operation.
6. The database is updated.
7. The frontend displays the updated group information.

**Postcondition:** The requested group operation is completed.

## UC-08: Group Permission Management

**Release:** Beta

**Actor:** Admin

**Precondition:** The Admin is authenticated and the target group exists.

**Main Flow:**
1. The Admin selects a group.
2. The Admin views its permissions.
3. The Admin assigns or revokes a permission.
4. The backend verifies Admin authorization.
5. The database is updated.
6. The system returns the updated permission information.

**Postcondition:** The group's permission configuration is updated.

## UC-09: Session Management

**Release:** Beta

**Actor:** Admin or Student

**Precondition:** The user is authenticated.

**Main Flow:**
1. The user opens session management.
2. The system retrieves the user's active sessions.
3. The user selects a session or chooses to revoke all sessions.
4. The backend verifies ownership.
5. The selected session or sessions are revoked.
6. The system returns the operation result.

**Postcondition:** The selected sessions are revoked.

---

# 5. External Interface Requirements

## 5.1 User Interface Requirements

### MVP Interface

The MVP shall provide:
- Quiz management interface.
- Quiz list.
- Quiz creation and editing interface.
- Question management interface.
- Appropriate success and error feedback.

### Beta Interface

The Beta release shall extend the interface with:
- Login and registration interfaces.
- Admin dashboard.
- Admin management interface.
- User management interface.
- Group management interface.
- Audit log interface.
- Student quiz interface.
- Student profile interface.
- Student attempt history interface.
- Session management interface.

The interface shall provide appropriate feedback for successful operations, validation errors, and unauthorized access.

## 5.2 Software Interface Requirements

The frontend shall communicate with the backend using HTTP-based REST APIs.

The backend shall:
- Receive JSON requests where applicable.
- Validate request data using Pydantic schemas.
- Return JSON responses.
- Use HTTP status codes to communicate operation results.
- Interact with the relational database through SQLAlchemy.

## 5.3 API Documentation

The backend shall provide interactive API documentation through:

- Swagger UI: `/api/docs`
- ReDoc: `/api/redoc`
- OpenAPI JSON: `/api/openapi.json`

---

# 6. API Requirements

The following endpoints describe the MVP and Beta backend API interface.

## 6.1 MVP Quiz and Question APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quizzes` | Retrieve quizzes |
| GET | `/api/quizzes/{quiz_id}` | Retrieve quiz details |
| GET | `/api/quizzes/{quiz_id}/management` | Retrieve quiz management information |
| POST | `/api/quizzes` | Create a quiz |
| PATCH | `/api/quizzes/{quiz_id}` | Update a quiz |
| DELETE | `/api/quizzes/{quiz_id}` | Delete a quiz |
| POST | `/api/quizzes/{quiz_id}/questions` | Add a question |
| GET | `/api/questions/{question_id}` | Retrieve a question |
| PATCH | `/api/questions/{question_id}` | Update a question |
| DELETE | `/api/questions/{question_id}` | Delete a question |
| GET | `/api/health` | Check backend health |

## 6.2 Beta Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve current user profile |
| PATCH | `/api/auth/me` | Update current user profile |
| POST | `/api/auth/change-password` | Change account password |
| POST | `/api/auth/refresh` | Refresh access authentication |
| POST | `/api/auth/logout` | Log out current session |
| GET | `/api/auth/sessions` | Retrieve active sessions |
| DELETE | `/api/auth/sessions/{session_id}` | Revoke a specific session |
| DELETE | `/api/auth/sessions` | Revoke all sessions |
| POST | `/api/auth/demo-login/{role}` | Demo login for an allowed role |

## 6.3 Beta Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admins` | Retrieve administrator accounts |
| POST | `/api/admins` | Create an administrator account |
| DELETE | `/api/admins/{admin_id}` | Delete an administrator account |
| GET | `/api/admin/dashboard/stats` | Retrieve dashboard statistics |

## 6.4 Beta Admin User Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Retrieve or search users |
| GET | `/api/admin/users/{user_id}` | Retrieve user details |
| PATCH | `/api/admin/users/{user_id}/status` | Update account status |
| PATCH | `/api/admin/users/{user_id}/role` | Update user role |
| PATCH | `/api/admin/users/{user_id}/ban` | Ban a user |
| PATCH | `/api/admin/users/{user_id}/unban` | Unban a user |
| POST | `/api/admin/users/bulk-ban` | Ban multiple users |
| POST | `/api/admin/users/bulk-unban` | Unban multiple users |

## 6.5 Beta Group Management APIs

### Admin Group APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/groups` | Create a group |
| GET | `/api/admin/groups` | Retrieve groups |
| GET | `/api/admin/groups/{group_id}` | Retrieve group details |
| PATCH | `/api/admin/groups/{group_id}` | Update a group |
| DELETE | `/api/admin/groups/{group_id}` | Delete a group |
| GET | `/api/admin/groups/{group_id}/members` | Retrieve group members |
| POST | `/api/admin/groups/{group_id}/members` | Add a group member |
| DELETE | `/api/admin/groups/{group_id}/members/{user_id}` | Remove a group member |
| GET | `/api/admin/groups/{group_id}/permissions` | Retrieve group permissions |
| POST | `/api/admin/groups/{group_id}/permissions` | Assign a group permission |
| DELETE | `/api/admin/groups/{group_id}/permissions/{permission}` | Revoke a group permission |

### Student Group APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/groups` | Create an owned group |
| PATCH | `/api/groups/{group_id}` | Update an owned group |
| DELETE | `/api/groups/{group_id}` | Delete an owned group |
| GET | `/api/groups/{group_id}/members` | Retrieve owned group members |
| POST | `/api/groups/{group_id}/members` | Add a member to an owned group |
| DELETE | `/api/groups/{group_id}/members/{user_id}` | Remove a member from an owned group |
| GET | `/api/groups/me` | Retrieve current user's groups |
| GET | `/api/groups/me/permissions` | Retrieve current user's group permissions |
| GET | `/api/groups/resources` | Access permitted group resources |

## 6.6 Beta Student Attempt APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quizzes/{quiz_id}/attempts` | Submit a quiz attempt |
| GET | `/api/attempts/me` | Retrieve current user's attempt history |

## 6.7 Beta Audit Log APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/audit-logs` | Retrieve audit logs |
| GET | `/api/admin/audit-logs/{log_id}` | Retrieve an individual audit log |

---

# 7. Data Requirements

## 7.1 MVP Data Requirements

### Quiz Entity

The Quiz entity shall contain:
- Quiz ID.
- Title.
- Description.
- Publication status.
- Creation timestamp.

### Question Entity

The Question entity shall contain:
- Question ID.
- Associated Quiz ID.
- Question text.
- Answer options.
- Correct option index.

Each question shall belong to a quiz.

## 7.2 Beta Data Requirements

The Beta release shall extend the database with the following entities.

### User Entity

The User entity shall contain:
- User ID.
- Email.
- Name.
- Hashed password.
- Role.
- Account active status.
- Ban status.
- Ban reason.
- Ban timestamp.
- Banning administrator ID.
- Creation timestamp.

Email addresses shall be unique.

### Refresh Session Entity

The RefreshSession entity shall contain:
- Session ID.
- User ID.
- Hashed refresh token.
- Creation timestamp.
- Expiration timestamp.
- Revocation timestamp.
- Replacement token hash, when applicable.

### Quiz Attempt Entity

The QuizAttempt entity shall contain:
- Attempt ID.
- User ID.
- Quiz ID.
- Score.
- Total questions.
- Correct answers.
- Submission timestamp.

### Quiz Answer Entity

The QuizAnswer entity shall contain:
- Answer ID.
- Attempt ID.
- Question ID.
- Selected option.
- Correctness status.

### Group Entity

The Group entity shall contain:
- Group ID.
- Group name.
- Description.
- Owner ID.
- Creation timestamp.

Group names shall be unique.

### Group Membership Entity

The GroupMembership entity shall contain:
- Group ID.
- User ID.
- Creation timestamp.

A user shall not be added more than once to the same group.

### Group Permission Entity

The GroupPermission entity shall contain:
- Group ID.
- Permission name.
- Creation timestamp.

A group shall not contain duplicate permission entries.

### Audit Log Entity

The AuditLog entity shall contain:
- Actor ID.
- Action.
- Target type.
- Target ID.
- Description.
- Additional details.
- IP address.
- Creation timestamp.

---

# 8. Non-Functional Requirements

The following non-functional requirements apply to both MVP and Beta unless otherwise specified.

## NFR-01: Security

The system shall:
- Validate incoming requests.
- Protect database operations from invalid input.
- Store passwords securely in the Beta release.
- Use Argon2-based password hashing.
- Apply a server-side password pepper.
- Use JWT-based access authentication in the Beta release.
- Store refresh token hashes instead of raw refresh tokens.
- Use HttpOnly cookies for refresh tokens.
- Validate authentication and authorization on the backend.
- Protect administrative endpoints from unauthorized access.
- Prevent banned and inactive accounts from accessing protected functionality.

## NFR-02: Performance

The system should:
- Process common API requests efficiently.
- Avoid unnecessary database queries.
- Return appropriate responses without unnecessary delays.
- Support normal concurrent application usage.

## NFR-03: Reliability

The system shall:
- Validate input before database operations.
- Handle database and API errors appropriately.
- Preserve database relationships and integrity.
- Reject invalid authentication and authorization requests in the Beta release.

## NFR-04: Maintainability

The system shall:
- Separate frontend components from API service logic.
- Organize backend endpoints into router modules.
- Separate business logic into service modules where appropriate.
- Use structured database models and schemas.
- Maintain readable and modular code.

## NFR-05: Usability

The system shall:
- Provide understandable navigation.
- Display clear validation and error messages.
- Provide feedback after successful operations.
- Support common modern web browsers.

## NFR-06: Compatibility

The application shall support modern browsers and standard HTTP communication between frontend and backend.

## NFR-07: Data Integrity

The system shall:
- Enforce unique email addresses in the Beta release.
- Enforce unique group names in the Beta release.
- Maintain valid foreign-key relationships.
- Prevent duplicate group memberships.
- Prevent duplicate group permission entries.
- Validate quiz submissions before storing results.

---

# 9. Validation and Error Handling

The system shall validate all relevant user input on the backend.

## 9.1 MVP Validation

MVP validation shall include:
- Required quiz field validation.
- Question text validation.
- Answer option validation.
- Correct option validation.
- Quiz and question existence checks.
- Request body validation.

## 9.2 Beta Validation

Beta validation shall additionally include:
- Email normalization and duplicate checking.
- Password verification.
- Role validation.
- Authentication token validation.
- Session validity checks.
- Account status checks.
- Quiz attempt completeness.
- Duplicate question submission checks.
- Selected answer option validation.
- Group ownership validation.
- Group membership validation.
- Permission validation.

The system shall use appropriate HTTP status codes, including:

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request or validation failure |
| 401 | Authentication required or invalid credentials |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict, such as duplicate resource |
| 422 | Request validation error |
| 500 | Internal server error |

The frontend shall display understandable error messages instead of exposing internal server details.

---

# 10. Acceptance Criteria

Acceptance criteria are separated by release to make MVP and Beta evaluation clear.

## 10.1 MVP Acceptance Criteria

| ID | Acceptance Criteria |
|---|---|
| AC-MVP-01 | A quiz can be created with valid information. |
| AC-MVP-02 | The quiz list can be retrieved successfully. |
| AC-MVP-03 | Individual quiz information can be retrieved. |
| AC-MVP-04 | Existing quiz information can be updated. |
| AC-MVP-05 | Existing quizzes can be deleted. |
| AC-MVP-06 | Questions can be added to an existing quiz. |
| AC-MVP-07 | Individual question information can be retrieved. |
| AC-MVP-08 | Existing questions can be updated. |
| AC-MVP-09 | Existing questions can be deleted. |
| AC-MVP-10 | Invalid requests are rejected with appropriate error responses. |
| AC-MVP-11 | The backend health endpoint returns a successful response when the application is running. |
| AC-MVP-12 | Interactive API documentation is accessible. |

## 10.2 Beta Acceptance Criteria

### Authentication and Authorization

| ID | Acceptance Criteria |
|---|---|
| AC-BETA-01 | A new user can register with valid information. |
| AC-BETA-02 | Duplicate email registration is rejected. |
| AC-BETA-03 | Users can log in with valid credentials. |
| AC-BETA-04 | Invalid credentials are rejected. |
| AC-BETA-05 | Inactive and banned users cannot access protected functionality. |
| AC-BETA-06 | Admin-only endpoints reject regular users. |
| AC-BETA-07 | Valid access tokens allow authorized requests. |
| AC-BETA-08 | Refresh token rotation and session revocation work correctly. |

### Quiz and Student Features

| ID | Acceptance Criteria |
|---|---|
| AC-BETA-09 | Existing MVP quiz and question functionality remains available. |
| AC-BETA-10 | Student attempts are accepted only for published quizzes. |
| AC-BETA-11 | Students can submit complete and valid quiz attempts. |
| AC-BETA-12 | The system calculates and stores quiz results correctly. |
| AC-BETA-13 | Students can retrieve only their own attempt history. |
| AC-BETA-14 | Students can update their profile and change passwords. |
| AC-BETA-15 | Students can view and manage their login sessions. |

### Admin and User Management

| ID | Acceptance Criteria |
|---|---|
| AC-BETA-16 | Admin dashboard statistics can be retrieved. |
| AC-BETA-17 | Admin users can search and view registered users. |
| AC-BETA-18 | Admin users can update account status and roles. |
| AC-BETA-19 | Admin users can ban and unban individual or multiple users. |
| AC-BETA-20 | Administrator accounts can be managed through authorized endpoints. |

### Groups and Audit Features

| ID | Acceptance Criteria |
|---|---|
| AC-BETA-21 | Students can create and manage groups they own. |
| AC-BETA-22 | Admin users can manage groups and their members. |
| AC-BETA-23 | Admin users can assign and revoke group permissions. |
| AC-BETA-24 | Group permission checks restrict access to protected resources. |
| AC-BETA-25 | Admin users can retrieve audit logs and individual log details. |

---

# 11. Testing Requirements

## 11.1 MVP Testing

The MVP shall be tested for:
- Quiz creation.
- Quiz retrieval.
- Quiz updating.
- Quiz deletion.
- Question creation.
- Question retrieval.
- Question updating.
- Question deletion.
- Input validation.
- Backend health checking.
- API response correctness.

## 11.2 Beta Backend Testing

The Beta release shall additionally be tested for:
- User registration and authentication.
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
- Quiz result calculation.

Automated backend tests are maintained using pytest.

## 11.3 Frontend Testing

The frontend shall be checked for:
- Quiz and question management.
- Login and registration behavior.
- Role-based navigation.
- Admin dashboard display.
- User management operations.
- Group management operations.
- Student quiz participation.
- Profile and session management.
- Error and success feedback.

## 11.4 Integration Testing

Integration testing shall verify:
- Frontend-to-backend communication.
- API request and response handling.
- Database operations.
- Quiz and question management.
- Authentication state handling.
- Protected API access.
- Quiz submission and result retrieval.
- Group membership and permission checks.
- Session refresh and logout behavior.

## 11.5 API Testing

The API shall be tested using FastAPI's interactive Swagger documentation and appropriate API testing methods.

---

# 12. Constraints and Limitations

The system has the following constraints:

- The application requires an internet or local network connection to communicate with the backend.
- The system is designed as a web-based application.
- The application uses a relational database.
- Access to protected Beta features requires authentication.
- Administrative operations require Admin authorization.
- Students can manage only groups they own.
- Students cannot assign or revoke group permissions.
- Group permissions are assigned at the group level.
- Student quiz attempts require published quizzes.
- Each quiz attempt must contain answers for all questions.
- The application does not currently provide native mobile applications.

---

# 13. Conclusion

This SRS describes the functional and non-functional requirements of both the MVP and Beta releases of the Quiz Game application.

The MVP establishes the core quiz and question management functionality.

The Beta release extends the MVP with secure authentication, role-based access control, administrative management, student functionality, quiz attempts and results, group management, permission enforcement, session management, and audit logging.

Both releases together define the requirements and expected behavior of the Quiz Game system and provide a reference for implementation, testing, evaluation, and future development.
