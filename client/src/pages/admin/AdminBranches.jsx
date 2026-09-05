import { useEffect, useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import { getAdminBranches, createAdminBranch, updateAdminBranch, deleteAdminBranch, toggleBranchActive } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import AdminBranchForm from '../../components/admin/AdminBranchForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminBranches() {
  const { t } = useLanguage();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
    getAdminBranches()
      .then((res) => setBranches(res.data.data))
      .catch(() => setError(t('admin.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return branches.filter((b) => {
      if (q) {
        const haystack = `${b.name_en} ${b.name_ar} ${b.address_en || ''} ${b.address_ar || ''} ${b.phone || ''} ${b.mobile || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter === 'active' && !b.is_active) return false;
      if (statusFilter === 'inactive' && b.is_active) return false;
      return true;
    });
  }, [branches, search, statusFilter]);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (branch) => {
    setEditing(branch);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (busy) return;
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = (formData) => {
    setBusy(true);
    const req = editing ? updateAdminBranch(editing.id, formData) : createAdminBranch(formData);
    req
      .then((res) => {
        closeForm();
        showToast(editing ? t('admin.branchUpdated') : t('admin.branchCreated'));
        load();
      })
      .catch((err) => {
        setToast(err.response?.data?.message || t('admin.error'));
        setToastType('error');
        window.setTimeout(() => setToast(''), 4000);
      })
      .finally(() => setBusy(false));
  };

  const handleToggle = (branch) => {
    toggleBranchActive(branch.id)
      .then(() => load())
      .catch(() => showToast(t('admin.error'), 'error'));
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    deleteAdminBranch(toDelete.id)
      .then(() => {
        showToast(t('admin.branchDeleted'));
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

  const displayName = (b) => ({ en: b.name_en, ar: b.name_ar });
  const displayAddress = (b) => ({ en: b.address_en, ar: b.address_ar });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.branchesPageTitle')}</h1>
          <p className="admin-page-subtitle">{t('admin.branchesSubtitle')}</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openAdd}>
          <FiPlus aria-hidden="true" />
          {t('admin.addBranch')}
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
            placeholder={t('admin.searchBranches')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-select" style={{ width: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">{t('admin.allBranches')}</option>
          <option value="active">{t('admin.onlyActive')}</option>
          <option value="inactive">{t('admin.inactiveLabel')}</option>
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">{t('admin.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">{t('admin.noBranches')}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>{t('admin.branchNameEn')}</th>
                  <th>{t('admin.addressEn')}</th>
                  <th>{t('admin.phoneLabel')}</th>
                  <th>{t('admin.status')}</th>
                  <th className="admin-row-actions">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const name = displayName(b);
                  const address = displayAddress(b);
                  return (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>
                        <div className="admin-thumb-wrap">
                          {b.image_url ? (
                            <img src={b.image_url} alt={name.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FiImage aria-hidden="true" style={{ fontSize: 26, color: 'var(--text-muted)' }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="admin-cell-strong">{name.en}</span>
                        <span className="admin-cell-sub" dir="rtl">{name.ar}</span>
                      </td>
                      <td>
                        {address.en || '—'}
                        {address.ar && <span className="admin-cell-sub" dir="rtl">{address.ar}</span>}
                      </td>
                      <td>{b.phone || '—'}</td>
                      <td>
                        {b.is_active ? (
                          <span className="admin-badge admin-badge--available">{t('admin.branchActive')}</span>
                        ) : (
                          <span className="admin-badge admin-badge--unavailable">{t('admin.branchInactive')}</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className={`admin-icon-btn ${b.is_active ? '' : 'admin-icon-btn--danger'}`}
                            title={b.is_active ? t('admin.branchInactive') : t('admin.branchActive')}
                            onClick={() => handleToggle(b)}
                          >
                            {b.is_active ? '●' : '○'}
                          </button>
                          <button type="button" className="admin-icon-btn" title="Edit" onClick={() => openEdit(b)}>
                            <FiEdit2 aria-hidden="true" />
                          </button>
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Delete" onClick={() => setToDelete(b)}>
                            <FiTrash2 aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminBranchForm
        open={formOpen}
        onClose={closeForm}
        branch={editing}
        onSave={handleSave}
        busy={busy}
      />

      <ConfirmDialog
        open={!!toDelete}
        title={t('admin.deleteBranchTitle')}
        message={t('admin.deleteBranchMessage')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </>
  );
}
