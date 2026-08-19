import CycleTimeAnalytics from './CycleTimeAnalytics';
import FinancialYieldReport from './FinancialYieldReport';

export default function ReportingFinancialsWorkspace() {
  return (
    <div className="space-y-6">
      <CycleTimeAnalytics />
      <FinancialYieldReport />
    </div>
  );
}
