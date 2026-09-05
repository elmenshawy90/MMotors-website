import { useLanguage } from '../context/LanguageContext';

export default function ErrorMessage({ message, onRetry }) {
  const { t } = useLanguage();
  return (
    <div className="error-state">
      <p className="error-state-text">{message || t('common.error')}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}