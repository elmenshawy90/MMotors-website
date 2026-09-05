import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { language, changeLanguage, t } = useLanguage();
  const { isAuthenticated, checking, login } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (checking) {
    return <div className="admin-login-wrap">{t('admin.verifying')}</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(t('admin.loginError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-lang">
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
      </div>

      <div className="admin-login-card">
        <img src="/logo.png" alt={t('brandName')} className="admin-login-logo" />
        <h1 className="admin-login-title">{t('admin.loginTitle')}</h1>
        <p className="admin-login-subtitle">{t('admin.loginSubtitle')}</p>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-username">{t('admin.username')}</label>
            <input
              id="admin-username"
              type="text"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">{t('admin.password')}</label>
            <input
              id="admin-password"
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="admin-btn admin-btn--primary admin-btn--lg admin-btn--block" disabled={submitting}>
            {submitting ? t('admin.signingIn') : t('admin.signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}