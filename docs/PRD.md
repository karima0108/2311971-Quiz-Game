# Product Requirements Document (PRD)
## Quiz Game

**Document Version:** 1.0  
**Status:** Proposed / Planning  
**Project Type:** Solo Course Project  
**Release Plan:** MVP (Mid-term) and Beta (Final)

## 1. Project Overview

Quiz Game is a web-based application that allows teachers to create and manage quizzes, students to attempt published quizzes and view their results, and administrators to manage user accounts and roles. The application will use React.js with TypeScript for the frontend and FastAPI with Python for the backend. REST APIs, authentication, role-based access control (RBAC), and security scopes will ensure that users can access only the operations and data they are authorized to use.

## 2. Problem Statement

Managing quizzes manually can make quiz creation, answer submission, scoring, and result access less organized. Quiz Game aims to provide a simple platform that centralizes these activities while demonstrating proper REST API design, secure backend development, and frontend-backend integration.

## 3. Project Objectives

- Develop a functional web-based quiz management system.
- Implement REST APIs for quiz and question management.
- Allow students to attempt quizzes and receive automatically calculated scores.
- Implement authentication and authorization.
- Apply RBAC and security scopes to restrict access to protected operations.
- Integrate the React frontend with the FastAPI backend.
- Keep the project practical and achievable within the course timeline.

## 4. Target Users and Roles

### 4.1 Student
- View published quizzes.
- Attempt available quizzes.
- Submit answers.
- View personal quiz results.

### 4.2 Teacher
- Create quizzes.
- Add and manage questions and answer options.
- Publish or unpublish quizzes.
- Update or delete quizzes they own.
- View results for their own quizzes.

### 4.3 Admin
- View user accounts.
- Assign user roles.
- Activate or deactivate user accounts.

## 5. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js with TypeScript |
| Backend | Python with FastAPI |
| Communication | REST APIs using HTTP and JSON |
| Database | SQLite |
| Authentication | JWT-based authentication |
| Authorization | RBAC and security scopes |
| API documentation and testing | FastAPI Swagger UI and/or Postman |

## 6. Project Scope and Release Plan

### 6.1 MVP — Mid-term Assessment

The MVP will focus on developing and testing the core backend functionality locally.

**Included features:**

1. Create, retrieve, update, and delete quizzes through REST APIs.
2. Manage quiz questions and answer options.
3. Submit MCQ answers and calculate scores on the backend.
4. Validate incoming request data.
5. Store quiz-related data in SQLite.
6. Return appropriate HTTP status codes and error responses.
7. Test endpoints using FastAPI Swagger UI or Postman.

**MVP success criteria:** The core quiz workflow can be demonstrated through working REST APIs in a local environment.

### 6.2 Beta — Final Assessment

The Beta release will extend the MVP into a complete web application.

**Included features:**

1. User registration and login.
2. Secure password hashing and JWT access-token validation.
3. Student, Teacher, and Admin roles.
4. Role-based access control and security scopes.
5. Backend ownership checks for teacher-managed quizzes.
6. Student access restricted to their own results.
7. Teacher access restricted to results for quizzes they own.
8. Admin functionality for managing accounts and assigning roles.
9. React.js and TypeScript frontend integrated with FastAPI.
10. Role-appropriate pages, forms, and navigation.
11. Loading, success, empty, and error states in the frontend.
12. Integration testing and a reproducible final demonstration or deployment.

**Beta success criteria:** Users can use the application through the React frontend, and the backend correctly rejects requests that violate authentication, role, permission, or ownership rules.

## 7. Feature Priorities

| ID | Feature | Priority | Release |
|---|---|---|---|
| F-01 | Quiz CRUD APIs | Must Have | MVP |
| F-02 | Question and option management | Must Have | MVP |
| F-03 | MCQ submission and backend scoring | Must Have | MVP |
| F-04 | Input validation and API error handling | Must Have | MVP |
| F-05 | SQLite persistence and API documentation | Must Have | MVP |
| F-06 | User registration and JWT login | Must Have | Beta |
| F-07 | Student, Teacher, and Admin roles | Must Have | Beta |
| F-08 | Security scopes and ownership checks | Must Have | Beta |
| F-09 | Student quiz and results pages | Must Have | Beta |
| F-10 | Teacher quiz management and results pages | Must Have | Beta |
| F-11 | Admin user management | Must Have | Beta |
| F-12 | Frontend-backend integration and final testing | Must Have | Beta |

## 8. User Stories

### MVP

- **US-01:** As an API tester, I want to create and retrieve quizzes so that quiz management can be verified.
- **US-02:** As an API tester, I want to add and update questions and answer options so that quizzes can be prepared.
- **US-03:** As an API tester, I want to submit answers and receive a backend-calculated score.
- **US-04:** As an API tester, I want invalid requests to return clear error responses.

### Beta

- **US-05:** As a student, I want to view published quizzes, attempt them, and view my own results.
- **US-06:** As a teacher, I want to manage my own quizzes and view their results.
- **US-07:** As an admin, I want to manage user accounts and assign roles.
- **US-08:** As a user, I want the system to restrict actions according to my role and permissions.
- **US-09:** As a user, I want a clear frontend interface that communicates with the backend and displays useful feedback.

## 9. Non-Functional Requirements

- **NFR-01:** The frontend will use React.js with TypeScript, and the backend will use FastAPI with Python.
- **NFR-02:** The application will expose core functionality through REST APIs.
- **NFR-03:** The backend will validate incoming data and return appropriate HTTP responses.
- **NFR-04:** Passwords will be stored as secure hashes, never as plaintext.
- **NFR-05:** Authorization checks will be enforced on the backend.
- **NFR-06:** Correct answers will not be exposed in student-facing quiz responses before submission.
- **NFR-07:** Students will not be allowed to access other students' private results.
- **NFR-08:** The system will remain small and practical enough to complete within the course timeline.

## 10. Out of Scope

The following features are not planned for this course project:

- Artificial Intelligence or Machine Learning.
- LLMs or Retrieval-Augmented Generation (RAG).
- AI-generated quiz questions.
- Live multiplayer competitions.
- Payment processing.
- Advanced online proctoring.
- Complex analytics and recommendation systems.
- A separate mobile application.

## 11. Assumptions and Constraints

- The initial quiz format will be multiple-choice questions (MCQs), with one correct option per question.
- SQLite will be used to keep the project simple and practical.
- The MVP will focus on core REST API functionality.
- The Beta release will complete authentication, authorization, security scopes, and frontend-backend integration.
- Public registration will create Student accounts by default; privileged roles will be assigned through an authorized process.
- This document describes the planned system and may be updated if implementation decisions change.

