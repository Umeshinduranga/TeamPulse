# TeamPulse - Weekly Status Reports

TeamPulse is a full-stack web application designed to track and aggregate weekly status reports for engineering teams. It enforces a simple "one report per person, per week" rule, replacing messy Slack threads with structured, queryable data.

Managers get a high-level dashboard with charts showing team compliance, work distribution across projects, and a chronological history of tasks completed and planned.

**ER Diagram:** https://drive.google.com/file/d/17MXEq7x12XGyMGp8x0cIm8YzlQncR7dz/view?usp=sharing

---

## Features

**Role-Based Access Control (RBAC)**
Users register as either a `member` or `manager`. Managers must provide a secret invite code to be granted elevated privileges - if the code is missing or incorrect, the account is created as a standard member regardless of what was requested. This keeps the privilege boundary enforced on the server, not just in the UI.

**Member Workflow**
- Fixed, non-customizable 7-field report structure (identical for every user, so reports stay comparable across the team)
- Inline project creation and selection
- "Save as Draft" vs "Save & Submit" workflows
- Viewing past weekly reports, grouped by week

**Manager Dashboard**
- Live charts built with Recharts (submission trend over time, submission status breakdown, project workload distribution)
- Summary metrics: total submitted, compliance rate, open blockers
- Expandable, detailed view of every team member's report content
- Filtering by date range, project, and specific team member

**API Security**
- Strict Zod schema validation on all incoming requests (unknown fields are rejected, not silently dropped)
- JWT-based authentication with httpOnly cookies
- Role-guard middleware (`requireAuth` + `requireRole`) enforced server-side on every protected route
- Password hashes are stripped from all JSON responses via a Mongoose `toJSON` transform

---

## Tech Stack

**Frontend**
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Data Fetching: Fetch API with a custom typed wrapper (`apiClient`) and React Context for auth state
- Data Visualization: Recharts

**Backend**
- Framework: Express.js + Node.js
- Language: TypeScript
- Database: MongoDB (via Mongoose)
- Authentication: JWT & bcrypt
- Validation: Zod schemas, strict mode

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- A running MongoDB instance — either:
  - **Local MongoDB**: install MongoDB Community Server and ensure it's running on the default port (`27017`), or
  - **MongoDB Atlas** (recommended if you don't want to install MongoDB locally): create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), then use your Atlas connection string in place of the local one below.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teampulse
JWT_SECRET=your_super_secret_jwt_key
MANAGER_INVITE_CODE=teampulse-manager-2026
FRONTEND_URL=http://localhost:3000
```

If you're using MongoDB Atlas instead of a local instance, replace `MONGO_URI` with your Atlas connection string, e.g.:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/teampulse
```

**Seed the database (highly recommended):**
This populates the database with realistic test data — 1 manager, 3 team members, 4 projects, and 3 weeks of varied report history — so the dashboard looks populated immediately rather than empty.

```bash
npm run db:seed
```
All seed accounts use the password `password123`.

**Start the backend server:**
```bash
npm run dev
```
The API will be running at `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Start the frontend dev server:**
```bash
npm run dev
```
The app will be running at `http://localhost:3000`.

---

## Testing the App

1. Visit `http://localhost:3000` in your browser.
2. **To view the manager dashboard** (requires the seed script to have been run):
   - Email: `manager@teampulse.dev`
   - Password: `password123`
3. **To submit a report as a team member:**
   - Email: `nadun@teampulse.dev`
   - Password: `password123`
   (or `farzan@teampulse.dev` / `pradeep@teampulse.dev`, same password)
4. **To test the registration flow yourself:**
   - Click "Register"
   - Fill in your details, select "Manager" as the role
   - Enter the invite code from your `.env` file (`teampulse-manager-2026` by default)
   - Submitting with an incorrect or missing code will create a standard member account instead

---

## Project Structure

```
backend/
  src/
    models/         # Mongoose schemas (User, Project, Report)
    routes/         # Express route definitions
    controllers/    # HTTP layer — parses requests, calls services, shapes responses
    services/       # Business logic — no direct DB access
    repositories/    # Database access only — no business logic
    middleware/      # Auth (requireAuth, requireRole), validation, error handling
    validators/      # Zod schemas per resource
    scripts/seed.ts  # Database seeder
    utils/           # JWT helpers, custom ApiError class

frontend/
  app/
    (auth)/          # Login, register — public routes
    (member)/reports/    # Personal report page — member-facing
    (manager)/dashboard/ # Team dashboard — manager-facing
  components/
    ui/              # Reusable primitives (Button, Input, Card, Select, Badge)
    reports/         # Report form, report card, report history
    dashboard/        # Summary cards, filter bar, charts, reports table
    layout/           # Navbar
  lib/
    api/              # Typed API wrapper functions per resource
    apiClient.ts       # Base fetch wrapper with typed {success, data} responses
    auth-context.tsx   # Global auth state (React Context)
    types.ts           # Shared TypeScript interfaces
```

**Architecture note:** the backend uses a layered pattern (Controller → Service → Repository) so that business logic stays testable and independent of both the HTTP layer and the database layer. The frontend's route groups — `(auth)`, `(member)`, `(manager)` — map directly to the app's access levels, even though the parentheses don't appear in the actual URLs.

---

## Role-Based Access Control — How It Works

Both the personal report page and the team dashboard read from the same `Report` collection in MongoDB. There is no separate schema per role. The split is enforced entirely by backend middleware:

- `requireAuth` verifies the JWT and attaches the decoded user to the request
- `requireRole('manager')` checks the authenticated user's role before allowing the request to proceed — a team member hitting a manager-only endpoint (e.g. `/api/dashboard/*` or `/api/reports/all`) receives a hard `403 Forbidden`, not just a hidden UI element

Submission status (`submitted` / `pending` / `late`) is computed on-demand in the service layer by comparing the full team member list against existing reports for the selected week — it is never stored directly, so it can't drift out of sync.

---

## License

MIT
