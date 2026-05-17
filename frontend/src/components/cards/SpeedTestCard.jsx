import { useMemo } from 'react';
import CardShell from './CardShell';

const SpeedIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

function arcDash(val, maxMbps) {
  const circ = 2 * Math.PI * 42;
  const pct = val != null ? Math.min(100, (val / maxMbps) * 100) : 0;
  return `${(pct / 100) * circ} ${circ}`;
}

export default function SpeedTestCard({ data, loading }) {
  const d = data || {};
  const dlDash = useMemo(() => arcDash(d.dlMbps, 100), [d.dlMbps]);
  const ulDash = useMemo(() => arcDash(d.ulMbps, 50), [d.ulMbps]);

  return (
    <CardShell
      id="speed"
      loading={loading}
      icon={SpeedIcon}
      iconClass="icon-speed"
      title="Speed Test"
      subtitle="Download & Upload bandwidth"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      {/* SVG Gradient definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <linearGradient id="dlGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="ulGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b8beb" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>

      <div className="speed-gauges">
        <div className="speed-gauge-item">
          <div className="speed-gauge-ring">
            <svg viewBox="0 0 100 100">
              <circle className="gauge-bg" cx="50" cy="50" r="42" />
              <circle
                className="gauge-fill gauge-dl"
                cx="50" cy="50" r="42"
                strokeDasharray={dlDash}
              />
            </svg>
            <div className="gauge-center">
              <div className="gauge-val">{d.dlMbps ?? '—'}</div>
              <div className="gauge-unit">Mbps</div>
            </div>
          </div>
          <div className="gauge-label">
            <span className="gauge-arrow dl-arrow">↓</span> Download
          </div>
        </div>
        <div className="speed-gauge-item">
          <div className="speed-gauge-ring">
            <svg viewBox="0 0 100 100">
              <circle className="gauge-bg" cx="50" cy="50" r="42" />
              <circle
                className="gauge-fill gauge-ul"
                cx="50" cy="50" r="42"
                strokeDasharray={ulDash}
              />
            </svg>
            <div className="gauge-center">
              <div className="gauge-val">{d.ulMbps ?? '—'}</div>
              <div className="gauge-unit">Mbps</div>
            </div>
          </div>
          <div className="gauge-label">
            <span className="gauge-arrow ul-arrow">↑</span> Upload
          </div>
        </div>
      </div>
      <div className="metric-row" style={{ marginTop: 4 }}>
        <span className="metric-label">Latency (Ping)</span>
        <span className={`metric-value mono ${d.pingCls || ''}`}>
          {d.pingMs != null ? `${d.pingMs} ms` : '—'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Jitter</span>
        <span className={`metric-value mono ${d.jitterCls || ''}`}>
          {d.jitterMs != null ? `${d.jitterMs} ms` : '—'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Rating</span>
        <span className={`metric-value mono ${d.ratingCls || ''}`}>
          {d.rating || '—'}
        </span>
      </div>
    </CardShell>
  );
}
