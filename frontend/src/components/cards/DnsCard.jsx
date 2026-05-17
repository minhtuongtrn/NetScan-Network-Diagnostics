import CardShell from './CardShell';

const DnsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.657-4.03 3-9 3S3 13.657 3 12" />
    <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
  </svg>
);

export default function DnsCard({ data, loading }) {
  const d = data || {};
  const results = d.results || [];

  return (
    <CardShell
      id="dns"
      loading={loading}
      icon={DnsIcon}
      iconClass="icon-dns"
      title="DNS Server"
      subtitle="Domain name resolution (DoH detection)"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      <div className="dns-list" id="dns-list">
        {results.map((r, i) => (
          <div className={`dns-item ${r.cls}`} key={i}>
            <span className={`dns-dot ${r.cls}`}></span>
            <span className="dns-host">{r.host}</span>
            <span className="dns-ms">{r.ok ? r.ms + ' ms' : 'Timeout'}</span>
          </div>
        ))}
      </div>
      <div className="metric-row" style={{ marginTop: 10 }}>
        <span className="metric-label">Primary DNS (Detected)</span>
        <span className="metric-value mono">{d.primary || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">DNS Provider</span>
        <span className="metric-value mono">{d.provider || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">DNS-over-HTTPS</span>
        <span className="metric-value mono">{d.doh || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Resolution Time</span>
        <span className={`metric-value mono ${d.latencyCls || ''}`}>{d.latency || '—'}</span>
      </div>
    </CardShell>
  );
}
