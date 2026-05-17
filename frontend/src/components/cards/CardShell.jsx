import { nowStr } from '../../diagnostics';

export default function CardShell({ id, loading, wide, icon, iconClass, title, subtitle, badge, badgeStatus, logs, children }) {
  return (
    <div className={`card${wide ? ' card-wide' : ''}${loading ? ' loading' : ''}`} id={`card-${id}`}>
      <div className="card-header">
        <div className={`card-icon ${iconClass}`}>
          {icon}
        </div>
        <div className="card-title-group">
          <h2 className="card-title">{title}</h2>
          <p className="card-subtitle">{subtitle}</p>
        </div>
        <div className={`card-status-badge ${badgeStatus || ''}`} id={`${id}-badge`}>
          {badge || '—'}
        </div>
      </div>
      <div className="card-body">
        {children}
      </div>
      <div className={`card-log${logs && logs.length ? ' has-logs' : ''}`} id={`${id}-log`}>
        {(logs || []).map((l, i) => (
          <div className="log-line" key={i}>
            <span className="log-time">{nowStr()}</span>
            <span className={`log-msg ${l.type}`}>{l.msg}</span>
          </div>
        ))}
      </div>
      <div className={`card-progress${loading ? ' running' : ''}`} id={`${id}-progress`}></div>
    </div>
  );
}
