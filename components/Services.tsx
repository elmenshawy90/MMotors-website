import { ScanLine, Droplets, Disc3, Snowflake, CarFront, BatteryCharging, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data";

const icons: Record<string, typeof ScanLine> = {
  scan: ScanLine,
  oil: Droplets,
  brake: Disc3,
  ac: Snowflake,
  body: CarFront,
  battery: BatteryCharging,
};

export default function Services() {
  return (
    <section id="services" className="relative py-20 lg:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">02 — Service Center</p>
          <h2 className="display-condensed font-black text-5xl sm:text-6xl lg:text-7xl mt-3">
            Pit crew for<br />your <span className="text-stroke">daily drive.</span>
          </h2>
        </div>
        <p className="max-w-sm text-muted leading-relaxed text-sm sm:text-base">
          Every job starts with a CONSULT scan, ends with a road test + wash.
          Transparent pricing on screen before we lift a wrench.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => {
          const Icon = icons[s.icon] ?? ScanLine;
          return (
            <a
              key={s.title}
              href="#booking"
              className="card-sheen group rounded-3xl border border-white/10 bg-carbon p-6 hover:border-dune/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-steel border border-white/10 grid place-items-center group-hover:bg-nissan group-hover:border-nissan transition-colors">
                  <Icon size={20} className="text-dune group-hover:text-white" />
                </div>
                <span className="font-hud text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display font-bold text-xl uppercase tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{s.desc}</p>
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
                <span className="font-hud text-xs text-dune">{s.price}</span>
                <span className="flex items-center gap-1 text-xs font-bold group-hover:text-dune-light">
                  Book <ArrowUpRight size={14} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
