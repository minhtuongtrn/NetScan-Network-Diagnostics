import { useRef, useEffect } from 'react';
import CardShell from './CardShell';

const PingIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

function drawPingChart(canvas, pingHistory) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = (canvas.offsetWidth || 400) * dpr;
  canvas.height = 72 * dpr;
  ctx.scale(dpr, dpr);
  const w = canvas.offsetWidth || 400;
  const h = 72;
  ctx.clearRect(0, 0, w, h);
  const data = (pingHistory || []).filter((v) => v !== null);
  if (data.length < 2) return;
  const maxV = Math.max(...data, 1);
  const step = w / (data.length - 1);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(59,139,235,0.35)');
  grad.addColorStop(1, 'rgba(59,139,235,0)');
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - (v / maxV) * (h - 8) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo((data.length - 1) * step, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - (v / maxV) * (h - 8) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#3b8beb';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - (v / maxV) * (h - 8) - 4;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = v < 100 ? '#22c55e' : v < 300 ? '#f59e0b' : '#ef4444';
    ctx.fill();
  });
}

export default function PingCard({ data, loading, targets }) {
  const canvasRef = useRef(null);
  const d = data || {};
  const tgts = targets || [];

  useEffect(() => {
    drawPingChart(canvasRef.current, d.pingHistory);
  }, [d.pingHistory]);

  return (
    <CardShell
      id="ping"
      loading={loading}
      icon={PingIcon}
      iconClass="icon-ping"
      title="Ping Test"
      subtitle="Latency to external servers"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      <div className="ping-targets" id="ping-targets">
        {tgts.map((t) => (
          <div className={`ping-target-card ${t.cls || ''}`} key={t.host}>
            <div className="ping-host">{t.host}</div>
            <div className={`ping-ms ${t.cls || ''}`} style={t.loading ? { animation: 'pulse 1s infinite' } : {}}>
              {t.label || '…'}
            </div>
            <div className={`ping-status-dot ${t.cls || ''}`}></div>
          </div>
        ))}
      </div>
      <div className="ping-chart-wrap">
        <canvas ref={canvasRef} width="600" height="72"></canvas>
      </div>
      <div className="metric-row" style={{ marginTop: '0.75rem' }}>
        <span className="metric-label">Average</span>
        <span className={`metric-value mono ${d.avg != null ? (d.avg < 100 ? 'ok' : d.avg < 300 ? 'warn' : 'bad') : 'bad'}`}>
          {d.avg != null ? d.avg + ' ms' : '—'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Min / Max</span>
        <span className="metric-value mono">
          {d.min != null ? `${d.min} ms / ${d.max} ms` : '—'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-label">Packet Loss</span>
        <span className={`metric-value mono ${d.lossP != null ? (d.lossP === 0 ? 'ok' : d.lossP < 50 ? 'warn' : 'bad') : ''}`}>
          {d.lossP != null ? `${d.lossP}% (${d.lost}/${d.total})` : '—'}
        </span>
      </div>
    </CardShell>
  );
}
