'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { ReportForm } from '@/components/reports/ReportForm';
import { ReportHistory } from '@/components/reports/ReportHistory';
import { reportsApi } from '@/lib/api/reports';
import { Report, ReportFormInput } from '@/lib/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ReportsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function loadReports() {
    const res = await reportsApi.getMyReports();
    setReports(res.data.reports ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    } else if (user && user.role === 'manager') {
      router.push('/dashboard');
    } else if (user) {
      loadReports();
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="bg-[#FAFAF9] min-h-screen flex items-center justify-center">
        <p className="text-[#5B6470]">Loading...</p>
      </div>
    );
  }

  async function handleCreate(data: ReportFormInput, submitImmediately: boolean) {
    setIsSubmitting(true);
    try {
      const res = await reportsApi.create(data);
      if (submitImmediately) {
        await reportsApi.submit(res.data.report._id);
      }
      await loadReports();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitReport(id: string) {
    await reportsApi.submit(id);
    await loadReports();
  }

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <Navbar />

      {/* Page header / greeting */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-0">
        <h1 className="text-[22px] font-semibold text-[#0F1115] tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-[13px] text-[#5B6470] mt-1">
          Here&apos;s your weekly report workspace
        </p>
        <div className="border-b border-[#E8E7E3] mt-5" />
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <ReportForm onSubmit={handleCreate} isSubmitting={isSubmitting} />

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 rounded-xl bg-[#E8E7E3]/60 animate-pulse" />
            <div className="h-24 rounded-xl bg-[#E8E7E3]/60 animate-pulse" />
            <div className="h-24 rounded-xl bg-[#E8E7E3]/60 animate-pulse" />
          </div>
        ) : (
          <ReportHistory reports={reports} onSubmit={handleSubmitReport} />
        )}
      </div>
    </div>
  );
}
