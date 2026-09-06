"use client";
import { useState } from "react";
import { CalendarCheck, ChevronDown } from "lucide-react";

const serviceOptions = [
  { label: "10k / 20k Scheduled Maintenance", base: 2900 },
  { label: "Express Oil + Filter", base: 1900 },
  { label: "Full Diagnostics Scan", base: 750 },
  { label: "Brakes / Suspension Check", base: 500 },
  { label: "A/C Cooling Service", base: 1200 },
  { label: "Test Drive (new car)", base: 0 },
];

const branches = ["New Cairo — 90 Road", "6th of October — Industrial Zone", "Alexandria — Smouha"];

export default function Booking() {
  const [service, setService] = useState(0);
  const [branch, setBranch] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [sent, setSent] = useState(false);

  const estimate = serviceOptions[service].base;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="booking" className="py-20 lg:py-28 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-steel via-carbon to-asphalt grid lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <p className="font-hud text-[11px] tracking-[0.35em] uppercase text-dune">06 — Book now</p>
          <h2 className="display-condensed font-black text-5xl sm:text-6xl mt-3 leading-[0.95]">
            Your bay is<br />waiting.
          </h2>
          <p className="mt-4 text-muted text-sm sm:text-base max-w-sm">
            Pick a service, get an instant estimate. We confirm on WhatsApp within 10 minutes, 8am–10pm.
          </p>

          <div className="mt-8 rounded-2xl border border-dune/30 bg-dune/10 p-5 flex items-center justify-between">
            <div>
              <p className="font-hud text-[10px] uppercase tracking-[0.25em] text-dune">Live estimate</p>
              <p className="font-black text-2xl mt-1">{estimate === 0 ? "Free" : `EGP ${estimate.toLocaleString()}+`}</p>
            </div>
            <div className="text-right font-hud text-[11px] text-muted leading-relaxed">
              {serviceOptions[service].label}<br />{branches[branch]}
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-muted font-hud uppercase tracking-widest">
            <li>✓ No advance payment</li>
            <li>✓ Free cancellation up to 3h before</li>
            <li>✓ Free wash with every booking</li>
          </ul>
        </div>

        <form onSubmit={submit} className="p-8 sm:p-12 bg-black/30 backdrop-blur border-t lg:border-t-0 lg:border-l border-white/10 space-y-4">
          {sent ? (
            <div className="h-full min-h-[380px] grid place-items-center text-center">
              <div>
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/15 border border-emerald-400/30 grid place-items-center">
                  <CalendarCheck className="text-emerald-400" />
                </div>
                <h3 className="mt-5 font-black text-2xl">Shokran, {name || "driver"}!</h3>
                <p className="mt-2 text-muted text-sm max-w-xs mx-auto">
                  Your request for <b className="text-platinum">{serviceOptions[service].label}</b> at {branches[branch]} is in.
                  We’ll WhatsApp <b className="text-platinum">{phone || "you"}</b> within 10 minutes.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 text-xs font-hud uppercase tracking-widest text-dune underline underline-offset-4">
                  Book another car
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-hud text-[10px] uppercase tracking-widest text-muted">Full name</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmed Samy" className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted/60 focus:border-dune outline-none" />
                </label>
                <label className="block">
                  <span className="font-hud text-[10px] uppercase tracking-widest text-muted">Mobile / WhatsApp</span>
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted/60 focus:border-dune outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="font-hud text-[10px] uppercase tracking-widest text-muted">Service</span>
                <div className="relative mt-2">
                  <select value={service} onChange={(e) => setService(Number(e.target.value))} className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-dune outline-none [&>option]:bg-carbon">
                    {serviceOptions.map((s, i) => <option key={s.label} value={i}>{s.label} — {s.base === 0 ? "Free" : `from EGP ${s.base.toLocaleString()}`}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-hud text-[10px] uppercase tracking-widest text-muted">Branch</span>
                  <div className="relative mt-2">
                    <select value={branch} onChange={(e) => setBranch(Number(e.target.value))} className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-dune outline-none [&>option]:bg-carbon">
                      {branches.map((b, i) => <option key={b} value={i}>{b}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </label>
                <label className="block">
                  <span className="font-hud text-[10px] uppercase tracking-widest text-muted">Preferred date</span>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-dune outline-none [color-scheme:dark]" />
                </label>
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-nissan font-bold text-sm red-glow hover:bg-red-600 transition-colors">
                Confirm Booking — get WhatsApp in 10 min
              </button>
              <p className="text-center font-hud text-[10px] uppercase tracking-widest text-muted">Or call 19900 • 8:00–22:00 daily</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
