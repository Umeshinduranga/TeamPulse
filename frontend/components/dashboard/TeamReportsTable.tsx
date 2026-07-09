'use client';

import { useState, Fragment } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Report } from '@/lib/types';

export function TeamReportsTable({ reports }: { reports: Report[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (reports.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-gray-500">
        No reports match the current filters.
      </Card>
    );
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b">
            <th className="pb-2 font-medium">Member</th>
            <th className="pb-2 font-medium">Project</th>
            <th className="pb-2 font-medium">Week</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const memberName = typeof r.userId === 'object' ? r.userId.fullName : 'Unknown';
            const projectName = typeof r.projectId === 'object' ? r.projectId.name : 'Unknown';
            const isExpanded = expandedId === r._id;

            return (
              <Fragment key={r._id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : r._id)}
                  className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                >
                  <td className="py-2">{memberName}</td>
                  <td className="py-2 text-gray-500">{projectName}</td>
                  <td className="py-2 text-gray-500">{new Date(r.weekStart).toLocaleDateString()}</td>
                  <td className="py-2">
                    <Badge variant={r.status === 'submitted' ? 'submitted' : 'draft'}>{r.status}</Badge>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${r._id}-detail`} className="bg-gray-50">
                    <td colSpan={4} className="p-4 text-sm space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Tasks completed</p>
                        <p className="text-gray-800">{r.tasksCompleted}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Tasks planned (next week)</p>
                        <p className="text-gray-800">{r.tasksPlanned}</p>
                      </div>
                      {r.blockers && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Blockers</p>
                          <p className="text-gray-800">{r.blockers}</p>
                        </div>
                      )}
                      <div className="flex gap-6 text-xs text-gray-500">
                        {r.hoursWorked !== undefined && <span>{r.hoursWorked} hours logged</span>}
                        {r.notes && <span>Notes: {r.notes}</span>}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
