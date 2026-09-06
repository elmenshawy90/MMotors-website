import { ShieldCheck, Wrench, Banknote, Truck } from "lucide-react";

const points = [
  { icon: ShieldCheck, title: "Nissan-certified, or it doesn't leave", desc: "27 factory-trained techs, recertified yearly in Dubai. Genuine parts with QR traceability." },
  { icon: Banknote, title: "Quote before wrench", desc: "Video + photo quote on WhatsApp. You approve on your phone. No approval, no work." },
  { icon: Wrench, title: "Fix-first-visit 98%", desc: "Central parts warehouse in 6th of October = parts on shelf, not on order from Japan." },
  { icon: Truck, title: "Free pickup & mobile vans", desc: "We collect in Cairo & Giza, plus 4 mobile service vans for oil + brakes at your office." },
];

export default function WhyUs() {
  return (
    <section id="why" className="py-20 lg:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">03 — Why Modern Motors</p>
        <h2 className="display-condensed font-black text-5xl sm:text-6xl mt-3 leading-[0.95]">
          Not a workshop.<br />A <span className="gold-gradient-text">pit crew.</span>
        </h2>
        <p className="mt-5 text-muted leading-relaxed max-w-md">
          We run the service center like a race team: timed bays, torque-logged bolts,
          and an advisor who knows your car by plate number — not ticket number.
        </p>
        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-steel to-carbon p-6 flex items-center gap-5">
          <div className="display-condensed text-6xl font-black text-dune">A+</div>
          <div className="text-sm">
            <p className="font-bold">Nissan MENA Service Excellence 2024 & 2025</p>
            <p className="text-muted mt-1">Top CSI score in Egypt — 96.4/100. Audited, not claimed.</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {points.map((p) => (
          <div key={p.title} className="rounded-3xl border border-white/10 bg-carbon p-6 hover:border-dune/40 transition-colors">
            <p.icon size={22} className="text-dune" />
            <h3 className="mt-4 font-bold leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
