import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { FaCar, FaClipboardList, FaEdit, FaSignOutAlt, FaHome, FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa';

export default function AdminSidebar({ open, onCloseMenu }) {
  const { t } = useLanguage();
  const { logout } = useAdminAuth();

  const navItems = [
    { to: '/admin', label: t('admin.dashboard'), icon: FaHome, end: true },
    { to: '/admin/cars', label: t('admin.cars'), icon: FaCar },
    { to: '/admin/buy-requests', label: t('admin.buyRequests'), icon: FaShoppingCart },
    { to: '/admin/bookings', label: t('admin.bookings'), icon: FaClipboardList },
    { to: '/admin/branches', label: t('admin.branches'), icon: FaMapMarkerAlt },
    { to: '/admin/content', label: t('admin.content'), icon: FaEdit }
  ];

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-brand">
        <img src="/logo.png" alt={t('brandName')} className="admin-logo" />
        <span className="admin-sidebar-brand-text">
          <span className="admin-sidebar-brand-name">{t('brandName')}</span>
          <span className="admin-sidebar-brand-sub">{t('admin.panelTitle')}</span>
        </span>
      </div>

      <nav className="admin-nav" aria-label={t('admin.panelTitle')}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
              onClick={onCloseMenu}
            >
              <Icon aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button type="button" className="admin-nav-link" onClick={logout}>
          <FaSignOutAlt aria-hidden="true" />
          {t('admin.logout')}
        </button>
      </div>
    </aside>
  );
}