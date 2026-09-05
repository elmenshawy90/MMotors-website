import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getBranches } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import BranchCard from '../components/BranchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function Branches() {
  const { t, language } = useLanguage();
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState(false);

  const BlogArrow = language === 'ar' ? FaArrowLeft : FaArrowRight;

  const load = () => {
    setError(false);
    setBranches(null);
    getBranches()
      .then((res) => setBranches(res.data.data))
      .catch(() => setError(true));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.branches') }]} />
          <h1 className="page-hero-title">{t('branches.title')}</h1>
          <p className="page-hero-subtitle">{t('branches.subtitle')}</p>
        </div>
      </section>

      <section className="section section-light section-top">
        <div className="container">
          {error ? (
            <ErrorMessage message={t('common.error')} onRetry={load} />
          ) : branches === null ? (
            <LoadingSpinner />
          ) : branches.length === 0 ? (
            <p className="empty-text">{t('branches.noBranches')}</p>
          ) : (
            <div className="branch-grid">
              {branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-inner">
          <h2 className="cta-title">{t('home.ctaTitle')}</h2>
          <p className="cta-subtitle">{t('home.ctaSubtitle')}</p>
          <Link to="/book-service" className="btn btn-gold">
            {t('home.ctaBtn')} <BlogArrow aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
