import CommitteeBuilder from './CommitteeBuilder';
import SharedEvidenceVault from './SharedEvidenceVault';
import DisputeResolutionBoard from './DisputeResolutionBoard';
import DepartmentalLockPanel from './DepartmentalLockPanel';
import ConsolidatedFindingsForm from './ConsolidatedFindingsForm';

export default function JointAuditWorkspace() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Yoseph / JA</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Joint Audit Workspace</h1>
      </div>
      <CommitteeBuilder />
      <SharedEvidenceVault />
      <DisputeResolutionBoard />
      <DepartmentalLockPanel />
      <ConsolidatedFindingsForm />
    </div>
  );
}
