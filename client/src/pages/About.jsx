import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import Breadcrumb from '../components/Breadcrumb';
import StatsBar from '../components/StatsBar';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function About() {
  const { t } = useLanguage();
  const { text } = useContent();

  const values = t('about.values');
  const valueTitles = t('about.valueTitles');
  const statsValues = t('stats.values');
  const statsLabels = t('stats.labels');

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.about') }]} />
          <h1 className="page-hero-title">{t('about.title')}</h1>
          <p className="page-hero-subtitle">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="section section-top">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <span className="section-kicker">{t('about.storyKicker')}</span>
              <h2 className="about-story-title">{t('about.storyTitle')}</h2>
              <p className="about-text">{text('about_text')}</p>
            </div>
            <div className="about-mission">
              <h3 className="about-mission-title">{t('about.missionTitle')}</h3>
              <p className="about-text">{t('about.missionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {Array.isArray(statsValues) && Array.isArray(statsLabels) && (
        <section className="stats-band">
          <div className="container">
            <h2 className="visit-caption">{t('about.statsTitle')}</h2>
            <StatsBar values={statsValues} labels={statsLabels} variant="light" />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-header section-header-center">
            <span className="section-kicker">{t('home.whyKicker')}</span>
            <h2 className="section-title">{t('about.valuesTitle')}</h2>
          </div>
          <div className="about-values-grid">
            {Array.isArray(values) &&
              values.map((value, index) => (
                <div className="about-value-card" key={index}>
                  {Array.isArray(valueTitles) && valueTitles[index] && (
                    <h3 className="about-value-title">{valueTitles[index]}</h3>
                  )}
                  <p className="about-value-text">{value}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="section-header section-header-center">
            <span className="section-kicker">{t('footer.contact')}</span>
            <h2 className="section-title">{t('about.contactTitle')}</h2>
          </div>
          <ul className="about-contact-list">
            <li>
              <FiPhone aria-hidden="true" />
              <a href={`tel:${text('contact_phone')}`} dir="ltr">{text('contact_phone')}</a>
            </li>
            <li>
              <FiMail aria-hidden="true" />
              <a href={`mailto:${text('contact_email')}`} dir="ltr">{text('contact_email')}</a>
            </li>
            <li>
              <FiMapPin aria-hidden="true" />
              <a href="https://www.google.com/maps/search/?api=1&query=Modern+Motors" target="_blank" rel="noopener noreferrer">
                {text('contact_address')}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}