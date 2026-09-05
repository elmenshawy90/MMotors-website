import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function TopBar() {
  const { language, changeLanguage } = useLanguage();
  const { text } = useContent();

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-contact">
          <a className="topbar-item" href={`tel:${text('contact_phone')}`}>
            <FiPhone aria-hidden="true" />
            <span dir="ltr">{text('contact_phone')}</span>
          </a>
          <a className="topbar-item topbar-email" href={`mailto:${text('contact_email')}`}>
            <FiMail aria-hidden="true" />
            <span dir="ltr">{text('contact_email')}</span>
          </a>
          <span className="topbar-item topbar-hours">
            <FiClock aria-hidden="true" />
            <span>{text('contact_hours')}</span>
          </span>
        </div>

        <div className="lang-switcher lang-switcher-dark" role="group" aria-label="Language">
          <button
            type="button"
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
            onClick={() => changeLanguage('ar')}
          >
            عربي
          </button>
        </div>
      </div>
    </div>
  );
}