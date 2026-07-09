import { dashboardRepository } from '../repositories/dashboardRepository';

function buildFilter(filters: { member?: string; project?: string; weekStart?: Date; weekEnd?: Date }) {
  const query: Record<string, unknown> = {};
  if (filters.member) query.userId = filters.member;
  if (filters.project) query.projectId = filters.project;
  if (filters.weekStart || filters.weekEnd) {
    query.weekStart = {
      ...(filters.weekStart && { $gte: filters.weekStart }),
      ...(filters.weekEnd && { $lte: filters.weekEnd }),
    };
  }
  return query;
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

export const dashboardService = {
  async getFilteredReports(filters: { member?: string; project?: string; weekStart?: Date; weekEnd?: Date }) {
    const query = buildFilter(filters);
    return dashboardRepository.findFilteredReports(query);
  },

  // Derived, not stored — computed fresh every time so it can never go stale
  async getSubmissionStatus() {
    const { weekStart, weekEnd } = getCurrentWeekRange();
    const members = await dashboardRepository.findAllMembers();
    const thisWeekReports = await dashboardRepository.findFilteredReports({
      weekStart: { $gte: weekStart, $lte: weekEnd },
    });

    const submittedUserIds = new Set(
      thisWeekReports.filter((r) => r.status === 'submitted').map((r) => r.userId._id?.toString() ?? r.userId.toString())
    );
    const draftUserIds = new Set(
      thisWeekReports.filter((r) => r.status === 'draft').map((r) => r.userId._id?.toString() ?? r.userId.toString())
    );

    const now = new Date();
    const isLate = now > weekEnd;

    return members.map((m: any) => {
      const id = m._id.toString();
      let status: 'submitted' | 'pending' | 'late' = 'pending';
      if (submittedUserIds.has(id)) status = 'submitted';
      else if (isLate) status = 'late';
      else if (draftUserIds.has(id)) status = 'pending';

      return { userId: id, fullName: m.fullName, status };
    });
  },

  async getSummaryMetrics() {
    const statusList = await this.getSubmissionStatus();
    const totalMembers = statusList.length;
    const submitted = statusList.filter((s: any) => s.status === 'submitted').length;
    const complianceRate = totalMembers === 0 ? 0 : Math.round((submitted / totalMembers) * 100);

    const { weekStart, weekEnd } = getCurrentWeekRange();
    const thisWeekReports = await dashboardRepository.findFilteredReports({
      weekStart: { $gte: weekStart, $lte: weekEnd },
    });
    const openBlockers = thisWeekReports.filter((r) => r.blockers && r.blockers.trim().length > 0).length;

    return {
      totalSubmitted: submitted,
      totalMembers,
      complianceRate,
      openBlockers,
    };
  },

  async getWorkloadByProject() {
    const reports = await dashboardRepository.findFilteredReports({});
    const projects = await dashboardRepository.findAllProjects();

    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.name] = 0;
    });

    reports.forEach((r) => {
      const projectName = (r.projectId as any)?.name ?? 'Unknown';
      counts[projectName] = (counts[projectName] ?? 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  },

  async getTasksCompletedTrend() {
    const reports = await dashboardRepository.findFilteredReports({ status: 'submitted' });

    const byWeek: Record<string, number> = {};
    reports.forEach((r) => {
      const key = r.weekStart.toISOString().slice(0, 10);
      byWeek[key] = (byWeek[key] ?? 0) + 1;
    });

    return Object.entries(byWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count]) => ({ week, count }));
  },
};
