// ACT 3 lab: the arithmetic of a delivery promise. Every number is an input you control; the defaults are FICTIONAL.
import { Lab, Presets, Range, Seg, Why, Stat, useLab, type Preset } from '../lab';

export interface TV { promise: number; km: number; pack: number; signals: number; red: number; safe: number }

export const DEADLINE_PRESETS: Preset<TV>[] = [
  { name: '10 minutes, 2 km', note: 'A quick-commerce promise from a nearby dark store.', v: { promise: 10, km: 2, pack: 2.5, signals: 2, red: 90, safe: 25 } },
  { name: 'Rush hour, 3 km', note: 'Same promise, a little further, five signals, slow traffic.', v: { promise: 10, km: 3, pack: 3, signals: 5, red: 90, safe: 20 } },
  { name: 'Empty night roads', note: 'Short reds, free-flowing roads.', v: { promise: 10, km: 2, pack: 2.5, signals: 2, red: 30, safe: 35 } },
  { name: 'Food in 30 minutes', note: 'A restaurant order: the kitchen takes most of the time.', v: { promise: 30, km: 4, pack: 15, signals: 4, red: 90, safe: 22 } },
];

export function deadline(v: TV) {
  const sigMin = (v.signals * 0.5 * v.red) / 60;          // on average, half the signals are red
  const avail = v.promise - v.pack - sigMin;                // minutes left to actually ride
  const needed = avail > 0 ? v.km / (avail / 60) : Infinity; // km/h needed to make it
  const noStop = v.promise - v.pack > 0 ? v.km / ((v.promise - v.pack) / 60) : Infinity; // if you skip every red
  const rideSafe = (v.km / v.safe) * 60;
  const total = v.pack + sigMin + rideSafe;                 // minutes at a safe speed, stopping at reds
  return { sigMin, avail, needed, noStop, rideSafe, total, ok: needed <= v.safe };
}

export function DeadlinePhone({ v }: { v: TV }) {
  const d = deadline(v);
  const late = Math.max(0, d.total - v.promise);
  return (
    <div className="zp-body center">
      <p className="tiny">Customer sees</p>
      <div className={`deadline ${late > 0 ? 'late' : ''}`}>Arriving in {v.promise}:00</div>
      <p className="tiny">You see</p>
      <div className="speedo"><b>{Number.isFinite(d.needed) ? Math.round(d.needed) : '∞'}</b><small>km/h needed</small></div>
      <p className="tiny">Your safe speed here: <b>{v.safe} km/h</b></p>
      <p className="tiny">{late > 0 ? `At a safe speed you arrive ${late.toFixed(1)} min late.` : `At a safe speed you arrive with ${(v.promise - d.total).toFixed(1)} min to spare.`}</p>
    </div>
  );
}

export function DeadlineLab({ lab, onNext }: { lab: ReturnType<typeof useLab<TV>>; onNext: () => void }) {
  const { v, set } = lab;
  const d = deadline(v);
  const W = 300, scale = W / Math.max(v.promise, d.total);
  const verdict = d.avail <= 0
    ? { tone: 'bad', text: `Impossible: packing and red lights alone take ${(v.pack + d.sigMin).toFixed(1)} of the ${v.promise} minutes.` }
    : d.ok
      ? { tone: 'good', text: `Possible at a safe speed: you need ${Math.round(d.needed)} km/h and can safely ride ${v.safe}.` }
      : { tone: 'bad', text: `Only by riding at ${Math.round(d.needed)} km/h, ${Math.round(d.needed - v.safe)} km/h over your safe speed. Or by skipping every red light (then ${Math.round(d.noStop)} km/h).` };
  return (
    <Lab title="Can the promise be kept without breaking a rule?" hint="The promise is made to the customer. The arithmetic is done by the rider, on the road.">
      <Presets items={DEADLINE_PRESETS} active={lab.active} onPick={lab.pick} />

      <div className="lab-sticky">
      <div className={`lab-verdict ${verdict.tone}`}>{verdict.text}</div>
      </div>
      <Seg label="Promised to the customer" options={[[10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']]} value={v.promise} onChange={(x) => set('promise', x)} />
      <div className="lab-grid">
        <Range label="Distance" value={v.km} min={0.5} max={5} step={0.1} fmt={(x) => `${x.toFixed(1)} km`} onChange={(x) => set('km', x)} />
        <Range label="Packing or cooking" value={v.pack} min={1} max={20} step={0.5} fmt={(x) => `${x} min`} onChange={(x) => set('pack', x)} />
        <Range label="Traffic signals on the way" value={v.signals} min={0} max={8} onChange={(x) => set('signals', x)} />
        <Range label="Length of a red light" value={v.red} min={20} max={150} step={10} fmt={(x) => `${x} s`} onChange={(x) => set('red', x)} />
      </div>
      <Range label="Your safe speed in this traffic" value={v.safe} min={12} max={40} fmt={(x) => `${x} km/h`} onChange={(x) => set('safe', x)} />

      <div className="timeline" aria-label="Minutes: packing, red lights, riding at a safe speed; the line is the promise">
        <i className="tl-pack" style={{ width: v.pack * scale }} />
        <i className="tl-sig" style={{ width: d.sigMin * scale }} />
        <i className="tl-ride" style={{ width: d.rideSafe * scale }} />
        <b style={{ left: v.promise * scale }} />
      </div>
      <div className="legend-row"><span><i style={{ background: '#7fa8e0' }} />packing</span><span><i style={{ background: 'var(--red)' }} />waiting at reds</span><span><i style={{ background: 'var(--grn)' }} />riding safely</span><span>│ the promise</span></div>
      <div className="lab-stats">
        <Stat k="Minutes left to ride" v={d.avail > 0 ? d.avail.toFixed(1) : '0'} tone={d.avail <= 0 ? 'bad' : undefined} />
        <Stat k="Speed needed" v={Number.isFinite(d.needed) ? `${Math.round(d.needed)} km/h` : '—'} tone={d.ok ? 'good' : 'bad'} />
        <Stat k="Safe arrival" v={`${d.total.toFixed(1)} min`} tone={d.total > v.promise ? 'bad' : 'good'} />
      </div>
      <Why items={[
        { text: <>Packing time and red lights don&rsquo;t shrink when the promise does. Whatever is left over is all the rider has to cover the distance.</> },
        { label: 'CONTESTED', text: <>All 13 Blinkit and Zepto riders Reuters interviewed (2022) said 10-minute deadlines often made them speed. Blinkit&rsquo;s CEO said riders are not penalised for delays.</> },
        { label: 'STATEMENT', text: <>Zomato&rsquo;s CEO says riders never see the customer&rsquo;s timer. In January 2026, after meeting the Labour Minister, Blinkit dropped &ldquo;10 minutes&rdquo; from its branding.</> },
        { label: 'FICTIONAL', text: <>The starting numbers are invented. Change them to match a road you know.</> },
      ]} />
      <div className="lab-next"><button className="btn" onClick={onNext}>Next order →</button></div>
    </Lab>
  );
}
