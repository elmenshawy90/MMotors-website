import { Link } from 'react-router-dom';
import { FiMenu, FiEye } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminHeader({ onMenuClick }) {
  const { language, changeLanguage, t } = useLanguage();
  const { username } = useAdminAuth();

  return (
    <header className="admin-header">
      <button type="button" className="admin-header-menu-btn" onClick={onMenuClick} aria-label={t('admin.menu')}>
        <FiMenu />
      </button>

      <span className="admin-header-title">{t('admin.panelTitle')}</span>

      <div className="admin-header-spacer" />

      <Link to="/" className="admin-view-site">
        <FiEye aria-hidden="true" />
        <span>{t('admin.viewSite')}</span>
      </Link>

      <div className="admin-lang-switch" role="group" aria-label="Language">
        <button
          type="button"
          className={`admin-lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <button
          type="button"
          className={`admin-lang-btn ${language === 'ar' ? 'active' : ''}`}
          onClick={() => changeLanguage('ar')}
        >
          ع
        </button>
      </div>

      <div className="admin-header-user">
        <span className="admin-user-avatar">{(username || 'A').slice(0, 1).toUpperCase()}</span>
        <span className="admin-user-name">{username}</span>
      </div>
    </header>
  );
}