import { z } from 'zod';

export const dashboardFilterSchema = z
  .object({
    member: z.string().length(24).optional(),
    project: z.string().length(24).optional(),
    weekStart: z.coerce.date().optional(),
    weekEnd: z.coerce.date().optional(),
  })
  .strict();
