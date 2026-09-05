import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { getCars } from '../services/api';
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowUpRight } from 'react-icons/fi';

export default function Footer() {
  const { t } = useLanguage();
  const { text } = useContent();
  const [brands, setBrands] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;
    getCars()
      .then((res) => {
        if (!cancelled) {
          setBrands([...new Set(res.data.data.map((c) => c.brand).filter(Boolean))].sort());
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/cars', label: t('nav.cars') },
    { to: '/book-service', label: t('nav.bookService') },
    { to: '/buy-new-car', label: t('nav.buyNewCar') },
    { to: '/branches', label: t('nav.branches') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about-col">
          <img src="/logo.png" alt={t('brandName')} className="footer-logo" />
          <p className="footer-tagline">{t('tagline')}</p>
          <p className="footer-about-text">{text('about_text')}</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t('footer.cars')}</h4>
          <ul className="footer-links">
            <li>
              <Link to="/cars">
                <span className="footer-link-with-arrow">{t('footer.viewAll')} <FiArrowUpRight aria-hidden="true" /></span>
              </Link>
            </li>
            {brands.map((brand) => (
              <li key={brand}>
                <Link to={`/cars?brand=${encodeURIComponent(brand)}`}>{brand}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t('footer.contact')}</h4>
          <ul className="footer-contact">
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
              <span>{text('contact_address')}</span>
            </li>
            <li>
              <FiClock aria-hidden="true" />
              <span>{text('contact_hours')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>© {year} {t('brandName')}. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}