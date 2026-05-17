import CardShell from './CardShell';

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function VerdictCard({ data, loading }) {
  const d = data || {};
  const checks = d.checks || [];

  return (
    <CardShell
      id="verdict"
      loading={loading}
      wide
      icon={ShieldIcon}
      iconClass="icon-verdict"
      title="Result: Is Your IP Blocked?"
      subtitle="Comprehensive analysis — proxy, VPN, Tor, blacklist and firewall"
      badge={d.verdictBadge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      {/* Verdict banner */}
      <div className={`verdict-banner ${d.finalCls || ''}`}>
        <div className="verdict-icon">{d.finalIcon || '🔍'}</div>
        <div className="verdict-text">
          <div className="verdict-title">{d.finalTitle || 'Analyzing…'}</div>
          <div className="verdict-desc">{d.finalDesc || 'Waiting for results'}</div>
        </div>
      </div>

      {/* Checks grid */}
      <div className="verdict-checks" id="verdict-checks">
        {checks.map((c, i) => (
          <div className="vcheck-item" key={i}>
            <span className="vcheck-icon">{c.icon}</span>
            <span className="vcheck-label">{c.label}</span>
            <span className={`vcheck-val ${c.cls}`}>{c.val}</span>
          </div>
        ))}
      </div>

      {/* Risk score */}
      {d.riskScore != null && (
        <div className="risk-score-wrap" style={{ display: 'flex' }}>
          <div className="risk-label">Risk Score</div>
          <div className="risk-bar-bg">
            <div
              className="risk-bar-fill"
              style={{
                width: d.riskScore + '%',
                background: d.riskScore < 30 ? '#22c55e' : d.riskScore < 60 ? '#f59e0b' : '#ef4444',
              }}
            ></div>
          </div>
          <div className="risk-value">{d.riskScore} / 100</div>
        </div>
      )}
    </CardShell>
  );
}
