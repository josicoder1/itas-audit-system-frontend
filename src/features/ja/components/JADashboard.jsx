import { useState } from 'react';
import JACaseList from './JACaseList';

const METRICS = [
  { label: 'Total Cases', value: 3, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Viability', value: 1, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Your Pending Votes', value: 2, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Teams Assigned', value: 1, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function JADashboard({ onOpenCase }) {
  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className={`rounded-xl border border-slate-200 ${m.bg} p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.label}</p>
            <p className={`mt-1 text-3xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Case list */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-700">Committee Cases</h2>
        <JACaseList onOpenCase={onOpenCase} />
      </div>
    </div>
  );
}
