import { Check } from "lucide-react";

const plans = [
  {
    name: "Essential",
    price: "EGP 6,900",
    per: "/ year",
    desc: "For low-mileage city cars",
    features: ["2x oil + filter (genuine)", "Free 172-pt inspection", "Free wash each visit", "10% off brakes & tires", "WhatsApp priority line"],
    featured: false,
  },
  {
    name: "Plus",
    price: "EGP 14,500",
    per: "/ year",
    desc: "Most popular — Sunny / Juke / Qashqai",
    features: ["4x oil + filter + rotation", "Free A/C + battery check", "Free pickup & delivery (4x)", "20% off parts & labor", "Free alignment yearly", "Roadside assistance Egypt-wide"],
    featured: true,
  },
  {
    name: "Signature",
    price: "EGP 29,000",
    per: "/ year",
    desc: "Patrol / X-Trail / fleet",
    features: ["Everything in Plus", "Dedicated advisor", "Mobile van at your door", "Body & paint priority", "Free courtesy car", "Extended warranty 1 yr"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="plans" className="py-20 lg:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune text-center">04 — Care Plans</p>
      <h2 className="display-condensed font-black text-5xl sm:text-6xl text-center mt-3">Maintenance, <span className="text-stroke">prepaid & painless.</span></h2>
      <p className="text-center text-muted mt-4 max-w-lg mx-auto text-sm sm:text-base">Lock 2026 prices. One payment, zero surprise invoices. Transferable if you sell the car.</p>

      <div className="mt-12 grid md:grid-cols-3 gap-4 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-7 border flex flex-col ${
              p.featured
                ? "bg-gradient-to-b from-nissan/20 to-carbon border-nissan/40 red-glow scale-[1.02]"
                : "bg-carbon border-white/10"
            }`}
          >
            {p.featured && (
              <span className="w-fit font-hud text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-nissan text-white mb-4">
                Most chosen
              </span>
            )}
            <h3 className="font-display font-bold uppercase tracking-wide">{p.name}</h3>
            <p className="text-muted text-sm mt-1">{p.desc}</p>
            <p className="mt-4"><span className="display-condensed text-5xl font-black">{p.price}</span><span className="text-muted font-hud text-xs"> {p.per}</span></p>
            <ul className="mt-6 space-y-3 text-sm flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-platinum/85"><Check size={16} className="text-emerald-400 shrink-0 mt-0.5" /> {f}</li>
              ))}
            </ul>
            <a
              href="#booking"
              className={`mt-7 text-center px-6 py-3.5 rounded-full font-bold text-sm transition-colors ${
                p.featured ? "bg-nissan text-white hover:bg-red-600" : "border border-white/15 hover:border-dune"
              }`}
            >
              Choose {p.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
