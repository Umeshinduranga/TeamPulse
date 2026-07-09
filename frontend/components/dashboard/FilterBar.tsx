'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { DashboardFilters } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';

interface Member {
  _id: string;
  fullName: string;
}
interface ProjectOption {
  _id: string;
  name: string;
}

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  useEffect(() => {
    apiClient.get<{ status: { userId: string; fullName: string }[] }>('/api/dashboard/submission-status')
      .then((res) => setMembers(res.data.status.map((s) => ({ _id: s.userId, fullName: s.fullName }))))
      .catch(() => setMembers([]));

    apiClient.get<{ projects: ProjectOption[] }>('/api/projects')
      .then((res) => setProjects(res.data.projects))
      .catch(() => setProjects([]));
  }, []);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">Team member</label>
        <Select
          value={filters.member ?? ''}
          onChange={(e) => onChange({ ...filters, member: e.target.value || undefined })}
        >
          <option value="">All members</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>{m.fullName}</option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">Project</label>
        <Select
          value={filters.project ?? ''}
          onChange={(e) => onChange({ ...filters, project: e.target.value || undefined })}
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">From</label>
        <Input
          type="date"
          value={filters.weekStart ?? ''}
          onChange={(e) => onChange({ ...filters, weekStart: e.target.value || undefined })}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 block mb-1">To</label>
        <Input
          type="date"
          value={filters.weekEnd ?? ''}
          onChange={(e) => onChange({ ...filters, weekEnd: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
