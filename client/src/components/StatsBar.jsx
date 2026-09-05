export default function StatsBar({ values, labels, variant = 'dark' }) {
  return (
    <div className={`stats-bar stats-bar-${variant}`}>
      {values.map((value, index) => (
        <div className="stat" key={index}>
          <span className="stat-value">{value}</span>
          <span className="stat-label">{labels[index] || ''}</span>
        </div>
      ))}
    </div>
  );
}