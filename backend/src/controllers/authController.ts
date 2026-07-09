import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authService } from '../services/authService';
import { authRepository } from '../repositories/authRepository';

// Helper to send cookie + JSON with user data
const sendTokenResponse = (result: { user: any; token: string }, statusCode: number, res: Response) => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };
  res.status(statusCode).cookie('jwt', result.token, options).json({
    success: true,
    data: { user: result.user, token: result.token },
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendTokenResponse(result, 201, res);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendTokenResponse(result, 200, res);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authRepository.findUserById(req.user!.id);
  res.status(200).json({ success: true, data: { user } });
});
