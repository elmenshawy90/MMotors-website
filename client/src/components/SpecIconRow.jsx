export default function SpecIconRow({ items = [] }) {
  if (!items.some((item) => item.value && String(item.value) !== '—' && String(item.value) !== '0')) {
    return null;
  }
  return (
    <div className="spec-icons">
      {items.map((item, index) => {
        const Icon = item.icon;
        if (!item.value || String(item.value) === '—' || String(item.value) === '0') return null;
        return (
          <span className="spec-chip" key={index} title={item.label || ''}>
            {Icon && <Icon className="spec-chip-icon" aria-hidden="true" />}
            <span className="spec-chip-value" dir={item.dir || 'auto'}>
              {item.value}
            </span>
            {item.label && <span className="sr-only">: {item.label}</span>}
          </span>
        );
      })}
    </div>
  );
}