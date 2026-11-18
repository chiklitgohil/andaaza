// The small kit each stop uses for its one "hero" control and its result.
// One control per stop; no presets and no reason lists (the story behind each result unfolds afterwards).
import type { ReactNode } from 'react';

export function Lab({ kicker, title, children }: { kicker?: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="side-card lab">
      {kicker && <p className="kicker">{kicker}</p>}
      <p className="lab-title">{title}</p>
      {children}
    </section>
  );
}

export function Range({ label, value, min, max, step = 1, fmt = String, onChange }: {
  label: ReactNode; value: number; min: number; max: number; step?: number; fmt?: (v: number) => ReactNode; onChange: (v: number) => void;
}) {
  return (
    <label className="lab-range">
      <span className="lab-range-top"><span>{label}</span><b>{fmt(value)}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

export function Seg<T extends string | number>({ label, options, value, onChange }: { label?: ReactNode; options: [T, ReactNode][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="lab-seg">
      {label && <span className="lab-k">{label}</span>}
      <div className="seg" role="radiogroup">
        {options.map(([k, l]) => (
          <button key={String(k)} role="radio" aria-checked={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/** A big result number with a caption. */
export function Stat({ k, v, tone }: { k: ReactNode; v: ReactNode; tone?: 'good' | 'bad' | 'warn' }) {
  return <div className={`lab-stat ${tone ?? ''}`}><small>{k}</small><b>{v}</b></div>;
}

/** Simple seeded random numbers, so a "day" is the same every time you replay it. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export const rupees = (v: number) => `${v < 0 ? '−' : ''}₹${Math.abs(Math.round(v)).toLocaleString('en-IN')}`;
