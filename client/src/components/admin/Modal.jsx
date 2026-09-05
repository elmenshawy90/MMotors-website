import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

export default function Modal({ open, onClose, title, children, footer, size = 'default' }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === 'narrow' ? 'admin-modal--narrow' : size === 'wide' ? 'admin-modal--wide' : '';

  return (
    <div className="admin-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`admin-modal ${sizeClass}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label={t('admin.close')}>
            <FiX />
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}