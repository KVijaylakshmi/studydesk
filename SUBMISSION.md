# Term Work 2 — Micro Project Report Guide

## Cover page

- Project: **StudyDesk — Student Task Tracker using MERN**
- Student name: ____________________
- Roll number / division: ____________________
- Course / subject: ____________________
- College: ____________________
- Faculty: ____________________
- Academic year: 2026–27
- Assignment date: 13/10/2026
- Submission date given in brief: 17/10/2026
- GitHub URL: https://github.com/KVijaylakshmi/studydesk

## Aim

Design and implement a responsive full stack web application using MongoDB, Express.js, React.js, and Node.js with user authentication and basic CRUD operations.

## Problem statement

Students manage assignments across multiple subjects. StudyDesk provides one workspace to record tasks, set deadlines and priorities, and track progress.

## Technologies

React builds the interface, CSS adapts the layout to different screen sizes, Express and Node handle API requests, and MongoDB stores users and tasks through Mongoose. bcrypt hashes passwords, and JSON Web Tokens authenticate task requests.

## Modules

1. Home page: introduces the application and opens login, registration or a sample demo.
2. Authentication: registers a user and verifies login credentials.
3. Task display: shows each user's tasks with search, status filtering and summary counts.
4. CRUD: creates a task, reads tasks, updates fields and deletes tasks after confirmation.
5. Database: stores records across server restarts and isolates users' task lists.

## Data flow

`React interface → HTTP /api request → Express route → Mongoose → MongoDB → JSON response → React interface`

## Database design

**User:** name, email (unique), hashed password, timestamps.

**Task:** user reference, title, subject, description, dueDate, priority, status, timestamps. Each task belongs to one user. Task operations always filter by the logged-in user's ID.

## Demonstration / manual tests

Complete these with a connected MongoDB database and record actual results:

| Test | Expected result | Actual result |
| --- | --- | --- |
| Open home on desktop and phone | Readable, responsive layout | Pending |
| Register a new user | Account created; workspace opens | Passed (API verification) |
| Register same email again | Duplicate email message | Pending |
| Login with wrong password | Error message | Passed (API verification) |
| Login with correct password | User workspace opens | Passed (API verification) |
| Add a task | Task appears and MongoDB contains it | Passed (API verification) |
| Edit title/status | Updated values persist | Passed (API verification) |
| Search and filter | Matching tasks displayed | Pending |
| Cancel delete | Task remains | Pending |
| Confirm delete | Task removed from UI and database | Passed (API verification) |
| Reload and restart server | Saved tasks remain | Pending |
| Use another account | Other user's tasks are hidden | Pending |
| Request another user's task ID | Update/delete rejected with 404 | Pending |
| Logout | Account workspace closes | Pending |

## Screenshots for the color printed copy

Capture the real application after connecting MongoDB:

1. Home page.
2. Registration and login pages (no passwords visible).
3. Task list showing several records.
4. Add-task form and newly created task.
5. Edit-task form and updated status.
6. Delete confirmation and list after deletion.
7. MongoDB collections showing stored tasks and a user; hide sensitive fields.
8. GitHub repository after you authorize commit/upload.

Print the report **in color**, as required by the supplied assignment brief. Include aim, technologies, modules, database design, selected source code, test results, screenshots, conclusion and GitHub URL. Fill in your student details and actual results before printing. The supplied deadline is already past relative to the current project date; confirm any revised deadline with your faculty.

## Conclusion

StudyDesk demonstrates React-to-Express communication, authenticated CRUD operations, and MongoDB persistence. Complete the database tests above before presenting this as a verified end-to-end implementation.

## Current verification

- Automated validation and API access tests: 3 passed. Frontend production build: passed.
- Browser demo add, edit, and delete flows: passed. These do not verify MongoDB.
- Atlas-backed registration, correct login, wrong-password rejection, CRUD, and read after fresh login: passed. Successful browser login: passed.
- Cross-account ownership and persistence after server restart: still pending manual verification.
- GitHub repository: https://github.com/KVijaylakshmi/studydesk
- Color printed submission: to be prepared by the student using the outline above.
