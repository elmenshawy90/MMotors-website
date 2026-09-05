import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { createBuyRequest } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import { FiPhone, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';

const BRANDS = ['Nissan', 'Suzuki'];

export default function BuyNewCar() {
  const { t } = useLanguage();
  const { text } = useContent();

  const [form, setForm] = useState({
    customer_name: '',
    phone_number: '',
    email: '',
    preferred_brand: '',
    preferred_model: '',
    preferred_color: '',
    budget: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2) errs.customer_name = t('buyNewCar.required');
    const digits = (form.phone_number.match(/\d/g) || []).length;
    if (!form.phone_number.trim()) errs.phone_number = t('buyNewCar.required');
    else if (digits < 7) errs.phone_number = t('buyNewCar.invalidPhone');
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = t('buyNewCar.invalidEmail');
    if (form.budget.trim() && Number.isNaN(Number(form.budget))) errs.budget = t('buyNewCar.invalidBudget');
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
      await createBuyRequest({
        customer_name: form.customer_name.trim(),
        phone_number: form.phone_number.trim(),
        email: form.email.trim() || null,
        preferred_brand: form.preferred_brand || null,
        preferred_model: form.preferred_model.trim() || null,
        preferred_color: form.preferred_color.trim() || null,
        budget: form.budget.trim() || null,
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
      email: '',
      preferred_brand: '',
      preferred_model: '',
      preferred_color: '',
      budget: '',
      notes: ''
    });
    setErrors({});
    setSubmitError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <>
        <section className="page-hero">
          <div className="container page-hero-inner">
            <Breadcrumb items={[{ label: t('nav.buyNewCar') }]} />
            <h1 className="page-hero-title">{t('nav.buyNewCar')}</h1>
            <p className="page-hero-subtitle">{t('buyNewCar.subtitle')}</p>
          </div>
        </section>

        <section className="section section-top">
          <div className="container">
            <div className="booking-success">
              <div className="booking-success-icon" aria-hidden="true">✓</div>
              <h2 className="booking-success-title">{t('buyNewCar.successTitle')}</h2>
              <p className="booking-success-message">{t('buyNewCar.successMessage')}</p>
              <button type="button" className="btn btn-gold" onClick={resetForm}>
                {t('buyNewCar.submitAnother')}
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <Breadcrumb items={[{ label: t('nav.buyNewCar') }]} />
          <h1 className="page-hero-title">{t('nav.buyNewCar')}</h1>
          <p className="page-hero-subtitle">{t('buyNewCar.subtitle')}</p>
        </div>
      </section>

      <section className="section section-top">
        <div className="container booking-layout">
          <div className="booking-main">
            <div className="booking-form-wrap">
              <h3 className="booking-step-title">{t('buyNewCar.formTitle')}</h3>
              <p className="booking-step-subtitle">{t('buyNewCar.formSubtitle')}</p>

              <form className="booking-form" onSubmit={handleSubmit} noValidate>
                {submitError && <p className="form-alert form-alert-error">{submitError}</p>}

                <div className="form-group">
                  <label htmlFor="customer_name">{t('buyNewCar.customerName')} *</label>
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

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="phone_number">{t('buyNewCar.phoneNumber')} *</label>
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

                  <div className="form-group">
                    <label htmlFor="email">{t('buyNewCar.email')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="preferred_brand">{t('buyNewCar.preferredBrand')}</label>
                    <select
                      id="preferred_brand"
                      name="preferred_brand"
                      className="form-input"
                      value={form.preferred_brand}
                      onChange={handleChange}
                    >
                      <option value="">{t('buyNewCar.preferredBrandPlaceholder')}</option>
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand}>{t(`buyNewCar.brand${brand}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferred_model">{t('buyNewCar.preferredModel')}</label>
                    <input
                      id="preferred_model"
                      name="preferred_model"
                      type="text"
                      value={form.preferred_model}
                      onChange={handleChange}
                      placeholder={t('buyNewCar.preferredModelPlaceholder')}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="preferred_color">{t('buyNewCar.preferredColor')}</label>
                    <input
                      id="preferred_color"
                      name="preferred_color"
                      type="text"
                      value={form.preferred_color}
                      onChange={handleChange}
                      placeholder={t('buyNewCar.preferredColorPlaceholder')}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="budget">{t('buyNewCar.budget')}</label>
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder={t('buyNewCar.budgetPlaceholder')}
                      className={`form-input ${errors.budget ? 'input-error' : ''}`}
                    />
                    {errors.budget && <p className="field-error">{errors.budget}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">{t('buyNewCar.notes')}</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder={t('buyNewCar.notesPlaceholder')}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={submitting}>
                  {submitting ? t('buyNewCar.submitting') : t('buyNewCar.submit')}
                </button>
              </form>
            </div>
          </div>

          <aside className="booking-sidebar">
            <div className="booking-info-card">
              <h3 className="booking-info-title">{t('buyNewCar.contactTitle')}</h3>
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
                {t('buyNewCar.callNow')}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}