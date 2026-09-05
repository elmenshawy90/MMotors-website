import { useEffect, useState } from 'react';
import Modal from '../../components/admin/Modal';
import AdminToggle from '../../components/admin/AdminToggle';
import { FiImage, FiUpload } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const EMPTY = {
  name_en: '',
  name_ar: '',
  address_en: '',
  address_ar: '',
  phone: '',
  mobile: '',
  email: '',
  working_hours_en: '',
  working_hours_ar: '',
  maps_url: '',
  latitude: '',
  longitude: '',
  image_url: '',
  is_active: true
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

export default function AdminBranchForm({ open, onClose, branch, onSave, busy }) {
  const { t } = useLanguage();
  const isEdit = !!branch;
  const [form, setForm] = useState({ ...EMPTY, ...(branch || {}) });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, ...(branch || {}) });
      setSelectedFile(null);
      setPreviewUrl('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, branch]);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name_en.trim() || !form.name_ar.trim()) {
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      data.append(key, String(value));
    });
    if (selectedFile) {
      data.append('image', selectedFile);
    }
    onSave(data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t('admin.editBranch') : t('admin.addBranch')}
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
            {t('admin.sectionBasicInfo')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.branchNameEn')} required>
              <input className="admin-input" dir="ltr" value={form.name_en} onChange={set('name_en')} />
            </Field>
            <Field label={t('admin.branchNameAr')} required>
              <input className="admin-input" dir="rtl" value={form.name_ar} onChange={set('name_ar')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">2</span>
            {t('admin.sectionAddress')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.addressEn')} full>
              <input className="admin-input" dir="ltr" value={form.address_en} onChange={set('address_en')} />
            </Field>
            <Field label={t('admin.addressAr')} full>
              <input className="admin-input" dir="rtl" value={form.address_ar} onChange={set('address_ar')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">3</span>
            {t('admin.sectionContactInfo')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.phoneLabel')}>
              <input className="admin-input" dir="ltr" value={form.phone} onChange={set('phone')} />
            </Field>
            <Field label={t('admin.mobileLabel')}>
              <input className="admin-input" dir="ltr" value={form.mobile} onChange={set('mobile')} />
            </Field>
            <Field label={t('admin.emailLabel')}>
              <input className="admin-input" dir="ltr" type="email" value={form.email} onChange={set('email')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">4</span>
            {t('admin.sectionWorkingHours')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.workingHoursEn')}>
              <input className="admin-input" dir="ltr" value={form.working_hours_en} onChange={set('working_hours_en')} />
            </Field>
            <Field label={t('admin.workingHoursAr')}>
              <input className="admin-input" dir="rtl" value={form.working_hours_ar} onChange={set('working_hours_ar')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">5</span>
            {t('admin.sectionLocation')}
          </h4>
          <div className="admin-form-grid">
            <Field label={t('admin.mapsUrlLabel')} full>
              <input className="admin-input" dir="ltr" value={form.maps_url} onChange={set('maps_url')} />
            </Field>
            <Field label={t('admin.latitudeLabel')}>
              <input className="admin-input" dir="ltr" type="number" step="any" value={form.latitude} onChange={set('latitude')} />
            </Field>
            <Field label={t('admin.longitudeLabel')}>
              <input className="admin-input" dir="ltr" type="number" step="any" value={form.longitude} onChange={set('longitude')} />
            </Field>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">6</span>
            {t('admin.sectionImage')}
          </h4>
          <div className="admin-image-upload">
            {previewUrl ? (
              <div className="admin-image-preview">
                <img src={previewUrl} alt={t('admin.previewLabel')} />
              </div>
            ) : form.image_url ? (
              <div className="admin-image-preview">
                <img src={form.image_url} alt={t('admin.previewLabel')} />
              </div>
            ) : (
              <div className="admin-image-preview">
                <FiImage aria-hidden="true" />
              </div>
            )}

            <div className="admin-field" style={{ minWidth: 220, flex: 1 }}>
              <label>{t('admin.uploadMore')}</label>
              <div className="admin-file-btn">
                <FiUpload aria-hidden="true" />
                <span>{selectedFile ? selectedFile.name : t('admin.uploadImages')}</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} />
              </div>
              {isEdit && <span className="admin-field-help">{t('admin.imageHint')}</span>}
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h4 className="admin-form-section-title">
            <span className="admin-form-section-num">7</span>
            {t('admin.sectionStatus')}
          </h4>
          <div className="admin-form-grid">
            <AdminToggle
              checked={!!form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              label={t('admin.isActive')}
              onLabel={t('admin.branchActive')}
              offLabel={t('admin.branchInactive')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
