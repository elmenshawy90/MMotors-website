import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { getFeaturedCars } from '../services/api';
import SectionHeader from '../components/SectionHeader';
import CarCard from '../components/CarCard';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaCar, FaTag, FaAward, FaOilCan, FaExclamationTriangle, FaWrench, FaPhone, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const WHY_ICONS = [FaCar, FaTag, FaAward];

const HOME_SERVICES = [
  { key: 'oilChange', icon: FaOilCan },
  { key: 'brakeInspection', icon: FaExclamationTriangle },
  { key: 'generalMaintenance', icon: FaWrench }
];

export default function Home() {
  const { t, language } = useLanguage();
  const { text } = useContent();
  const [cars, setCars] = useState(null);
  const [error, setError] = useState(false);

  const BlogArrow = language === 'ar' ? FaArrowLeft : FaArrowRight;

  const loadFeatured = () => {
    setError(false);
    setCars(null);
    getFeaturedCars()
      .then((res) => setCars(res.data.data))
      .catch(() => setError(true));
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  const whyPoints = t('home.whyPoints');

  return (
    <>
      <section className="hero" aria-label={t('brandName')}></section>

      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-text">
            <h2 className="intro-title">{t('home.introTitle')}</h2>
            <p className="intro-paragraph">{text('about_text')}</p>
            <Link to="/about" className="btn btn-outline">
              {t('home.learnMore')} <BlogArrow aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <SectionHeader
            kicker={t('home.featuredKicker')}
            title={t('home.featuredTitle')}
            subtitle={t('home.featuredSubtitle')}
          />
          {error ? (
            <ErrorMessage message={t('common.error')} onRetry={loadFeatured} />
          ) : cars === null ? (
            <LoadingSpinner />
          ) : cars.length === 0 ? (
            <p className="empty-text">{t('cars.noResults')}</p>
          ) : (
            <>
              <div className="car-grid">
                {cars.map((car) => <CarCard key={car.id} car={car} />)}
              </div>
              <div className="section-footer-action">
                <Link to="/cars" className="btn btn-gold">
                  {t('home.viewAll')} <BlogArrow aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            kicker={t('home.whyKicker')}
            title={t('home.whyTitle')}
            subtitle={t('home.whySubtitle')}
          />
          <div className="why-grid">
            {Array.isArray(whyPoints) &&
              whyPoints.map((point, index) => {
                const Icon = WHY_ICONS[index % WHY_ICONS.length];
                return (
                  <div className="why-card" key={index}>
                    <div className="why-icon" aria-hidden="true"><Icon /></div>
                    <p className="why-point">{point}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <SectionHeader
            kicker={t('home.servicesKicker')}
            title={t('home.servicesTitle')}
            subtitle={t('home.servicesSubtitle')}
          />
          <div className="services-grid">
            {HOME_SERVICES.map((service, index) => {
              const Icon = service.icon;
              const label = t(`booking.serviceTypes.${service.key}`);
              return (
                <Link
                  key={service.key}
                  to={`/book-service?service=${service.key}`}
                  className="service-link"
                >
                  <ServiceCard
                    icon={Icon}
                    title={label}
                    text={t('home.servicesText')[index] || ''}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-inner">
          <span className="cta-kicker">{t('home.ctaKicker')}</span>
          <h2 className="cta-title">{t('home.ctaTitle')}</h2>
          <p className="cta-subtitle">{t('home.ctaSubtitle')}</p>
          <div className="cta-actions">
            <Link to="/book-service" className="btn btn-gold">
              {t('home.ctaBtn')} <BlogArrow aria-hidden="true" />
            </Link>
            <a className="btn btn-phone-light" href={`tel:${text('contact_phone')}`}>
              <FaPhone aria-hidden="true" />
              <span dir="ltr">{text('contact_phone')}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}