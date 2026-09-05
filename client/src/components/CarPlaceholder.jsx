import { FaCar } from 'react-icons/fa';

const PALETTES = {
  Silver: ['#c2c6ce', '#565a62'],
  White: ['#e9ebef', '#7c818a'],
  Black: ['#40444b', '#0b0b0c'],
  Blue: ['#3b6fbf', '#101f3d'],
  Red: ['#c23a32', '#350d0a'],
  Gray: ['#8d9198', '#2a2c31'],
  Green: ['#3e8a52', '#102f1a'],
  Orange: ['#d97a35', '#54270e'],
  Brown: ['#8a6a45', '#392a18'],
  Purple: ['#7a5fc0', '#261a45'],
  Yellow: ['#d2bf45', '#453e10'],
  Navy: ['#3a4a8a', '#121a33']
};

const DEFAULT_GRADIENT = ['#A6193C', '#1C1C1C'];

function luminosity(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function CarPlaceholder({ color, brand, model, variant = 'card' }) {
  const stops = PALETTES[color] || DEFAULT_GRADIENT;
  const light = luminosity(stops[0]) > 0.6;

  return (
    <div
      className={`car-ph ${light ? 'car-ph--light' : 'car-ph--dark'} car-ph--${variant}`}
      style={{ background: `linear-gradient(155deg, ${stops[0]} 0%, ${stops[1]} 82%)` }}
    >
      <span className="car-ph-glow" aria-hidden="true" />
      <FaCar aria-hidden="true" className="car-ph-icon" />
      <span className="car-ph-label">{brand} {model}</span>
    </div>
  );
}