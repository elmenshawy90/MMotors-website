import { useLanguage } from '../../context/LanguageContext';

const STATUS_MAP = {
  pending: 'statusPending',
  confirmed: 'statusConfirmed',
  completed: 'statusCompleted',
  cancelled: 'statusCancelled',
  new: 'buyStatusNew',
  contacted: 'buyStatusContacted'
};

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const label = t(`admin.${STATUS_MAP[status] || 'statusPending'}`);
  return (
    <span className={`admin-badge admin-badge--${status}`}>
      <span className="admin-dot" aria-hidden="true" />
      {label}
    </span>
  );
}