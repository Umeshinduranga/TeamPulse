import { Card } from '@/components/ui/Card';
import { SummaryMetrics } from '@/lib/types';

export function SummaryCards({ summary }: { summary: SummaryMetrics }) {
  const cards = [
    { label: 'Submitted this week', value: `${summary.totalSubmitted} / ${summary.totalMembers}` },
    { label: 'Compliance rate', value: `${summary.complianceRate}%` },
    { label: 'Open blockers', value: summary.openBlockers },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="p-4">
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className="text-2xl font-semibold text-[#0F1115]">{c.value}</p>
        </Card>
      ))}
    </div>
  );
}
