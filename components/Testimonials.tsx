import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section id="reviews" className="py-20 lg:py-28 bg-carbon border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-end">
          <div>
            <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">05 — Reviews</p>
            <h2 className="display-condensed font-black text-5xl sm:text-6xl mt-3">Egypt keeps<br />coming back.</h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-asphalt px-5 py-3">
            <span className="display-condensed text-4xl font-black">4.9</span>
            <div className="text-xs">
              <p className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className="fill-dune text-dune" />)}</p>
              <p className="text-muted mt-1 font-hud">12,400+ Google reviews</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-white/10 bg-asphalt p-6 flex flex-col">
              <Quote size={22} className="text-dune" />
              <blockquote className="mt-4 text-sm leading-relaxed text-platinum/90 flex-1">“{t.text}”</blockquote>
              <figcaption className="mt-6 pt-4 border-t border-white/5">
                <p className="font-bold text-sm">{t.name}</p>
                <p className="font-hud text-[11px] text-muted uppercase tracking-widest mt-0.5">{t.car}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
