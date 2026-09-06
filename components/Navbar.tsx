"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin, Wrench } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Models", href: "#models" },
  { label: "Why Us", href: "#why" },
  { label: "Plans", href: "#plans" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-asphalt/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      {/* top utility bar */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-2 text-[11px] font-hud tracking-widest uppercase text-muted border-b border-white/5">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Service open today 8:00 — 22:00 • 3 branches
        </span>
        <span className="flex items-center gap-5">
          <span className="flex items-center gap-1.5"><MapPin size={12} /> Cairo • Giza • Alex</span>
          <a href="tel:19900" className="flex items-center gap-1.5 text-dune hover:text-dune-light"><Phone size={12} /> 19900</a>
        </span>
      </div>

      <nav className="flex items-center justify-between px-5 sm:px-6 lg:px-10 h-16 lg:h-[72px]">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nissan to-nissan-dark grid place-items-center red-glow">
            <Wrench size={18} className="text-white" />
          </div>
          <div className="leading-none">
            <p className="font-display font-900 font-black tracking-tight text-lg">MODERN<span className="text-dune"> MOTORS</span></p>
            <p className="font-hud text-[10px] tracking-[0.3em] text-muted uppercase">Nissan • Egypt</p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-8 text-sm text-platinum/80">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-dune-light transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#booking"
            className="px-5 py-2.5 rounded-full bg-platinum text-asphalt text-sm font-bold hover:bg-dune-light transition-colors"
          >
            Book Service
          </a>
          <a
            href="#models"
            className="px-5 py-2.5 rounded-full border border-white/15 text-sm font-semibold hover:border-dune hover:text-dune-light transition-colors"
          >
            Explore Cars
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg border border-white/10"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-carbon/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-lg font-semibold py-1">
              {l.label}
            </a>
          ))}
          <a href="#booking" onClick={() => setOpen(false)} className="mt-2 px-5 py-3 rounded-xl bg-nissan text-white text-center font-bold">
            Book Service — 19900
          </a>
        </div>
      )}
    </header>
  );
}
