import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

const branches = [
  { city: "New Cairo", addr: "90 Road, South Teseen, New Cairo", hrs: "Daily 8:00 – 22:00", phone: "19900" },
  { city: "6th of October", addr: "Industrial Zone B4, Giza", hrs: "Daily 8:00 – 22:00", phone: "19900" },
  { city: "Alexandria", addr: "Smouha, Victor Emanuel Sq.", hrs: "Daily 9:00 – 21:00", phone: "19900" },
];

export default function Contact() {
  return (
    <section id="contact" className="pb-20 lg:pb-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div>
          <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">07 — Visit us</p>
          <h2 className="display-condensed font-black text-5xl sm:text-6xl mt-3">Three doors.<br />One standard.</h2>
          <a href="https://wa.me/201000000000" className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 text-asphalt font-bold text-sm hover:bg-emerald-400 transition-colors">
            <MessageCircle size={16} /> WhatsApp Service Advisor
          </a>
          <p className="mt-4 text-muted text-sm">Average reply: 4 minutes. Send your plate, get your history.</p>
        </div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div key={b.city} className="rounded-3xl border border-white/10 bg-carbon p-5">
              <p className="font-display font-bold uppercase">{b.city}</p>
              <p className="mt-3 text-xs text-muted leading-relaxed flex gap-1.5"><MapPin size={13} className="shrink-0 mt-0.5 text-dune" /> {b.addr}</p>
              <p className="mt-2 text-xs text-muted flex gap-1.5"><Clock size={13} className="shrink-0 mt-0.5 text-dune" /> {b.hrs}</p>
              <a href="tel:19900" className="mt-4 flex items-center gap-1.5 text-sm font-bold text-dune"><Phone size={13} /> {b.phone}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
