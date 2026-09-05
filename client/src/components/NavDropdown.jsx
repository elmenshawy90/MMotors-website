import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function NavDropdown({ label, active = false, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div
      ref={ref}
      className={`nav-dropdown ${open ? 'open' : ''}`}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`nav-link nav-dropdown-toggle ${active ? 'active' : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <FiChevronDown className="nav-dropdown-caret" aria-hidden="true" />
      </button>
      <div className="nav-dropdown-menu">
        <div className="nav-dropdown-pointer" />
        {children}
      </div>
    </div>
  );
}