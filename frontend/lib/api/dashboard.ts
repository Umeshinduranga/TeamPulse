import { apiClient } from '@/lib/apiClient';
import { Report, SubmissionStatus, SummaryMetrics, WorkloadItem, TrendItem, DashboardFilters } from '@/lib/types';

function buildQuery(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.member) params.set('member', filters.member);
  if (filters.project) params.set('project', filters.project);
  if (filters.weekStart) params.set('weekStart', filters.weekStart);
  if (filters.weekEnd) params.set('weekEnd', filters.weekEnd);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const dashboardApi = {
  getReports: (filters: DashboardFilters = {}) =>
    apiClient.get<{ reports: Report[] }>(`/api/dashboard/reports${buildQuery(filters)}`),

  getSummary: () => apiClient.get<{ summary: SummaryMetrics }>('/api/dashboard/summary'),

  getSubmissionStatus: () =>
    apiClient.get<{ status: SubmissionStatus[] }>('/api/dashboard/submission-status'),

  getWorkload: () => apiClient.get<{ workload: WorkloadItem[] }>('/api/dashboard/workload'),

  getTasksTrend: () => apiClient.get<{ trend: TrendItem[] }>('/api/dashboard/tasks-trend'),
};
