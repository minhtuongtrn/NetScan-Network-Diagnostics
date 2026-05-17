export default function Hero({ running, onRun }) {
  return (
    <section className="hero">
      <h1 className="hero-title">Network Diagnostics</h1>
      <p className="hero-subtitle">
        Comprehensive network analysis: connection type, IPv4/IPv6, DNS, speed,
        latency and IP blocking detection.
      </p>
      <button
        id="runDiagBtn"
        className="run-btn"
        disabled={running}
        onClick={onRun}
      >
        <span className="run-btn-icon">
          {running ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
            </svg>
          )}
        </span>
        <span>{running ? 'Running…' : 'Run Diagnostics'}</span>
      </button>
    </section>
  );
}
