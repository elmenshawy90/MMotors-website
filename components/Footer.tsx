import { Wrench, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nissan to-nissan-dark grid place-items-center">
              <Wrench size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="font-black tracking-tight text-lg">MODERN<span className="text-dune"> MOTORS</span></p>
              <p className="font-hud text-[10px] tracking-[0.3em] text-muted uppercase">Nissan • Egypt since 1989</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted max-w-sm leading-relaxed">
            Authorized Nissan sales & service. New cars, genuine parts, factory maintenance —
            with transparent video quotes and Egypt-wide roadside cover.
          </p>
          <a href="tel:19900" className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-sm font-bold hover:border-dune">
            <Phone size={14} /> Hotline 19900
          </a>
        </div>
        <div>
          <p className="font-hud text-[11px] uppercase tracking-[0.25em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {["Showroom", "Services", "Care Plans", "Reviews", "Book Service"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase().split(" ")[0] === "showroom" ? "models" : l.toLowerCase().split(" ")[0] === "care" ? "plans" : l.toLowerCase().split(" ")[0] === "book" ? "booking" : l.toLowerCase()}`} className="hover:text-dune-light text-platinum/80">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-hud text-[11px] uppercase tracking-[0.25em] text-muted">Hours</p>
          <ul className="mt-4 space-y-2.5 text-sm text-platinum/80">
            <li>Sat – Thu: 8:00 — 22:00</li>
            <li>Friday: 13:00 — 22:00</li>
            <li>Roadside 24/7: 19900</li>
            <li className="font-hud text-[11px] text-muted">CR 123456 • VAT 987-654-321</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row justify-between gap-2 font-hud text-[11px] uppercase tracking-widest text-muted">
          <span>© 2026 Modern Motors Egypt. All rights reserved.</span>
          <span>Built with Next.js • Nissan genuine parts only</span>
        </div>
      </div>
    </footer>
  );
}
