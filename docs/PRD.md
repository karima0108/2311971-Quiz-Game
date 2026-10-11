# Product Requirements Document (PRD) — Quiz Game

| Field | Details |
|---|---|
| Project Name | Quiz Game |
| Document | Product Requirements Document (PRD) |
| Version | 	MVP + Beta |
| Status | Draft |
| Planned Releases | MVP (Mid-term) and Beta (Final) |
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |

## 1. Product Overview

Quiz Game is a web-based application that allows users to participate in multiple-choice quizzes, submit answers, and view their scores. The application will also provide quiz management functionality so authorized users can create, update, publish, and remove quizzes and their questions.

The project will be developed in two releases. The MVP will focus on the core quiz experience and REST API integration, running locally. The Beta release will extend the MVP with authentication, role-based access control (RBAC), user profiles, dashboards, security scopes, and deployment.

## 2. Problem Statement

Students often need a simple way to practise multiple-choice questions and evaluate their knowledge. A lightweight quiz application can provide immediate results without requiring manual checking. At the same time, quiz managers need a structured way to create and maintain quiz content.

Quiz Game aims to solve these problems through a simple interface, a Python REST API, and a structured data store.

## 3. Product Goals

- Provide a simple interface for viewing and attempting available quizzes.
- Allow users to submit answers and receive automatically calculated scores.
- Allow authorized quiz managers to manage quizzes and questions.
- Separate frontend presentation from backend business logic using REST APIs.
- Introduce authentication, RBAC, and security permissions in the Beta release.
- Keep the project small, testable, and suitable for a university course demonstration.

## 4. Target Users

### 4.1 Student / Quiz Participant

A student can browse published quizzes, answer questions, submit a quiz, and view the result. In the Beta release, the student can also view a profile dashboard and previous attempts.

### 4.2 Admin / Quiz Manager

The admin manages quiz content, including creating quizzes, adding questions, editing content, publishing quizzes, and removing quizzes. In the Beta release, the admin can also manage user accounts and access permissions.

### 4.3 Guest

A guest can access the public quiz list and view published quiz information. Attempting quizzes and accessing personal results will follow the authentication rules defined for the Beta release.

## 5. Scope and Release Plan

### 5.1 MVP — Mid-term Demonstration

The MVP will run locally and focus on the core quiz workflow through REST APIs.

- Display a list of available quizzes.
- View a quiz and its multiple-choice questions.
- Create a quiz.
- Add, update, and delete quiz questions.
- Update and delete quizzes.
- Submit answers to a quiz.
- Calculate the score on the backend.
- Display the result after submission.
- Validate request data and handle common API errors.
- Integrate the React + TypeScript frontend with the FastAPI + Python backend.
- Use a database to persist quiz and question data.

**MVP limitation:** Authentication and production access control are not included in the MVP. Quiz-management endpoints are for local development and demonstration only and must not be exposed publicly without appropriate authorization.

### 5.2 Beta — Final Demonstration

The Beta release will extend the MVP with:

- User registration and login.
- Secure password hashing and token-based authentication.
- Student and Admin roles.
- Role-based access control for quiz management and administration.
- Permission scopes for protected operations.
- A user profile page and dashboard.
- Personal quiz-attempt history and scores.
- Admin user-management functionality.
- Security validation and authorization testing.
- Deployment of the application to a suitable hosting platform.

## 6. Functional Features

| ID | Feature | Description | Release |
|---|---|---|---|
| F-01 | Quiz Listing | Display available published quizzes. | MVP |
| F-02 | Quiz Details | Display quiz instructions and questions. | MVP |
| F-03 | Quiz Management | Create, view, update, and delete quizzes. | MVP |
| F-04 | Question Management | Create, view, update, and delete MCQ questions. | MVP |
| F-05 | Quiz Submission | Submit selected answers to the backend. | MVP |
| F-06 | Score Calculation | Calculate and return the score on the backend. | MVP |
| F-07 | Result Display | Show score and correct/incorrect answer summary. | MVP |
| F-08 | Input Validation | Validate requests and return meaningful errors. | MVP |
| F-09 | Authentication | Register, log in, and authenticate protected requests. | Beta |
| F-10 | Role-Based Access | Restrict actions according to Student and Admin roles. | Beta |
| F-11 | Profile Dashboard | Display profile information and personal statistics. | Beta |
| F-12 | Attempt History | Show previous quiz attempts and scores. | Beta |
| F-13 | Admin User Management | View and manage user accounts and roles. | Beta |
| F-14 | Permission Scopes | Enforce fine-grained permissions for protected operations. | Beta |
| F-15 | Deployment | Deploy the frontend and backend for the final demo. | Beta |

## 7. Non-Functional Goals

- **Usability:** The interface should be understandable to a first-time user.
- **Performance:** Normal quiz-list and quiz-submission requests should respond promptly under typical demonstration workloads.
- **Reliability:** Invalid requests should return structured errors rather than crash the application.
- **Security:** Passwords must never be stored in plain text. Protected operations must be authorized on the backend.
- **Maintainability:** Frontend, API routes, data models, and business logic should be organized clearly.
- **Compatibility:** The application should work in a modern desktop browser.
- **Data integrity:** Quiz scores must be calculated by the backend, not trusted from client-submitted scores.

## 8. Out of Scope

The following features are not planned for the initial project:

- AI-generated questions or AI-based grading.
- Live multiplayer competitions.
- Real-time chat or video sessions.
- Payment or subscription functionality.
- Complex learning analytics.
- Native Android or iOS applications.
- A large question bank or external learning-management-system integration.

These exclusions keep the project manageable within the course timeline.

## 9. Success Criteria

The project will be considered successful when:

1. A user can view a quiz and submit answers through the React interface.
2. The backend validates the submission and calculates the correct score.
3. Quiz and question CRUD operations work through REST APIs.
4. The MVP can run locally with clear setup instructions.
5. The Beta supports login, Student/Admin roles, and protected operations.
6. Personal dashboard and quiz-attempt history work for authenticated users.
7. Automated or manual tests demonstrate that unauthorized users cannot perform protected actions.
8. The final application can be demonstrated using the deployed environment.

## 10. Assumptions and Constraints

- The application is an academic project with a limited development timeline.
- React + TypeScript and FastAPI + Python are the required technologies.
- The backend is the trusted source for answer validation and score calculation.
- Only published quizzes are available to normal participants.
- The Admin role is responsible for quiz content management.
- Features may be refined after instructor feedback, but every requirement must remain labelled MVP or Beta.

## 11. Dependencies

- Python and the required backend packages.
- Node.js and npm for the frontend.
- A supported database.
- Git and GitHub for version control and collaboration.
- A hosting platform for the Beta deployment.

## 12. Release Summary

| Area | MVP | Beta |
|---|---|---|
| Quiz and question CRUD | Included | Retained |
| Quiz attempts and scoring | Included | Retained |
| React–FastAPI integration | Included | Retained |
| Local execution | Required | Supported |
| Registration and login | Not included | Included |
| Student/Admin RBAC | Not included | Included |
| Profile and history dashboard | Not included | Included |
| Fine-grained security scopes | Not included | Included |
| Deployment | Not required | Included |

