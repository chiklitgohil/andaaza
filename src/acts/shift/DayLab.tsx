// ACT 2 lab: play out a whole day of offers under your own rules and the app's bonus rules.
// Offers, pay, speeds and times are FICTIONAL; the bonus ladders and rejection rule are shaped like reports.
import { Lab, Seg, Stat, seeded, rupees } from '../lab';

export interface DV { minRate: number; protect: boolean; fuel: number; pin: number; scheme: 'old' | 'new'; limit: number; hours: number }

// Arun accepts every order (to protect the bonus); only the app's bonus ladder changes. FICTIONAL day.
export const dayFor = (scheme: DV['scheme']): DV => ({ minRate: 0, protect: true, fuel: 2.2, pin: 0.5, scheme, limit: 1, hours: 11 });

// Bonus ladders as Blinkit riders reported them to Newslaundry (2025): [orders, ₹ for the highest rung reached]
const SCHEMES: Record<DV['scheme'], [number, number][]> = {
  old: [[15, 130], [32, 555]],
  new: [[30, 205], [40, 338], [43, 448]],
};
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

export function DayLab({ scheme, setScheme, onNext }: { scheme: DV['scheme']; setScheme: (s: DV['scheme']) => void; onNext: () => void }) {
  const d = simulate(dayFor(scheme));
  const other = simulate(dayFor(scheme === 'old' ? 'new' : 'old'));
  return (
    <Lab kicker="The same day, twice" title={`${d.orders} orders. Same roads, same hours. Only the bonus rules change.`}>
      <Seg options={[['old', 'Yesterday’s bonus'], ['new', 'Today’s bonus']]} value={scheme} onChange={setScheme} />
      <div className="strip" aria-label="Each offer of the day">{d.kinds.map((k, i) => <i key={i} className={k} />)}</div>
      <div className="lab-stats">
        <Stat k="Bonus" v={d.hit ? rupees(d.bonus) : '₹0'} tone={d.bonus >= other.bonus ? 'good' : 'bad'} />
        <Stat k="Day, after fuel" v={rupees(d.net)} tone={d.net >= other.net ? 'good' : 'bad'} />
      </div>
      <p className="lab-verdict bad">Under today&rsquo;s rules the same {d.orders} orders earn {rupees(Math.abs(simulate(dayFor('old')).bonus - simulate(dayFor('new')).bonus))} less in bonus.</p>
      <div className="lab-next"><button className="btn" onClick={onNext}>What&rsquo;s behind this? →</button></div>
    </Lab>
  );
}
