import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import BookingForm from '../components/BookingForm';
import Breadcrumb from '../components/Breadcrumb';
import { FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function BookService() {
  const { t } = useLanguage();
  const { text } = useContent();

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.bookService') }]} />
          <h1 className="page-hero-title">{t('nav.bookService')}</h1>
          <p className="page-hero-subtitle">{t('booking.subtitle')}</p>
        </div>
      </section>

      <section className="section section-top">
        <div className="container booking-layout">
          <div className="booking-main">
            <BookingForm />
          </div>

          <aside className="booking-sidebar">
            <div className="booking-info-card">
              <h3 className="booking-info-title">{t('booking.contactTitle')}</h3>
              <ul className="booking-info-list">
                <li>
                  <FiPhone aria-hidden="true" />
                  <a href={`tel:${text('contact_phone')}`} dir="ltr">{text('contact_phone')}</a>
                </li>
                <li>
                  <FiMail aria-hidden="true" />
                  <a href={`mailto:${text('contact_email')}`} dir="ltr">{text('contact_email')}</a>
                </li>
                <li>
                  <FiClock aria-hidden="true" />
                  <span>{text('contact_hours')}</span>
                </li>
              </ul>
              <a className="btn btn-gold btn-block" href={`tel:${text('contact_phone')}`}>
                {t('booking.callNow')}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}