import CardShell from './CardShell';

const WifiIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1.5 8.5c5.523-5.523 14.477-5.523 20 0" />
    <path d="M5 12c3.866-3.866 10.134-3.866 14 0" />
    <path d="M8.5 15.5c2.21-2.21 5.79-2.21 8 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);

export default function ConnectionCard({ data, loading }) {
  const d = data || {};
  return (
    <CardShell
      id="wifi"
      loading={loading}
      icon={WifiIcon}
      iconClass="icon-wifi"
      title="Connection Type"
      subtitle="Wi-Fi / Ethernet / 4G / Cellular"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      <div className="conn-type-display" id="conn-type-pill">
        <span className="conn-type-icon">{d.typeIcon || '📡'}</span>
        <span className="conn-type-label">{d.typeLabel || 'Detecting…'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Status</span>
        <span className={`metric-value mono ${d.online ? 'ok' : d.online === false ? 'bad' : ''}`}>
          {d.online === undefined ? '—' : d.online ? '● Connected' : '○ Offline'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Network Type (Network API)</span>
        <span className="metric-value mono">{d.type || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Estimated Speed</span>
        <span className="metric-value mono">{d.speed || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Estimated RTT</span>
        <span className="metric-value mono">{d.rtt || '—'}</span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Data Saver</span>
        <span className={`metric-value mono ${d.saverWarn ? 'warn' : ''}`}>
          {d.saver || '—'}
        </span>
      </div>
    </CardShell>
  );
}
