import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getContent } from '../services/api';
import { useLanguage } from './LanguageContext';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { language } = useLanguage();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getContent()
      .then((res) => {
        if (!cancelled) setContent(res.data.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const text = useCallback(
    (key, fallback = '') => {
      const item = content[key];
      if (!item) return fallback;
      if (item[language]) return item[language];
      if (item.en) return item.en;
      return fallback;
    },
    [content, language]
  );

  return (
    <ContentContext.Provider value={{ content, loading, error, text }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used inside a ContentProvider');
  }
  return context;
}