export default function ServiceCard({ icon: Icon, title, text, selected = false, onClick }) {
  return (
    <button
      type="button"
      className={`service-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="service-card-icon" aria-hidden="true"><Icon /></span>
      <span className="service-card-title">{title}</span>
      {text && <span className="service-card-text">{text}</span>}
    </button>
  );
}