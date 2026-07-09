# TeamPulse - Weekly Status Reports

TeamPulse is a full-stack web application designed to track and aggregate weekly status reports for engineering teams. It enforces a simple "one report per person, per week" rule, replacing messy Slack threads with structured, queryable data. 

Managers get a high-level dashboard with charts showing team compliance, work distribution across projects, and a chronological history of tasks completed and planned.

## Features

- **Role-Based Access Control (RBAC):** Users register as either a `member` or `manager`. Managers must provide a secret invite code to be granted elevated privileges.
- **Member Workflow:** 
  - Inline project creation and selection.
  - "Save as Draft" vs "Save & Submit" workflows.
  - Viewing past weekly reports.
- **Manager Dashboard:** 
  - Live charts built with Recharts (Compliance Rates, Submissions Over Time, Project Workload).
  - Expandable, detailed views of every team member's report.
  - Filtering by date range, project, and specific team members.
- **API Security:** Strict Zod schema validation on all incoming requests, JWT-based authentication, and proper password stripping on JSON responses.

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router, Turbopack)
- **Styling:** TailwindCSS
- **Data Fetching:** Fetch API with custom wrappers and Auth Context
- **Data Visualization:** Recharts

### Backend
- **Framework:** Express.js + Node.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT & bcrypt
- **Validation:** Zod schemas for strict payload validation

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teampulse
JWT_SECRET=your_super_secret_jwt_key
MANAGER_INVITE_CODE=teampulse-manager-2026
```

#### Seed the Database (Highly Recommended)
We provide a robust seed script that populates the database with realistic test data (1 manager, 3 team members, 4 projects, and 3 weeks of varied report history).
```bash
npm run db:seed
```
*Note: All seed accounts use the password `password123`.*

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```

## Testing the App

1. Visit `http://localhost:3000` in your browser.
2. If you ran the seed script, you can log in as a manager to view the dashboard:
   - **Email:** `manager@teampulse.dev`
   - **Password:** `password123`
3. Alternatively, you can log in as a member to submit a report:
   - **Email:** `nadun@teampulse.dev`
   - **Password:** `password123`
4. If you want to test the registration flow:
   - Click "Register".
   - Select "Manager" and use the invite code defined in your `.env` file (`teampulse-manager-2026`).

## Project Structure

- `backend/src/routes`, `controllers`, `services`, `repositories`: Implements a layered architecture for clean separation of concerns.
- `backend/src/scripts/seed.ts`: The database seeder.
- `frontend/app/(auth)`, `(manager)`, `(member)`: Next.js route groups mapped directly to user roles.
- `frontend/components/dashboard`: Contains the charts, summary widgets, and expandable tables.
- `frontend/components/reports`: Contains the highly dynamic weekly report form.

## License
MIT
