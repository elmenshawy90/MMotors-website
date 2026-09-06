import { ArrowRight, Fuel, Users, Cog } from "lucide-react";
import { models } from "@/lib/data";

export default function Models() {
  return (
    <section id="models" className="relative py-20 lg:py-28 bg-carbon border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">01 — Showroom</p>
            <h2 className="display-condensed font-black text-5xl sm:text-6xl lg:text-7xl mt-3">
              2026 lineup.<br /><span className="gold-gradient-text">Ready to test.</span>
            </h2>
          </div>
          <a href="#booking" className="flex items-center gap-2 text-sm font-bold border border-white/15 rounded-full px-6 py-3 hover:border-dune w-fit">
            Book a test drive <ArrowRight size={15} />
          </a>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => (
            <article
              key={m.name}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-asphalt hover:border-dune/40 transition-all hover:-translate-y-1 duration-300"
            >
              {/* visual */}
              <div className={`relative h-52 bg-gradient-to-br ${m.gradient} p-5 flex flex-col justify-between overflow-hidden`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-hud uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white">
                    {m.tag}
                  </span>
                  <span className="font-hud text-[10px] text-white/60">NISSAN / 2026</span>
                </div>
                {/* abstract car shape */}
                <div className="relative">
                  <p className="display-condensed font-black text-4xl text-white/95 leading-none">{m.name}</p>
                  <p className="font-hud text-[11px] text-white/60 tracking-widest uppercase mt-1">{m.trim}</p>
                  <svg viewBox="0 0 300 70" className="mt-3 w-full opacity-90">
                    <path d="M10 55 L45 55 L60 32 L180 30 L220 45 L285 46 L290 55 L10 55 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                    <circle cx="70" cy="55" r="12" fill="#0a0c10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                    <circle cx="230" cy="55" r="12" fill="#0a0c10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                    <line x1="0" y1="62" x2="300" y2="62" stroke="#c9a86a" strokeWidth="1.5" strokeDasharray="12 8" opacity="0.7" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {m.specs.map((s) => (
                    <span key={s} className="text-[11px] font-hud px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum/80 flex items-center gap-1">
                      {s.includes("Seats") || s.includes("HP") ? <Cog size={11} /> : s.includes("WD") || s.includes("Bose") ? <Fuel size={11} /> : <Users size={11} />}
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="font-black text-lg">{m.price}</p>
                    <p className="text-muted text-xs font-hud">{m.monthly} • 0% down options</p>
                  </div>
                  <a href="#booking" className="px-4 py-2.5 rounded-full bg-platinum text-asphalt text-xs font-bold hover:bg-dune-light transition-colors">
                    Test Drive
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 font-hud text-[11px] text-muted tracking-wide">* Prices include VAT. Trade-in & Bank Audi / CIB / NBE financing available. Ask for fleet quotes.</p>
      </div>
    </section>
  );
}
