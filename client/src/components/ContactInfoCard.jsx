export default function ContactInfoCard({ icon: Icon, title, text, actionLabel, href, dir }) {
  return (
    <div className="contact-card">
      <span className="contact-card-icon" aria-hidden="true"><Icon /></span>
      <h3 className="contact-card-title">{title}</h3>
      {text && <p className="contact-card-text">{text}</p>}
      {actionLabel && href && (
        <a href={href} className="contact-card-action" dir={dir || 'auto'}>{actionLabel}</a>
      )}
    </div>
  );
}