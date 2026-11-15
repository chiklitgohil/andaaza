// ACT 2 lab: play out a whole day of offers under your own rules and the app's bonus rules.
// Offers, pay, speeds and times are FICTIONAL; the bonus ladders and rejection rule are shaped like reports.
import { Lab, Presets, Range, Seg, Toggle, Why, Stat, useLab, seeded, rupees, type Preset, type WhyItem } from '../lab';

export interface DV { minRate: number; protect: boolean; fuel: number; pin: number; scheme: 'old' | 'new'; limit: number; hours: number }

export const DAY_PRESETS: Preset<DV>[] = [
  { name: 'Accept everything', note: 'Never risk the bonus. Take every order the app sends.', v: { minRate: 0, protect: true, fuel: 2.2, pin: 0.5, scheme: 'new', limit: 1, hours: 11 } },
  { name: 'Picky: ₹5/km or better', note: 'Turn down trips that pay less than ₹5 a kilometre, whatever happens to the bonus.', v: { minRate: 5, protect: false, fuel: 2.2, pin: 0.5, scheme: 'new', limit: 1, hours: 11 } },
  { name: 'Picky, but save the bonus', note: 'Picky until the rejection limit is used up, then forced to accept anything.', v: { minRate: 5, protect: true, fuel: 2.2, pin: 0.5, scheme: 'new', limit: 1, hours: 11 } },
  { name: 'Yesterday’s bonus', note: 'Accept everything, under the old ladder: ₹130 at 15 orders, ₹555 at 32.', v: { minRate: 0, protect: true, fuel: 2.2, pin: 0.5, scheme: 'old', limit: 1, hours: 11 } },
  { name: 'If pins were accurate', note: 'Accept everything, and every kilometre you ride is a kilometre you are paid for.', v: { minRate: 0, protect: true, fuel: 2.2, pin: 0, scheme: 'new', limit: 1, hours: 11 } },
  { name: 'If saying no were free', note: 'No rejection limit. Picky at ₹5/km.', v: { minRate: 5, protect: false, fuel: 2.2, pin: 0.5, scheme: 'new', limit: 99, hours: 11 } },
];

// Bonus ladders as Blinkit riders reported them to Newslaundry (2025): [orders, ₹ for the highest rung reached]
const SCHEMES: Record<DV['scheme'], [number, number][]> = {
  old: [[15, 130], [32, 555]],
  new: [[30, 205], [40, 338], [43, 448]],
};
const ladderText = (k: DV['scheme']) => SCHEMES[k].map(([n, b]) => `₹${b} at ${n}`).join(', ');
const SPEED = 22;      // km/h in city traffic (FICTIONAL)
const HANDLING = 5;    // minutes at pickup and drop (FICTIONAL)
const GAP = 3;         // minutes waiting for the next offer (FICTIONAL)

interface Offer { pay: number; km: number }
const OFFERS: Offer[] = (() => {
  const r = seeded(7);
  return Array.from({ length: 60 }, () => {
    const km = Math.round((1 + r() ** 1.8 * 6.5) * 10) / 10;
    let pay = 14 + 3.2 * km + (r() - 0.5) * 12;
    if (r() < 0.25) pay *= 0.55; // some offers pay far less than the distance deserves
    return { pay: Math.max(15, Math.round(pay)), km };
  });
})();

export type Kind = 'acc' | 'loss' | 'rej' | 'late';
export function simulate(v: DV) {
  const sc = SCHEMES[v.scheme];
  let t = 0, orders = 0, rejects = 0, gross = 0, km = 0, unpaid = 0, poor = 0, forced = 0, idle = 0, lost = false;
  const kinds: Kind[] = [];
  for (const o of OFFERS) {
    if (t >= v.hours * 60) { kinds.push('late'); continue; }
    t += GAP; idle += GAP;
    const rate = o.pay / o.km;
    let accept = rate >= v.minRate;
    if (!accept && v.protect && rejects >= v.limit) { accept = true; forced++; }
    if (!accept) {
      rejects++;
      if (rejects > v.limit) lost = true;
      kinds.push('rej');
      continue;
    }
    const ridden = o.km + v.pin;
    t += (ridden / SPEED) * 60 + HANDLING;
    orders++; gross += o.pay; km += ridden; unpaid += v.pin;
    const bad = rate < 4;
    if (bad) poor++;
    kinds.push(bad ? 'loss' : 'acc');
  }
  const reached = sc.filter(([n]) => orders >= n).pop();
  const next = sc.find(([n]) => orders < n);
  const hit = !lost && !!reached;
  const bonus = hit ? reached![1] : 0;
  const fuel = km * v.fuel;
  const net = gross + bonus - fuel;
  const hours = Math.max(t, v.hours * 60) / 60;
  return { orders, rejects, gross, bonus, hit, lost, km, unpaid, fuel, net, hours, poor, forced, idle, kinds, reached, next };
}

/** What the app shows at the end of the day: earnings, never costs. */
export function DayPhone({ v }: { v: DV }) {
  const d = simulate(v);
  return (
    <div className="zp-body">
      <p className="zp-title">Today&rsquo;s summary</p>
      <div className="app-sum">
        <div className="row2"><span>Orders</span><b>{d.orders}</b></div>
        <div className="row2"><span>Order pay</span><b>{rupees(d.gross)}</b></div>
        <div className="row2"><span>Daily bonus</span><b>{d.lost ? 'Lost' : d.hit ? rupees(d.bonus) : `${d.orders}/${d.next?.[0]}`}</b></div>
        {!d.lost && d.next && <div className="row2"><span>Next bonus</span><b>₹{d.next[1]} at {d.next[0]}</b></div>}
        <div className="row2"><span>Total earnings</span><b style={{ fontSize: '1.2rem' }}>{rupees(d.gross + d.bonus)}</b></div>
      </div>
      <p className="tiny">{d.hit ? '🎉 Bonus unlocked! Keep it up tomorrow.' : d.lost ? 'Bonus lost: too many rejections today.' : 'So close! Log in early tomorrow to reach your bonus.'}</p>
      <p className="tiny" style={{ opacity: 0.7 }}>Fuel, unpaid kilometres and waiting time are not shown.</p>
    </div>
  );
}

export function DayLab({ lab, onNext }: { lab: ReturnType<typeof useLab<DV>>; onNext: () => void }) {
  const { v, set } = lab;
  const d = simulate(v);
  const why: WhyItem[] = [];
  if (d.hit) why.push({ label: 'REPORTED', text: <>{d.orders} orders reached the ₹{d.bonus} rung ({d.reached![0]} orders){d.next ? `; ₹${d.next[1]} needed ${d.next[0]}` : ''}. Riders reported the ladder changing from {ladderText('old')} to {ladderText('new')}.</> });
  else if (d.lost) why.push({ label: 'REPORTED', bad: true, text: <>Bonus lost after {d.rejects} rejections with {v.limit} allowed. Swiggy riders reported in 2021 that more than one rejection a day forfeited the incentive.</> });
  else why.push({ label: 'REPORTED', bad: true, text: <>Bonus missed: {d.orders} orders, and the first rung needs {d.next?.[0]}. Riders reported the ladder changing from {ladderText('old')} to {ladderText('new')}.</> });
  if (d.forced) why.push({ bad: true, text: <>{d.forced} trips you would have refused were accepted only to protect the bonus.</> });
  if (d.poor) why.push({ bad: true, text: <>{d.poor} trips paid less than ₹4 a kilometre.</> });
  if (d.unpaid) why.push({ label: 'ALLEGED', bad: true, text: <>{d.unpaid.toFixed(1)} km ridden but not paid for, because the pin was {v.pin} km off on every trip. Riders say pins can be up to a kilometre off.</> });
  why.push({ text: <>{Math.round(d.idle)} minutes waiting for the next offer, unpaid. Fuel of {rupees(d.fuel)} came out of your pocket. Neither appears on the app&rsquo;s summary.</> });
  why.push({ label: 'FICTIONAL', text: <>The 60 offers, speeds and times are invented, and are the same every time so you can compare rules fairly.</> });

  return (
    <Lab title="Plan your day. Then live it." hint="Choose your rules and the app's rules. A whole day of 60 offers plays out instantly.">
      <Presets items={DAY_PRESETS} active={lab.active} onPick={lab.pick} />

      <div className="lab-sticky">
      <div className="strip" aria-label="Each offer of the day">{d.kinds.map((k, i) => <i key={i} className={k} />)}</div>
      <div className="legend-row"><span><i style={{ background: 'var(--grn)' }} />accepted</span><span><i style={{ background: 'var(--red)' }} />accepted, under ₹4/km</span><span><i style={{ background: '#3a3c44' }} />rejected</span><span><i style={{ border: '1px dashed #555' }} />after you logged off</span></div>
      <div className="lab-stats">
        <Stat k="App says you earned" v={rupees(d.gross + d.bonus)} />
        <Stat k="After fuel" v={rupees(d.net)} tone={d.net < 700 ? 'bad' : 'warn'} />
        <Stat k="Per hour, after fuel" v={rupees(d.net / d.hours)} tone={d.net / d.hours < 80 ? 'bad' : 'warn'} />
      </div>
      </div>
      <p className="lab-k" style={{ display: 'block' }}>Your rules</p>
      <Range label="Only accept trips paying at least" value={v.minRate} min={0} max={9} step={0.5} fmt={(x) => (x ? `₹${x}/km` : 'anything')} onChange={(x) => set('minRate', x)} />
      <Toggle label="Protect the bonus: once my rejections are used up, accept anything" value={v.protect} onChange={(x) => set('protect', x)} />
      <div className="lab-grid">
        <Range label="Fuel cost" value={v.fuel} min={1.5} max={4} step={0.1} fmt={(x) => `₹${x.toFixed(1)}/km`} onChange={(x) => set('fuel', x)} />
        <Range label="Hours online" value={v.hours} min={6} max={13} fmt={(x) => `${x} h`} onChange={(x) => set('hours', x)} />
      </div>
      <p className="lab-k" style={{ display: 'block', marginTop: 8 }}>The app&rsquo;s rules</p>
      <Seg label="Bonus ladder" options={[['old', `Yesterday: ${ladderText('old')}`], ['new', `Today: ${ladderText('new')}`]]} value={v.scheme} onChange={(x) => set('scheme', x)} />
      <div className="lab-grid">
        <Range label="Rejections allowed" value={v.limit} min={0} max={10} fmt={(x) => (x >= 10 ? 'no limit' : String(x))} onChange={(x) => set('limit', x >= 10 ? 99 : x)} />
        <Range label="Pin error per trip" value={v.pin} min={0} max={1.5} step={0.1} fmt={(x) => `${x.toFixed(1)} km`} onChange={(x) => set('pin', x)} />
      </div>

      <Why items={why} />
      <div className="lab-next"><button className="btn" onClick={onNext}>What&rsquo;s behind this? →</button></div>
    </Lab>
  );
}
