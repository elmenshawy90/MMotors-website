import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import en from '../translations/en';
import ar from '../translations/ar';

const translations = { en, ar };

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const saved = localStorage.getItem('language');
  if (saved === 'en' || saved === 'ar') return saved;
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('ar') ? 'ar' : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    const nextDir = language === 'ar' ? 'rtl' : 'ltr';
    setDir(nextDir);
    document.documentElement.lang = language;
    document.documentElement.dir = nextDir;
  }, [language]);

  const t = useCallback(
    (key) => {
      const parts = key.split('.');
      let value = translations[language];
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          return key;
        }
      }
      return typeof value === 'string' || Array.isArray(value) ? value : key;
    },
    [language]
  );

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, dir, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return context;
}