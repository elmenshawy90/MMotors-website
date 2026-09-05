import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCars } from '../services/api';
import { formatPrice } from '../utils/format';
import Breadcrumb from '../components/Breadcrumb';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FaSearch } from 'react-icons/fa';

const MIN_PRICE_OPTIONS = ['', '0', '10000', '20000', '30000', '40000', '50000', '75000'];
const MAX_PRICE_OPTIONS = ['', '20000', '30000', '40000', '50000', '75000', '100000', '150000'];

export default function Cars() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allCars, setAllCars] = useState([]);
  const [cars, setCars] = useState(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    fuel_type: '',
    min_price: '',
    max_price: ''
  });
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const urlBrand = searchParams.get('brand') || '';
    if (filters.brand !== urlBrand) {
      setFilters((prev) => ({ ...prev, brand: urlBrand }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    if (filters.brand) params.brand = filters.brand;
    if (searchParams.get('brand') !== filters.brand) {
      setSearchParams(filters.brand ? { brand: filters.brand } : {}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.brand]);

  const loadOptions = () => {
    getCars()
      .then((res) => setAllCars(res.data.data))
      .catch(() => setAllCars([]));
  };

  const loadCars = () => {
    setError(false);
    setCars(null);
    const params = {};
    if (filters.brand) params.brand = filters.brand;
    if (filters.fuel_type) params.fuel_type = filters.fuel_type;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;

    getCars(params)
      .then((res) => {
        let list = [...res.data.data];
        const query = search.trim().toLowerCase();
        if (query) {
          list = list.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(query));
        }
        if (sort === 'priceLow') list.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sort === 'priceHigh') list.sort((a, b) => Number(b.price) - Number(a.price));
        setCars(list);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadCars, 300);
    return () => clearTimeout(timer);
  }, [search, filters, sort]);

  const brands = [...new Set(allCars.map((c) => c.brand).filter(Boolean))].sort();
  const fuelTypes = [...new Set(allCars.map((c) => c.fuel_type).filter(Boolean))];

  const handleFilter = (name) => (e) => {
    setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  };

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.cars') }]} />
          <h1 className="page-hero-title">{t('nav.cars')}</h1>
          <p className="page-hero-subtitle">{t('cars.subtitle')}</p>
        </div>
      </section>

      <section className="section section-light section-top">
        <div className="container">
          <div className="filter-bar" role="search">
            <div className="filter-search">
              <FaSearch className="filter-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="filter-input"
                placeholder={t('cars.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('cars.searchPlaceholder')}
              />
            </div>

            <div className="filter-control">
              <label htmlFor="brand">{t('cars.brand')}</label>
              <select id="brand" className="filter-select" value={filters.brand} onChange={handleFilter('brand')}>
                <option value="">{t('cars.allBrands')}</option>
                {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="fuel_type">{t('cars.fuelType')}</label>
              <select id="fuel_type" className="filter-select" value={filters.fuel_type} onChange={handleFilter('fuel_type')}>
                <option value="">{t('cars.allFuelTypes')}</option>
                {fuelTypes.map((fuel) => <option key={fuel} value={fuel}>{fuel}</option>)}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="min_price">{t('cars.minPrice')}</label>
              <select id="min_price" className="filter-select" value={filters.min_price} onChange={handleFilter('min_price')}>
                <option value="">{t('cars.any')}</option>
                {MIN_PRICE_OPTIONS.slice(1).map((p) => <option key={p} value={p}>{p === '0' ? formatPrice(0, language) : `${formatPrice(p, language)}+`}</option>)}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="max_price">{t('cars.maxPrice')}</label>
              <select id="max_price" className="filter-select" value={filters.max_price} onChange={handleFilter('max_price')}>
                <option value="">{t('cars.any')}</option>
                {MAX_PRICE_OPTIONS.slice(1).map((p) => <option key={p} value={p}>{formatPrice(p, language)}</option>)}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="sort">{t('cars.sort')}</label>
              <select id="sort" className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">{t('cars.sortNewest')}</option>
                <option value="priceLow">{t('cars.sortPriceLow')}</option>
                <option value="priceHigh">{t('cars.sortPriceHigh')}</option>
              </select>
            </div>
          </div>

          {error ? (
            <ErrorMessage message={t('common.error')} onRetry={loadCars} />
          ) : cars === null ? (
            <LoadingSpinner />
          ) : cars.length === 0 ? (
            <div className="empty-text">{t('cars.noResults')}</div>
          ) : (
            <>
              <p className="results-count">{cars.length} {t('cars.resultsSuffix')}</p>
              <div className="car-grid">
                {cars.map((car) => <CarCard key={car.id} car={car} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}