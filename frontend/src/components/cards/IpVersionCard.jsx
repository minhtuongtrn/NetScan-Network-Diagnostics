import CardShell from './CardShell';

const GlobeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function IpVersionCard({ data, loading }) {
  const d = data || {};
  return (
    <CardShell
      id="ipver"
      loading={loading}
      icon={GlobeIcon}
      iconClass="icon-ipver"
      title="IPv4 & IPv6"
      subtitle="Public IP addresses - both versions"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      <div className="ipver-block">
        <div className="ipver-row">
          <span className="ipver-tag ipv4-tag">IPv4</span>
          <span className="ip-value mono">{d.ipv4 || 'Fetching…'}</span>
          <span className={`ipver-dot ${d.ipv4Ok ? 'ok' : d.ipv4Ok === false ? 'fail' : ''}`}></span>
        </div>
        <div className="ipver-row">
          <span className="ipver-tag ipv6-tag">IPv6</span>
          <span className="ip-value mono">{d.ipv6 || 'Fetching…'}</span>
          <span className={`ipver-dot ${d.ipv6Ok ? 'ok' : d.ipv6Ok === false ? 'warn' : ''}`}></span>
        </div>
      </div>
      <div className="metric-row" style={{ marginTop: 12 }}>
        <span className="metric-label">ISP / Provider</span>
        <span className="metric-value mono">{d.isp || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Country / Region</span>
        <span className="metric-value mono">{d.region || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Timezone</span>
        <span className="metric-value mono">{d.tz || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">IP Type</span>
        <span className={`metric-value mono ${d.proxy ? 'warn' : d.proxy === false ? 'ok' : ''}`}>
          {d.proxy === undefined ? '—' : d.proxy ? '⚠ Proxy/VPN/Hosting' : '✓ Regular'}
        </span>
      </div>
    </CardShell>
  );
}
