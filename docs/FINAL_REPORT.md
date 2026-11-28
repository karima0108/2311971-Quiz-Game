# Quiz Game — Final Project Submission Report

> **Independent University, Bangladesh**  
> **Course:** CSE309 — Web Application & Internet  
> **Submitted by:** Syeda Karima Kashmin  
> **Student ID:** 2311971  
> **Section:** 06  
> **Submitted to:** Sayef Reyadh, Adjunct Lecturer  
> **Semester:** Autumn 2026  
> **Submission date:** 28 November 2026

**Project links**
- [Live application](https://2311971-quiz-game-rcvyljc1c-web-rocks.vercel.app/)
- [GitHub repository](https://github.com/karima0108/2311971-Quiz-Game)
- [API documentation](https://2311971-quiz-game.vercel.app/api/docs)

## About this Markdown version
- This file converts the report's extracted text into GitHub-flavoured Markdown.
- Screenshots, page-layout graphics, and embedded visual evidence from the PDF are not reproduced as image files here. Keep the original PDF or upload the relevant screenshots to the repository and link them where needed.
- Demo account credentials have intentionally been omitted from this repository version. Keep credentials only in the PDF report, as required.

## Table of Contents

- [Executive Summary](#1-executive-summary)
- [Part A. Product Requirements (PRD)](#part-a-product-requirements-prd)
- [Part B. Software Requirements (SRS)](#part-b-software-requirements-srs)
- [Part C. Technical Design (TDD)](#part-c-technical-design-tdd)
- [Part D. Evidence: Screenshots of the Running Application](#part-d-evidence-screenshots-of-the-running-application)
- [Part E. Project Management and Conclusion](#part-e-project-management-and-conclusion)
- [Appendix — Test Accounts and Video Demo](#appendix--test-accounts-and-video-demo)

---

<!-- PDF page 3 -->
## 1. Executive Summary

## 1.1 Project overview

Project Name: Quiz Game

Quiz Game is a web-based application designed to provide an interactive platform for quiz management and participation. It allows administrators to create and manage quizzes and questions, manage user accounts, control access through role-based permissions, and monitor platform activities. Registered users (students) can access available quizzes, submit answers, view their scores and attempt history, and participate in groups with assigned permissions. The system aims to provide a structured, secure, and manageable quiz environment for both administrators and students.

Technology Stack: React 19 with TypeScript 7, FastAPI (Python), SQLAlchemy, SQLite/PostgreSQL, and Vercel deployment.

## 1.2 What was built since the mid assessment

Following the mid assessment, the project was extended beyond its initial quiz and question management functionality with the following features:

- JWT Authentication: Implemented user login and authentication using JWT access
```text
       tokens, refresh-token management, session handling, and logout functionality.
    - Role-Based Access Control (RBAC): Introduced Admin and User roles, with
       authorization checks based on user roles, resource ownership, and group-level
       permissions.
    - Admin Dashboard: Added administrative functionality for managing users, quizzes and
       content, groups, and administrative activities.
    - Audit Logging: Added activity records to support tracking and reviewing important
       administrative actions.
    -  Security Enhancements: Implemented password hashing, account status and ban
       checks, and authentication-related security controls. Brute-force protection should be
       included here only if it is implemented and tested.
    - Deployment: Prepared the application for online access through Vercel, with a deployed
       frontend and API configuration
```

## 1.3 Live links

Github: https://github.com/karima0108/2311971-Quiz-Game Vercel frontend :https://2311971-quiz-game.vercel.app/ API docs : https://2311971-quiz-game.vercel.app/api/docs

<!-- PDF page 4 -->
## Part A. Product Requirements (PRD)

### A1. Problem Statement

Students often need to test their knowledge and evaluate their understanding of academic topics through quizzes. However, accessing organized quiz content, answering questions, and keeping track of personal performance can be difficult when these activities are handled manually or across separate platforms. Students may also have difficulty reviewing their previous quiz attempts and identifying their learning progress.

Quiz managers and administrators face challenges when creating and maintaining quiz content, organizing questions, and managing student participation. As the number of quizzes and users increases, managing access, group membership, user permissions, and administrative activities becomes more difficult. Without clearly defined access restrictions, there is also a risk of unauthorized access to user information and administrative operations.

### A2. Users and Roles

The Quiz Game application has four main user roles. Each role has specific responsibilities and access restrictions to maintain proper application security.

```text
        Role        Who They Are        Main Tasks       What They Must
                                                          Never Be Able to Do
```

```text
          Visitor       A person who visits      View publicly       Access protected
                           the Quiz Game       accessible pages,     pages, view private
                            platform without      access the signup    user data, or perform
                              logging in.         page, and log in.         administrative
                                                                                  actions.
```

```text
    User (Student)     A registered user    Log in, manage their     Access another
                   who participates in          profile, view          student's private
                               quizzes.          published quizzes,     data, perform admin
                                             submit quiz answers,   operations, or access
                                              view results and      restricted resources
                                                personal attempt      without permission.
                                                                history.
```

```text
   Group Member or     A student who       Access assigned      Manage groups
       Owner         belongs to a group or    group resources.     owned by others,
                      owns a group.      Owners can create     grant administrative
                                         and manage their       permissions, or
                                      own groups and      access resources
                                       manage group      without authorization.
                                             membership.
```

<!-- PDF page 5 -->
```text
       Admin          An authorized     Manage users, roles,    Access or modify
                             administrator         account status,       information outside
                           responsible for        quizzes, groups,         the system's
                               platform             permissions,            authorized
                       management.      dashboard statistics   administrative scope.
                                          and audit logs.
```

```text
                      Table A2: User Roles and Responsibilities
```

### A3. Goals and Success Measures

The primary goals of the Quiz Game application focus on usability, secure access, data protection, group management, and student participation. Each goal has a measurable success criterion.

```text
          Goal ID                    Project Goal            Success Measure
```

```text
           G-01                Provide reliable quiz and      Admin can successfully
                                  question management.        create, view, update and
                                                                delete quizzes and questions.
                                                                               All valid changes are stored
                                                                                  in the database.
```

```text
           G-02                  Provide secure user      Users can register and log in
                                           registration and          with valid credentials. Invalid
                                          authentication.           credentials are rejected, and
                                                       passwords are never stored
                                                                                     in plaintext.
```

```text
           G-03               Enforce role-based access       Unauthenticated users
                                         control (RBAC).           cannot access protected
                                                                 endpoints, and students
                                                           cannot perform admin-only
                                                                         operations.
```

```text
           G-04                 Protect user privacy and       Students cannot access
                                     session security           another student's private
                                                                             profile or attempt history.
                                                            Refresh sessions support
                                                                         rotation and revocation.
```

```text
           G-05              Ensure secure group and     Group owners can manage
                                permission management.          their own groups and
```

<!-- PDF page 6 -->
```text
                                                       members. Admins can
                                                    manage group-level
                                                               permissions. Unauthorized
                                                                    actions are rejected.
```

```text
           G-06             Support quiz participation and      Students can attempt
                                             result tracking           published quizzes, receive
                                                                   automatically calculated
                                                                       results and view their own
                                                               attempt history. Relevant
                                                                       administrative and
                                                                  authentication activities are
                                                              recorded in audit logs.
```

```text
               Table A3: Project Goals and Measurable Success Criteria
```

### A4. Scope and Non-Goals

### In Scope

The project is developed in two releases: MVP (Mid-term) and Beta (Final).

### MVP — Mid-term Release

The MVP establishes the core quiz-management functionality of the application. Its scope includes:

## 1. Quiz creation, listing, detail retrieval, updating, and deletion.

## 2. Question creation, retrieval, updating, and deletion.

## 3. Multiple-choice question management.

## 4. Frontend and backend REST API integration.

## 5. Request validation and error handling.

## 6. Database persistence for quiz and question records.

### Beta — Final Release

The Beta release extends the MVP with authentication, authorization, administration, group management, and student participation features. Its scope includes:

## 1. User registration and login.

## 2. Password hashing and verification.

## 3. JWT-based access-token authentication.

## 4. Refresh-token session management, rotation, and revocation.

## 5. Admin and Student roles with backend RBAC.

## 6. Protected API endpoints and permission checks.

## 7. Admin dashboard statistics.

<!-- PDF page 7 -->
## 8. User listing and account management.

## 9. User role, active status, and ban/unban management.

```text
    10.Student profile retrieval and updating.
   11.Password change and personal session management.
   12.Admin and Student group management.
   13.Group membership management.
    14.Group-level permission assignment and revocation by Admins.
    15.Permission-protected group resources.
    16.Student participation in published quizzes.
   17.Automatic quiz scoring and result generation.
    18.Personal quiz attempt history.
    19.Audit logging for relevant authentication and administrative activities.
    20.Configurable database support for local SQLite and PostgreSQL deployment.
   21.Frontend and backend deployment configuration.
```

### Out of Scope

The following features are not included in the current project scope:

## 1. AI-generated quiz questions or AI-based grading: The project focuses on

```text
       conventional quiz management and automated scoring based on predefined correct
       answers.
```

## 2. Live multiplayer quiz competitions: Real-time competitive functionality is not part of

```text
       the current requirements.
```

## 3. Real-time chat or video communication: The application does not require

```text
      communication features.
```

## 4. Payment, subscription, or premium membership functionality: The project does not

```text
       involve commercial transactions.
```

## 5. Native Android or iOS applications: The application is developed as a web-based

platform.

## 6. Dedicated quiz publishing/unpublishing management workflow: A separate

```text
       publishing management interface is not currently implemented.
```

### Assumptions and Constraints

The project is developed based on the following assumptions and constraints:

## 1. The application uses React, TypeScript, Vite, FastAPI, Python, and SQLAlchemy.

## 2. The application is intended to run in modern web browsers.

## 3. The frontend communicates with the backend through REST APIs using JSON.

## 4. Backend authorization is authoritative; hiding frontend options alone is not considered

```text
        sufficient security.
```

## 5. The backend uses admin and user as role values. The ordinary user role is presented

```text
      as Student in the application.
```

## 6. Only authenticated users can access protected account, group, attempt, and

```text
       administrative operations.
```

<!-- PDF page 8 -->
## 7. Students can update or delete only groups they own and manage the membership of

those groups.

## 8. Admins are responsible for administrative group management and group-level

```text
       permission assignment or revocation.
```

## 9. Group permissions are associated with groups, and eligible Students receive access

```text
       through their group membership.
    10.Only published quizzes can be attempted.
    11.Students must answer every question before submitting a quiz attempt.
    12.Correct-option and selected-option values use zero-based indexes.
   13.The application uses SQLite as a local development fallback and PostgreSQL/Supabase
        for configured persistent deployment.
   14.Deployment and hosting are subject to the limitations of the selected platforms, available
       environment variables, database connectivity, and university project time constraints.
```

### A5. User Stories

User stories describe the expected actions and benefits of each role in the Quiz Game application. They are organized by release and functional area to distinguish MVP functionality from Beta functionality.

MVP — Quiz and Question Management :

```text
                 Story ID                              User Story
```

```text
                 US-1                 As an Admin, I want to create quizzes so that
                                                                                     I can provide quiz content to students.
```

```text
                 US-2                    As an Admin, I want to view the list and
                                                         details of quizzes so that I can monitor
                                                              available quiz content.
```

```text
                 US-3                   As an Admin, I want to update and delete
                                              quizzes so that I can maintain accurate quiz
                                                                   information.
```

```text
                 US-4                 As an Admin, I want to add, view, update and
                                                delete multiple-choice questions so that I can
                                     manage the questions associated with each
                                                                         quiz.
```

<!-- PDF page 9 -->
```text
                  Table A5.1: MVP – Quiz and Question Management
```

Beta — Authentication and User Access:

```text
                 Story ID                              User Story
```

```text
                 US-5                  As a Visitor, I want to create an account so
                                                      that I can become a registered user of the
                                                                     platform.
```

```text
                 US-6                 As a Student, I want to log in securely so that
                                                                                    I can access my personal account and
                                                            protected features.
```

```text
                 US-7                  As a Student, I want to view and update my
                                                            profile so that my personal information
                                                       remains accurate.
```

```text
                 US-8                  As a Student, I want to change my password
                                         and manage active sessions so that I can
                                                maintain control over my account security.
```

```text
                  Table A5.2: Beta – Authentication and User Access
```

Beta — RBAC and Group Management:

```text
                 Story ID                              User Story
```

```text
                 US-9                   As an Admin, I want to enforce role-based
                                          access control so that users can access only
                                                    the features permitted by their roles.
```

```text
                US-10                  As a Student, I want to create and manage
                                 my own groups so that I can organize group
                                                                                activities.
```

```text
                 US-11                 As a Group Owner, I want to add and remove
                                      members from my own group so that I can
                                           manage group membership.
```

```text
                US-12                  As an Admin, I want to assign and revoke
                                                   group-level permissions so that access to
                                               group resources can be controlled.
```

```text
                US-13                    As a Group Member, I want to access
```

<!-- PDF page 10 -->
```text
                                                protected group resources only when I have
                                                the required permission so that unauthorized
                                                     access is prevented.
```

```text
                   Table A5.3: Beta – RBAC and Group Management
```

Beta — Administrative Features:

```text
                 Story ID                              User Story
```

```text
                US-14                   As an Admin, I want to view dashboard
                                                            statistics so that I can monitor the overall
                                                               platform activity.
```

```text
                US-15                    As an Admin, I want to manage user
                                               accounts, roles and account status so that I
                                         can maintain proper platform administration.
```

```text
                US-16                   As an Admin, I want to ban, unban and
                                              bulk-ban users so that I can control accounts
                                                               that violate platform rules.
```

```text
                US-17                  As an Admin, I want to manage groups and
                                                          their members so that I can maintain group
                                                      organization across the platform.
```

```text
                US-18                  As an Admin, I want to review audit logs so
                                                      that I can monitor important authentication
                                              and administrative activities.
```

```text
                        Table A5.4: Beta – Admin Management
```

Beta — Student Quiz Participation:

```text
                 Story ID                              User Story
```

```text
                US-19                    As a Student, I want to view published
                                                 quizzes so that I can choose a quiz to
                                                                   attempt.
```

```text
                US-20                  As a Student, I want to submit all required
                                          answers to a quiz so that my attempt can be
                                                                evaluated.
```

<!-- PDF page 11 -->
```text
                US-21                     As a Student, I want to receive my
                                                  automatically calculated quiz result so that I
                                              can understand my performance.
```

```text
                US-22                 As a Student, I want to view my personal quiz
                                                  attempt history so that I can track my
                                                         previous performance.
```

```text
                     Table A5.5: Beta – Student Quiz Participation
```

At least ten stories in the form: As a (role) I want (action) so that (benefit). Give each an ID (US-01). Cover every role: at least two for authentication, three for RBAC or groups, three for the admin.

```text
    [Table 4: user stories]
```

## Part B. Software Requirements (SRS)

### B1. Introduction

### B1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements of the Quiz Game application. It describes the expected system behavior, user permissions, use cases, and acceptance criteria for the MVP and Beta releases.

The document is intended for project developers, testers, evaluators, and other stakeholders who need to understand and verify the system requirements.

### B1.2 Scope

- Quiz Game is a web-based platform that allows administrators to manage quizzes,
```text
       questions, users, and groups, while students can participate in published quizzes, view
        their results, and manage their accounts.
    - The MVP focuses on quiz and question management. The Beta release extends the
      system with authentication, role-based access control, administrative functions, group
      management, student quiz participation, session management, and audit logging.
```

### B1.3 Definitions

```text
 Term                                   Meaning
```

<!-- PDF page 12 -->
```text
 JWT                             JSON Web Token
```

```text
 RBAC                                   Role-Based Access Control
```

```text
 API                                            Application Programming Interface
```

```text
 CRUD                                       Create, Read, Update, Delete
```

```text
 Access Token                            Token used to access protected APIs
```

```text
 Audit Log                                Record of important system activities
```

```text
 Argon2                                  Secure password-hashing algorithm
```

```text
 Role                             A category of user that determines general
                                          access rights.
```

```text
 Permission                           An authorization granted for a particular
                                             resource or action.
```

```text
 Session                           A user's authenticated login instance.
```

```text
 Owner                           A student who created and manages a
                                                     particular group.
```

```text
 Student                           A registered regular user of the application.
```

```text
 Admin                              An authorized user responsible for
                                                 administrative operations.
```

### B1.4 References

- RFC 7519 — JSON Web Token (JWT): https://www.rfc-editor.org/rfc/rfc7519
- OWASP Application Security Verification Standard (ASVS):
```text
       https://owasp.org/www-project-application-security-verification-standard/
    - FastAPI Documentation: https://fastapi.tiangolo.com/
    - OWASP Password Storage Cheat Sheet:
```

<!-- PDF page 13 -->
```text
       https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
```

### B2. Functional Requirements

The system requirements are divided into MVP and Beta functionality.

### B2.1 Authentication Requirements (FR-AUTH)

```text
 ID                                                 Functional Requirement
```

```text
 FR-AUTH-01                           The system shall allow visitors to register
                                              using valid account information and shall
                                                     reject duplicate email addresses.
```

FR-AUTH-02

```text
                                      The system shall authenticate users using
                                                        their registered email addresses and
                                         passwords and reject invalid credentials.
```

```text
 FR-AUTH-03                           The system shall store passwords using
                                        Argon2 password hashing and shall never
                                                 store plaintext passwords.
```

FR-AUTH-04

```text
                                      The system shall use a server-side password
                                          pepper stored outside the source code and
                                                     shall apply it during password verification and
                                              hashing.
```

<!-- PDF page 14 -->
```text
FR-AUTH-05                           The system shall issue access tokens
                                               containing the user's identity, email, role, and
                                            session identifier, with an access-token
                                                      lifetime of 15 minutes.
```

FR-AUTH-06

```text
                                     The system shall issue refresh sessions with
                                      a maximum lifetime of 7 days and shall rotate
                                                refresh tokens when a valid refresh request is
                                            processed.
```

FR-AUTH-07

```text
                                     The system shall store refresh-token hashes
                                                 rather than raw refresh tokens and shall
                                                transmit refresh tokens through HttpOnly
                                              cookies.
```

FR-AUTH-08

```text
                                     The system shall revoke the current refresh
                                            session when a user logs out.
```

FR-AUTH-09

```text
                                     The system shall allow authenticated users to
                                           view their active sessions and revoke a
                                              selected session or all active sessions
                                            belonging to them.
```

<!-- PDF page 15 -->
```text
 FR-AUTH-10                           The system shall allow authenticated users to
                                            view and update their own profile information.
```

FR-AUTH-11

```text
                                      The system shall require the current
                                         password before accepting a
                                         password-change request.
```

```text
 FR-AUTH-12                           The system shall limit repeated failed login
                                             attempts and temporarily prevent further login
                                             attempts after the configured failure threshold
                                                            is reached.
```

### B2.2 Role-Based Access Control Requirements (FR-RBAC)

```text
 ID                                                 Functional Requirement
```

```text
 FR-RBAC-01                           The system shall support Admin and User
                                           account roles, where the User role represents
                                       a Student in the application interface.
```

FR-RBAC-02

```text
                                      The system shall enforce authentication and
                                                 authorization through backend checks rather
                                             than relying only on frontend visibility
                                                       restrictions.
```

<!-- PDF page 16 -->
FR-RBAC-03

```text
                                     The system shall restrict administrative
                                              operations to authenticated Admin users.
```

FR-RBAC-04

```text
                                     The system shall restrict students to their own
                                                  private profiles, quiz attempts, and personal
                                              sessions.
```

FR-RBAC-05

```text
                                     The system shall allow a Group Owner to
                                          update or delete only groups owned by that
                                            user and to manage membership within those
                                             groups.
```

```text
FR-RBAC-06                           The system shall allow Admin users to assign
                                      and revoke group-level permissions and shall
                                                    reject unauthorized permission changes.
```

```text
FR-RBAC-07                           The system shall reject protected requests
                                           from banned or inactive users, including
                                            requests made with previously issued access
                                              tokens.
```

```text
FR-RBAC-08                           The system shall prevent an Admin from
                                          changing their own role or banning another
                                      Admin through ordinary administrative
                                       user-management operations.
```

<!-- PDF page 17 -->
### B2.3 Administrative Requirements (FR-ADM)

```text
                    ID                              Functional Requirement
```

```text
 FR-ADM-01                            The system shall provide an Admin
                                         dashboard displaying available platform
                                                          statistics.
```

FR-ADM-02

```text
                                      The system shall allow Admin users to
                                                      retrieve, search, and filter registered user
                                                records.
```

```text
 FR-ADM-03                            The system shall allow Admin users to view
                                                    individual user details and account status.
```

```text
 FR-ADM-04                            The system shall allow authorized Admin
                                            users to ban, unban, activate, deactivate, and
                                        change the roles of eligible user accounts.
```

```text
 FR-ADM-05                            The system shall support authorized bulk
                                        user-management operations, including bulk
                                       ban and unban where implemented.
```

FR-ADM-06

```text
                                      The system shall allow Admin users to
                                    manage quiz content and review or moderate
                                                  available quiz and question records.
```

<!-- PDF page 18 -->
```text
 FR-ADM-07                            The system shall allow Admin users to
                                                    retrieve audit logs and filter recorded
                                                         activities using available search criteria.
```

```text
 FR-ADM-08                            The system shall provide an administrative
                                                   security view showing relevant account,
                                               session, or security-related information.
```

```text
 FR-ADM-09                            The system shall allow authorized Admin
                                            users to export supported user-management
                                       and activity records as CSV files..
```

```text
 FR-ADM-10                            The system shall allow authorized Admin
                                            users to revoke eligible user sessions.
```

### B2.4 Quiz, Group, and Student Requirements (FR-DOMAIN)

```text
 ID                                                 Functional Requirement
```

```text
 FR-DOMAIN-01                         The system shall allow authorized quiz
                                       managers to create, retrieve, update, and
                                                delete quizzes.
```

```text
 FR-DOMAIN-02                         The system shall allow authorized quiz
                                       managers to create, retrieve, update, and
                                                delete multiple-choice questions associated
                                                 with quizzes.
```

```text
 FR-DOMAIN-03                         The system shall allow authenticated
                                            Students to retrieve published quizzes and
                                                     shall prevent attempts on unpublished
                                               quizzes.
```

```text
 FR-DOMAIN-04                         The system shall require Students to submit
                                                     valid answers for all required questions
                                              before evaluating a quiz attempt.
```

```text
 FR-DOMAIN-05                         The system shall calculate quiz results by
```

<!-- PDF page 19 -->
```text
                                          comparing submitted answers with the
                                                  correct answer indexes and shall store the
                                              attempt and its answers.
```

```text
 FR-DOMAIN-06                         The system shall allow Students to retrieve
                                                        their own quiz attempt history without
                                            accessing another Student's records.
```

```text
 FR-DOMAIN-07                         The system shall allow Students to create
                                              groups, update and delete groups they own,
                                       and manage membership within their own
                                              groups.
```

```text
 FR-DOMAIN-08                         The system shall allow Admin users to
                                    manage groups, group members, and
                                                group-level permissions.
```

```text
 FR-DOMAIN-09                         The system shall restrict protected group
                                             resources according to the authenticated
                                                  user's membership and assigned
                                               permissions.
```

```text
 FR-DOMAIN-10                         The system shall record relevant
                                                 authentication and administrative activities in
                                                  audit logs.
```

### B3. Non-Functional Requirements

```text
 ID                   Category               Non-Functional          Verification
                                          Requirement
```

```text
 NFR-01                Security            The system shall       Inspect environment
                                                 store secret keys and   configuration and
                                          password-pepper      source code.
                                             values in
                                            environment
                                                 variables rather than
                                            hardcoding them in
                                            source code.
```

<!-- PDF page 20 -->
```text
NFR-02                Security            The system shall       Test invalid login
                                                 return generic login     requests.
                                                  error messages that
                                      do not reveal whether
                                      an email address or
                                        password was
                                                    incorrect.
```

```text
NFR-03                Security            The system shall      Execute token
                                                    reject expired, invalid,  validation tests.
                                                or tampered access
                                           tokens with HTTP
                                            401.
```

```text
NFR-04                Security            The system shall      Execute RBAC and
                                             enforce role,          ownership tests.
                                            ownership, and
                                            permission checks on
                                              the backend for
                                              protected operations.
```

```text
NFR-05              Performance         The system shall limit  Test pagination
                                            paginated list          boundaries.
                                          responses to a
                                  maximum of 100
                                             records per request.
```

```text
NFR-06              Performance         The system should    Measure response
                                                 return common API    time under a defined
                                          responses within 2      test workload.
                                        seconds under the
                                                    project's normal
                                            demonstration
                                             workload.
```

```text
NFR-07                 Usability            The interface shall     Test representative
                                             provide responsive    screen sizes.
                                               layouts suitable for
                                 common desktop and
                                           mobile browser sizes.
```

<!-- PDF page 21 -->
```text
 NFR-08                 Usability            The interface shall     Perform frontend
                                                 display appropriate     interaction tests.
                                                  loading, success,
                                                     validation, and error
                                                 states for user
                                                operations.
```

```text
 NFR-09                  Reliability           The system shall      Create records,
                                             preserve successfully   restart the
                                               stored records after a   application, and
                                           normal application      retrieve them.
                                                        restart.
```

```text
 NFR-10                  Reliability           The system shall      Execute API
                                                  return appropriate      error-handling tests.
                                 HTTP status codes
                                                        for invalid,
                                               unauthorized,
                                               missing, and
                                                      conflicting requests.
```

```text
 NFR-11                 Maintainability       The system shall      Review backend
                                              maintain centralized    structure and
                                       and reusable           authorization tests.
                                        backend
                                                 authorization
                                          dependencies for role
                                       and permission
                                             checks.
```

```text
 NFR-12                 Maintainability       The system shall     Run the automated
                                              maintain automated     test suite.
                                        backend tests for
                                                  authentication,
                                    RBAC, user
                                       management,
                                              groups, and other
                                                             critical functionality.
```

### B4. Roles and Permission Matrix

<!-- PDF page 22 -->
The following matrices define the intended access rules for the five user categories. A final implementation review must confirm each entry against the backend authorization logic.

### B4.1 Endpoint Groups Against Roles

```text
 Endpoint /       Visitor        User         Group        Group Owner  Admin
 Operation                     (Student)     Member
```

Group

```text
 Registration   Yes          Yes          Yes          Yes          Yes
```

and Login

```text
 Public Pages  Yes          Yes          Yes          Yes          Yes
```

```text
 Personal     No        Own       Own       Own       Own
```

Profile

```text
 Personal     No        Own       Own       Own       Own
```

Sessions

```text
 Quiz Listing    Publicly       Yes          Yes          Yes          Yes
                 available only
```

```text
 Quiz and     No         No         No         No           Yes
```

Question Management

```text
 Quiz        No        Own       Own       Own          No, unless
 Attempts                                                                    separately
                                                                             authorized
```

```text
 Personal     No        Own       Own       Own          No, unless
 Attempt                                                                     separately
 History                                                                     authorized
```

```text
 Create a     No           Yes          Yes          Yes          Yes
```

Group

```text
 Update or    No         No         No        Own         Yes
```

Delete a Group

```text
 Manage     No         No         No        Own         Yes
```

Group Members

<!-- PDF page 23 -->
```text
 View        No            Yes, if         Yes, if         Yes, if         Subject to
 Permitted                     permitted      permitted      permitted      group
 Group                                                                    permission
 Resources                                                                       rules
```

```text
 Assign or     No         No         No         No           Yes
```

Revoke Group Permissions

```text
 User        No         No         No         No           Yes
```

Management

```text
 Admin       No         No         No         No           Yes
```

Dashboard

```text
 Audit Logs    No         No         No         No           Yes
```

Legend: Yes = permitted, No = denied, Own = permitted only for resources owned by or belonging to the authenticated user.

### B4.2 Group Permissions

```text
 Permission / Action          Meaning
```

```text
                                          Who Can Perform It
```

```text
 Create Group                                             Student or Admin
```

```text
                             Create a new group and
                         become its owner.
```

```text
 Update Group              Change the name or
                                 description of a group.
                                                    Group Owner or authorized
                                                   Admin
```

<!-- PDF page 24 -->
Delete Group

```text
                        Remove a group.            Group Owner or authorized
                                                   Admin
```

```text
 Manage Membership                                  Group Owner or authorized
                                                   Admin
                         Add or remove members
                             from a group.
```

```text
 Assign Permission                                    Admin
```

```text
                             Grant a supported group
                                permission.
```

```text
 Revoke Permission                                   Admin
```

```text
                        Remove a previously
                             assigned group permission.
```

```text
 Access Protected Resource   Use a resource when the        Eligible Group Member
                                required group permission is
                                   available.
```

```text
 View Own Membership       View groups to which the
                                 current user belongs.
                                                             Authenticated Student
```

### B4.3 Administrative Rules

Rule ID

```text
                                                 Administrative Rule
```

AR-01

```text
                                    An Admin shall not be allowed to change their
                                    own role through ordinary user-management
                                                operations.
```

<!-- PDF page 25 -->
```text
 AR-02                              An Admin shall not be allowed to ban another
                                      Admin through ordinary user-management
                                                operations.
```

AR-03

```text
                                    An Admin shall be allowed to manage eligible
                                            Student accounts.
```

AR-04

```text
                                    An Admin shall be allowed to view
                                                 administrative dashboard information and
                                                  audit logs.
```

```text
 AR-05                              An Admin shall be allowed to assign and
                                            revoke group-level permissions.
```

```text
 AR-06                                 Admin status shall not automatically be
                                                 treated as a group-level permission unless an
                                                         explicit system rule grants that access.
```

AR-07

```text
                                  No separate System Admin role or additional
                                       System Admin group privileges are assumed
                                                        in this specification.
```

### B5. Use Cases

The following use cases describe important user interactions and expected system behavior.

### B5.1 Use Case Descriptions

UC-01: Log In and Refresh Session

-  Actor: Admin or Student
-  Preconditions: The user has an active account and valid credentials.
- Main Flow:
## 1. The user opens the login page.

## 2. The user submits their email and password.

<!-- PDF page 26 -->
## 3. The system validates the credentials and account status.

## 4. The system creates an access token and refresh session.

## 5. The user accesses protected features.

## 6. When the access token expires, the application requests a refresh.

## 7. The system validates and rotates the refresh token and issues a new access

token.

-  Alternative / Error Flows: Invalid credentials return 401; banned or inactive accounts
```text
       are rejected; invalid or expired refresh tokens return 401.
    - Postconditions: The user has a valid authenticated session or receives an
       authentication error.
```

UC-02: Create a Quiz Record

-  Actor: Admin / Authorized Quiz Manager
-  Preconditions: The actor is authorized to manage quiz content.
- Main Flow:
## 1. The actor opens quiz management.

## 2. The actor enters the quiz title and description.

## 3. The actor submits the form.

## 4. The system validates the input.

## 5. The system stores the quiz.

## 6. The system returns the created quiz information.

-  Alternative / Error Flows: Invalid input returns 422 or 400; unauthorized access returns
401 or 403.

- Postconditions: A new quiz record exists in the system.
UC-03: Change a Group Member's Permissions

-  Actor: Admin
-  Preconditions: The Admin is authenticated and the target group exists.
- Main Flow:
## 1. The Admin opens group management.

## 2. The Admin selects a group.

## 3. The Admin views the group's current permissions.

## 4. The Admin selects a permission to assign or revoke.

## 5. The system verifies Admin authorization.

## 6. The system updates the group permission record.

## 7. The system returns the updated permission information.

-  Alternative / Error Flows: An unauthenticated request returns 401; an unauthorized
```text
       request returns 403; a missing group returns 404; an invalid or conflicting permission
       request returns an appropriate validation or conflict response.
    - Postconditions: The group's permission configuration is updated.
```

UC-04: Attempt a Denied Action

-  Actor: Student or Group Member
-  Preconditions: The user is authenticated but does not have the required role,
```text
       ownership, or permission.
```

<!-- PDF page 27 -->
- Main Flow:
## 1. The user requests a protected resource or administrative operation.

## 2. The backend identifies the authenticated user.

## 3. The backend checks the required role, ownership, or permission.

## 4. The system denies the operation.

## 5. The system returns an appropriate error response.

-  Alternative / Error Flows: Missing or invalid authentication returns 401; insufficient
```text
       authorization returns 403; a missing resource returns 404.
    - Postconditions: No unauthorized data modification or access occurs.
```

UC-05: Ban a User

-  Actor: Admin
-  Preconditions: The Admin is authenticated and the target is an eligible Student
account.

- Main Flow:
## 1. The Admin opens user management.

## 2. The Admin searches for and selects a user.

## 3. The Admin chooses the ban action.

## 4. The system verifies the Admin's authorization and target account eligibility.

## 5. The system updates the user's ban status.

## 6. The system records the relevant administrative activity.

## 7. The system returns the updated account status.

-  Alternative / Error Flows: An unauthorized request returns 403; a missing user returns
```text
       404; an attempt to ban an Admin is rejected.
    - Postconditions: The eligible Student account is marked as banned and subsequent
       protected requests are rejected.
```

UC-06: Read the Audit Log

-  Actor: Admin
-  Preconditions: The Admin is authenticated and authorized to access audit logs.
- Main Flow:
## 1. The Admin opens the audit log interface.

## 2. The system retrieves available audit records.

## 3. The Admin reviews the records.

## 4. The Admin applies available filters.

## 5. The system returns the matching records.

-  Alternative / Error Flows: Missing authentication returns 401; insufficient authorization
```text
       returns 403; invalid filter values return an appropriate validation response.
    - Postconditions: The Admin can review the available authorized audit records.
```

UC-07: Revoke a Login Session

-  Actor: Admin or Student
-  Preconditions: The user is authenticated and the target session belongs to the user or
```text
         is eligible for administrative revocation.
    - Main Flow:
```

<!-- PDF page 28 -->
## 1. The user opens session management.

## 2. The system retrieves active sessions.

## 3. The user selects a session.

## 4. The system checks session ownership or administrative authorization.

## 5. The system revokes the selected session.

## 6. The system returns a success response.

-  Alternative / Error Flows: Missing authentication returns 401; unauthorized session
```text
      access returns 403 or 404 according to the endpoint's ownership policy; an invalid
       session ID returns 404.
    - Postconditions: The selected refresh session is revoked.
```

### B5.2 Use Case Diagram

<!-- PDF page 29 -->
Figure B5.1: Use Case Diagram of the Quiz Game System

### B6. Acceptance Criteria

<!-- PDF page 30 -->
The following Given–When–Then conditions define the expected behavior of critical requirements.

```text
 ID                  Given            When              Then
```

```text
 AC-01            A visitor provides     The visitor submits    The system creates a
                           valid registration       the signup form.      new account with the
                            details.                                          default Student role.
```

```text
 AC-02            A registered user                        The system rejects
                        provides invalid login                          the request with
                          credentials.                         HTTP 401.
```

```text
 AC-03            A user has an                          The system rejects
                        expired access token.                         the request with
                                                  HTTP 401.
```

```text
 AC-04            A user presents a                       The system rejects
                     tampered JWT.                               the token with HTTP
                                                                   401.
```

```text
 AC-05            A Student is                            The system denies
                        authenticated                             access with HTTP
                                                          403 or an
                                                                      ownership-protecting
                                                          404 response.
```

```text
 AC-06            A Group Member     The member         The system denies
                     does not have the      requests that         access with HTTP
                       permission required    resource.             403.
                             for a protected
                        resource.
```

```text
 AC-07             An Admin bans an    The banned Student   The system rejects
                             eligible Student.      makes the next        the request with
                                               protected request    HTTP 403.
                                              using a previously
                                             issued access token.
```

```text
 AC-08             An Admin is         The Admin attempts   The system rejects
                         authenticated.          to ban another         the operation with
                                          Admin.            HTTP 403.
```

```text
 AC-09            A Group Owner owns  The owner updates    The system accepts
                    a group.               the group or           the operation if the
                                     manages its           submitted data is
```

<!-- PDF page 31 -->
```text
                                           membership             valid.
```

```text
    AC-10            A Student does not    The Student attempts  The system rejects
                     own a group.            to update or delete     the operation with
                                                        that group.         HTTP 403.
```

```text
    AC-11            A Student submits all  The Student submits   The system
                               valid answers to a      the attempt.            calculates and stores
                           published quiz.                                the result.
```

```text
    AC-12             An authenticated     The user revokes one  The system marks
                          user has multiple        eligible session.        the selected refresh
                             active sessions.                             session as revoked.
```

```text
    AC-13             An Admin is         The Admin requests   The system returns
                            authenticated.         the audit log.           authorized audit
                                                                           records.
```

```text
    AC-14            A user submits valid   The user updates     The system stores
                                 profile information.      their own profile.       the changes and
                                                                             returns the updated
                                                                                           profile.
```

### B7. Traceability Matrix

```text
   This matrix links each requirement group to its expected API endpoint or screen, automated
    test, and supporting screenshot. Test names and screenshot IDs should be replaced with the
   exact names and evidence from the final repository and report.
```

```text
 Requirement ID    Endpoint or Screen          Automated Test          Screenshot
```

```text
                                  test_signup,                 S1:FR-AUTH-01–04  /api/auth/signup                                test_password_hashing      Registration
```

```text
              /api/auth/login,   test_auth_security,        S2: Login andFR-AUTH-05–07              /api/auth/refresh test_token_validation     token response
```

S3: Logout

```text
FR-AUTH-08      /api/auth/logout         test_logout
                                                                   response
```

```text
                                                                     S4: Session list
FR-AUTH-09     /api/auth/sessions      test_session_management
                                                              and revocation
```

<!-- PDF page 32 -->
```text
              /api/auth/me,                                 test_profile_update,       S5: Profile andFR-AUTH-10–11 /api/auth/change-p                                test_password_change      password              assword
```

S6: Lockout

```text
FR-AUTH-12     Login endpoint          test_login_lockout
                                                                   response
```

S7:

```text
                                  test_rbac,FR-RBAC-01–04 Protected API endpoints                              Role-based                                test_auth_security                                                                  access
```

```text
               Group management and test_groups,                 S8: GroupFR-RBAC-05–06                 permission endpoints   test_group_permissions    permissions
```

```text
               Admin                                               S9: Denied
                                 test_banned_user_access,FR-RBAC-07–08 user-management                                 admin                                test_admin_protection                 endpoints                                               operation
```

S10: Admin

```text
FR-ADM-01     Admin dashboard      test_admin_dashboard
                                                                 dashboard
```

```text
               Admin user list and                                    S11: User list
FR-ADM-02–03                       test_admin_user_management
                     detail screens                                    and details
```

```text
               Admin                                             S12: Ban and
                                test_admin_user_managemenFR-ADM-04–05  user-management                                     user                                            t, test_bulk_user_actions                 endpoints                                     management
```

```text
                Quiz and question                                   S13: Quiz
FR-ADM-06                           test_quiz_management
              management screens                            management
```

```text
                  Audit log endpoint and
FR-ADM-07                               test_audit_logs                S14: Audit logs
                 screen
```

S15: Security

```text
               Admin security view and test_security_view,FR-ADM-08–09                                                       view and                  export screen        test_csv_export                                                                          export
```

```text
               Admin                                             S16: Admin
FR-ADM-10      session-revocation     test_admin_session_revoke      session
                 endpoint                                                revocation
```

S17: Quiz and

```text
FR-DOMAIN-01– /api/quizzes,      test_quiz_crud,                                                                         question
02            /api/questions    test_question_crud                                                           management
```

<!-- PDF page 33 -->
```text
FR-DOMAIN-03– Quiz attempt and history test_attempts,              S18: Student
06               endpoints           test_attempt_history       quiz and result
```

```text
FR-DOMAIN-07– Group management                                  S19: Group
                                  test_groups, test_rbac09               endpoints                                     management
```

```text
FR-DOMAIN-10   Audit log endpoint       test_audit_logs                S20: Audit log
```

Environment S21: Security

```text
NFR-01–04       configuration and       Security and authorization tests
                                                                     evidence
                  protected APIs
```

S22: API

```text
                                         Pagination and response-time
NFR-05–06      Paginated list APIs                                  response
                                              tests
                                                                     evidence
```

S23:

```text
NFR-07–08      Frontend pages        Frontend UI checks            Responsive UI
                                                              and feedback
```

```text
               Database and API      Persistence and error-handling   S24: Data
NFR-09–10
                 endpoints                tests                            persistence
```

```text
               Backend modules and                                S25: Test
NFR-11–12                                   Full backend test suite
                automated test suite                                         results
```

## Part C. Technical Design (TDD)

### C1. Technology Stack

```text
   The Quiz Game application uses a modern web development stack. React and TypeScript are
   used for the frontend, while FastAPI and Python handle backend operations. SQLAlchemy
   provides database connectivity and ORM functionality.
```

```text
        Component           Technology                        Reason for Choosing
```

Version

```text
          Frontend                                      19.3
```

```text
                               React                             Component-based
                                                                          user interface
```

<!-- PDF page 34 -->
development

```text
  Programming           TypeScript              7
    Language
                                                                              Static typing and
                                                                  improved
                                                                              maintainability
```

```text
     Build Tool                  Vite                    8.3            Fast development
                                                                    server and optimized
                                                                      production builds
```

```text
    UI Library        React components           Project           Reusable and
                       and CSS           implementation         customizable
                                                                          interface components
```

```text
    Backend              FastAPI                               High-performance
                                                   REST API
                                             0.141.1 or later, as     development and
                                                     specified in          automatic API
                                               requirements         documentation
```

```text
Backend Language         Python                3.13.17
```

Readable and maintainable backend development

```text
    Database                             Supabase-hosted        Relational data
                                                    version             storage and
                      PostgreSQL                                   production
                                                                 deployment
```

```text
  Local Database           SQLite             Installed SQLite       Lightweight local
                                                    version          development and
                                                                                   testing
```

ORM

```text
                     SQLAlchemy                2.x               Object-relational
                                                             mapping and
                                                              database operations
```

```text
Password Hashing      Argon2 through    Dependency-manage    Secure password
                             pwdlib                d               hashing and
                                                                                     verification
```

<!-- PDF page 35 -->
```text
    JWT Library          PyJWT        Dependency-manage      Creating and
                                               d             validating JSON Web
                                                                    Tokens
```

```text
   Database Driver                       Dependency-manage      PostgreSQL
                                               d                  connectivity
                       Psycopg Binary
```

```text
    API Validation                             FastAPI-compatible
                                                      version
                             Pydantic                               Request and
                                                                  response data
                                                                                   validation
```

```text
        Testing                                                Automated backend
                                                             and API testing
                               Pytest        Dependency-manage
                                               d
```

```text
   Frontend Hosting            Vercel         Managed platform
```

```text
                                                                 Frontend deployment
                                                              and hosting
```

```text
   Database Hosting
```

```text
                        Supabase       Managed platform    Hosted PostgreSQL
                                                                    database
```

```text
                            Table 16: Technology Stack
```

Technology selection rationale

- React and TypeScript provide a reusable and structured frontend.
- FastAPI supports REST API development, dependency-based authentication, and
```text
      OpenAPI documentation.
    - SQLAlchemy separates database operations from API logic.
    - Argon2 protects stored passwords against direct recovery from a database leak.
    - PyJWT supports signed access tokens.
    -  Pytest provides repeatable automated testing.
    -  Vercel and Supabase provide managed hosting for the application frontend and
```

<!-- PDF page 36 -->
database.

### C2. System Architecture

The Quiz Game follows a client-server architecture. The browser displays the React frontend, while the FastAPI backend processes API requests and communicates with the relational database.

Diagram: System Architecture

None‎ User

```text
                     |
                     v
               Client Browser
                     |
                     v
            Vercel Frontend
            React + TypeScript
                     |
            HTTP / REST Requests
                     |
                     v
             Vercel API / Backend
                FastAPI
                     |
          +----------+-----------+
          |          |           |
          v          v           v
      Auth/RBAC   API Routers  Services
          |          |           |
          +----------+-----------+
                     |
                     v
               SQLAlchemy
                     |
                     v
            PostgreSQL Database
               (Supabase)
                     |
            +--------+--------+
            |                 |
```

<!-- PDF page 37 -->
```text
            v                 v
        Application       Audit Log
           Data             Records
```

Communication Flow

## 1. Browser → Frontend: The user interacts with the React interface to perform actions such

```text
      as login, quiz management, or group management.
```

## 2. Frontend → API: The frontend sends HTTP requests through the centralized API

```text
        service. Protected requests include the access token in the Authorization header using
       the Bearer scheme.
```

## 3. API → Authentication: The backend validates the access token and checks the user's

```text
       account status and permissions before processing protected requests.
```

## 4. API → Database: FastAPI uses SQLAlchemy to retrieve or update application records in

```text
      SQLite or PostgreSQL.
```

## 5. API → Audit Log: Important administrative and system activities are recorded with

```text
       relevant actor, action, target, and timestamp information.
```

## 6. API → Frontend: The backend returns a JSON response with an appropriate HTTP

```text
       status code. The frontend updates the interface based on the response.
```

## 7. Refresh Cookie → API: The browser sends the refresh token through an HttpOnly cookie

```text
       during refresh operations. JavaScript cannot directly read this cookie.
```

### C3. Backend and Frontend Structure

The project separates frontend interface responsibilities from backend application logic.

Backend Folder Structure

None‎ backend/ ├── routers/

```text
  │   ├── admin.py
  │   ├── admin_dashboard.py
  │   ├── admin_users.py
  │   ├── attempts.py
  │   ├── audit_logs.py
  │   ├── auth.py
  │   ├── groups.py
  │   └── quizzes.py
  ├── services/
```

<!-- PDF page 38 -->
```text
  │   ├── attempt_service.py
  │   └── quiz_service.py
  ├── tests/
  │   ├── conftest.py
  │   ├── test_auth_security.py
  │   ├── test_security.py
  │   ├── test_rbac.py
  │   ├── test_admin_user_management.py
  │   ├── test_groups.py
  │   └── test_audit_logs.py
  ├── auth_config.py
  ├── create_admin.py
  ├── database.py
  ├── dependencies.py
  ├── jwt_handler.py
  ├── main.py
  ├── migrations.py
  ├── models.py
  ├── schemas.py
  ├── schemas_attempt.py
  └── security.py
```

Backend Responsibilities

```text
              Module                   Responsibility
```

Defines API

```text
routers/                                          endpoints
```

```text
                                         Contains reusable
services/                                         business logic
```

Defines

```text
models.py                          SQLAlchemy
                                        database models
```

Defines request

```text
schemas.py                          and response
                                    schemas
```

Configures

```text
database.py                           database
                                          connection and
```

<!-- PDF page 39 -->
sessions

Handles

```text
                                              authentication and
dependencies.py                                              authorization
                                       checks
```

Implements

```text
security.py                          password hashing
                                     and verification
```

Creates and

```text
jwt_handler.py                                                    verifies JWTs
```

Stores

```text
auth_config.py                           authentication
                                              configuration
```

Contains

```text
tests/                                automated
                                      backend tests
```

```text
                                                       Initializes FastAPI
main.py                             and registers
                                              routers
```

The reusable authorization checks are implemented through backend dependencies. The admin functionality is separated into administrator, dashboard, and user-management routers.

Frontend Folder Structure

None‎ frontend/ └── src/ ├── components/

```text
      │   ├── AdminDashboard.tsx
```

<!-- PDF page 40 -->
```text
      │   ├── AdminManagement.tsx
      │   ├── AuditLogs.tsx
      │   ├── GroupManagement.tsx
      │   ├── LoginForm.tsx
      │   ├── QuestionManager.tsx
      │   ├── QuizForm.tsx
      │   ├── QuizList.tsx
      │   ├── StudentAttemptHistory.tsx
      │   ├── StudentGroups.tsx
      │   ├── StudentProfile.tsx
      │   ├── StudentQuizAttempt.tsx
      │   └── UserManagement.tsx
      ├── context/
      │   └── AuthContext.tsx
      ├── services/
      │   └── api.ts
      ├── types/
      │   ├── attempt.ts
      │   ├── auditLog.ts
      │   └── quiz.ts
      ├── App.tsx
      ├── main.tsx
      └── index.css
```

Frontend Responsibilities:

```text
                Location                   Responsibility
```

Reusable pages

```text
components/                         and interface
                                      components
```

Shared

```text
context/AuthContext.tsx                                              authentication state
```

Centralized API

```text
services/api.ts                                        communication
```

TypeScript data

```text
types/                                                  definitions
```

<!-- PDF page 41 -->
```text
                                      Main application
App.tsx                                      structure and
                                             navigation
```

```text
main.tsx                               Frontend entry point
```

Global styling index.css

Route guards should restrict access to role-specific pages. Their exact implementation should be verified in the current frontend source code before documenting them as completed.

### C4. Data Model

The application uses SQLAlchemy models to represent relational database entities. Primary keys identify records, while foreign keys maintain relationships between related tables.

Diagram: Entity Relationship Overview

None‎

```text
  Quiz 1 -------- * Question
   |                  |
   |                  |
   1                  *
   |                  |
   *                  *
  QuizAttempt 1 --- * QuizAnswer
       |
       |
       *
      User
       |
       +--------- * RefreshSession
       |
       +--------- * Group (owner relationship)
       |
       +--------- * GroupMembership * -------- Group
       |
       +--------- * AuditLog (actor relationship)
```

```text
  Group 1 -------- * GroupPermission
```

<!-- PDF page 42 -->
Table 17: User Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                      Integer               Primary key          Unique user identifier
```

```text
 email                   String               Unique
```

```text
                                                             User login email
```

```text
 name                   String        —
```

```text
                                                                     User's display name
```

```text
 hashed_password      String               Not nullable
```

```text
                                                                   Stores the password
                                                            hash
```

```text
 role                     String        —                    Stores the account
                                                                              role
```

```text
 is_active             Boolean       —                      Indicates account
                                                                             activation
```

```text
 is_banned           Boolean       —                      Indicates whether the
                                                                 account is banned
```

```text
 ban_reason            String                  Nullable
```

Stores the ban reason

```text
 banned_at           DateTime              Nullable
```

Records the ban

<!-- PDF page 43 -->
timestamp

```text
 bannd_by              Integer                Foreign key where      Identifies the
                                               configured             administrator who
                                                          banned the user
```

```text
 created_at           DateTime      —                   Account creation
                                                               timestamp
```

Table 18: Quiz Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                       integer               Primary Key
```

```text
                                                             Unique quiz identifier
```

```text
  title                     String        —                   Quiz title
```

```text
 description             String        —
```

```text
                                                               Quiz description
```

```text
 is_published          Boolean       —                      Publication status
```

```text
 created_at           DateTime      —                    Creation timestamp
```

Table 19: Question Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                      Integer               Primary key
```

Unique question

<!-- PDF page 44 -->
identifier

```text
 quiz_id                 Integer                                            dentifies the parent
                                                                       quiz
                                             Foreign key to Quiz
```

```text
 question_text           String        —                   Question content
```

```text
 options           JSON        —                    Stores answer
                                                                      options
```

```text
 correct_option          Integer        —                    Stores the correct
                                                                       option index
```

Table 20: RefreshSession Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                      Integer                                  Unique session
                                                                                      identifier
                                            Primary key
```

```text
 user_id                 Integer                Foreign key to User    Session owner
```

```text
 token_hash             String               Unique             Hashed refresh token
```

```text
 created_at           DateTime           _                    Session creation time
```

```text
 expires_at           DateTime           _                    Session expiration
                                                                     time
```

```text
 revoked_at           DateTime
```

```text
                                                Nullable              Session revocation
                                                                     time
```

<!-- PDF page 45 -->
Table 21: QuizAttempt Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                                          Primary key          Unique attempt
                                                                                      identifier
                         Integer
```

user_id

```text
                         Integer                Foreign key to User    Student who
                                                                   submitted the attempt
```

quiz_id

```text
                         Integer                Foreign key to Quiz    Attempted quiz
```

score

```text
                         Integer        —                    Calculated score
```

total_questions

```text
                         Integer        —                       Total number of
                                                                    questions
```

correct_answers

```text
                         Integer        —                Number of correct
                                                             answers
```

submitted_at

```text
                     DateTime      —                   Submission time
```

Table 22: QuizAnswer Table

<!-- PDF page 46 -->
Column

```text
                      Type               Key / Constraint       Purpose
```

```text
   id                      Integer               Primary key
```

Unique answer identifier

```text
  attempt_id             Integer
```

```text
                                              Foreign key to         Parent attempt
                                             QuizAttempt
```

```text
  question_id            Integer                Foreign key to
                                             Question
                                                            Answered question
```

```text
  selected_options       Integer        —                    Selected option index
```

```text
   is_correct            Boolean       —                    Correctness result
```

Table 23: Group Table

Column

```text
                     Type               Key / Constraint       Purpose
```

```text
 id                      Integer               Primary key
```

Unique group identifier

```text
 name                   String
                                                          Group name
                                             Foreign key to
                                            QuizAttempt
```

```text
 description             String                 Foreign key to
                                            Question
                                                          Group descriptions
```

<!-- PDF page 47 -->
```text
 owner_id               Integer        —                 Group owner
```

```text
 created_at           DateTime      —                    Creation timestamp
```

Data Model Design Rules

Roles: The User.role field stores the primary account role. Group ownership and membership are represented through group-related records.

Bans: The is_banned, ban_reason, banned_at, and banned_by fields record account ban information.

Refresh sessions: The RefreshSession table stores hashed refresh tokens, expiration, revocation, and rotation information.

Group membership: The GroupMembership table links users and groups. The GroupPermission table stores group-level permission records.

Activity logging: The AuditLog table stores important security and administrative events.

### C5. API Design

The backend exposes REST endpoints through FastAPI. The API uses JSON for request and response bodies where applicable.

API prefix: /api

API versioning: The current API uses the /api prefix and does not use a separate numbered version such as /api/v1.

API Authentication Rules

-  Public endpoints do not require an access token.
-  Protected endpoints require a valid access token.
-  Administrator endpoints require the Admin role.
- Resource ownership and group permissions are checked by the backend where
applicable.

-  Refresh endpoints use the HttpOnly refresh cookie.
Table 27: Authentication and Account Endpoints

<!-- PDF page 48 -->
Error

```text
                                           Role /     Request
     Method and Path      Authentication                      Success Stat
                                        Permission    Body
                                                                   uses
```

```text
                                                Name,               400,
POST /api/auth/signup  No               Visitor         email,     201      409,
                                                    password           422
```

401, Email,

```text
POST /api/auth/login   No               Visitor                  200      403,                                                    password
                                                                     422
```

```text
                                             Authenticated                       401,
GET /api/auth/me       Yes                     None      200                                           user                           403
```

```text
                                             Authenticated                       401,
PATCH /api/auth/me     Yes                               Profile fields 200                                           user                           422
```

```text
POST                                                      Current and          400,                                             Authenticated
/api/auth/change-passw Yes                     new       200      401,                                           user
ord                                                 password           422
```

```text
                                                 Valid refresh   Cookie-bas           401,
POST /api/auth/refresh Refresh cookie                        200                                            session      ed                403
```

```text
                           Refresh cookie / Current
POST /api/auth/logout                          None      200     401                            session        session
```

```text
GET /api/auth/sessions Yes           Session owner None      200     401
```

```text
DELETE                                                                               401,
/api/auth/sessions/{se Yes           Session owner None      200                                                                     404
```

ssion_id}

```text
DELETE                         Yes           Session owner None      200     401
```

/api/auth/sessions

```text
POST                    Depends on                                       400,                                          Allowed demo Role path
/api/auth/demo-login/{ demo                               200      401,                                                   role          parameter
role}                        configuration                                  403
```

Table 28: Quiz and Question Endpoints

<!-- PDF page 49 -->
Error

```text
                                            Role /   Request
      Method and Path       Authentication                   Success Statu
                                          Permission  Body
                                                                     ses
```

Public or

```text
GET /api/quizzes             optional, as      Visitor / User None   200      500
                                configured
```

```text
GET                                           Authorized                          As configured            None   200      404
/api/quizzes/{quiz_id}                   reader
```

```text
GET                                                                         401,                                      Owner /
/api/quizzes/{quiz_id}/m Yes                    None   200       403,                                        Admin
anagement                                                          404
```

401,

```text
                                               Authorized  Quiz
POST /api/quizzes         Yes                             201       403,                                                   creator       fields
                                                                    422
```

401, Updated

```text
PATCH                                 Owner /                        403,                            Yes                          quiz    200
/api/quizzes/{quiz_id}                Admin                         404,                                                                         fields
                                                                    422
```

401,

```text
DELETE                                Owner /                            Yes                    None   200       403,
/api/quizzes/{quiz_id}                Admin                                                                    404
```

401,

```text
POST                                            Quiz owner / Question           403,
/api/quizzes/{quiz_id}/q Yes                             201                                        Admin        fields              404,
uestions                                                                    422
GET                                               Authorized
/api/questions/{question As configured            None   200      404                                               reader
```

_id}

401,

```text
PATCH                                               Updated                                            Quiz owner /                   403,
/api/questions/{question Yes                         question 200                                        Admin                         404,
_id}                                                                   fields                                                                    422
```

```text
DELETE                                                                      401,                                            Quiz owner /
/api/questions/{question Yes                    None   200       403,                                        Admin
_id}                                                               404
```

Table 29: Administrator Endpoints

<!-- PDF page 50 -->
```text
                                             Role /                         Error
                                                    Request
      Method and Path        Authentication  Permissio           Success Statuse
                                                Body
                                          n                          s
                                                                               401,
GET /api/admins           Yes           Admin    None      200                                                                     403
```

401,

```text
                                                               Administrat          403,
POST /api/admins          Yes           Admin               201                                                                or details            409,
                                                                     422
```

Admin,

```text
                                                   subject to                       401,
DELETE                           Yes            admin     None      200      403,
/api/admins/{admin_id}                                                     protection                    404
                                                     rules
GET                                                                               401,
/api/admin/dashboard/sta Yes           Admin    None      200                                                                     403
```

ts

Search and 401,

```text
GET /api/admin/users     Yes           Admin        filter query  200                                                                     403
                                                        parameters
```

```text
GET                                                                            401,
/api/admin/users/{user_i Yes           Admin    None      200      403,
d}                                                                   404
```

401,

```text
PATCH                                                       Account             403,
/api/admin/users/{user_i Yes           Admin               200                                                                status               404,
d}/status                                                                     422
```

Admin, 401,

```text
PATCH                                            subject to                                                                               403,
/api/admin/users/{user_i Yes            admin    New role   200                                                                               404,
d}/role                                           protection                                                                     422
                                                     rules
```

Admin, 401,

```text
PATCH                                            subject to                                                                               403,
/api/admin/users/{user_i Yes            admin     Ban reason 200                                                                               404,
d}/ban                                            protection                                                                     422
                                                     rules
PATCH                                                                         401,                           Yes           Admin    None      200
/api/admin/users/{user_i                                                  403,
```

<!-- PDF page 51 -->
```text
d}/unban                                                             404
```

User

```text
POST                                                                          401,                                                                         identifiers
/api/admin/users/bulk-ba Yes           Admin               200      403,                                                   and ban
n                                                                    422                                                                information
POST                                                                          401,                                                      User
/api/admin/users/bulk-un Yes           Admin               200      403,                                                                         identifiers
ban                                                                  422
```

Table 30: Group Management Endpoints

```text
                                                 Role /                      Error
                                                       Request Succes
        Method and Path          Authentication Permissio                   Statu
                                                   Body     s
                                             n                      ses
```

401, Group

```text
POST /api/admin/groups        Yes           Admin              201     403,                                                                          details
                                                                       422
```

Filter

```text
                                                            parameter         401,
GET /api/admin/groups         Yes           Admin              200                                                                              s, if              403
                                                              supported
```

401,

```text
GET                                Yes           Admin    None     200     403,
/api/admin/groups/{group_id}                                                                       404
```

401, Updated

```text
PATCH                                                                           403,                                Yes           Admin     group    200
/api/admin/groups/{group_id}                                               404,                                                                              fields
                                                                       422
```

401,

```text
DELETE                                Yes           Admin    None     200     403,
/api/admin/groups/{group_id}                                                                       404
```

```text
GET                                                                              401,
/api/admin/groups/{group_id} Yes           Admin    None     200     403,
/members                                                               404
```

<!-- PDF page 52 -->
401,

```text
     POST                                                       Member           403,
     /api/admin/groups/{group_id} Yes           Admin              201                                                                                         identifier           404,
     /members                                                                             409
```

```text
     DELETE                                                                          401,
     /api/admin/groups/{group_id} Yes           Admin    None     200     403,
     /members/{user_id}                                                    404
```

```text
     GET                                                                              401,
     /api/admin/groups/{group_id} Yes           Admin    None     200     403,
     /permissions                                                          404
```

```text
                                                                     Permissio          401,
     POST                                                            n                  403,
     /api/admin/groups/{group_id} Yes           Admin              201                                                                             informatio          404,
     /permissions                                                            n               422
     DELETE
     /api/admin/groups/{group_id} Yes           Admin    None     200
     /permissions/{permission}
```

```text
     Table 31: Student and Group Endpoints
```

```text
                                                   Role /     Request  Succes    Error
         Method and Path           Authentication
                                                 Permission   Body      s     Statuses
```

```text
                                                      Authorized    Group             401, 403,
POST /api/groups                Yes                                201                                                     user            details           422
```

```text
                                                            Updated           401, 403,
PATCH /api/groups/{group_id}   Yes          Group owner           200                                                               group fields       404
```

<!-- PDF page 53 -->
401, 403,

```text
DELETE /api/groups/{group_id}  Yes          Group owner  None     200                                                                           404
```

Group owner /

```text
GET                                                                                  401, 403,                                  Yes            authorized    None     200
/api/groups/{group_id}/members                                           404                                          member
```

```text
POST                                                 Member            401, 403,                                  Yes          Group owner           201
/api/groups/{group_id}/members                                information         404, 409
```

```text
DELETE                                                                                      401, 403,
/api/groups/{group_id}/members Yes          Group owner  None     200                                                                           404
```

/{user_id}

Authenticated

```text
GET /api/groups/me              Yes                     None     200    401                                                     user
```

Authenticated

```text
GET /api/groups/me/permissions Yes                     None     200    401                                                     user
```

Member with Resource

```text
GET /api/groups/resources      Yes            required               200     401, 403                                                                 query
                                                     permission
```

```text
     Table 32: Quiz Attempt and Audit Endpoints
```

```text
                                             Role /    Request
      Method and Path       Authentication                     Success  Error Statuses
                                          Permission   Body
```

```text
 POST                                       Student /                                                         Submitted           401, 403, 404,
 /api/quizzes/{quiz_id} Yes             authorized           201                                                      answers           422
 /attempts                                  user
```

Attempt

```text
 GET /api/attempts/me   Yes                     None     200      401                                         owner
```

Filter

```text
 GET                           Yes           Admin       parameter 200       401, 403
 /api/admin/audit-logs                                                         s
```

GET

```text
 /api/admin/audit-logs/ Yes           Admin      None     200       401, 403, 404
```

{log_id}

<!-- PDF page 54 -->
API Error Response Format

The backend uses FastAPI's JSON error response mechanism. An error response communicates the failure through an HTTP status code and a detail message.

Example:

JSON‎ {

```text
    "detail": "Not authenticated"
   }
```

Validation errors may contain additional field-level information.

```text
       Status                  Meaning
```

## 200               Request completed successfully

## 201               Resource created successfully

```text
                       Invalid request or business rule
```

400 violation

```text
                     Missing, expired, or invalid
```

401 authentication

```text
                    Authenticated user does not have
```

403 permission

```text
                  Requested resource does not exist or
```

404

```text
                          is not accessible
```

## 409               Resource conflict

## 422               Request validation failed

## 500                   Internal server error

### C6. JWT Authentication Design

The Beta release uses JWT-based access authentication and database-backed refresh sessions.

Login and Token Flow

<!-- PDF page 55 -->
Diagram: JWT Authentication Sequence

None‎

```text
  User          Frontend          FastAPI          Database
   |                |                |                 |
   |-- Login ------>|                |                 |
   |                |-- Credentials->|                 |
   |                |                |-- Find User ---->|
   |                |                |<-- User Data ----|
   |                |                |                 |
   |                |                | Verify Password |
   |                |                | Check Status     |
   |                |                |                 |
   |                |                | Create JWT      |
   |                |                | Create Session  |
   |                |                | Store Token Hash>|
   |                |<-- Access JWT + Refresh Cookie --|
   |                |                |                 |
   |-- Protected Request ----------->|                 |
   |                | Authorization: Bearer JWT       |
   |                |                | Validate JWT    |
   |                |                | Check User      |
   |                |                |                 |
   |                |<-- JSON Response ----------------|
   |                |                |                 |
   |-- Token Expired / Refresh ----->|                 |
   |                | Refresh Cookie | Validate Session|
   |                |                | Rotate Token    |
   |                |                | Update Database>|
   |                |<-- New Access JWT + Cookie ------|
   |                |                |                 |
   |-- Logout ---------------------->|                 |
   |                |                | Revoke Session  |
   |                |                | Update Database>|
   |                |<-- Logout Response --------------|
```

Authentication Process

## 1. The user submits their email and password through the login form.

## 2. The backend retrieves the corresponding user account.

## 3. The submitted password is verified against the stored Argon2 hash.

## 4. The backend checks whether the account is active and not banned.

## 5. A signed access JWT is generated.

## 6. A refresh session is created in the database.

## 7. The refresh token is stored as a hash.

## 8. The raw refresh token is delivered through an HttpOnly cookie.

<!-- PDF page 56 -->
## 9. The frontend uses the access token for protected API requests.

Token Claims and Lifetime

The access token is valid for 15 minutes. This relatively short lifetime limits the period during which a stolen access token may remain usable.

```text
       Token Property          Configuration
```

Identifies the User ID

```text
                                 authenticated user
```

```text
Role                       Admin or User
```

```text
Issued At (iat)                Token creation time
```

```text
                            15 minutes after
Expiration (exp)                               issuance
```

```text
                             To be verified in
```

Signing Algorithm jwt_handler.py

```text
                                Configured through
```

Signing Secret JWT_SECRET_KEY

The refresh session has a 15 minutes expiration period. Refresh tokens are stored as hashes in the database and delivered through an HttpOnly cookie.

Token Storage and Lifetime

The refresh session has a 15 minutes expiration period. Access-token lifetime must be confirmed from the authentication configuration.

The HttpOnly attribute prevents frontend JavaScript from directly reading the refresh token. This reduces exposure through certain XSS attacks. Cookie security settings, including Secure and SameSite, must be configured appropriately for the production environment.

Token Refresh and Logout

When an access token expires, the frontend should attempt a refresh operation once. If the refresh operation succeeds, the new access token is used for subsequent requests. If refresh fails, the frontend should clear its authentication state and return the user to the login page.

During refresh, the backend validates the existing refresh session and rotates the token. The previous session is revoked, and the replacement token hash is stored.

During logout, the refresh session is revoked and the refresh cookie is cleared. Reuse of a

<!-- PDF page 57 -->
revoked or replaced refresh token should be rejected.

### C6.6 Protected Request Validation

For every protected request, the backend performs the applicable checks:

## 1. Extracts the access token from the Authorization header.

## 2. Validates the JWT signature.

## 3. Checks the token expiration.

## 4. Extracts the user identity and session information.

## 5. Retrieves the corresponding user.

## 6. Checks whether the user account exists and is active.

## 7. Rejects banned users.

## 8. Applies the required role and permission checks.

### C6.7 Access Token Expiry and Frontend Behavior

When a protected request returns HTTP 401 because the access token has expired, the frontend attempts to refresh authentication once.

-   If refresh succeeds, the frontend stores the new access token and retries the original
request once.

-   If refresh fails, the frontend clears authentication state and redirects the user to the login
interface.

- The frontend does not repeatedly retry failed refresh requests.
### C6.8 Logout

Logout revokes the current refresh session in the database and clears the refresh cookie. The frontend also clears its in-memory access token and authentication state.

### C7. RBAC Design

The system uses Role-Based Access Control to restrict access to protected features.

<!-- PDF page 58 -->
Primary Roles

```text
        Role                                Responsibilities
```

```text
Guest                 Registration and login
```

```text
Student/User            Profile, quiz attempts, personal history, and owned groups
```

```text
                    Quiz administration, user management, group administration,
```

Admin

```text
                      permissions, dashboard, and audit logs
```

### Authorization Workflow

Diagram: Authorization Flow

None‎

```text
  Incoming API Request
          |
          v
  Validate Access Token
          |
          v
  Retrieve Current User
          |
          v
  Check Account Status
          |
          v
  Check Required Role
          |
          v
  Check Resource Ownership
          |
          v
  Check Group Permission
          |
          v
  Execute Authorized Handler
          |
          v
  Return Response
```

<!-- PDF page 59 -->
Reusable Authorization Dependencies

The backend uses reusable dependencies in dependencies.py.

The following is a conceptual example of the authorization pattern; the final code excerpt should be replaced with the exact implementation from the project.

Python‎ def require_permission(permission: str): def checker( group_id: int,

```text
          user=Depends(get_current_user),
          db: Session = Depends(get_db),
      ):
          if user.role == "admin":
              return user
```

```text
          membership = get_membership(
              db, group_id, user.id
          )
          if not membership:
              raise HTTPException(status_code=403)
```

```text
          if not has_permission(
              db, group_id, permission
          ):
              raise HTTPException(status_code=403)
```

return user return checker

### Ownership and Permission Rules

-  Students can manage only groups they own.
-  Students can retrieve only their own attempt history and sessions.
-  Students cannot assign or revoke group permissions.
- Group members can access resources only when the required permission is available.
- Admin users can bypass group-level permission checks where applicable.
-  Inactive or banned accounts must not access protected functionality.
Ownership should be enforced in database queries using the authenticated user's ID. For example, personal attempt history should be filtered by the current user's ID rather than retrieving all attempts and filtering them only in the frontend.

<!-- PDF page 60 -->
### Extending Roles and Permissions

A new permission can be introduced by defining a permission constant, assigning it through the appropriate administrative operation, and checking it through the reusable authorization dependency.

A new primary role requires updates to role validation, authorization dependencies, and frontend role-based navigation.

### C8. Admin Dashboard Design

The Admin Dashboard provides centralized access to administrative functions. It supports dashboard statistics, administrator management, user management, group administration, and audit log inspection.

### Admin Pages and API Integration

Table 28: Admin Pages and Operations

```text
    Page          Main Endpoints          Main Actions      Audit Activity
            /api/admin/dashboard/st                     DashboardDashboard                               View statistics
            ats                                                access, if logged
Admin                                        Create, view, delete    Admin account
            /api/adminsManagement                             admins              changes
User                                                         User information
            /api/admin/users         Search and view usersManagement                                                       access, if logged
            /api/admin/users/{id}/sUser Status                                     Activate/deactivate     Status changes
            tatus
Role        /api/admin/users/{id}/r                                        Update role           Role changes
Management  ole
Ban                                                                 Ban-related
             Ban/unban and bulk endpoints Ban or unban users
Management                                                          actions
Group                                        Create, update, delete
            /api/admin/groups                           Group changesManagement                               groups
Group                                       Assign/revoke         Permission
             Group permission endpoints
Permissions                                 permissions          changes
```

```text
                                                                       Audit log access,
Audit Logs    /api/admin/audit-logs   View activity records                                                                                                                                 if logged
```

.

### Bulk Actions

<!-- PDF page 61 -->
Bulk ban and unban operations are provided through dedicated API endpoints. The backend should validate each selected user and apply the requested operation only to eligible accounts.

If the implementation returns affected and skipped counts, the frontend can display the operation summary to the administrator. The exact response fields should be documented from the implemented API schema.

### C9. Security Design and Threats

The system applies authentication, authorization, password hashing, request validation, and environment-based configuration to reduce common security risks.

Table 29: Security Threats and Defences

```text
         Threat                      Defence                Related Module
Password database leak  Argon2 hashing and server-side pepper   security.py
                                                     jwt_handler.pStolen access token     JWT signature and expiration validation
                                                     y
```

```text
                                                         auth.py,Stolen refresh token      Hashed storage, rotation, and revocation
                                                     models.py
```

```text
                          [Confirm rate limiting or lockout             Authentication
```

Brute-force login

```text
                          implementation]                       module
```

```text
                                                     dependencies.Privilege escalation      Backend role checks
                                                     py
```

```text
Access to another user's  Ownership checks and user-scoped       Routers and
data                      queries                                   services
```

```text
                         HttpOnly refresh cookie and safe frontend  Frontend and
```

Cross-site scripting (XSS)

```text
                          rendering                                  authentication
```

```text
Cross-site request forgery                                             Authentication
                          [Confirm cookie and CSRF protections]
(CSRF)                                                                configuration
```

```text
CORS misuse             Restricted allowed frontend origins       main.py
```

```text
                        Environment variables and excluded      Deployment
```

Secrets in repository

```text
                         environment files                           configuration
```

```text
                     SQLAlchemy parameterized database
SQL injection                                                Database layer
                          operations
```

```text
                          Pydantic schemas and controlled update   schemas.py,Over-posting of fields
                                fields                                       routers
```

Security checks must be enforced by the backend. Hiding a frontend button or page is not

<!-- PDF page 62 -->
sufficient authorization.

### C10. Deployment on Vercel

The project uses separate frontend and backend development environments. The frontend is built with Vite, while the backend runs through FastAPI.

The deployment configuration should identify the frontend project, API hosting configuration, and hosted PostgreSQL database.

Diagram: Deployment Layout

None‎ User Browser

```text
                     |
                     v
            Vercel Frontend
            React + Vite
                     |
               HTTPS Requests
                     |
                     v
            Hosted FastAPI API
                     |
                SQLAlchemy
                     |
                     v
            Supabase PostgreSQL
                     |
                     v
                Audit Logs
```

The frontend discovers the backend API through its configured API base URL. The exact Vercel project configuration, API deployment method, and rewrite rules must be verified against the current deployment settings.

Environment Variables

Table 30: Environment Configuration

```text
                   Variable                    Purpose
```

<!-- PDF page 63 -->
Database

```text
DATABASE_URL                                             connection
```

```text
JWT_SECRET_KEY                    JWT signing secret
```

```text
                                                  Additional password
PASSWORD_PEPPER                                                  protection
```

```text
                                            Allowed frontend
FRONTEND_URL                                                      origin
```

```text
                                         Token and cookie
```

Authentication configuration variables configuration

Redeployment Process

## 1. Review the latest changes locally.

## 2. Run the relevant backend and frontend tests.

## 3. Commit and push the changes to the appropriate Git branch.

## 4. Open and merge the Pull Request after review.

## 5. Verify that the deployment platform has the correct build and environment settings.

## 6. Trigger or wait for the deployment associated with the updated branch.

## 7. Check the frontend, backend health endpoint, and API documentation.

## 8. Test login and protected API operations against the deployed environment.

The exact build commands, output directory, and rewrite configuration should be copied from the actual Vercel project settings.

### C11. Testing

The project uses automated backend testing with Pytest and manual API testing through FastAPI Swagger documentation.

Test Strategy

-  Unit testing: checks individual backend functions and security utilities.
- API testing: verifies endpoint responses and validation.
-  Authentication testing: checks login, JWT validation, refresh, and logout.
-  Authorization testing: checks Admin and Student access restrictions.
-  Integration testing: checks communication between routers, services, and the database.
- Manual testing: verifies application workflows through the frontend and Swagger UI.
Running Backend Tests

From the project root:

<!-- PDF page 64 -->
None‎

`cd backend`  
.\.venv\Scripts\Activate.ps1

`pytest`  
To run a specific test module:

None‎

`pytest tests/test_auth_security.py`  
### Test Coverage

Table 31: Test Modules

```text
               Test File                    Testing Area
```

Login and

```text
test_auth_security.py                                           authentication security
```

```text
                                   Password hashing and
test_security.py                                                verification
```

```text
                                      Role-based access
test_rbac.py                                             control
```

```text
test_admin_user_management.py   Admin user operations
```

```text
                                   Group and permission
test_groups.py                                         operations
```

```text
test_audit_logs.py                  Audit log functionality
```

### Test Results

The following table defines the results that should be recorded after executing the test suite. Actual results must be filled in from the latest test run.

Table 32: Test Results

```text
      Test Scenario               Requirement Verified              Result
```

```text
User registration          Unique email and valid account creation     [Record result]
```

<!-- PDF page 65 -->
```text
Password verification      Argon2 password verification               [Record result]
```

```text
JWT expiry                Expired token rejection                    [Record result]
```

```text
JWT tampering              Invalid signature rejection                  [Record result]
```

```text
Refresh rotation           Old refresh token rejection                 [Record result]
```

```text
Session revocation        Revoked session rejection                 [Record result]
```

```text
Admin authorization        Admin-only endpoint protection             [Record result]
```

```text
Student authorization       Student restrictions                        [Record result]
```

```text
Ownership validation      Access limited to owned resources          [Record result]
```

```text
Group permission matrix    Allowed and denied group operations        [Record result]
```

```text
Ban enforcement         Banned account restrictions                [Record result]
```

[Confirm

```text
Login lockout             Repeated failed login handling              implementation
                                                            and result]
```

```text
Quiz submission          Complete and valid answer submission      [Record result]
```

```text
Audit logging               Administrative activity recording             [Record result]
```

## Part D. Evidence: Screenshots of the Running

Application

Take every screenshot on the deployed Vercel URL, with the address bar visible and the logged-in user shown. Crop to the relevant area. Give each a number, a caption saying what it proves and the

<!-- PDF page 66 -->
requirement ID. Mask passwords and tokens.

### D1. User Side

Each screenshot below is required:

> **Visual evidence placeholder:** [S1: signup and login page, with a validation error shown (for example a weak

password)]

<!-- PDF page 67 -->
> **Visual evidence placeholder:** [S2: the main feature page of a logged-in user, showing only that user's

records]

> **Visual evidence placeholder:** [S3: profile page and the change password form, with the wrong current

password rejected]

<!-- PDF page 68 -->
> **Visual evidence placeholder:** [S5: a group page showing members and their permissions]

<!-- PDF page 69 -->
### D2. Security Behaviour

Use the browser developer tools:

> **Visual evidence placeholder:** [S7: network tab showing the Authorization header (token masked) and an

```text
   expired token returning 401]
```

> **Visual evidence placeholder:** [S9: a banned user rejected on the next request]

<!-- PDF page 70 -->
### D3. Admin Dashboard

Show real data and the matching result of each action:

> **Visual evidence placeholder:** [S10: overview statistics]

> **Visual evidence placeholder:** [S11: users list with search, filters and pagination]

<!-- PDF page 71 -->
> **Visual evidence placeholder:** [S12: user detail with sessions and recent activity]

<!-- PDF page 72 -->
> **Visual evidence placeholder:** [S13: the ban dialog with a reason, and the banned state afterwards]

> **Visual evidence placeholder:** [S14: records and groups moderation list with filters and a bulk action]

<!-- PDF page 73 -->
> **Visual evidence placeholder:** [S15: activity log with filters, showing the events caused by the steps above]

### D4. Deployment

<!-- PDF page 74 -->
Show that it is live and configured:

> **Visual evidence placeholder:** [S18: the Vercel frontend project with the production deployment and domain]

> **Visual evidence placeholder:** [S19: the Vercel API project with the environment variable names (values

hidden)]

<!-- PDF page 75 -->
> **Visual evidence placeholder:** [S20: the live API documentation page]

### D5. Tests

The output of the automated tests:

> **Visual evidence placeholder:** [S21: test run output showing all tests and the result]

<!-- PDF page 76 -->
## Part E. Project Management and Conclusion

### E1. How to Run and Test

This section explains how to set up and run the Quiz Game project locally. The instructions assume that Git, Python, and Node.js are installed.

### E1.1 Prerequisites

```text
           Requirement                       Purpose
```

```text
Git                                 Clone the project repository
```

```text
Python                         Run the FastAPI backend
```

```text
Node.js and npm                  Run the React frontend
```

```text
Code editor (e.g., VS Code)           View and modify the source code
```

```text
                                                 Install dependencies and access the
```

Internet connection

```text
                                       configured database
```

### E1.2 Get the Project

Clone the repository and enter the project directory:

None‎ git clone https://github.com/karima0108/2311971-Quiz-Game.git

`cd 2311971-Quiz-Game`  
### E1.3 Configure Environment Variables

Create the backend environment file at backend/.env. Add the required variables using the actual configuration values for the project.

Example format:

None‎ DATABASE_URL=<your_database_connection_string> JWT_SECRET_KEY=<your_secret_key>

Use the local SQLite database configuration or the project's configured PostgreSQL connection,

<!-- PDF page 77 -->
as appropriate. Generate a strong, private JWT secret key. Do not commit .env files, database passwords, JWT secrets, or other credentials to GitHub.

Note: Confirm the complete list of required environment variables from the project's configuration files before running the application. The example above is not necessarily the complete environment configuration.

### E1.4 Install Backend Dependencies

Open PowerShell in the project root:

None‎

`cd backend`  
`python -m venv .venv`  
.\.venv\Scripts\Activate.ps1

`pip install -r requirements.txt`  
If PowerShell blocks script activation, use the following command for the current terminal session:

None‎

`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`  
.\.venv\Scripts\Activate.ps1

### E1.5 Run the Backend

From the backend directory, activate the virtual environment if necessary and run:

None‎

`fastapi dev main.py`  
The backend runs locally at:

http://127.0.0.1:8000

Interactive API documentation is available at:

http://127.0.0.1:8000/api/docs

<!-- PDF page 78 -->
### E1.6 Install and Run the Frontend

Open a second PowerShell terminal in the project root:

None‎

`cd frontend`  
`npm install`  
`npm run dev`  
Open the local frontend URL displayed in the terminal, normally:

http://localhost:5173

The frontend communicates with the backend through the configured API base URL. Ensure that the local frontend configuration points to the running backend.

### E1.7 Run Backend Tests

Open another terminal, navigate to the backend directory, and activate the virtual environment:

None‎

`cd backend`  
.\.venv\Scripts\Activate.ps1

`pytest`  
To run a particular test module:

None‎

`pytest tests/test_auth_security.py`  
The test command runs the available automated backend tests. Actual test results should be recorded after running the suite in the final project environment.

### E1.8 Test Login

After the application and database are ready, open the frontend and use the prepared demo accounts to test the two account roles:

- Admin: for administrative features and management operations.
- User: for normal user features, such as profile management and available student
activities.

The demo account user IDs and passwords are provided only in the PDF report's Appendix. They are intentionally excluded from this Markdown file and the GitHub repository.

<!-- PDF page 79 -->
### E2. GitHub Work

The project was developed incrementally using Git branches, issues, commits, and pull requests. The MVP phase focused on the core quiz-management functionality. The Beta phase extended the system with authentication, authorization, and administrative functionality.

```text
    Issue      Pull Request     Feature / Title         What It Delivered
```

```text
                                              Implemented the core
                                             quiz-management functionality,
                           Quiz Management
Issue #5    PR #6                                 including creating, listing, updating,
                   CRUD
                                           and deleting quizzes and managing
                                                              their questions.
```

```text
                                               Beta development work for
                                                      administrator authentication,
                                             password security, JWT-based
               [To be        Admin Authentication
Issue #8                                              authentication, and role-based
              confirmed]     and RBAC
                                                        authorization. The final merged
                                                 implementation should be verified
                                                    against the pull request.
```

```text
                                                     Administrative overview and
```

[Issue / PR

```text
                [Link to be                      management features. Add the
link to be                 Admin Dashboard
             added]                              exact issue and PR after checking
```

added]

```text
                                                    the repository history.
```

```text
[Issue / PR                                    User listing, account status, role
                [Link to be
link to be                   User Management   management, and ban-related
             added]
added]                                                     functionality, where implemented.
```

```text
[Issue / PR                                  Group management, membership,
                [Link to be     Groups and
link to be                                    and group-level permissions, where
             added]         Permissions
added]                                          implemented.
```

```text
[Issue / PR                                       Student quiz attempts, attempt
                [Link to be     Quiz Attempts and
link to be                                                  history, and administrative activity
             added]         Audit Logs
added]                                              records, where implemented.
```

### Development Timeline and Contribution

The work was divided into two major stages:

## 1. MVP stage: The initial development focused on the frontend, backend API, database

```text
        integration, and quiz/question CRUD operations. The MVP was assessed and received
      27 out of 30 marks.
```

<!-- PDF page 80 -->
## 2. Beta stage: Development moved towards authentication, password hashing,

```text
      JWT-based sessions, role-based access control, and administrative features. Work was
       organized through feature branches linked to GitHub issues.
```

The commits authored by the project developer should be identified from the repository's commit history. The final report should distinguish personally authored commits from commits contributed by other team members. Feature ownership and collaboration should be described according to the actual issue assignments and pull-request history.

Repository: https://github.com/karima0108/2311971-Quiz-Game

### E3. Limitations

The following limitations should be reviewed against the final deployed application and test results before submission. A feature described in the requirements or design documents should not be considered complete unless its implementation has been verified.

```text
                                        Limitation / Point to Verify
```

Area

```text
                     Confirm that access-token expiry, refresh-token rotation, logout,
Authentication        and session revocation work correctly in the deployed
                      environment.
```

```text
                   The access token has a 15-minute lifetime. Token storage,
Token Security         refresh-cookie settings, and protection against token theft should
                   be reviewed.
```

```text
                    Rate limiting, login-attempt throttling, and account lockout
```

Brute-force Protection

```text
                        protection require verification.
```

```text
                   The refresh-token cookie requires appropriate CSRF protection
```

CSRF Protection

```text
                     depending on its SameSite and cross-origin configuration.
```

```text
                XSS prevention and secure handling of authentication responses
```

Frontend Security

```text
                        require further review.
```

```text
                     Every administrative endpoint and group-level permission check
```

RBAC

```text
                      should be tested to prevent unauthorized access.
```

<!-- PDF page 81 -->
```text
                      Permission combinations and ownership restrictions may require
```

Group Management

```text
                         additional edge-case testing.
```

```text
                      Local development and deployed API/database configurations
Deployment        may behave differently. Deployment-specific failures should be
                    documented.
```

```text
                   The existence of test files does not guarantee complete test
Automated Testing     coverage. All tests should be executed and their actual results
                       recorded.
```

```text
                      Production monitoring, automated alerts, and detailed operational
```

Monitoring

```text
                       logging may require further development.
```

Known bugs and incomplete features identified during final testing should be added to this table with their reproduction steps and current status. No unresolved issue should be described as fixed without verification.

### E4. Future Work

The following improvements are proposed in priority order:

```text
  Priority           Future Improvement                  Reason
```

```text
                                           Reduce the risk of unauthorized
          Complete security testing and strengthen
1                                                  access, token misuse, and
            authentication protections
                                                  account attacks.
```

```text
                                                    Detect regressions and verify
```

## 2         Improve automated test coverage            role, ownership, and permission

rules.

```text
          Improve deployment reliability and       Make local and production
```

3

```text
           environment configuration                environments more consistent.
```

```text
                                         Make administrative user and
```

## 4        Add better filtering, pagination, and search  group management easier at

scale.

<!-- PDF page 82 -->
```text
                                                 Help administrators review and
```

## 5         Improve audit-log reporting and export      investigate important system

activities.

```text
                                                    Provide a clearer and more
```

## 6         Improve frontend usability and accessibility consistent experience for both

```text
                                                        administrators and users.
```

```text
                                                  Support a larger number of
         Add more quiz features and performance
7                                                  quizzes and users as the
          improvements
                                                         application grows.
```

### E5. Sources, Libraries and Tools

The following technologies and tools were used or selected for the project. Versions should be checked against the project's dependency files before final submission.

```text
    Name             Version / Link                   Purpose
```

```text
React          19                              Building the frontend user interface.
```

```text
                                                 Providing static typing in frontend
TypeScript      7
                                             development.
```

```text
                                             Frontend development server and
Vite           8
                                                     build tooling.
```

```text
                 3.13 (local development
Python                                   Backend application development.
                 environment)
```

<!-- PDF page 83 -->
See

```text
                                                   Building REST API endpoints and API
FastAPI       backend/requirements.tx                                              documentation.
              t
```

```text
                                          Database models and ORM
SQLAlchemy     2.x
                                                  operations.
```

```text
SQLite          Local database configuration    Local development and testing.
```

```text
                 Configured deployment
PostgreSQL                                      Persistent relational data storage.
                database
```

See

```text
Psycopg       backend/requirements.tx PostgreSQL database connectivity.
              t
              See
PyJWT        backend/requirements.tx Creating and validating JWT tokens.
              t
              See
pwdlib with                                 Secure password hashing and
              backend/requirements.txArgon2                                                  verification.
              t
```

```text
Pytest             Installed test dependency      Backend automated testing.
```

```text
                                               Version control and branch
Git                  Official website
                                         management.
```

```text
                                            Source-code hosting, issues, commits,
GitHub           Project repository
                                         and pull requests.
```

```text
Visual Studio                                Source-code editing and project
                     Official website
Code                                        development.
```

```text
                                           Hosted PostgreSQL database service,
Supabase         Official website
                                                                                          if used for the deployed environment.
```

```text
Vercel              Official website                Frontend hosting and deployment.
```

```text
                                               Assistance with understanding
ChatGPT                                          technical concepts, debugging,
              ChatGPT
(OpenAI)                                       reviewing implementation approaches,
                                         and preparing project documentation.
```

### Use of AI Assistance

ChatGPT was used as a supporting tool during development and documentation. It assisted

<!-- PDF page 84 -->
with explaining technical concepts, troubleshooting errors, reviewing code and implementation approaches, and organizing report sections. The project source code, configuration, application behavior, and test results were reviewed by the developer. AI-generated suggestions were not treated as proof that a feature was implemented or tested successfully.

Official documentation for the libraries and tools was used as a technical reference. The final dependency versions should be taken from the project's actual configuration files.

### Appendix. Test Accounts and Video Demo

Video Demo: https://youtu.be/0MjZ50ZEYAs User Accounts:

Admin:

## Appendix — Test Accounts and Video Demo

- **Video demo:** [Watch the Quiz Game demonstration](https://youtu.be/0MjZ50ZEYAs)
- **Test accounts:** Account email addresses/user IDs and passwords are intentionally excluded from this GitHub Markdown file. Refer to the PDF report appendix for the demo credentials.
- **Security:** Do not commit real credentials, passwords, access tokens, or secrets to the GitHub repository.
