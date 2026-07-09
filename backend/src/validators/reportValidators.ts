import { z } from 'zod';

// Accepts both ISO datetime and plain YYYY-MM-DD date strings from HTML inputs
const dateString = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: 'Invalid date' }
);

// Matches Mongoose schema, rejects any extra fields
export const reportCreateSchema = z.object({
  weekStart: dateString,
  weekEnd: dateString,
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ID'),
  tasksCompleted: z.string().min(1, "Tasks completed is required"),
  tasksPlanned: z.string().min(1, "Tasks planned is required"),
  blockers: z.string().optional().default(''),
  hoursWorked: z.number().min(0).max(168).optional(),
  notes: z.string().optional().default(''),
  // 'status' and 'userId' are not accepted from client — forced server-side
}).strict();

export const reportUpdateSchema = reportCreateSchema.partial().strict();