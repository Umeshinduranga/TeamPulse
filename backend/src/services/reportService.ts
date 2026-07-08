import { reportRepository } from '../repositories/reportRepository';
import { ApiError } from '../utils/ApiError';

export const reportService = {
  createReport: async (userId: string, data: any) => {
    // Force the securely extracted userId, default status to draft
    const reportData = { ...data, userId, status: 'draft' }; 
    return await reportRepository.create(reportData);
  },

  getMyReports: async (userId: string) => {
    return await reportRepository.findByUserId(userId);
  },

  updateReport: async (userId: string, reportId: string, data: any) => {
    const report = await reportRepository.findById(reportId);
    
    if (!report) throw new ApiError(404, 'Report not found');
    if (report.userId.toString() !== userId) throw new ApiError(403, 'Not authorized to edit this report');
    if (report.status !== 'draft') throw new ApiError(400, 'Cannot edit a submitted report');

    return await reportRepository.update(reportId, data);
  },

  submitReport: async (userId: string, reportId: string) => {
    const report = await reportRepository.findById(reportId);
    
    if (!report) throw new ApiError(404, 'Report not found');
    if (report.userId.toString() !== userId) throw new ApiError(403, 'Not authorized to submit this report');
    if (report.status === 'submitted') throw new ApiError(400, 'Report is already submitted');

    return await reportRepository.update(reportId, { status: 'submitted', submittedAt: new Date() });
  }
};