import { useState } from 'react';

const MOCK_CASES = [
  {
    id: 'ja-case-001',
    caseRef: 'JA-2026-001',
    taxpayerName: 'Addis Ababa Trading PLC',
    tin: 'ETH-TAX-00123456',
    segment: 'Large Taxpayer',
    riskScore: 87,
    riskPriority: 'HIGH',
    status: 'PENDING_VIABILITY',
    dueDate: '2026-09-15',
    jurisdictions: ['Tax Department East', 'Customs & Excise'],
    pendingVotes: 2,
  },
  {
    id: 'ja-case-002',
    caseRef: 'JA-2026-002',
    taxpayerName: 'Oromia Export & Import Co.',
    tin: 'ETH-TAX-00234567',
    segment: 'Medium Taxpayer',
    riskScore: 72,
    riskPriority: 'MEDIUM',
    status: 'TEAM_ASSIGNED',
    dueDate: '2026-10-01',
    jurisdictions: ['Tax Department West', 'Revenue Intelligence'],
    pendingVotes: 0,
  },
  {
    id: 'ja-case-003',
    caseRef: 'JA-2026-003',
    taxpayerName: 'Horn of Africa Logistics',
    tin: 'ETH-TAX-00345678',
    segment: 'Large Taxpayer',
    riskScore: 91,
    riskPriority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '2026-08-30',
    jurisdictions: ['Customs & Excise', 'Tax Department North'],
    pendingVotes: 1,
  },
];

const STATUS_LABELS = {
  PENDING_VIABILITY: { label: 'Pending Viability', color: 'bg-amber-100 text-amber-700' },
  TEAM_ASSIGNED: { label: 'Team Assigned', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  TRANSFERRED: { label: 'Transferred', color: 'bg-emerald-100 text-emerald-700' },
  CLOSED: { label: 'Closed', color: 'bg-slate-100 text-slate-600' },
};

const RISK_COLORS = {
  HIGH: 'text-red-600 font-semibold',
  MEDIUM: 'text-amber-600 font-semibold',
  LOW: 'text-emerald-600 font-semibold',
};

export default function JACaseList({ onOpenCase }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = MOCK_CASES.filter((c) => {
    const matchSearch =
      !search ||
      c.taxpayerName.toLowerCase().includes(search.toLowerCase()) ||
      c.tin.includes(search) ||
      c.caseRef.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, TIN, or case ref…"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Case Ref</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Taxpayer</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Risk</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Due Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Pending Votes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => {
              const status = STATUS_LABELS[c.status] ?? { label: c.status, color: 'bg-slate-100 text-slate-600' };
              return (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">{c.caseRef}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{c.taxpayerName}</p>
                    <p className="text-xs text-slate-500">{c.tin}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={RISK_COLORS[c.riskPriority]}>{c.riskScore}</span>
                    <span className="text-xs text-slate-400 ml-1">/ 100</span>
                    <p className={`text-xs ${RISK_COLORS[c.riskPriority]}`}>{c.riskPriority}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.dueDate}</td>
                  <td className="px-4 py-3">
                    {c.pendingVotes > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {c.pendingVotes} pending
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenCase(c.id)}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No cases match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
