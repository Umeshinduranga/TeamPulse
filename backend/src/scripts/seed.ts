import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { Project } from '../models/Project';
import { Report } from '../models/Report';

const MONGO_URI = process.env.MONGO_URI as string;
const SALT_ROUNDS = 10;
const SEED_PASSWORD = 'password123';

const MEMBERS = [
  { fullName: 'Nadun Perera', email: 'nadun@teampulse.dev' },
  { fullName: 'Farzan Ismail', email: 'farzan@teampulse.dev' },
  { fullName: 'Pradeep Wickrama', email: 'pradeep@teampulse.dev' },
];

const MANAGER = { fullName: 'Hiruni Manager', email: 'manager@teampulse.dev' };

const PROJECTS = ['Client A', 'Internal Tooling', 'R&D', 'Marketing'];

const TASK_SAMPLES = [
  { completed: 'Implemented JWT auth middleware and role-based route guards.', planned: 'Build out report CRUD endpoints with Zod validation.' },
  { completed: 'Built the manager dashboard charts using Recharts.', planned: 'Add filter bar for member/project/date range.' },
  { completed: 'Fixed Turbopack cache corruption issue on Windows dev environment.', planned: 'Write the seed script and finalize README.' },
  { completed: 'Designed and reviewed the ER diagram for the reporting schema.', planned: 'Start on the AI chat assistant bonus feature.' },
  { completed: 'Integrated strict Zod schemas across all report and project routes.', planned: 'Polish responsive layout for mobile screens.' },
];

const BLOCKER_SAMPLES = [
  '',
  '',
  'Waiting on design assets from the client before finishing the UI pass.',
  'Blocked on a third-party API rate limit for testing.',
  '',
];

function getWeekRange(weeksAgo: number) {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

async function seed() {
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined');

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB. Wiping existing data...');

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Report.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

  console.log('Creating manager...');
  const manager = await User.create({
    fullName: MANAGER.fullName,
    email: MANAGER.email,
    passwordHash,
    role: 'manager',
  });

  console.log('Creating team members...');
  const members = await Promise.all(
    MEMBERS.map((m) =>
      User.create({
        fullName: m.fullName,
        email: m.email,
        passwordHash,
        role: 'member',
      })
    )
  );

  console.log('Creating projects...');
  const projects = await Promise.all(
    PROJECTS.map((name) =>
      Project.create({ name, description: `${name} workstream`, createdBy: manager._id })
    )
  );

  console.log('Generating 3 weeks of reports per member...');
  const reports = [];

  for (const member of members) {
    for (let weeksAgo = 3; weeksAgo >= 1; weeksAgo--) {
      const { weekStart, weekEnd } = getWeekRange(weeksAgo);
      const project = projects[Math.floor(Math.random() * projects.length)];
      const sample = TASK_SAMPLES[Math.floor(Math.random() * TASK_SAMPLES.length)];
      const blocker = BLOCKER_SAMPLES[Math.floor(Math.random() * BLOCKER_SAMPLES.length)];

      reports.push({
        userId: member._id,
        projectId: project._id,
        weekStart,
        weekEnd,
        tasksCompleted: sample.completed,
        tasksPlanned: sample.planned,
        blockers: blocker,
        hoursWorked: 30 + Math.floor(Math.random() * 15),
        notes: '',
        status: 'submitted',
        submittedAt: weekEnd,
      });
    }
  }

  // Current week: deliberately mixed states so the dashboard shows real variety
  // (this is what makes the compliance rate and status chart meaningful, not all-green)
  const { weekStart: curStart, weekEnd: curEnd } = getWeekRange(0);

  // Member 0: submitted on time
  reports.push({
    userId: members[0]._id,
    projectId: projects[0]._id,
    weekStart: curStart,
    weekEnd: curEnd,
    tasksCompleted: 'Wrapped up the auth flow and started on the dashboard filters.',
    tasksPlanned: 'Finish charts and polish the UI before deadline.',
    blockers: '',
    hoursWorked: 38,
    notes: '',
    status: 'submitted',
    submittedAt: new Date(),
  });

  // Member 1: draft only (shows as pending)
  reports.push({
    userId: members[1]._id,
    projectId: projects[1]._id,
    weekStart: curStart,
    weekEnd: curEnd,
    tasksCompleted: 'Still finalizing this week\'s update.',
    tasksPlanned: 'Will complete tomorrow.',
    blockers: 'Waiting on manager feedback from last sprint review.',
    hoursWorked: 20,
    notes: '',
    status: 'draft',
  });

  // Member 2: no report at all this week (shows as pending/late depending on day)
  // — intentionally omitted to demonstrate the "pending" state

  await Report.insertMany(reports);

  console.log('\nSeed complete!\n');
  console.log('=== Test Credentials (password for all: ' + SEED_PASSWORD + ') ===');
  console.log(`Manager:  ${MANAGER.email}`);
  MEMBERS.forEach((m) => console.log(`Member:   ${m.email}`));
  console.log('\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
