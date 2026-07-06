import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: error.flatten() });
  }

  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate key error' });
  }

  return res.status(500).json({ success: false, message: 'Internal server error' });
};
