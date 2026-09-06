import { ArrowRight, BadgeCheck, Star, Gauge, Fuel, ShieldCheck, Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-36 pb-0">
      {/* backdrop layers */}
      <div className="absolute inset-0 hud-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(225,29,46,0.18),transparent_60%),radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(201,168,106,0.14),transparent_60%)]" />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 font-hud text-[11px] tracking-[0.4em] uppercase text-muted/80 border border-white/10 rounded-full px-5 py-2 bg-white/[0.03] backdrop-blur">
        Authorized Nissan Sales & Service — Since 1989
      </div>

      <div className="relative px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
        <div className="pb-6">
          <h1 className="display-condensed font-black text-[13.5vw] sm:text-7xl lg:text-[5.6rem] xl:text-[6.4rem]">
            Nissan,
            <br />
            <span className="gold-gradient-text">mastered</span>
            <br />
            <span className="text-stroke">in Egypt.</span>
          </h1>
          <p className="mt-6 max-w-md text-muted text-base sm:text-lg leading-relaxed">
            New Nissans, genuine parts, and factory-certified technicians who know desert heat,
            Cairo traffic, and Red Sea salt. Sales + service under one roof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#booking" className="group flex items-center gap-2 px-7 py-4 rounded-full bg-nissan text-white font-bold text-sm red-glow hover:bg-red-600 transition-all">
              Book Service in 60s <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#models" className="flex items-center gap-3 px-7 py-4 rounded-full border border-white/15 font-semibold text-sm hover:border-dune transition-colors">
              <span className="w-7 h-7 rounded-full bg-white/10 grid place-items-center"><Play size={12} /></span>
              View 2026 Lineup
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["SE", "MA", "KF"].map((t) => (
                  <span key={t} className="w-8 h-8 rounded-full border-2 border-asphalt bg-steel grid place-items-center text-[10px] font-bold text-dune">{t}</span>
                ))}
              </div>
              <div className="leading-tight">
                <p className="flex items-center gap-1 font-bold">4.9 <Star size={12} className="fill-dune text-dune" /></p>
                <p className="text-muted text-xs">12,400+ reviews</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <p className="text-muted text-xs flex items-center gap-1.5"><BadgeCheck size={14} className="text-emerald-400" /> Nissan Middle East Certified</p>
          </div>
        </div>

        {/* HUD spec card */}
        <div className="hidden lg:block relative">
          <div className="rounded-3xl border border-white/10 bg-carbon/70 backdrop-blur-xl p-6 carbon-fiber">
            <div className="flex items-center justify-between font-hud text-[11px] tracking-widest uppercase text-muted">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-nissan animate-glow-pulse" /> Live Bay Status</span>
              <span>Bay 07 / Patrol</span>
            </div>
            {/* speedo */}
            <div className="mt-5 relative mx-auto w-56 h-32">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                <path d="M10 100 A90 90 0 0 1 190 100" fill="none" stroke="#232b38" strokeWidth="10" strokeLinecap="round" />
                <path d="M10 100 A90 90 0 0 1 158 38" fill="none" stroke="#e11d2e" strokeWidth="10" strokeLinecap="round" />
                <path d="M10 100 A90 90 0 0 1 120 18" fill="none" stroke="#c9a86a" strokeWidth="2" strokeDasharray="3 6" />
                <line x1="100" y1="100" x2="150" y2="42" stroke="#eceef1" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="100" r="8" fill="#eceef1" />
              </svg>
              <div className="absolute bottom-0 inset-x-0 text-center">
                <p className="font-hud text-3xl font-bold">172<span className="text-sm text-muted">/pt</span></p>
                <p className="font-hud text-[10px] tracking-[0.3em] uppercase text-muted">Inspection Score</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Gauge, v: "60 min", l: "Express" },
                { icon: Fuel, v: "100%", l: "Genuine oil" },
                { icon: ShieldCheck, v: "3 yr", l: "Warranty" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/[0.04] border border-white/10 py-3">
                  <s.icon size={16} className="mx-auto text-dune" />
                  <p className="mt-1 font-bold text-sm">{s.v}</p>
                  <p className="font-hud text-[10px] uppercase tracking-widest text-muted">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 px-4 py-3 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-200">4 express bays free right now — drive in, no queue.</span>
            </div>
          </div>
        </div>
      </div>

      {/* giant car silhouette strip */}
      <div className="relative mt-8 border-t border-white/10 bg-gradient-to-t from-black to-carbon overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["35+", "Years in Egypt"],
            ["128K", "Cars serviced"],
            ["98%", "Fix first visit"],
            ["3", "Branches + mobile vans"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline gap-3">
              <span className="display-condensed text-4xl md:text-5xl font-black text-platinum">{v}</span>
              <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-muted leading-tight">{l}</span>
            </div>
          ))}
        </div>
        {/* road line */}
        <div className="h-[3px] bg-[repeating-linear-gradient(90deg,#c9a86a_0_40px,transparent_40px_80px)] opacity-40" />
      </div>
    </section>
  );
}
