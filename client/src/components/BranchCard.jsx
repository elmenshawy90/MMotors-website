import { useLanguage } from '../context/LanguageContext';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSmartphone } from 'react-icons/fi';

export default function BranchCard({ branch }) {
  const { t, language } = useLanguage();
  const name = language === 'ar' ? branch.name_ar : branch.name_en;
  const address = language === 'ar' ? branch.address_ar : branch.address_en;
  const workingHours = language === 'ar' ? branch.working_hours_ar : branch.working_hours_en;

  let mapsUrl = branch.maps_url;
  if (!mapsUrl) {
    const query = language === 'ar' ? (branch.address_ar || address) : (branch.address_en || address);
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return (
    <article className="branch-card">
      {branch.image_url && (
        <div className="branch-card-image">
          <img src={branch.image_url} alt={name} />
        </div>
      )}
      <h3 className="branch-card-title">{name}</h3>
      <ul className="branch-card-list">
        <li>
          <FiMapPin aria-hidden="true" />
          <span>{address || '—'}</span>
        </li>
        {branch.phone && (
          <li>
            <FiPhone aria-hidden="true" />
            <a href={`tel:${branch.phone}`} dir="ltr">{branch.phone}</a>
          </li>
        )}
        {branch.mobile && (
          <li>
            <FiSmartphone aria-hidden="true" />
            <a href={`tel:${branch.mobile}`} dir="ltr">{branch.mobile}</a>
          </li>
        )}
        {branch.email && (
          <li>
            <FiMail aria-hidden="true" />
            <a href={`mailto:${branch.email}`} dir="ltr">{branch.email}</a>
          </li>
        )}
        {(branch.working_hours_en || branch.working_hours_ar) && (
          <li>
            <FiClock aria-hidden="true" />
            <span>{workingHours || '—'}</span>
          </li>
        )}
      </ul>
      <div className="branch-card-actions">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
          {t('branches.viewOnMap')}
        </a>
        {branch.phone && (
          <a href={`tel:${branch.phone}`} className="btn btn-gold btn-sm">
            {t('branches.call')}
          </a>
        )}
      </div>
    </article>
  );
}
