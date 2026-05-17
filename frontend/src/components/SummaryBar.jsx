import { nowStr } from '../diagnostics';

export default function SummaryBar({ passed, warnings, failures }) {
  return (
    <div className="summary-bar" id="summaryBar">
      <div className="summary-item">
        <span className="summary-label">Last Run</span>
        <span className="summary-value" id="sum-time">{nowStr()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Passed</span>
        <span className="summary-value green" id="sum-passed">{passed}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Warnings</span>
        <span className="summary-value yellow" id="sum-warnings">{warnings}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Errors</span>
        <span className="summary-value red" id="sum-failures">{failures}</span>
      </div>
    </div>
  );
}
