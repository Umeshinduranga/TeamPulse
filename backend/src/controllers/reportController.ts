import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { reportService } from '../services/reportService';

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.createReport(req.user!.id, req.body);
  res.status(201).json({ success: true, data: { report } });
});

export const getMyReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await reportService.getMyReports(req.user!.id);
  res.status(200).json({ success: true, data: { reports } });
});

export const updateReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.updateReport(req.user!.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: { report } });
});

export const submitReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.submitReport(req.user!.id, req.params.id);
  res.status(200).json({ success: true, data: { report } });
});