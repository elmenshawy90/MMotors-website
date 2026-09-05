import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCars } from '../services/api';
import TopBar from './TopBar';
import NavDropdown from './NavDropdown';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);

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

  const close = () => setOpen(false);

  return (
    <header className="header">
      <TopBar />

      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand" onClick={close}>
            <img src="/logo.png" alt={t('brandName')} className="navbar-logo" />
            <span className="navbar-brand-text">
              <span className="navbar-brand-name">{t('brandName')}</span>
              <span className="navbar-brand-tagline">{t('tagline')}</span>
            </span>
          </Link>

          <div className={`navbar-links ${open ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end onClick={close}>
              {t('nav.home')}
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={close}>
              {t('nav.about')}
            </NavLink>

            <NavDropdown label={t('nav.cars')} active={pathname.startsWith('/cars')}>
              <Link to="/cars" className="nav-dropdown-item nav-dropdown-item-all" onClick={close}>
                {t('nav.allCars')}
              </Link>
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to={`/cars?brand=${encodeURIComponent(brand)}`}
                  className="nav-dropdown-item"
                  onClick={close}
                >
                  {brand}
                </Link>
              ))}
            </NavDropdown>

            <NavDropdown label={t('nav.services')} active={pathname.startsWith('/book-service') || pathname.startsWith('/branches') || pathname.startsWith('/contact')}>
              <Link to="/book-service" className="nav-dropdown-item" onClick={close}>
                {t('nav.bookService')}
              </Link>
              <Link to="/branches" className="nav-dropdown-item" onClick={close}>
                {t('nav.branches')}
              </Link>
              <Link to="/contact" className="nav-dropdown-item" onClick={close}>
                {t('nav.contact')}
              </Link>
            </NavDropdown>

            <Link to="/buy-new-car" className="btn btn-gold nav-book-btn" onClick={close}>
              {t('nav.buyNewCar')}
            </Link>

            <Link to="/book-service" className="btn btn-outline nav-book-btn" onClick={close}>
              {t('nav.bookService')}
            </Link>
          </div>

          <button type="button" className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  );
}