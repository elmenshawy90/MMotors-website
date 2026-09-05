const CURRENCY = 'EGP';
const CURRENCY_AR = 'ج.م';

function formatNumber(num) {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function currencySymbol(language) {
  return language === 'ar' ? CURRENCY_AR : CURRENCY;
}

export function formatPrice(price, language = 'en') {
  const num = Number(price);
  if (Number.isNaN(num)) return language === 'ar' ? `0 ${CURRENCY_AR}` : `${CURRENCY} 0`;
  const formatted = formatNumber(num);
  if (language === 'ar') {
    return `${formatted} ${CURRENCY_AR}`;
  }
  return `${CURRENCY} ${formatted}`;
}

export function formatMileage(mileage) {
  const num = Number(mileage);
  if (!mileage || Number.isNaN(num)) return '—';
  return num.toLocaleString('en-US');
}

export function carDescription(car, language) {
  if (language === 'ar' && car.description_ar) return car.description_ar;
  if (car.description) return car.description;
  if (car.description_ar) return car.description_ar;
  return '';
}

export function carImage(car) {
  return car.image_url || null;
}

export function formatDateTime(value, language = 'en') {
  if (!value) return '—';
  let date;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return date.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(date);
  }
}

export function formatDate(value, language = 'en') {
  if (!value) return '—';
  let date;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return String(date);
  }
}