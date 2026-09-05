import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/format';
import SpecIconRow from './SpecIconRow';
import CarPlaceholder from './CarPlaceholder';
import { FaCogs, FaGasPump, FaTachometerAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function CarCard({ car }) {
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? FaArrowLeft : FaArrowRight;

  return (
    <article className="car-card">
      <Link to={`/cars/${car.id}`} className="car-card-media">
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-card-img" loading="lazy" />
        ) : (
          <CarPlaceholder color={car.color} brand={car.brand} model={car.model} variant="card" />
        )}
        <span className={`badge ${car.availability ? 'badge-available' : 'badge-sold'}`}>
          {car.availability ? t('common.available') : t('common.sold')}
        </span>
        <span className="car-card-cta">
          {t('common.viewDetails')} <Arrow aria-hidden="true" />
        </span>
      </Link>

      <div className="car-card-body">
        <div className="car-card-heading">
          <div>
            <h3 className="car-card-title">{car.brand} {car.model}</h3>
            <p className="car-card-year">{car.year}</p>
          </div>
          <SpecIconRow
            items={[
              { icon: FaCogs, value: car.transmission, label: t('carDetails.specs.transmission') },
              { icon: FaGasPump, value: car.fuel_type, label: t('carDetails.specs.fuel') },
              { icon: FaTachometerAlt, value: car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '', label: t('carDetails.specs.mileage'), dir: 'ltr' }
            ]}
          />
        </div>
        <p className="car-card-price-details">
          <span className="car-card-price-labels">
            <span className="car-card-price-label">{t('common.price')}</span>
          </span>
          <span className="car-card-price" dir="ltr">{formatPrice(car.price, language)}</span>
        </p>
      </div>
    </article>
  );
}