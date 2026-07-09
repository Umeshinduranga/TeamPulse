export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'member' | 'manager';
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Report {
  _id: string;
  userId: string | { _id: string; fullName: string; email: string };
  projectId: string | { _id: string; name: string };
  weekStart: string;
  weekEnd: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked?: number;
  notes: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
  createdAt: string;
}

export interface ReportFormInput {
  projectId: string;
  weekStart: string;
  weekEnd: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked?: number;
  notes: string;
}
