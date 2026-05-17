export default function SectionLabel({ text }) {
  return (
    <div className="section-label">
      <span className="section-label-line"></span>
      <span className="section-label-text">{text}</span>
      <span className="section-label-line"></span>
    </div>
  );
}
