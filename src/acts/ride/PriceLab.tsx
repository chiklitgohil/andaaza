// ACT 6: the claimed price effects, and the controls to test them yourself on both phones.
// Effect sizes come from single viral posts, small tests and one correlation study, which the companies deny
// (see debriefs.ts). "company" = nothing personal is used, as the companies say.
export type Model = 'old' | 'mid' | 'iphone';
export type Pay = 'upi' | 'cash' | 'debit' | 'amex' | 'wallet';
export type Area = 'mixed' | 'richer' | 'poorer';
export interface PhoneSet { model: Model; battery: number; pay: Pay; area: Area }
export type Mode = 'company' | 'claims';

export const MODELS: Record<Model, string> = { old: 'Old Android (₹8k)', mid: 'Mid-range Android', iphone: 'New iPhone' };
export const PAYS: Record<Pay, string> = { upi: 'UPI', cash: 'Cash', debit: 'Debit card', amex: 'Amex card', wallet: 'Wallet credits' };
export const AREAS: Record<Area, string> = { mixed: 'Bapunagar', richer: 'A richer area', poorer: 'A poorer area' };

export const ARUN: PhoneSet = { model: 'old', battery: 6, pay: 'upi', area: 'mixed' };
export const STRANGER: PhoneSet = { model: 'iphone', battery: 82, pay: 'amex', area: 'mixed' };
export const label = (p: PhoneSet) => `${MODELS[p.model]} · ${p.battery}% · ${PAYS[p.pay]}`;

/** What people have claimed for this phone, in plain words, and how big (sizes from single posts and tests). */
export function claims(p: PhoneSet) {
  const L: { text: string; pct: number }[] = [];
  if (p.model === 'iphone') L.push({ text: 'iPhone', pct: 0.178 });
  if (p.battery <= 20) L.push({ text: `${p.battery}% battery`, pct: 0.058 });
  if (p.pay === 'amex') L.push({ text: 'Amex card', pct: 0.626 });
  if (p.pay === 'wallet') L.push({ text: 'wallet credits', pct: 0.5 });
  if (p.area === 'poorer') L.push({ text: 'trip to a poorer area', pct: 0.04 });
  return L;
}

export function priceFor(p: PhoneSet, mode: Mode, quoted: number) {
  const pct = mode === 'company' ? 0 : claims(p).reduce((s, a) => s + a.pct, 0);
  return quoted * (1 + pct);
}

/** Everything about one phone that people suspect changes the price. */
export function PhoneControls({ who, p, onChange }: { who: string; p: PhoneSet; onChange: (p: PhoneSet) => void }) {
  const sel = <K extends keyof PhoneSet>(k: K, opts: Record<string, string>) => (
    <select value={String(p[k])} onChange={(e) => onChange({ ...p, [k]: e.target.value })} aria-label={`${who}: ${k}`}>
      {Object.entries(opts).map(([key, l]) => <option key={key} value={key}>{l}</option>)}
    </select>
  );
  return (
    <div className="pl-controls">
      <p className="lab-k">{who}</p>
      <label>Phone {sel('model', MODELS)}</label>
      <label className="lab-range"><span className="lab-range-top"><span>Battery</span><b>{p.battery}%</b></span>
        <input type="range" min={1} max={100} value={p.battery} onChange={(e) => onChange({ ...p, battery: +e.target.value })} aria-label={`${who}: battery`} />
      </label>
      <label>Paying by {sel('pay', PAYS)}</label>
      <label>Going to {sel('area', AREAS)}</label>
    </div>
  );
}
