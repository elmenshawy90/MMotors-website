import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCars, createBooking } from '../services/api';
import { formatPrice } from '../utils/format';
import ServiceCard from './ServiceCard';
import { FaOilCan, FaCircleNotch, FaExclamationTriangle, FaBolt, FaWrench, FaTools } from 'react-icons/fa';

const SERVICE_KEYS = [
  'oilChange',
  'tireRotation',
  'brakeInspection',
  'batteryReplacement',
  'generalMaintenance',
  'other'
];

const SERVICE_ICONS = {
  oilChange: FaOilCan,
  tireRotation: FaCircleNotch,
  brakeInspection: FaExclamationTriangle,
  batteryReplacement: FaBolt,
  generalMaintenance: FaWrench,
  other: FaTools
};

export default function BookingForm() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const initialServiceKey = SERVICE_KEYS.includes(searchParams.get('service')) ? searchParams.get('service') : '';
  const initialService = initialServiceKey ? t(`booking.serviceTypes.${initialServiceKey}`) : '';

  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    customer_name: '',
    phone_number: '',
    car_id: searchParams.get('car') || '',
    service_type: initialService,
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    getCars({ availability: 'true' })
      .then((res) => setCars(res.data.data))
      .catch(() => setCars([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectService = (key) => {
    setForm((prev) => ({ ...prev, service_type: t(`booking.serviceTypes.${key}`) }));
    setErrors((prev) => ({ ...prev, service_type: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2) errs.customer_name = t('booking.required');
    const digits = (form.phone_number.match(/\d/g) || []).length;
    if (!form.phone_number.trim()) errs.phone_number = t('booking.required');
    else if (digits < 7) errs.phone_number = t('booking.invalidPhone');
    if (!form.service_type) errs.service_type = t('booking.required');
    if (!form.preferred_date) errs.preferred_date = t('booking.required');
    else if (form.preferred_date < today) errs.preferred_date = t('booking.invalidDate');
    if (!form.preferred_time) errs.preferred_time = t('booking.required');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstError = document.querySelector('.input-error');
      if (firstError) firstError.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      await createBooking({
        customer_name: form.customer_name.trim(),
        phone_number: form.phone_number.trim(),
        car_id: form.car_id ? Number(form.car_id) : null,
        service_type: form.service_type,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        notes: form.notes.trim() || null
      });
      setSuccess(true);
    } catch {
      setSubmitError(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      customer_name: '',
      phone_number: '',
      car_id: '',
      service_type: '',
      preferred_date: '',
      preferred_time: '',
      notes: ''
    });
    setErrors({});
    setSubmitError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="booking-success">
        <div className="booking-success-icon" aria-hidden="true">✓</div>
        <h2 className="booking-success-title">{t('booking.successTitle')}</h2>
        <p className="booking-success-message">{t('booking.successMessage')}</p>
        <button type="button" className="btn btn-outline" onClick={resetForm}>
          {t('booking.bookAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="booking-form-wrap">
      <div className="booking-step">
        <h3 className="booking-step-title">{t('booking.stepService')}</h3>
        <p className="booking-step-subtitle">{t('booking.chooseService')}</p>
        <div className="service-step-grid">
          {SERVICE_KEYS.map((key, index) => {
            const Icon = SERVICE_ICONS[key];
            const label = t(`booking.serviceTypes.${key}`);
            return (
              <ServiceCard
                key={key}
                icon={Icon}
                title={label}
                text={t('booking.serviceTexts')[index] || ''}
                selected={form.service_type === label}
                onClick={() => selectService(key)}
              />
            );
          })}
        </div>
        {errors.service_type && <p className="field-error">{errors.service_type}</p>}
      </div>

      <div className="booking-step">
        <h3 className="booking-step-title">{t('booking.stepDetails')}</h3>
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          {submitError && <p className="form-alert form-alert-error">{submitError}</p>}

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="customer_name">{t('booking.customerName')} *</label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={form.customer_name}
                onChange={handleChange}
                className={`form-input ${errors.customer_name ? 'input-error' : ''}`}
              />
              {errors.customer_name && <p className="field-error">{errors.customer_name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">{t('booking.phoneNumber')} *</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                dir="ltr"
                value={form.phone_number}
                onChange={handleChange}
                className={`form-input ${errors.phone_number ? 'input-error' : ''}`}
              />
              {errors.phone_number && <p className="field-error">{errors.phone_number}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="service_type">{t('booking.serviceType')}</label>
            <select
              id="service_type"
              name="service_type"
              value={form.service_type}
              onChange={handleChange}
              className={`form-input ${errors.service_type ? 'input-error' : ''}`}
            >
              <option value="">{t('booking.selectServicePlaceholder')}</option>
              {SERVICE_KEYS.map((key) => (
                <option key={key} value={t(`booking.serviceTypes.${key}`)}>
                  {t(`booking.serviceTypes.${key}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="car_id">{t('booking.selectCar')}</label>
            <select
              id="car_id"
              name="car_id"
              value={form.car_id}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">{t('booking.noSpecificCar')}</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year}) — {formatPrice(car.price, language)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="preferred_date">{t('booking.preferredDate')} *</label>
              <input
                id="preferred_date"
                name="preferred_date"
                type="date"
                min={today}
                value={form.preferred_date}
                onChange={handleChange}
                className={`form-input ${errors.preferred_date ? 'input-error' : ''}`}
              />
              {errors.preferred_date && <p className="field-error">{errors.preferred_date}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="preferred_time">{t('booking.preferredTime')} *</label>
              <input
                id="preferred_time"
                name="preferred_time"
                type="time"
                value={form.preferred_time}
                onChange={handleChange}
                className={`form-input ${errors.preferred_time ? 'input-error' : ''}`}
              />
              {errors.preferred_time && <p className="field-error">{errors.preferred_time}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">{t('booking.notes')}</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={form.notes}
              onChange={handleChange}
              placeholder={t('booking.notesPlaceholder')}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={submitting}>
            {submitting ? t('booking.submitting') : t('booking.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}