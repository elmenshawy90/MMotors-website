import { useLanguage } from '../context/LanguageContext';

export default function LoadingSpinner() {
  const { t } = useLanguage();
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-text">{t('common.loading')}</p>
    </div>
  );
}