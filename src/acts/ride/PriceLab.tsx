// ACT 6 lab: build your own two-phone comparison, like a controlled test.
// Effect sizes come from single viral posts, small tests and one correlation study; the companies deny them.
// WHAT-IF effects have no public evidence at all and appear only when you switch them on.
import { Presets, Seg, Why, type Preset, type WhyItem } from '../lab';
import type { Label } from '../../content/types';

export type Model = 'old' | 'mid' | 'iphone';
export type Pay = 'upi' | 'cash' | 'debit' | 'amex' | 'wallet';
export type Area = 'mixed' | 'richer' | 'poorer';
export interface PhoneSet { model: Model; battery: number; pay: Pay; area: Area }
export type Mode = 'off' | 'reported' | 'whatif' | 'amp';

export const MODELS: Record<Model, string> = { old: 'Old Android (₹8k)', mid: 'Mid-range Android', iphone: 'New iPhone' };
export const PAYS: Record<Pay, string> = { upi: 'UPI', cash: 'Cash', debit: 'Debit card', amex: 'Amex card', wallet: 'Wallet credits' };
export const AREAS: Record<Area, string> = { mixed: 'Bapunagar', richer: 'A richer area', poorer: 'A poorer area' };

export const SCENARIOS: Preset<[PhoneSet, PhoneSet]>[] = [
  { name: 'Tonight: you and him', note: 'Arun: old Android at 6%, paying by UPI. The stranger: new iPhone at 82%, paying by Amex. Same corner, same second.', v: [{ model: 'old', battery: 6, pay: 'upi', area: 'mixed' }, { model: 'iphone', battery: 82, pay: 'amex', area: 'mixed' }] },
  { name: 'Everyone identical', note: 'A controlled test: both phones are the same. Any gap now can only come from chance.', v: [{ model: 'mid', battery: 80, pay: 'upi', area: 'mixed' }, { model: 'mid', battery: 80, pay: 'upi', area: 'mixed' }] },
  { name: 'iPhone vs Android', note: 'Only the phone differs: the shape of the January 2025 posts in India.', v: [{ model: 'old', battery: 80, pay: 'upi', area: 'mixed' }, { model: 'iphone', battery: 80, pay: 'upi', area: 'mixed' }] },
  { name: 'Battery test', note: '12% against 84% on the same phone, like the Brussels newspaper test. A US fact-check found no difference.', v: [{ model: 'mid', battery: 12, pay: 'upi', area: 'mixed' }, { model: 'mid', battery: 84, pay: 'upi', area: 'mixed' }] },
  { name: 'How you pay', note: 'Same phone, same trip; only the payment method changes.', v: [{ model: 'mid', battery: 80, pay: 'debit', area: 'mixed' }, { model: 'mid', battery: 80, pay: 'amex', area: 'mixed' }] },
  { name: 'Where you’re going', note: 'Same phone; one trip ends in a richer area, one in a poorer one.', v: [{ model: 'mid', battery: 80, pay: 'upi', area: 'richer' }, { model: 'mid', battery: 80, pay: 'upi', area: 'poorer' }] },
];

export interface Adj { text: string; pct: number; label: Label; note: string; whatif?: boolean }

/** Every adjustment someone has claimed for this phone. */
export function adjustments(p: PhoneSet): Adj[] {
  const L: Adj[] = [];
  if (p.model === 'iphone') L.push({ text: 'New iPhone', pct: 0.178, label: 'ALLEGED', note: 'Viral posts in India (Jan 2025): one trip at ₹342.47 on iPhone vs ₹290.79 on Android. The regulator sent notices; Ola and Uber denied it.' });
  if (p.model === 'mid') L.push({ text: 'Mid-range Android', pct: 0.03, label: 'WHAT-IF', note: 'No evidence. Imagines a model that prices by how expensive your phone is.', whatif: true });
  if (p.battery <= 20) L.push({ text: `Battery ${p.battery}%`, pct: 0.058, label: 'CONTESTED', note: 'A Brussels newspaper test: €17.56 at 12% vs €16.60 at 84%. A US fact-check found identical prices. Uber denies using battery.' });
  else if (p.battery <= 50) L.push({ text: `Battery ${p.battery}%`, pct: 0.02, label: 'WHAT-IF', note: 'No evidence for a medium-battery effect.', whatif: true });
  if (p.pay === 'amex') L.push({ text: 'Amex card', pct: 0.626, label: 'ALLEGED', note: 'One viral US video (Apr 2026): $33.05 with Amex vs $20.33 with Visa. Uber says it never sets prices by card brand.' });
  if (p.pay === 'wallet') L.push({ text: 'Wallet credits', pct: 0.5, label: 'ALLEGED', note: 'Riders say fares rose after loading gift cards or credits. Uber denies it.' });
  if (p.area === 'poorer') L.push({ text: 'Going to a poorer area', pct: 0.04, label: 'CONTESTED', note: 'A Chicago study of over 100 million trips linked higher per-mile fares to lower-income, mostly non-white areas. Correlation only; companies dispute it. The size here is invented.' });
  return L;
}

export function priceFor(p: PhoneSet, mode: Mode, quoted: number) {
  const k = mode === 'off' ? 0 : mode === 'amp' ? 3 : 1;
  const used = adjustments(p).filter((a) => !a.whatif || mode === 'whatif' || mode === 'amp');
  const pct = used.reduce((s, a) => s + a.pct, 0) * k;
  return { price: quoted * (1 + pct), used, k };
}

const fmt = (v: number) => `₹${Math.round(v)}`;

function PhoneControls({ who, p, onChange }: { who: string; p: PhoneSet; onChange: (p: PhoneSet) => void }) {
  const sel = <K extends keyof PhoneSet>(k: K, opts: Record<string, string>) => (
    <select value={String(p[k])} onChange={(e) => onChange({ ...p, [k]: e.target.value })} aria-label={`${who}: ${k}`}>
      {Object.entries(opts).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
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

export function PriceLab({ phones, setPhones, active, setActive, mode, setMode, quoted, prices }: {
  phones: [PhoneSet, PhoneSet]; setPhones: (p: [PhoneSet, PhoneSet]) => void;
  active: number | null; setActive: (i: number | null) => void;
  mode: Mode; setMode: (m: Mode) => void; quoted: number; prices: [number, number];
}) {
  const results = phones.map((p) => priceFor(p, mode, quoted));
  const whyFor = (i: number): WhyItem[] => {
    const r = results[i];
    const base: WhyItem = { text: <>Route, time and the rain surge: {fmt(quoted)} for everyone at this spot and second.</>, label: 'STATEMENT' };
    if (mode === 'off') return [base, { text: 'Hidden model off: nothing about the phone or the person is used. This is what the companies say happens.' }];
    if (!r.used.length) return [base, { text: 'No claimed adjustment applies to this phone.' }];
    return [base, ...r.used.map((a) => ({ delta: `+${(a.pct * r.k * 100).toFixed(1)}%`, label: a.label, text: <><b>{a.text}.</b> {a.note}</>, bad: true }))];
  };
  const gap = prices[1] - prices[0];
  return (
    <div className="pl">
      <Presets items={SCENARIOS} active={active} onPick={(i) => { setPhones(SCENARIOS[i].v); setActive(i); }} />
      <Seg label="Which story is true? (the hidden model)" options={[['off', 'Company: none'], ['reported', 'Only what was reported'], ['whatif', '+ what-ifs'], ['amp', 'Everything ×3']]} value={mode} onChange={setMode} />
      <div className="gap-readout"><span>{fmt(prices[0])}</span><em>{Math.abs(gap) < 1 ? 'same' : gap > 0 ? `he pays ${fmt(gap)} more` : `you pay ${fmt(-gap)} more`}</em><span>{fmt(prices[1])}</span></div>
      <div className="pl-two">
        <div>
          <PhoneControls who="Your phone" p={phones[0]} onChange={(p) => { setPhones([p, phones[1]]); setActive(null); }} />
          <Why title="Why this price?" items={whyFor(0)} />
        </div>
        <div>
          <PhoneControls who="His phone" p={phones[1]} onChange={(p) => { setPhones([phones[0], p]); setActive(null); }} />
          <Why title="Why this price?" items={whyFor(1)} />
        </div>
      </div>
    </div>
  );
}
