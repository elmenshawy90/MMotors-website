export default function SectionHeader({ kicker, title, subtitle, align = 'center' }) {
  return (
    <div className={`section-header section-header-${align}`}>
      {kicker && (
        <span className="section-kicker">{kicker}</span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}