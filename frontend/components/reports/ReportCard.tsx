import { Report } from '@/lib/types';

interface ReportCardProps {
  report: Report;
  onSubmit?: (id: string) => void;
}

export function ReportCard({ report, onSubmit }: ReportCardProps) {
  const projectName =
    typeof report.projectId === 'object' ? report.projectId.name : 'Unknown Project';
  const isSubmitted = report.status === 'submitted';

  return (
    <div
      className={`
        bg-white border border-[#E8E7E3] rounded-xl
        hover:border-[#0F1115]/15 hover:shadow-md
        transition-all duration-200
        border-l-[3px] ${isSubmitted ? 'border-l-[#3FBF83]' : 'border-l-[#E8E7E3]'}
        p-4 sm:p-5
      `}
    >
      <div className="space-y-2.5">
        {/* Header row — date + badge */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F1115]">
            {/* Calendar icon */}
            <svg
              className="h-3.5 w-3.5 text-[#5B6470] shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="12" height="11" rx="2" />
              <path d="M5 1v3M11 1v3M2 7h12" />
            </svg>
            {new Date(report.weekStart).toLocaleDateString()} —{' '}
            {new Date(report.weekEnd).toLocaleDateString()}
          </span>

          {/* Status badge */}
          <span
            className={`
              inline-flex items-center gap-1.5
              text-[11px] uppercase tracking-wide font-semibold
              px-2.5 py-1 rounded-md select-none
              ${
                isSubmitted
                  ? 'bg-[#E8F5E9] text-[#2E7D5B]'
                  : 'bg-[#F5F5F4] text-[#5B6470]'
              }
            `}
          >
            {/* Dot indicator */}
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isSubmitted ? 'bg-[#2E7D5B]' : 'bg-[#5B6470]'
              }`}
            />
            {report.status}
          </span>
        </div>

        {/* Project name */}
        <p className="text-[12px] text-[#5B6470] font-medium">{projectName}</p>

        {/* Tasks preview */}
        <p className="text-[13px] text-[#0F1115]/70 line-clamp-2 leading-relaxed">
          {report.tasksCompleted}
        </p>

        {/* Submit action for drafts */}
        {report.status === 'draft' && onSubmit && (
          <button
            onClick={() => onSubmit(report._id)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E7D5B] hover:text-[#245F45] transition-colors duration-150"
          >
            Submit
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
