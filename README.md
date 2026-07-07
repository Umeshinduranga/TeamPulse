
# sisenco - Weekly Report Generator & Team Dashboard

This project is a production-grade, multi-tenant full-stack web workspace designed for team synchronization. It streamlines corporate productivity by enabling team members to seamlessly submit structured, unalterable weekly performance reports while granting managers aggregated visual analytics, performance trends, compliance tracking, and role-guarded auditing tools through a data-driven dashboard.

---

##  Key Features

### 1. Secure Authentication & Role-Based Access Control (RBAC)
* **Cryptographic Security:** Secure signup and login mechanisms leveraging `bcrypt` for salted password hashing and stateless JSON Web Tokens (`JWT`) for session verification.
* **Server-Side RBAC Guards:** Strict API middleware insulation enforcing permission boundaries between `Team Member` and `Manager` roles.

### 2. Standardized Weekly Progress Reports
* **Immutable Integrity:** Fixed, unalterable schema ensuring team-wide reporting consistency (Date Range, Project Tag, Completed Tasks, Upcoming Plans, Blockers, and Hours).
* **Traceable History:** Chronologically organized record logs of individual submissions grouped dynamically by operational weeks.

### 3. Managerial Dashboard & Insights
* **Operational Analytics:** At-a-glance computation of team compliance status, pending report tallies, and active team roadblocks.
* **Visual Trend Vectors:** Complex data transformations rendered through reactive charting layouts mapping workload distribution and completion patterns over time.
* **Granular Filtering Matrix:** Search indexes sliceable dynamically by project category, team member, and custom calendar ranges.

---

##  System Architecture & Clean Code Standards

The platform backend is engineered following **Clean Layered Architecture** principles to isolate concerns, maximize testability, and decoupling data persistence from runtime execution routines.

<img width="490"  alt="sisenco weekly reports" src="https://github.com/user-attachments/assets/dbd4b9cb-d001-4120-858d-345640bf4268" />


### Architectural Subsystems

* **Routes:** Formal API gatekeepers passing clean requests onward.
* **Middlewares:** Handle request authentication, role checks, field validation, and catch unhandled runtime errors via a centralized asynchronous handler.
* **Controllers:** Parse incoming express requests and match them to exact payload signatures.
* **Services:** Pure domain logic layer completely separated from Express or Mongoose contexts. Handles calculations (e.g., submission compliance).
* **Repositories:** Encapsulates Mongoose database direct queries, abstracting the storage engine away from the app logic.

---

##  Technology Stack

* **Frontend Monorepo Core:** Next.js, React, TypeScript, Tailwind CSS, Recharts
* **Backend Core Engine:** Node.js, Express, TypeScript, Object Modeling via Mongoose
* **Database Infrastructure:** MongoDB Atlas (Cloud Tier)
* **Security & Validation:** JSON Web Tokens (JWT), Bcrypt, Schema Validation

---

##  Installation & Local Environment Setup

Follow these precise steps to get the environment fully operational locally.

### Prerequisites

* Node.js (v18+ or v20+ recommended)
* NPM or Yarn
* A running MongoDB Atlas Cluster Instance

### Step 1: Clone and Extract the Repository

```bash
git clone https://github.com/Umeshinduranga/sisenco-weekly-reports.git
cd sisenco-weekly-reports

```

### Step 2: Configure Environment Variables

Create a `.env` file inside the root of the **`backend`** directory based on the provided `.env.example` file:

```bash
cd backend
touch .env

```

Populate the `backend/.env` with your secure environment keys:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/teampulse?retryWrites=true&w=majority
JWT_SECRET=your_generated_secure_64_character_hex_string
NODE_ENV=development

```

### Step 3: Install & Start the Backend Server

```bash
# From the backend directory
npm install

# Run the TypeScript codebase in development watch-mode via nodemon
npm run dev

```

The backend API server will successfully establish a handshake with MongoDB Atlas and initialize on `http://localhost:5000`.

### Step 4: Install & Start the Frontend Workspace

Open a new secondary terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install

# Run the frontend development instance
npm run dev

```

The client dashboard UI application will compile and become interactive at `http://localhost:3000`.

---

##  Database Seed Automation

To deliver a premium reviewer experience with robust visual metrics instantly populated upon initial startup, a database bootstrapping script is included.

To seed the database with structured target data (1 Manager account, 3 active Team Member profiles, and 3 consecutive weeks of historical report updates):

```bash
cd backend
npm run db:seed

```

*Credentials for testing these generated mock profiles will be output directly to your console terminal window upon successful script execution.*

---

##  Deliverables Index

* **GitHub Repository:** [Private/Public Repo Link]
* **ER Diagram Design:** [Interactive ERD / dbdiagram Link]
* **Video Demo Walkthrough:** [Google Drive Shared Walkthrough Link]
* **Technical Slide Presentation:** [Google Slides Delivery Link]

---

##  License

Distributed under the permissive **MIT License**. Copyright (c) 2026 Umesh Induranga. See the `LICENSE` file for more details.
