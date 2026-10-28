# StudyDesk — Student Task Tracker

A simple MERN micro project for Term Work 2. Students can create an account, log in, and manage their own study tasks. The frontend uses React components and plain CSS; the backend uses Express routes and two Mongoose models.

## Requirements covered

| Assignment requirement | Implementation |
| --- | --- |
| Home page | Responsive overview with links to registration and demo |
| Registration/login | Passwords hashed with bcrypt; JWT authentication |
| Data display | Private task list, counts, search and status filters |
| CRUD | Add, view, edit and delete tasks with confirmation |
| MongoDB | Users and tasks stored using Mongoose |
| GitHub repository | Source repository: https://github.com/KVijaylakshmi/studydesk |

Assignment date: **13 October 2026**. Submission date in the supplied brief: **17 October 2026**. A **color printed copy is required** by the brief. See [SUBMISSION.md](SUBMISSION.md) for the report outline and printing checklist.

## Prerequisites

- Node.js 20.19+ or 22.12+ (Node 24 supported), npm, Git.
- MongoDB Community Server running locally, or a MongoDB Atlas database.

## Run locally

The website and Express backend run on your computer; the selected database provider is now **MongoDB Atlas (cloud)**. Follow [ATLAS_SETUP.md](ATLAS_SETUP.md) to finish account setup. No local MongoDB installation is needed when using Atlas.

Open PowerShell in this folder:

```powershell
npm install
Copy-Item server/.env.example server/.env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Edit `server/.env`: paste the generated value as `JWT_SECRET` and set `MONGODB_URI`. Do not leave the example secret. For Atlas, use your database user's connection string, allow your IP in Atlas Network Access, and URL-encode special characters in the database password. Use `studydesk` as the database name. Optional local alternative: `mongodb://127.0.0.1:27017/studydesk`, with your MongoDB service running. Never commit `.env` or share credentials in screenshots.

```powershell
npm run dev
```

- Website: http://localhost:3000
- Backend: http://localhost:5000/api/health
- Vite forwards `/api` calls to Express on port 5000.
- Create an account and add your first task. There are no preset account credentials.

The backend intentionally stops when configuration is missing or MongoDB cannot connect. The frontend can still open, and **Explore a demo** provides an explicitly labeled in-memory sample workspace. Demo tasks reset when you restart the demo or reload; demo mode does not test MongoDB or authentication.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start React and Express together |
| `npm test` | Run validation and API access tests |
| `npm run build` | Build frontend to `client/dist` |
| `npm start` | Run the API only; does not serve the React build |
| `npm run preview --workspace client` | Preview frontend build only; API proxy is for development, use `npm run dev` for full local testing |

This is a local submission project. Production hosting would require serving the frontend and routing `/api` to Express, HTTPS, and a production environment configuration.

## Simple folder structure

```text
client/
  src/main.jsx       React pages, task form and API calls
  src/styles.css     Responsive layout and print styles
  vite.config.js    Development API proxy
server/
  index.js          Load configuration and connect MongoDB
  app.js            Authentication and CRUD routes
  models.js         User and task schemas
  validation.js     Task field validation
  test/             Validation tests
  .env.example      Safe configuration example
SUBMISSION.md       Printable report guide and verification checklist
```

## How it works

1. React sends a registration request to Express.
2. Express hashes the password and saves the user in MongoDB.
3. Login returns a signed token, held in browser session storage for this learning project. It expires after one day. Logging out removes it.
4. React sends the token in the `Authorization: Bearer ...` header.
5. Express verifies the token and uses the authenticated user ID when reading or changing tasks. A user cannot edit another user's task by supplying its ID.
6. Mongoose reads/writes MongoDB, and React updates the displayed task list.

For a production app, consider HTTP-only cookie sessions, stronger account recovery and verification, and broader automated testing. This project keeps the code appropriate for an undergraduate submission.

## API reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API status |
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/tasks` | List the logged-in user's tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace editable task fields |
| DELETE | `/api/tasks/:id` | Delete the user's task |

Task body: `{ title, subject, description, dueDate, priority, status }`. Dates use `YYYY-MM-DD`. Priority: `Low`, `Medium`, `High`. Status: `To do`, `In progress`, `Completed`. All task endpoints require a token. Invalid input returns 400, invalid login/token 401, missing task 404, duplicate email 409. Authentication requests are rate limited.

## GitHub repository

Source code: https://github.com/KVijaylakshmi/studydesk

To download and run your own copy:

```powershell
git clone https://github.com/KVijaylakshmi/studydesk.git
cd studydesk
npm install
Copy-Item server/.env.example server/.env
```

Configure your own MongoDB connection and generated JWT secret using the setup steps above, then run `npm run dev`. Real credentials, dependencies, and build output are excluded from Git. Include the repository link in your printed report.

## Troubleshooting

- **API unavailable:** check that Express started and that port 5000 is free. If the API port changes, update `client/vite.config.js` too.
- **MongoDB connection failed:** check the local service or Atlas credentials, IP access list, and network.
- **Please log in again:** your token expired; log in again.
- **Email already registered:** use login or a different email.
- **Fonts unavailable offline:** the CSS includes local sans-serif fallbacks; functionality is unaffected.

## Verification status

Frontend production build and all three automated tests passed. MongoDB Atlas is connected to the StudyDesk Free cluster in Mumbai. Real registration, correct login, wrong-password rejection, and task create/update/read-after-fresh-login/delete passed API checks. Successful browser login at http://localhost:3000 was also verified. Temporary verification tasks were removed. Cross-account ownership isolation and server-restart persistence remain manual checks.

Register your own app account after connecting MongoDB. Database credentials and the local Atlas connection are stored only in ignored `server/.env`; no account password is included in this repository.

This computer could not resolve Atlas SRV records through its default DNS resolver. Its local configuration uses Atlas's standard multi-host URI with TLS enabled, `authSource=admin`, and the replica set supplied by Atlas. A fresh clone can use the SRV URI in `.env.example` if its DNS supports SRV lookups.

See `SUBMISSION.md` for checks performed and the database-dependent steps still needed. Do not claim demo mode verifies database storage.
