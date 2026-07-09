import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async getReports(req: Request, res: Response) {
    const { member, project, weekStart, weekEnd } = req.query;
    const reports = await dashboardService.getFilteredReports({
      member: member as string | undefined,
      project: project as string | undefined,
      weekStart: weekStart ? new Date(weekStart as string) : undefined,
      weekEnd: weekEnd ? new Date(weekEnd as string) : undefined,
    });
    res.status(200).json({ success: true, data: { reports } });
  },

  async getSummary(_req: Request, res: Response) {
    const summary = await dashboardService.getSummaryMetrics();
    res.status(200).json({ success: true, data: { summary } });
  },

  async getSubmissionStatus(_req: Request, res: Response) {
    const status = await dashboardService.getSubmissionStatus();
    res.status(200).json({ success: true, data: { status } });
  },

  async getWorkloadByProject(_req: Request, res: Response) {
    const workload = await dashboardService.getWorkloadByProject();
    res.status(200).json({ success: true, data: { workload } });
  },

  async getTasksTrend(_req: Request, res: Response) {
    const trend = await dashboardService.getTasksCompletedTrend();
    res.status(200).json({ success: true, data: { trend } });
  },
};
