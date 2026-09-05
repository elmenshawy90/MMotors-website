import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { getCar, getCars, getFeaturedCars, getCarImages } from '../services/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import CarCard from '../components/CarCard';
import CarPlaceholder from '../components/CarPlaceholder';
import SectionHeader from '../components/SectionHeader';
import SpecIconRow from '../components/SpecIconRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice, formatMileage, carDescription } from '../utils/format';
import { FaWrench, FaPhone, FaCalendarAlt, FaGasPump, FaCogs, FaTachometerAlt, FaPalette } from 'react-icons/fa';

export default function CarDetails() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { text } = useContent();

  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const load = () => {
    setError(false);
    setCar(null);
    setGallery([]);
    setActiveIndex(0);
    getCar(id)
      .then((res) => {
        setCar(res.data.data);
        const current = res.data.data;
        if (current.brand) {
          getCars({ brand: current.brand })
            .then((r) => {
              setSimilar(r.data.data.filter((c) => c.id !== current.id).slice(0, 3));
            })
            .catch(() => setSimilar([]));
        }
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    load();
  }, [id]);

  const loadFallbackSimilar = () => {
    getFeaturedCars()
      .then((res) => setSimilar(res.data.data.filter((c) => c.id !== car?.id).slice(0, 3)))
      .catch(() => setSimilar([]));
  };

  useEffect(() => {
    if (car && similar.length === 0) loadFallbackSimilar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  useEffect(() => {
    if (!car) return;
    getCarImages(car.id)
      .then((res) => {
        const imgs = res.data.data;
        if (imgs && imgs.length > 0) {
          setGallery(imgs.map((i) => i.image_url));
          const primIdx = imgs.findIndex((i) => i.is_primary);
          setActiveIndex(primIdx >= 0 ? primIdx : 0);
        } else if (car.image_url) {
          setGallery([car.image_url]);
        }
      })
      .catch(() => {
        if (car.image_url) setGallery([car.image_url]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <ErrorMessage message={t('cars.notFound')} onRetry={load} />
        </div>
      </section>
    );
  }

  if (car === null) {
    return (
      <section className="section">
        <div className="container"><LoadingSpinner /></div>
      </section>
    );
  }

  const description = carDescription(car, language);

  const specs = [
    { label: t('carDetails.specs.year'), value: car.year },
    { label: t('carDetails.specs.price'), value: formatPrice(car.price, language) },
    { label: t('carDetails.specs.color'), value: car.color },
    { label: t('carDetails.specs.mileage'), value: `${formatMileage(car.mileage)} km` },
    { label: t('carDetails.specs.fuel'), value: car.fuel_type },
    { label: t('carDetails.specs.transmission'), value: car.transmission },
    { label: t('carDetails.specs.engine'), value: car.engine },
    { label: t('carDetails.specs.horsepower'), value: car.horsepower ? `${car.horsepower} HP` : '—' },
    { label: t('carDetails.specs.seats'), value: car.seats }
  ];

  return (
    <>
      <section className="section section-details">
        <div className="container">
          <Breadcrumb items={[{ to: '/cars', label: t('nav.cars') }, { label: `${car.brand} ${car.model}` }]} />

          <div className="details-grid">
            <div className="details-media">
              {gallery.length > 0 ? (
                <>
                  <div className="gallery-main">
                    <img src={gallery[activeIndex]} alt={`${car.brand} ${car.model}`} className="details-image" />
                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="gallery-nav gallery-nav--prev"
                          aria-label={t('carDetails.prevImage')}
                          onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                        >
                          <FaChevronLeft aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="gallery-nav gallery-nav--next"
                          aria-label={t('carDetails.nextImage')}
                          onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
                        >
                          <FaChevronRight aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                  {gallery.length > 1 && (
                    <div className="gallery-thumbs" role="group" aria-label={t('carDetails.galleryThumbsAria')}>
                      {gallery.map((url, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`gallery-thumb ${index === activeIndex ? 'is-active' : ''}`}
                          onClick={() => setActiveIndex(index)}
                          aria-label={`${t('carDetails.image')} ${index + 1}`}
                        >
                          <img src={url} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : car.image_url ? (
                <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="details-image" />
              ) : (
                <CarPlaceholder color={car.color} brand={car.brand} model={car.model} variant="detail" />
              )}
            </div>

            <div className="details-info">
              <div className="details-title-row">
                <h1 className="details-title">{car.brand} {car.model}</h1>
                <span className={`badge badge-lg ${car.availability ? 'badge-available' : 'badge-sold'}`}>
                  {car.availability ? t('common.available') : t('common.sold')}
                </span>
              </div>
              <p className="details-price" dir="ltr">{formatPrice(car.price, language)}</p>

              <SpecIconRow
                items={[
                  { icon: FaCalendarAlt, value: car.year, label: t('carDetails.specs.year') },
                  { icon: FaGasPump, value: car.fuel_type, label: t('carDetails.specs.fuel') },
                  { icon: FaCogs, value: car.transmission, label: t('carDetails.specs.transmission') },
                  { icon: FaTachometerAlt, value: car.mileage ? `${formatMileage(car.mileage)} km` : '', label: t('carDetails.specs.mileage'), dir: 'ltr' },
                  { icon: FaPalette, value: car.color, label: t('carDetails.specs.color') }
                ]}
              />

              <p className="details-description">
                {description || t('cars.notFound')}
              </p>

              <div className="details-cta">
                {car.availability ? (
                  <Link to={`/book-service?car=${car.id}`} className="btn btn-gold btn-lg">
                    <FaWrench aria-hidden="true" /> {t('carDetails.bookService')}
                  </Link>
                ) : (
                  <span className="details-cta-sold">{t('common.sold')}</span>
                )}
                <a className="btn btn-outline btn-lg" href={`tel:${text('contact_phone')}`}>
                  <FaPhone aria-hidden="true" /> {t('carDetails.callUs')}
                </a>
              </div>
            </div>
          </div>

          <div className="specs-section">
            <h2 className="specs-title">{t('carDetails.specsTitle')}</h2>
            <div className="specs-grid">
              {specs.map((spec) => (
                <div className="spec-item" key={spec.label}>
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value" dir={typeof spec.value === 'string' && (spec.value.includes('EGP') || spec.value.includes('ج.م')) ? 'ltr' : 'auto'}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section section-light">
          <div className="container">
            <SectionHeader kicker={t('home.featuredKicker')} title={t('carDetails.similarTitle')} subtitle={t('carDetails.similarSubtitle')} />
            <div className="car-grid">
              {similar.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}