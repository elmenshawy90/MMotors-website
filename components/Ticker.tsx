const items = [
  "Genuine Nissan Parts",
  "Factory-Trained Techs",
  "60-Min Express Service",
  "3-Year Service Warranty",
  "Free Pickup & Delivery",
  "Insurance Direct Billing",
];

export default function Ticker() {
  return (
    <div className="relative bg-nissan overflow-hidden py-3 -rotate-[0.5deg] scale-[1.01]">
      <div className="flex whitespace-nowrap animate-marquee gap-0 w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((t) => (
              <span key={`${dup}-${t}`} className="mx-6 flex items-center gap-6 text-white font-display font-bold uppercase tracking-wide text-sm">
                {t} <span className="text-white/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
