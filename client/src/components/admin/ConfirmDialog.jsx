import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';
import { useLanguage } from '../../context/LanguageContext';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, busy }) {
  const { t } = useLanguage();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="narrow"
      footer={
        <>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onCancel} disabled={busy}>
            {t('admin.cancel')}
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={onConfirm} disabled={busy}>
            {busy ? t('admin.saving') : t('admin.confirm')}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: '#FDECEC',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0
          }}
        >
          <FiAlertTriangle />
        </div>
        <p style={{ color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.6 }}>{message}</p>
      </div>
    </Modal>
  );
}