import { z } from 'zod';

// Matches Mongoose schema strictly, rejects any extra fields
export const reportCreateSchema = z.object({
  weekStart: z.string().datetime({ message: "Invalid week start date" }),
  weekEnd: z.string().datetime({ message: "Invalid week end date" }),
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ID'), // Mongoose ObjectId regex
  tasksCompleted: z.string().min(1, "Tasks completed is required"),
  tasksPlanned: z.string().min(1, "Tasks planned is required"),
  blockers: z.string().min(1, "Blockers field is required (write 'None' if none)"),
  hours: z.number().min(0).optional(),
  notes: z.string().optional(),
  // Notice: 'status' and 'userId' are missing here. 
  // We don't let the user send them; the backend forces them securely!
}).strict();

export const reportUpdateSchema = reportCreateSchema.partial().strict();