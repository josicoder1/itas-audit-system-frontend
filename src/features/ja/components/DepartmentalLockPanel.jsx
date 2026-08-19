import { useState } from 'react';

const initialMembers = [
  { id: 1, name: 'member-1', jurisdiction: 'Tax Department East', locked: false },
  { id: 2, name: 'member-2', jurisdiction: 'Customs & Excise', locked: false },
];

export default function DepartmentalLockPanel() {
  const [members, setMembers] = useState(initialMembers);

  const allLocked = members.every((member) => member.locked);

  const toggleLock = (memberId) => {
    setMembers((current) => current.map((member) =>
      member.id === memberId ? { ...member, locked: !member.locked } : member,
    ));
  };

  return (
    <div className="max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Departmental signoff</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Lock Panel</h2>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${allLocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {allLocked ? 'Ready for consolidation' : 'Pending signoff'}
        </div>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-800">{member.jurisdiction}</p>
              <p className="text-sm text-slate-500">{member.name}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleLock(member.id)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${member.locked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {member.locked ? 'Locked' : 'Lock My Findings'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
