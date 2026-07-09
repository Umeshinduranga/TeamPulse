'use client';

import { Card } from '@/components/ui/Card';
import { WorkloadItem, TrendItem, SubmissionStatus } from '@/lib/types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface ChartsPanelProps {
  trend: TrendItem[];
  workload: WorkloadItem[];
  status: SubmissionStatus[];
}

const STATUS_COLORS: Record<string, string> = {
  submitted: '#2E7D5B',
  pending: '#F2B84B',
  late: '#D85A30',
};

export function ChartsPanel({ trend, workload, status }: ChartsPanelProps) {
  const statusCounts = ['submitted', 'pending', 'late'].map((key) => ({
    status: key,
    count: status.filter((s) => s.status === key).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <p className="text-sm font-medium text-[#0F1115] mb-3">Submitted reports over time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E3" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2E7D5B" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium text-[#0F1115] mb-3">Submission status by member</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusCounts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E3" />
            <XAxis dataKey="status" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2E7D5B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4 col-span-2">
        <p className="text-sm font-medium text-[#0F1115] mb-3">Workload by project</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={workload} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E3" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#5B6470" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
