import { useEffect, useMemo, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { getAdminBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/admin/Modal';
import { formatDate, formatDateTime } from '../../utils/format';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookings() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [details, setDetails] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');

  const load = () => {
    setLoading(true);
    setError('');
    getAdminBookings()
      .then((res) => setBookings(res.data.data))
      .catch(() => setError(t('admin.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = (booking, status) => {
    if (status === booking.status) return;
    updateBookingStatus(booking.id, status)
      .then(() => {
        showToast(t('admin.bookingStatusUpdated'));
        load();
      })
      .catch(() => showToast(t('admin.error'), 'error'));
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    deleteBooking(toDelete.id)
      .then(() => {
        showToast(t('admin.bookingDeleted'));
        setToDelete(null);
        load();
      })
      .catch(() => {
        showToast(t('admin.error'), 'error');
        setToDelete(null);
      })
      .finally(() => setDeleting(false));
  };

  const Detail = details && (
    <Modal open={!!details} onClose={() => setDetails(null)} title={t('admin.bookingDetails')} size="narrow">
      <div style={{ display: 'grid', gap: 14, fontSize: '0.92rem', color: 'var(--text)' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.customerName')}
          </div>
          <strong>{details.customer_name}</strong>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.phone')}
          </div>
          {details.phone_number}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.car')}
          </div>
          {details.model ? `${details.brand} ${details.model}` : t('admin.noCar')}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.serviceType')}
          </div>
          {details.service_type}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.preferredDate')} / {t('admin.preferredTime')}
          </div>
          {formatDate(details.preferred_date)} — {details.preferred_time}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.status')}
          </div>
          <StatusBadge status={details.status} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.createdAt')}
          </div>
          {formatDateTime(details.created_at)}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.notes')}
          </div>
          {details.notes || '—'}
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.bookingsTitle')}</h1>
          <p className="admin-page-subtitle">{t('admin.bookingsSubtitle')}</p>
        </div>
      </div>

      {toast && <div className={`admin-alert admin-alert--${toastType}`}>{toast}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-filter-chips" style={{ marginBottom: 20 }}>
        <button type="button" className={`admin-chip ${statusFilter === '' ? 'active' : ''}`} onClick={() => setStatusFilter('')}>
          {t('admin.allStatuses')}
        </button>
        {STATUSES.map((s) => (
          <button key={s} type="button" className={`admin-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
            {t(`admin.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">{t('admin.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">{t('admin.noBookings')}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table--bookings">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('admin.customerName')}</th>
                  <th>{t('admin.phone')}</th>
                  <th>{t('admin.car')}</th>
                  <th>{t('admin.serviceType')}</th>
                  <th>{t('admin.preferredDate')}</th>
                  <th>{t('admin.preferredTime')}</th>
                  <th>{t('admin.status')}</th>
                  <th className="admin-row-actions">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td><span className="admin-cell-strong">{b.customer_name}</span></td>
                    <td>{b.phone_number}</td>
                    <td>{b.model ? `${b.brand} ${b.model}` : <span className="admin-cell-sub">{t('admin.noCar')}</span>}</td>
                    <td>{b.service_type}</td>
                    <td>{formatDate(b.preferred_date)}</td>
                    <td>{b.preferred_time}</td>
                    <td>
                      <select
                        className={`admin-status-select is-${b.status}`}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b, e.target.value)}
                        title={t('admin.changeStatus')}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{t(`admin.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-btn" onClick={() => setDetails(b)} aria-label={t('admin.bookingDetails')}>
                          <FiEye aria-hidden="true" />
                        </button>
                        <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => setToDelete(b)} aria-label={t('admin.delete')}>
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

      {Detail}

      <ConfirmDialog
        open={!!toDelete}
        title={t('admin.bookingDeleteTitle')}
        message={t('admin.bookingDeleteMessage')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </>
  );
}