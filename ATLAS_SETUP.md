# Connect StudyDesk to MongoDB Atlas

Status: StudyDesk Free cluster created in Mumbai. Database user `studydesk_app` has `readWrite` on `studydesk`. Atlas connection and real app login/CRUD verified. The owner explicitly chose to publish the configured `server/.env` with live credentials for instructor review.

On this computer, the default DNS resolver failed SRV lookup. The configured connection uses Atlas’s standard multi-host URI with TLS enabled. Use Connect → Drivers → Legacy URI String to obtain this form if needed.

1. Sign in to your own account at https://cloud.mongodb.com/.
2. Select the project for StudyDesk. Use an existing suitable cluster or create a Free cluster if available in your account. Do not select a paid tier unintentionally.
3. Create a dedicated database user for this app. Atlas account login and database-user credentials are separate. Prefer the `readWrite` role scoped to the `studydesk` database.
4. Add your computer's current public IP to the project's IP access list. Avoid opening access to all IP addresses. If your public IP changes, update this entry.
5. Open your cluster's **Connect → Drivers** flow and select Node.js. Copy the provided `mongodb+srv://...` connection string.
6. In `server/.env`, replace only `MONGODB_URI`. Add the database name `studydesk` after the hostname, before `?`. Replace username/password placeholders and URL-encode reserved characters in credentials. Preserve the generated `JWT_SECRET` and `CLIENT_ORIGIN=http://localhost:3000`.

Example shape only (not working credentials):

```dotenv
MONGODB_URI=mongodb+srv://DB_USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/studydesk?retryWrites=true&w=majority
```

For ordinary projects, do not publish `.env`. This academic submission includes it by explicit owner instruction. Enter them directly in your local configuration file. The database user and IP access entry must be configured in Atlas before connection succeeds.

From the project root, run:

```powershell
npm run dev
```

Open http://localhost:3000, register a new app account, and add/edit/delete a task. Reload to confirm persistence. The first writes create the database/collections automatically. Check the records in Atlas; do not include passwords, tokens, or the connection string in submission screenshots.

If startup reports a database connection failure, check the connection string, database username/password, IP access list, cluster status, and network/DNS access. Keep Atlas configuration in the backend only; the React frontend must never receive them.

Official guide: https://www.mongodb.com/docs/atlas/connect-to-database-deployment/
