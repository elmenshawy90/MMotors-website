const steps = [
  { n: "01", t: "Book in 60 seconds", d: "Pick branch, time, and service. Instant WhatsApp confirmation with bay number." },
  { n: "02", t: "Free 172-pt scan", d: "CONSULT diagnostics + lift inspection. Video quote to your phone in 20 minutes." },
  { n: "03", t: "You approve, we wrench", d: "Genuine parts, torque-logged, road-tested. Track progress live from the lounge." },
  { n: "04", t: "Wash, warranty, go", d: "Free wash + 3-year / 30k warranty on parts & labor. Digital service history updated." },
];

export default function Process() {
  return (
    <section className="py-20 bg-asphalt border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune text-center">How it works</p>
        <h2 className="display-condensed font-black text-4xl sm:text-6xl text-center mt-3">Drive in. Drive out. Done.</h2>
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-white/10 bg-carbon p-6 overflow-hidden">
              <span className="display-condensed text-6xl font-black text-white/[0.07] absolute top-3 right-4">{s.n}</span>
              <span className="font-hud text-xs px-3 py-1 rounded-full bg-nissan/15 border border-nissan/30 text-red-300">{s.n}</span>
              <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
