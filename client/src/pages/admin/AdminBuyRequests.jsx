import { useEffect, useMemo, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { getAdminBuyRequests, updateBuyRequestStatus, deleteBuyRequest } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/admin/Modal';
import { formatDateTime } from '../../utils/format';

const STATUSES = ['new', 'contacted', 'completed', 'cancelled'];

export default function AdminBuyRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
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
    getAdminBuyRequests()
      .then((res) => setRequests(res.data.data))
      .catch(() => setError(t('admin.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = (req, status) => {
    if (status === req.status) return;
    updateBuyRequestStatus(req.id, status)
      .then(() => {
        showToast(t('admin.buyRequestStatusUpdated'));
        load();
      })
      .catch(() => showToast(t('admin.error'), 'error'));
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    deleteBuyRequest(toDelete.id)
      .then(() => {
        showToast(t('admin.buyRequestDeleted'));
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
    <Modal open={!!details} onClose={() => setDetails(null)} title={t('admin.buyRequestDetails')} size="narrow">
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
          <span dir="ltr">{details.phone_number}</span>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.email')}
          </div>
          {details.email ? <span dir="ltr">{details.email}</span> : <span className="admin-cell-sub">{t('admin.noEmail')}</span>}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.preferredBrand')}
          </div>
          {details.preferred_brand || '—'}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.preferredModel')}
          </div>
          {details.preferred_model || '—'}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.preferredColor')}
          </div>
          {details.preferred_color || '—'}
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            {t('admin.budget')}
          </div>
          <span dir="ltr">{details.budget != null ? Number(details.budget).toLocaleString() : t('admin.noBudget')}</span>
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

  const statusLabelMap = {
    new: 'buyStatusNew',
    contacted: 'buyStatusContacted',
    completed: 'buyStatusCompleted',
    cancelled: 'buyStatusCancelled'
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.buyRequestsTitle')}</h1>
          <p className="admin-page-subtitle">{t('admin.buyRequestsSubtitle')}</p>
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
            {t(`admin.${statusLabelMap[s]}`)}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">{t('admin.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">{t('admin.noBuyRequests')}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table--bookings">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('admin.customerName')}</th>
                  <th>{t('admin.phone')}</th>
                  <th>{t('admin.email')}</th>
                  <th>{t('admin.preferredBrand')}</th>
                  <th>{t('admin.preferredModel')}</th>
                  <th>{t('admin.preferredColor')}</th>
                  <th>{t('admin.budget')}</th>
                  <th>{t('admin.createdAt')}</th>
                  <th>{t('admin.status')}</th>
                  <th className="admin-row-actions">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td><span className="admin-cell-strong">{r.customer_name}</span></td>
                    <td><span dir="ltr">{r.phone_number}</span></td>
                    <td>{r.email ? <span dir="ltr">{r.email}</span> : <span className="admin-cell-sub">{t('admin.noEmail')}</span>}</td>
                    <td>{r.preferred_brand || '—'}</td>
                    <td>{r.preferred_model || '—'}</td>
                    <td>{r.preferred_color || '—'}</td>
                    <td><span dir="ltr">{r.budget != null ? Number(r.budget).toLocaleString() : t('admin.noBudget')}</span></td>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td>
                      <select
                        className={`admin-status-select is-${r.status}`}
                        value={r.status}
                        onChange={(e) => handleStatusChange(r, e.target.value)}
                        title={t('admin.changeStatus')}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{t(`admin.${statusLabelMap[s]}`)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-btn" onClick={() => setDetails(r)} aria-label={t('admin.buyRequestDetails')}>
                          <FiEye aria-hidden="true" />
                        </button>
                        <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => setToDelete(r)} aria-label={t('admin.delete')}>
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
        title={t('admin.buyRequestDeleteTitle')}
        message={t('admin.buyRequestDeleteMessage')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </>
  );
}