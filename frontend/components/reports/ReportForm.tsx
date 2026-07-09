'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Project, ReportFormInput } from '@/lib/types';
import { projectsApi } from '@/lib/api/projects';

interface ReportFormProps {
  onSubmit: (data: ReportFormInput) => Promise<void>;
  isSubmitting: boolean;
}

const emptyForm: ReportFormInput = {
  projectId: '',
  weekStart: '',
  weekEnd: '',
  tasksCompleted: '',
  tasksPlanned: '',
  blockers: '',
  hoursWorked: undefined,
  notes: '',
};

export function ReportForm({ onSubmit, isSubmitting }: ReportFormProps) {
  const [form, setForm] = useState<ReportFormInput>(emptyForm);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((res) => setProjects(res.data.projects ?? []))
      .catch(() => setError('Failed to load projects'));
  }, []);

  function update<K extends keyof ReportFormInput>(key: K, value: ReportFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.projectId || !form.weekStart || !form.weekEnd || !form.tasksCompleted || !form.tasksPlanned) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await onSubmit(form);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save report');
    }
  }

  const inputClasses =
    'w-full bg-[#FAFAF9] border border-[#E8E7E3] rounded-lg px-3.5 py-2.5 text-sm text-[#0F1115] placeholder:text-[#5B6470]/50 transition-all duration-200 ease-in-out focus:bg-white focus:border-[#0F1115]/20 focus:ring-2 focus:ring-[#0F1115]/5 focus:outline-none';

  const labelClasses =
    'block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5B6470] mb-1.5';

  return (
    <Card className="bg-white border border-[#E8E7E3] shadow-sm rounded-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="pb-5 border-b border-[#E8E7E3]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0F1115]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-[18px] font-semibold text-[#0F1115] leading-tight">
                New Weekly Report
              </h2>
              <p className="text-[13px] text-[#5B6470] mt-0.5">
                Fill in your progress for this week
              </p>
            </div>
          </div>
        </div>

        {/* ── Date Range ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-[#5B6470]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5B6470]">
              Reporting Period
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Week Start</label>
              <Input
                type="date"
                value={form.weekStart}
                onChange={(e) => update('weekStart', e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Week End</label>
              <Input
                type="date"
                value={form.weekEnd}
                onChange={(e) => update('weekEnd', e.target.value)}
                required
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* ── Project ────────────────────────────────────────── */}
        <div>
          <label className={labelClasses}>Project</label>
          <Select
            value={form.projectId}
            onChange={(e) => update('projectId', e.target.value)}
            required
            className={inputClasses}
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        {/* ── Tasks Completed ────────────────────────────────── */}
        <div>
          <label className={labelClasses}>Tasks Completed</label>
          <textarea
            className={`${inputClasses} min-h-[96px] resize-y`}
            value={form.tasksCompleted}
            onChange={(e) => update('tasksCompleted', e.target.value)}
            required
            placeholder="What did you accomplish this week?"
          />
        </div>

        {/* ── Tasks Planned ──────────────────────────────────── */}
        <div>
          <label className={labelClasses}>Tasks Planned (Next Week)</label>
          <textarea
            className={`${inputClasses} min-h-[96px] resize-y`}
            value={form.tasksPlanned}
            onChange={(e) => update('tasksPlanned', e.target.value)}
            required
            placeholder="What do you plan to work on next week?"
          />
        </div>

        {/* ── Blockers ───────────────────────────────────────── */}
        <div>
          <label className={labelClasses}>Blockers / Challenges</label>
          <textarea
            className={`${inputClasses} min-h-[72px] resize-y`}
            value={form.blockers}
            onChange={(e) => update('blockers', e.target.value)}
            placeholder="Any impediments or risks to flag?"
          />
        </div>

        {/* ── Section Divider ────────────────────────────────── */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-dashed border-[#E8E7E3]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5B6470]/60">
              Optional
            </span>
          </div>
        </div>

        {/* ── Optional Fields ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Hours Worked</label>
            <Input
              type="number"
              min={0}
              max={168}
              value={form.hoursWorked ?? ''}
              onChange={(e) =>
                update('hoursWorked', e.target.value ? Number(e.target.value) : undefined)
              }
              className={inputClasses}
              placeholder="e.g. 40"
            />
          </div>
          <div>
            <label className={labelClasses}>Notes / Links</label>
            <Input
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className={inputClasses}
              placeholder="Any additional context…"
            />
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h18.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* ── Submit ─────────────────────────────────────────── */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0F1115] text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-[#1a1d24] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Saving…
              </span>
            ) : (
              'Save as Draft'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
