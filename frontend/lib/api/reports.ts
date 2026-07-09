import { apiClient } from '@/lib/apiClient';
import { Report, ReportFormInput } from '@/lib/types';

export const reportsApi = {
  getMyReports: () => apiClient.get<{ reports: Report[] }>('/api/reports/me'),
  create: (data: ReportFormInput) => apiClient.post<{ report: Report }>('/api/reports', data),
  update: (id: string, data: Partial<ReportFormInput>) =>
    apiClient.put<{ report: Report }>(`/api/reports/${id}`, data),
  submit: (id: string) => apiClient.patch<{ report: Report }>(`/api/reports/${id}/submit`, {}),
};
