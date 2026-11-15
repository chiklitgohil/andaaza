// The "try it yourself" kit shared by every act: quick picks for people who just want to see the point,
// and every input exposed for people who want to poke at it. Each result says why.
import { useState, type ReactNode } from 'react';
import { Chip } from '../ui/Debrief';
import type { Label } from '../content/types';

export interface Preset<T> { name: string; note: string; v: T }

/** State for a lab: values, which preset (if any) they came from, and setters. */
export function useLab<T extends object>(presets: Preset<T>[], start = 0) {
  const [v, setV] = useState<T>(presets[start].v);
  const [active, setActive] = useState<number | null>(start);
  return {
    v, active,
    pick: (i: number) => { setV(presets[i].v); setActive(i); },
    set: <K extends keyof T>(k: K, x: T[K]) => { setV((o) => ({ ...o, [k]: x })); setActive(null); },
  };
}

export function Lab({ kicker = 'Try it yourself', title, hint, children, wide }: { kicker?: string; title: ReactNode; hint?: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`side-card lab ${wide ? 'wide' : ''}`} aria-label="Try it yourself">
      <p className="kicker">{kicker}</p>
      <p className="lab-title">{title}</p>
      {hint && <p className="tiny lab-hint">{hint}</p>}
      {children}
    </section>
  );
}

export function Presets<T>({ items, active, onPick }: { items: Preset<T>[]; active: number | null; onPick: (i: number) => void }) {
  return (
    <div className="lab-presets">
      <div className="lab-chips" role="group" aria-label="Quick picks">
        <span className="lab-k">Quick picks</span>
        {items.map((p, i) => (
          <button key={p.name} className={`chip-btn ${active === i ? 'on' : ''}`} aria-pressed={active === i} onClick={() => onPick(i)}>{p.name}</button>
        ))}
        {active == null && <span className="chip-btn custom on">Your own</span>}
      </div>
      {active != null && <p className="tiny lab-note">{items[active].note}</p>}
    </div>
  );
}

export function Range({ label, value, min, max, step = 1, fmt = String, onChange, note }: {
  label: ReactNode; value: number; min: number; max: number; step?: number; fmt?: (v: number) => ReactNode; onChange: (v: number) => void; note?: ReactNode;
}) {
  return (
    <label className="lab-range">
      <span className="lab-range-top"><span>{label}</span><b>{fmt(value)}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      {note && <span className="tiny">{note}</span>}
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

export function Toggle({ label, value, onChange }: { label: ReactNode; value: boolean; onChange: (v: boolean) => void }) {
  return <label className="tog lab-tog"><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} /> {label}</label>;
}

export interface WhyItem { label?: Label; text: ReactNode; delta?: ReactNode; bad?: boolean }

/** The reasons behind a result, each with how strong its evidence is. */
export function Why({ items, title = 'Why?', open = true }: { items: WhyItem[]; title?: string; open?: boolean }) {
  return (
    <details className="lab-why" open={open}>
      <summary>{title}</summary>
      <ul>
        {items.map((w, i) => (
          <li key={i} className={w.bad ? 'bad-row' : ''}>
            {w.delta != null && <b className="lab-delta">{w.delta}</b>}
            {w.label && <Chip label={w.label} />} <span>{w.text}</span>
          </li>
        ))}
      </ul>
    </details>
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
