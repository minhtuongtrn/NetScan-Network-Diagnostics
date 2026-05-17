export default function Header({ status }) {
  let cls = 'header-badge';
  let label = 'Initializing…';

  if (status === 'running') {
    label = 'Diagnosing…';
  } else if (status === 'ok') {
    cls += ' status-ok';
    label = 'All systems normal';
  } else if (status === 'warn') {
    cls += ' status-warn';
    label = 'Warnings detected';
  } else if (status === 'bad') {
    cls += ' status-bad';
    label = 'Errors detected';
  }

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1.5 8.5c5.523-5.523 14.477-5.523 20 0" />
            <path d="M5 12c3.866-3.866 10.134-3.866 14 0" />
            <path d="M8.5 15.5c2.21-2.21 5.79-2.21 8 0" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>
        <span className="logo-text">NetScan</span>
      </div>
      <div className={cls} id="overallStatus">
        <span className="badge-dot"></span>
        <span className="badge-label">{label}</span>
      </div>
    </header>
  );
}
