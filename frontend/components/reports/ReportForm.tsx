'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Project, ReportFormInput } from '@/lib/types';
import { projectsApi } from '@/lib/api/projects';

interface ReportFormProps {
  onSubmit: (data: ReportFormInput, submitImmediately: boolean) => Promise<void>;
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
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isSavingProject, setIsSavingProject] = useState(false);

  function loadProjects() {
    projectsApi
      .getAll()
      .then((res) => setProjects(res.data.projects ?? []))
      .catch(() => setError('Failed to load projects'));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function update<K extends keyof ReportFormInput>(key: K, value: ReportFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateProject() {
    if (!newProjectName.trim()) return;
    setIsSavingProject(true);
    setError(null);
    try {
      const res = await projectsApi.create({ name: newProjectName.trim() });
      await loadProjects();
      update('projectId', res.data.project._id);
      setNewProjectName('');
      setIsCreatingProject(false);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create project');
    } finally {
      setIsSavingProject(false);
    }
  }

  function validateForm() {
    if (!form.projectId || !form.weekStart || !form.weekEnd || !form.tasksCompleted || !form.tasksPlanned) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  }

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    try {
      await onSubmit(form, false);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save report');
    }
  }

  async function handleSaveAndSubmit() {
    setError(null);
    if (!validateForm()) return;
    try {
      await onSubmit(form, true);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit report');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSaveDraft} className="space-y-4">
        <h2 className="text-lg font-semibold">New Weekly Report</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Week Start</label>
            <Input type="date" value={form.weekStart} onChange={(e) => update('weekStart', e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Week End</label>
            <Input type="date" value={form.weekEnd} onChange={(e) => update('weekEnd', e.target.value)} required />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Project</label>
            <button
              type="button"
              onClick={() => setIsCreatingProject((v) => !v)}
              className="text-xs text-blue-600 hover:underline"
            >
              {isCreatingProject ? 'Cancel' : '+ New project'}
            </button>
          </div>

          {isCreatingProject ? (
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Client B Redesign"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button type="button" onClick={handleCreateProject} disabled={isSavingProject}>
                {isSavingProject ? 'Adding...' : 'Add'}
              </Button>
            </div>
          ) : (
            <Select value={form.projectId} onChange={(e) => update('projectId', e.target.value)} required>
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </Select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tasks Completed</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
            value={form.tasksCompleted}
            onChange={(e) => update('tasksCompleted', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tasks Planned (Next Week)</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
            value={form.tasksPlanned}
            onChange={(e) => update('tasksPlanned', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Blockers / Challenges</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[60px]"
            value={form.blockers}
            onChange={(e) => update('blockers', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Hours Worked (optional)</label>
            <Input
              type="number"
              min={0}
              max={168}
              value={form.hoursWorked ?? ''}
              onChange={(e) => update('hoursWorked', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Notes / Links (optional)</label>
            <Input value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="ghost" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button type="button" onClick={handleSaveAndSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save & Submit'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
