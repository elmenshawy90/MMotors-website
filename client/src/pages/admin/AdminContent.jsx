import { useEffect, useState } from 'react';
import { FaHome, FaInfoCircle, FaPhone, FaBuilding } from 'react-icons/fa';
import { getContent, updateContent } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const GROUPS = [
  {
    key: 'groupHomepage',
    icon: FaHome,
    fields: ['hero_title', 'hero_subtitle']
  },
  {
    key: 'groupAbout',
    icon: FaInfoCircle,
    fields: ['about_text']
  },
  {
    key: 'groupContact',
    icon: FaPhone,
    fields: ['contact_phone', 'contact_email', 'contact_address', 'contact_hours']
  },
  {
    key: 'groupBranch1',
    icon: FaBuilding,
    fields: ['branch_1_name', 'branch_1_address', 'branch_1_phone', 'branch_1_email', 'branch_1_hours']
  },
  {
    key: 'groupBranch2',
    icon: FaBuilding,
    fields: ['branch_2_name', 'branch_2_address', 'branch_2_phone', 'branch_2_email', 'branch_2_hours']
  }
];

const ALL_KEYS = GROUPS.flatMap((g) => g.fields);

export default function AdminContent() {
  const { t } = useLanguage();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState(null);
  const [toast, setToast] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getContent()
      .then((res) => setContent(res.data.data))
      .catch(() => setError(t('admin.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(id);
  }, [toast]);

  if (loading) {
    return <div className="admin-empty">{t('admin.loading')}</div>;
  }

  const setValue = (key, lang, value) => {
    setContent((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [lang]: value }
    }));
  };

  const save = (key) => {
    const value = content[key] || {};
    const en = value.en || '';
    const ar = value.ar || '';
    setSavingKey(key);
    setToast('');
    Promise.all([
      updateContent(key, 'en', en).catch(() => null),
      updateContent(key, 'ar', ar).catch(() => null)
    ])
      .then(() => setToast(t('admin.saved')))
      .finally(() => setSavingKey(null));
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.contentTitle')}</h1>
          <p className="admin-page-subtitle">{t('admin.contentSubtitle')}</p>
        </div>
      </div>

      {toast && <div className="admin-alert admin-alert--success">{toast}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span className="admin-lang-tag">EN</span>
        <span className="admin-lang-tag">العربية</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t('admin.contentSubtitle')}</span>
      </div>

      {GROUPS.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.key} className="admin-content-group">
            <h3 className="admin-content-group-title">
              <span className="admin-content-group-icon"><Icon aria-hidden="true" /></span>
              {t(`admin.${group.key}`)}
            </h3>
            {group.fields.map((key) => {
              const value = content[key] || {};
              const isLong = key === 'hero_subtitle' || key === 'about_text';
              return (
                <div key={key} className="admin-content-field">
                  <div className="admin-content-label">
                    {t(`admin.contentLabels.${key}`)}
                  </div>
                  <div className="admin-lang-field">
                    <div className="admin-lang-col">
                      <span className="admin-lang-tag admin-lang-tag--en">EN</span>
                      {isLong ? (
                        <textarea
                          className="admin-textarea"
                          dir="ltr"
                          value={value.en || ''}
                          onChange={(e) => setValue(key, 'en', e.target.value)}
                        />
                      ) : (
                        <input
                          className="admin-input"
                          dir="ltr"
                          value={value.en || ''}
                          onChange={(e) => setValue(key, 'en', e.target.value)}
                        />
                      )}
                    </div>
                    <div className="admin-lang-col">
                      <span className="admin-lang-tag">AR</span>
                      {isLong ? (
                        <textarea
                          className="admin-textarea"
                          dir="rtl"
                          value={value.ar || ''}
                          onChange={(e) => setValue(key, 'ar', e.target.value)}
                        />
                      ) : (
                        <input
                          className="admin-input"
                          dir="rtl"
                          value={value.ar || ''}
                          onChange={(e) => setValue(key, 'ar', e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, textAlign: 'end' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn--primary admin-btn--sm"
                      onClick={() => save(key)}
                      disabled={savingKey === key}
                    >
                      {savingKey === key ? t('admin.saving') : t('admin.save')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}