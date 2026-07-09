import { Report } from '@/lib/types';
import { ReportCard } from './ReportCard';

interface ReportHistoryProps {
  reports: Report[];
  onSubmit: (id: string) => void;
}

function groupByWeek(reports: Report[]) {
  return [...reports].sort(
    (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );
}

export function ReportHistory({ reports, onSubmit }: ReportHistoryProps) {
  const sorted = groupByWeek(reports);

  if (sorted.length === 0) {
    return (
      <div className="border border-dashed border-[#E8E7E3] rounded-xl py-16 flex flex-col items-center justify-center text-center px-6">
        {/* Document outline illustration */}
        <svg
          className="h-12 w-12 text-[#E8E7E3] mb-4"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="10" y="6" width="28" height="36" rx="3" />
          <path d="M17 16h14M17 22h14M17 28h8" />
        </svg>
        <p className="text-[15px] font-semibold text-[#0F1115]">No reports yet</p>
        <p className="text-[13px] text-[#5B6470] mt-1">
          Submit your first weekly report above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section header with count */}
      <h2 className="text-[15px] font-semibold text-[#0F1115] tracking-tight">
        Report History{' '}
        <span className="text-[#5B6470] font-semibold">({sorted.length})</span>
      </h2>

      {sorted.map((report) => (
        <ReportCard key={report._id} report={report} onSubmit={onSubmit} />
      ))}
    </div>
  );
}
