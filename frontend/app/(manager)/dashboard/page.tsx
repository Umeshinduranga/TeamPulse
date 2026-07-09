'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ChartsPanel } from '@/components/dashboard/ChartsPanel';
import { TeamReportsTable } from '@/components/dashboard/TeamReportsTable';
import { dashboardApi } from '@/lib/api/dashboard';
import { DashboardFilters, Report, SummaryMetrics, SubmissionStatus, WorkloadItem, TrendItem } from '@/lib/types';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [status, setStatus] = useState<SubmissionStatus[]>([]);
  const [workload, setWorkload] = useState<WorkloadItem[]>([]);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async (currentFilters: DashboardFilters) => {
    setIsLoading(true);
    const [summaryRes, statusRes, workloadRes, trendRes, reportsRes] = await Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getSubmissionStatus(),
      dashboardApi.getWorkload(),
      dashboardApi.getTasksTrend(),
      dashboardApi.getReports(currentFilters),
    ]);
    setSummary(summaryRes.data.summary);
    setStatus(statusRes.data.status);
    setWorkload(workloadRes.data.workload);
    setTrend(trendRes.data.trend);
    setReports(reportsRes.data.reports);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    } else if (user && user.role === 'member') {
      router.push('/reports');
    } else if (user) {
      loadAll(filters);
    }
  }, [filters, loadAll, user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-xl font-semibold text-[#0F1115]">Team dashboard</h1>

        <FilterBar filters={filters} onChange={setFilters} />

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            {summary && <SummaryCards summary={summary} />}
            <ChartsPanel trend={trend} workload={workload} status={status} />
            <TeamReportsTable reports={reports} />
          </>
        )}
      </div>
    </div>
  );
}
