import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const close = () => setMenuOpen(false);

  return (
    <div className="admin-shell">
      {menuOpen && <div className="admin-overlay" onClick={close} />}
      <AdminSidebar open={menuOpen} onCloseMenu={close} />
      <div className="admin-main">
        <AdminHeader onMenuClick={() => setMenuOpen((v) => !v)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}