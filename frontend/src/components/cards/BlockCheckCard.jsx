import CardShell from './CardShell';
import { BLOCK_TARGETS } from '../../diagnostics';

const BlockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

export default function BlockCheckCard({ data, loading, items }) {
  const d = data || {};
  const blockItems = items || [];

  return (
    <CardShell
      id="block"
      loading={loading}
      wide
      icon={BlockIcon}
      iconClass="icon-block"
      title="Reachability & IP Blocking Check"
      subtitle="Detect firewalls, blacklists, and internet connection blocking"
      badge={d.badge || '—'}
      badgeStatus={d.status}
      logs={d.logs}
    >
      <div className="block-list" id="block-list">
        {(blockItems.length ? blockItems : BLOCK_TARGETS).map((t) => (
          <div className={`block-item ${t.cls || ''}`} key={t.host}>
            <div className={`block-icon ${t.cls || 'loading'}`}>{t.icon}</div>
            <div className="block-info">
              <div className="block-host">{t.host}</div>
              <div className={`block-result ${t.cls || ''}`}>
                {t.resultLabel || 'Checking…'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
