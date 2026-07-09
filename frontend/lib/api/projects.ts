import { apiClient } from '@/lib/apiClient';
import { Project } from '@/lib/types';

export const projectsApi = {
  getAll: () => apiClient.get<{ projects: Project[] }>('/api/projects'),
};
