import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumb({ items = [] }) {
  const { t } = useLanguage();

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-link">{t('nav.home')}</Link>
      {items.map((item, index) => (
        <Fragment key={index}>
          <FiChevronRight className="breadcrumb-icon" aria-hidden="true" />
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}