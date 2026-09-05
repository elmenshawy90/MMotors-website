import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/admin/Modal';
import AdminToggle from '../../components/admin/AdminToggle';
import CarPlaceholder from '../../components/CarPlaceholder';
import { FiImage, FiStar, FiTrash2, FiUpload } from 'react-icons/fi';
import {
  getAdminCarImages, uploadAdminCarImages, deleteAdminCarImage, setPrimaryAdminCarImage
} from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const EMPTY = {
  brand: '',
  model: '',
  year: '',
  price: '',
  color: '',
  fuel_type: 'Petrol',
  transmission: 'Automatic',
  mileage: '',
  engine: '',
  horsepower: '',
  seats: '',
  description: '',
  description_ar: '',
  availability: true,
  featured: false
};

function Field({ label, required, full, children, help }) {
  return (
    <div className={`admin-field ${full ? 'admin-field--full' : ''}`}>
      <label>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {help && <span className="admin-field-help">{help}</span>}
    </div>
  );
}

export default function AdminCarForm({ open, onClose, car, onSave, busy }) {
  const { t } = useLanguage();
  const isEdit = !!car;
  const carId = car?.id;
  const [form, setForm] = useState({ ...EMPTY, ...(car || {}) });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgMessage, setImgMessage] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const loadImages = () => {
    if (!isEdit || !carId) return;
    getAdminCarImages(carId)
      .then((res) => setExistingImages(res.data.data))
      .catch(() => setExistingImages([]));
  };

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, ...(car || {}) });
      setSelectedFiles([]);
      setImgMessage('');
      loadImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, car]);

  const previewUrls = useMemo(() => {
    return selectedFiles.map((f) => URL.createObjectURL(f));
  }, [selectedFiles]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeSelected = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim() || !form.year || !form.price) {
      return;
    }

    if (isEdit) {
      // Text fields already saved via onSave; if new files picked for create-only
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'availability' || key === 'featured') {
          data.append(key, value ? '1' : '0');
        } else if (value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });
      onSave(data);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'availability' || key === 'featured') {
        data.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });
    // On create: first file becomes primary "image", the rest go to "images"
    if (selectedFiles.length > 0) {
      data.append('image', selectedFiles[0]);
      selectedFiles.slice(1).forEach((f) => data.append('images', f));
    }
    onSave(data);
  };

  const startNewImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !carId) return;
    setImgBusy(true);
    setImgMessage('');
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    uploadAdminCarImages(carId, fd)
      .then(() => {
        setImgMessage(t('admin.imageSaved'));
        loadImages();
      })
      .catch(() => setImgMessage(t('admin.error')))
      .finally(() => {
        setImgBusy(false);
        e.target.value = '';
      });
  };

  const makePrimary = (image) => {
    if (!carId) return;
    setPrimaryAdminCarImage(carId, image.id)
      .then(() => {
        setImgMessage(t('admin.imagePrimarySet'));
        loadImages();
      })
      .catch(() => setImgMessage(t('admin.error')));
  };

  const removeImage = (image) => {
    if (!carId) return;
    deleteAdminCarImage(carId, image.id)
      .then(() => {
        setImgMessage(t('admin.imageDeleted'));
        loadImages();
      })
      .catch(() => setImgMessage(t('admin.error')));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t('admin.editCar') : t('admin.addCar')}
      size="wide"
      footer={
        <>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={busy}>
            {t('admin.cancel')}
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleSubmit} disabled={busy}>
            {busy ? t('admin.saving') : t('admin.save')}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="admin-car-form">
        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">1</span>
            {t('admin.sectionBasic')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.brandLabel')} required>
              <input className="admin-input" value={form.brand} onChange={set('brand')} />
            </Field>
            <Field label={t('admin.modelLabel')} required>
              <input className="admin-input" value={form.model} onChange={set('model')} />
            </Field>
            <Field label={t('admin.yearLabel')} required>
              <input className="admin-input" type="number" value={form.year} onChange={set('year')} />
            </Field>
            <Field label={t('admin.colorLabel')}>
              <input className="admin-input" value={form.color} onChange={set('color')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">2</span>
            {t('admin.sectionPricing')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.priceLabel')} required>
              <input className="admin-input" type="number" step="0.01" value={form.price} onChange={set('price')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">3</span>
            {t('admin.sectionSpecs')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.fuelTypeLabel')}>
              <select className="admin-select" value={form.fuel_type} onChange={set('fuel_type')}>
                <option value="Petrol">{t('admin.fuelPetrol')}</option>
                <option value="Diesel">{t('admin.fuelDiesel')}</option>
                <option value="Electric">{t('admin.fuelElectric')}</option>
                <option value="Hybrid">{t('admin.fuelHybrid')}</option>
              </select>
            </Field>
            <Field label={t('admin.transmissionLabel')}>
              <select className="admin-select" value={form.transmission} onChange={set('transmission')}>
                <option value="Automatic">{t('admin.transmissionAuto')}</option>
                <option value="Manual">{t('admin.transmissionManual')}</option>
              </select>
            </Field>
            <Field label={t('admin.mileageLabel')}>
              <input className="admin-input" type="number" value={form.mileage} onChange={set('mileage')} />
            </Field>
            <Field label={t('admin.engineLabel')}>
              <input className="admin-input" value={form.engine} onChange={set('engine')} />
            </Field>
            <Field label={t('admin.horsepowerLabel')}>
              <input className="admin-input" type="number" value={form.horsepower} onChange={set('horsepower')} />
            </Field>
            <Field label={t('admin.seatsLabel')}>
              <input className="admin-input" type="number" value={form.seats} onChange={set('seats')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">4</span>
            {t('admin.sectionDescriptions')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.descriptionEn')} full>
              <textarea className="admin-textarea" value={form.description} onChange={set('description')} />
            </Field>
            <Field label={t('admin.descriptionAr')} full>
              <textarea className="admin-textarea" dir="rtl" value={form.description_ar} onChange={set('description_ar')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">5</span>
            {t('admin.imagesLabel')}
          </h4>

          {isEdit && (
            <div className="admin-image-manager">
              {existingImages.length === 0 ? (
                <p className="admin-empty" style={{ textAlign: 'left' }}>{t('admin.noImages')}</p>
              ) : (
                <div className="admin-image-grid">
                  {existingImages.map((img) => (
                    <div className={`admin-image-tile ${img.is_primary ? 'is-primary' : ''}`} key={img.id}>
                      <div className="admin-image-tile-preview">
                        <img src={img.image_url} alt="" />
                        {img.is_primary && (
                          <span className="admin-image-primary-badge">
                            <FiStar aria-hidden="true" /> {t('admin.primaryImage')}
                          </span>
                        )}
                      </div>
                      <div className="admin-image-tile-actions">
                        {!img.is_primary && (
                          <button type="button" className="admin-icon-btn" onClick={() => makePrimary(img)} title={t('admin.setAsPrimary')}>
                            <FiStar aria-hidden="true" />
                          </button>
                        )}
                        <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeImage(img)} title={t('admin.deleteImage')}>
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="admin-field" style={{ marginTop: 16 }}>
                <label>{t('admin.uploadMore')}</label>
                <div className="admin-file-btn">
                  <FiUpload aria-hidden="true" />
                  <span>{t('admin.uploadImages')}</span>
                  <input type="file" accept="image/*" multiple onChange={startNewImageUpload} disabled={imgBusy} />
                </div>
                <span className="admin-field-help">{t('admin.imagesHint')}</span>
                {imgMessage && <div className="admin-alert admin-alert--success" style={{ marginTop: 8 }}>{imgMessage}</div>}
              </div>
            </div>
          )}

          {!isEdit && (
            <div className="admin-image-upload">
              {selectedFiles.length > 0 ? (
                <div className="admin-image-grid">
                  {selectedFiles.map((_, index) => {
                    const isFirst = index === 0;
                    return (
                      <div className={`admin-image-tile ${isFirst ? 'is-primary' : ''}`} key={index}>
                        <div className="admin-image-tile-preview">
                          <img src={previewUrls[index]} alt="" />
                          {isFirst && (
                            <span className="admin-image-primary-badge">
                              <FiStar aria-hidden="true" /> {t('admin.primaryImage')}
                            </span>
                          )}
                        </div>
                        <div className="admin-image-tile-actions">
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeSelected(index)} title={t('admin.deleteImage')}>
                            <FiTrash2 aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="admin-image-preview">
                  {form.image_url ? (
                    <img src={form.image_url} alt={t('admin.previewLabel')} />
                  ) : form.color ? (
                    <CarPlaceholder color={form.color} brand={form.brand || '—'} model={form.model || '—'} />
                  ) : (
                    <FiImage aria-hidden="true" />
                  )}
                </div>
              )}

              <div className="admin-field" style={{ minWidth: 220, flex: 1 }}>
                <label>{t('admin.uploadImages')}</label>
                <div className="admin-file-btn">
                  <FiUpload aria-hidden="true" />
                  <span>{selectedFiles.length > 0 ? t('admin.uploadMore') : t('admin.imagesLabel')}</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileSelect} />
                </div>
                <span className="admin-field-help">{t('admin.imagesHint')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">6</span>
            {t('admin.sectionFlags')}
          </h4>
          <div className="admin-form-grid">
            <AdminToggle
              checked={!!form.availability}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
              label={t('admin.availabilityLabel')}
              onLabel={t('common.available')}
              offLabel={t('admin.noAvailability')}
            />
            <AdminToggle
              checked={!!form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              label={t('admin.featuredLabel')}
              onLabel={t('admin.featuredLabel')}
              offLabel={t('admin.no')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}