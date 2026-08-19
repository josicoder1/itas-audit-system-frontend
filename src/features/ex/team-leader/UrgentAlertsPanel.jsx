import { useState, useEffect } from 'react';

const ALERT_STYLES = {
  OVERDUE:    { bg: 'bg-red-50 border-red-200',    text: 'text-red-700',    label: 'Overdue' },
  UNASSIGNED: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700',  label: 'Unassigned' },
  OVERLOADED: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'Overloaded' },
};

export default function UrgentAlertsPanel({ compact = false, onOpenCase }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/v1/ex/dashboard/alerts?teamLeaderId=team-leader-1', {
        headers: { 'X-Actor-Id': 'team-leader-1' },
      });
      if (res.ok) setAlerts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const displayed = compact ? alerts.slice(0, 4) : alerts;

  return (
    <div className="space-y-3">
      {!compact && <h2 className="text-lg font-bold text-slate-900">Urgent Alerts</h2>}
      {compact && <h3 className="text-base font-semibold text-slate-900">Alerts</h3>}

      {loading ? (
        <p className="text-slate-500 text-sm text-center py-4">Loading alerts…</p>
      ) : displayed.length === 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700">No urgent alerts — all clear.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((alert, i) => {
            const style = ALERT_STYLES[alert.alertType] ?? ALERT_STYLES.OVERDUE;
            return (
              <div key={i} className={`rounded-lg border p-3 flex items-center justify-between ${style.bg}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${style.text} bg-white border ${style.bg.replace('bg-', 'border-').split(' ')[0]}`}>
                    {style.label}
                  </span>
                  <p className={`text-sm font-medium truncate ${style.text}`}>{alert.message}</p>
                </div>
                {onOpenCase && alert.relatedId && !alert.alertType.includes('OVERLOADED') && (
                  <button
                    type="button"
                    onClick={() => onOpenCase(alert.relatedId)}
                    className={`shrink-0 ml-3 text-xs font-medium underline ${style.text}`}
                  >
                    View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {compact && alerts.length > 4 && (
        <p className="text-xs text-slate-500 text-right">+{alerts.length - 4} more alerts</p>
      )}
    </div>
  );
}
