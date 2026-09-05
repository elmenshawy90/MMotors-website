import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import Breadcrumb from '../components/Breadcrumb';
import ContactInfoCard from '../components/ContactInfoCard';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

export default function Contact() {
  const { t } = useLanguage();
  const { text } = useContent();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text('contact_address'))}`;

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.contact') }]} />
          <h1 className="page-hero-title">{t('contact.title')}</h1>
          <p className="page-hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="section section-top">
        <div className="container">
          <div className="contact-grid">
            <ContactInfoCard
              icon={FiPhone}
              title={t('contact.callTitle')}
              text={t('contact.callText')}
              actionLabel={text('contact_phone')}
              href={`tel:${text('contact_phone')}`}
              dir="ltr"
            />
            <ContactInfoCard
              icon={FiMail}
              title={t('contact.emailTitle')}
              text={t('contact.emailText')}
              actionLabel={text('contact_email')}
              href={`mailto:${text('contact_email')}`}
              dir="ltr"
            />
            <ContactInfoCard
              icon={FiMapPin}
              title={t('contact.visitTitle')}
              text={t('contact.visitText')}
              actionLabel={text('contact_address')}
              href={mapsUrl}
            />
            <ContactInfoCard
              icon={FiClock}
              title={t('contact.hoursTitle')}
              text={text('contact_hours')}
              actionLabel={t('contact.directionsBtn')}
              href={mapsUrl}
            />
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container contact-banner">
          <div className="contact-banner-text">
            <span className="section-kicker">{t('footer.branches')}</span>
            <h2 className="contact-banner-title">{t('contact.requestTitle')}</h2>
            <p className="contact-banner-subtitle">{t('contact.requestText')}</p>
          </div>
          <div className="contact-banner-actions">
            <Link to="/book-service" className="btn btn-gold">{t('contact.bookService')}</Link>
            <a className="btn btn-outline" href={`tel:${text('contact_phone')}`}>
              <FiPhone aria-hidden="true" /> {t('contact.callNow')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}