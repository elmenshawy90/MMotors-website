import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCar, FaCheckCircle, FaStar, FaClipboardList, FaClock,
  FaCrown, FaSignOutAlt, FaArrowRight, FaShoppingCart
} from 'react-icons/fa';
import { getAdminStats, getAdminBookings } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/admin/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/format';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAdminStats(), getAdminBookings()])
      .then(([sRes, bRes]) => {
        if (cancelled) return;
        setStats(sRes.data.data);
        setBookings(bRes.data.data.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setError(t('admin.error'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [getAdminStats, getAdminBookings, t]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { key: 'total_cars', label: t('admin.totalCars'), icon: FaCar },
      { key: 'available_cars', label: t('admin.availableCars'), icon: FaCheckCircle },
      { key: 'featured_cars', label: t('admin.featuredCars'), icon: FaStar },
      { key: 'total_bookings', label: t('admin.totalBookings'), icon: FaClipboardList },
      { key: 'pending_bookings', label: t('admin.pendingBookings'), icon: FaClock },
      { key: 'confirmed_bookings', label: t('admin.confirmedBookings'), icon: FaSignOutAlt },
      { key: 'completed_bookings', label: t('admin.completedBookings'), icon: FaCrown },
      { key: 'new_purchase_requests', label: t('admin.newPurchaseRequests'), icon: FaShoppingCart }
    ].map(({ key, label, icon: Icon }) => ({ key, label, value: stats[key] ?? 0, icon: Icon }));
  }, [stats, t]);

  if (loading) {
    return <div className="admin-empty">{t('admin.loading')}</div>;
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{t('admin.dashboard')}</h1>
          <p className="admin-page-subtitle">{t('admin.welcome')}</p>
        </div>
        <Link to="/admin/cars" className="admin-btn admin-btn--primary">
          {t('admin.manageCars')}<FaArrowRight aria-hidden="true" />
        </Link>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="admin-stat-card">
              <div className="admin-stat-icon">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ padding: '20px 20px 0' }}>
          <div>
            <h2 className="admin-card-title">{t('admin.recentBookings')}</h2>
            <p className="admin-card-subtitle">{t('admin.bookingDetails')}</p>
          </div>
          <Link to="/admin/bookings" className="admin-btn admin-btn--ghost admin-btn--sm">
            {t('admin.viewAllBookings')}
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="admin-empty">{t('admin.noBookings')}</div>
        ) : (
          <div className="admin-table-wrap" style={{ padding: '14px 0 0' }}>
            <table className="admin-table admin-table--bookings">
              <thead>
                <tr>
                  <th>{t('admin.customerName')}</th>
                  <th>{t('admin.serviceType')}</th>
                  <th>{t('admin.car')}</th>
                  <th>{t('admin.preferredDate')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('admin.createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="admin-cell-strong">{b.customer_name}</span>
                      <span className="admin-cell-sub">{b.phone_number}</span>
                    </td>
                    <td>{b.service_type}</td>
                    <td>{b.model ? `${b.brand} ${b.model}` : t('admin.noCar')}</td>
                    <td>{formatDate(b.preferred_date)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>{formatDateTime(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}