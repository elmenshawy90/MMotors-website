import { useLanguage } from '../../context/LanguageContext';

export default function AdminToggle({ checked, onChange, label, disabled, onLabel, offLabel }) {
  const { t } = useLanguage();
  const off = offLabel || t('admin.noAvailability');
  const on = onLabel || t('admin.availabilityLabel');

  return (
    <label className="admin-switch">
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="admin-switch-track" aria-hidden="true" />
      <span className="admin-switch-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
        {label}: {checked ? on : off}
      </span>
    </label>
  );
}