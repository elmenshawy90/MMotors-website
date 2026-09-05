import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getCars, createAdminCar, updateAdminCar, deleteAdminCar } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import CarPlaceholder from '../../components/CarPlaceholder';
import AdminCarForm from '../../components/admin/AdminCarForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { formatPrice } from '../../utils/format';

export default function AdminCars() {
  const { t, language } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [availability, setAvailability] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');

  const load = () => {
    setLoading(true);
    setError('');
    getCars()
      .then((res) => setCars(res.data.data))
      .catch(() => setError(t('admin.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand).filter(Boolean))].sort(), [cars]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cars.filter((c) => {
      if (q && !`${c.brand} ${c.model}`.toLowerCase().includes(q)) return false;
      if (brand && c.brand !== brand) return false;
      if (availability === 'available' && !c.availability) return false;
      if (availability === 'unavailable' && c.availability) return false;
      return true;
    });
  }, [cars, search, brand, availability]);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (car) => {
    setEditing(car);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (busy) return;
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = (formData) => {
    setBusy(true);
    const req = editing ? updateAdminCar(editing.id, formData) : createAdminCar(formData);
    req
      .then((res) => {
        closeForm();
        showToast(editing ? t('admin.carUpdated') : t('admin.carCreated'));
        load();
      })
      .catch((err) => {
        setToast(err.response?.data?.message || t('admin.error'));
        setToastType('error');
        window.setTimeout(() => setToast(''), 4000);
      })
      .finally(() => setBusy(false));
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    deleteAdminCar(toDelete.id)
      .then(() => {
        showToast(t('admin.carDeleted'));
        setToDelete(null);
        load();
      })
      .catch((err) => {
        setToast(err.response?.data?.message || t('admin.error'));
        setToastType('error');
        window.setTimeout(() => setToast(''), 5000);
        setToDelete(null);
      })
      .finally(() => setDeleting(false));
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.carsPageTitle')}</h1>
          <p className="admin-page-subtitle">{t('admin.carsSubtitle')}</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openAdd}>
          <FiPlus aria-hidden="true" />
          {t('admin.addCar')}
        </button>
      </div>

      {toast && <div className={`admin-alert admin-alert--${toastType}`}>{toast}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-toolbar">
        <div className="admin-search" style={{ flex: 1, minWidth: 220 }}>
          <FiSearch className="admin-search-icon" aria-hidden="true" />
          <input
            className="admin-input"
            style={{ paddingInlineStart: 38 }}
            placeholder={t('admin.searchCars')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-select" style={{ width: 200 }} value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">{t('admin.filterBrand')}</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className="admin-select" style={{ width: 200 }} value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="">{t('admin.filterAvailability')}</option>
          <option value="available">{t('admin.onlyAvailable')}</option>
          <option value="unavailable">{t('admin.noAvailability')}</option>
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">{t('admin.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">{t('admin.noCars')}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>{t('admin.brandLabel')} / {t('admin.modelLabel')}</th>
                  <th>{t('admin.yearLabel')}</th>
                  <th>{t('admin.priceLabel')}</th>
                  <th>{t('admin.fuelTypeLabel')}</th>
                  <th>{t('admin.availabilityLabel')}</th>
                  <th>{t('admin.featuredLabel')}</th>
                  <th className="admin-row-actions">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((car) => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>
                      <div className="admin-thumb-wrap">
                        {car.image_url ? (
                          <img src={car.image_url} alt={`${car.brand} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <CarPlaceholder color={car.color} brand={car.brand} model={car.model} />
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="admin-cell-strong">{car.brand} {car.model}</span>
                      <span className="admin-cell-sub">{car.color || ''}</span>
                    </td>
                    <td>{car.year}</td>
                    <td><span className="admin-cell-strong">{formatPrice(car.price, language)}</span></td>
                    <td>{car.fuel_type}</td>
                    <td>
                      {car.availability ? (
                        <span className="admin-badge admin-badge--available">{t('common.available')}</span>
                      ) : (
                        <span className="admin-badge admin-badge--unavailable">{t('admin.noAvailability')}</span>
                      )}
                    </td>
                    <td>
                      {car.featured ? (
                        <span className="admin-badge admin-badge--featured">{t('admin.featuredLabel')}</span>
                      ) : (
                        <span className="admin-badge admin-badge--unavailable" style={{ background: 'var(--light)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-btn" title="Edit" onClick={() => openEdit(car)}>
                          <FiEdit2 aria-hidden="true" />
                        </button>
                        <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Delete" onClick={() => setToDelete(car)}>
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminCarForm
        open={formOpen}
        onClose={closeForm}
        car={editing}
        onSave={handleSave}
        busy={busy}
      />

      <ConfirmDialog
        open={!!toDelete}
        title={t('admin.deleteCarTitle')}
        message={t('admin.deleteCarMessage')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </>
  );
}