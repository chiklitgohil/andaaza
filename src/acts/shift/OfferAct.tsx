// ACT 2 · THE OFFER. Orders on a timer, a rejection limit, a bonus target that moves.
// All amounts are FICTIONAL, shaped like those riders reported (see debriefs.ts).
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Guess } from '../guess';
import { Stat } from '../lab';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';
import { DayLab, DayPhone, dayFor, simulate, type DV } from './DayLab';

interface Offer { pay: number; km: number; from: string; to: string }
const OFFERS: Offer[] = [
  { pay: 38, km: 2.4, from: 'Flopcart dark store', to: 'Shanti Heights' },
  { pay: 22, km: 9.1, from: 'Shree Ganesh Restaurant', to: 'Naroda GIDC' },
  { pay: 44, km: 3.0, from: 'Flopcart dark store', to: 'Nikol' },
  { pay: 25, km: 7.8, from: 'Chai point', to: 'Odhav ring road' },
  { pay: 41, km: 2.8, from: 'Sweet Mart', to: 'Bapunagar' },
];
const SECONDS = 12;
const REJECTS_ALLOWED = 1;
const PETROL = 2.2;                                   // ₹ per km on Arun's scooter (FICTIONAL, see the strike ledger)
const minutesFor = (km: number) => Math.round(km * 3.2 + 7);   // city riding plus pickup and handover (FICTIONAL)
const netOf = (o: Offer) => o.pay - Math.round(o.km * PETROL);
const isBad = (o: Offer) => o.pay / o.km < 4;        // under ₹4 a km barely covers petrol and time
type Took = 'acc' | 'rej' | 'late';

export default function OfferAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [done, setDone] = useState(11);       // orders already done this morning (FICTIONAL)
  const [earned, setEarned] = useState(392);
  const [rejects, setRejects] = useState(0);
  const [lost, setLost] = useState(false);
  const [phase, setPhase] = useState<'offers' | 'recap' | 'odometer' | 'nextday' | 'lab' | 'reveal'>('offers');
  const [took, setTook] = useState<Took[]>([]);
  const [odoDone, setOdoDone] = useState(false);
  const [scheme, setScheme] = useState<DV['scheme']>('new');
  const [answered, setAnswered] = useState(false);
  const day = simulate(dayFor(scheme));
  const [target, setTarget] = useState(15);
  const [bonus, setBonus] = useState(130);
  const offer = OFFERS[i];

  useEffect(() => {
    if (phase !== 'offers') return;
    setLeft(SECONDS);
    sfx.order();
    const id = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [i, phase]);
  // the clock: a tick every second that gets louder and higher, double-time with a heartbeat in the last four
  useEffect(() => {
    if (phase !== 'offers') return;
    if (left <= 0) { decide(false, true); return; }
    if (left === SECONDS) return;          // the order's own buzz covers the first second
    const k = 1 - left / SECONDS;
    sfx.clock(k);
    if (left <= 4) { const t = setTimeout(() => sfx.clock(Math.min(1, k + 0.04)), 500); return () => clearTimeout(t); }
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  const urgency = left <= 4 ? 'urgent' : left <= 7 ? 'hurry' : '';

  function decide(accept: boolean, timeout = false) {
    if (accept) { setDone((d) => d + 1); setEarned((e) => e + offer.pay); sfx.cash(); }
    else {
      const r = rejects + 1;
      setRejects(r);
      if (r > REJECTS_ALLOWED) { setLost(true); sfx.error(); }
    }
    setTook((t) => [...t, accept ? 'acc' : timeout ? 'late' : 'rej']);
    if (i + 1 >= OFFERS.length) { note('offer', { done: done + (accept ? 1 : 0), rejects: rejects + (accept ? 0 : 1) }); setPhase('recap'); }
    else setI(i + 1);
  }

  const pct = Math.min(100, (done / target) * 100);

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun · Flopcart Partner" battery={phase === 'lab' ? 12 : 71} model="android" time={phase === 'lab' ? '22:30' : phase === 'nextday' || phase === 'reveal' ? '07:02' : phase === 'odometer' ? '09:58' : phase === 'recap' ? '09:33' : '09:31'}>
          {phase === 'lab' ? (
            <>
              <PartnerHeader earned={Math.round(day.gross + day.bonus)} online={false} />
              <DayPhone v={dayFor(scheme)} />
            </>
          ) : (
            <PartnerHeader earned={earned} extra={
              <div className="zp-bar" aria-label={`Bonus progress ${done} of ${target}`}>
                <div className="zp-bar-top"><span>Daily bonus ₹{bonus}</span><span>{done}/{target}</span></div>
                <div className="zp-track"><i style={{ width: `${pct}%` }} /><b className="flag" style={{ left: '100%' }}>⚑</b></div>
                {lost && <span className="zp-lost">Bonus lost: too many rejections today</span>}
              </div>
            } />
          )}
          {phase === 'offers' && offer && (
            <div className="zp-body">
              <div className={`zp-offer ${urgency}`} key={i}>
                <div className={`zp-timer ${urgency}`}><i style={{ width: `${(left / SECONDS) * 100}%` }} /></div>
                <p className="zp-pay">₹{offer.pay}</p>
                <p className="tiny">{offer.km} km · ₹{(offer.pay / offer.km).toFixed(1)}/km</p>
                <p className="zp-route">{offer.from} → {offer.to}</p>
                <div className="zp-actions">
                  <button className="zp-rej" onClick={() => decide(false)}>Reject</button>
                  <button className={`zp-acc ${urgency}`} autoFocus onClick={() => decide(true)}>Accept · {left}s</button>
                </div>
                <p className="tiny">Rejections today: {rejects} of {REJECTS_ALLOWED} allowed</p>
              </div>
            </div>
          )}
          {phase === 'recap' && (
            <div className="zp-body center">
              <p className="zp-title">No new orders nearby</p>
              <p className="tiny">Stay online to keep your streak.</p>
            </div>
          )}
          {phase === 'odometer' && (
            <div className="zp-body center">
              <p className="zp-title">Order delivered ✓</p>
              <div className="odo"><div><small>App distance</small><b>10.3 km</b></div><div><small>Your scooter</small><b>13.0 km</b></div></div>
              <p className="tiny">Paid for 10.3 km. The pin was on the wrong side of the flyover.</p>
              <button className="zp-go small" disabled={!odoDone} onClick={() => setPhase('nextday')}>Next morning →</button>
            </div>
          )}
          {(phase === 'nextday' || phase === 'reveal') && (
            <div className="zp-body center">
              {phase === 'nextday' && target === 15 ? (
                <button className="zp-go small" onClick={() => { sfx.ping(); setTarget(30); setBonus(205); setDone(0); setEarned(0); setLost(false); }}>Open today&rsquo;s app</button>
              ) : (
                <>
                  <Toast tone="good">🎉 New earnings model! Earn more with our upgraded bonus.</Toast>
                  <p className="tiny">Bonus ₹205 for 30 orders (yesterday: ₹130 for 15)</p>
                </>
              )}
            </div>
          )}
        </Phone>

        {phase === 'offers' && offer && (
          <div className="side-card offer-x">
            <div className="ox-top">
              <p className="kicker">09:31 · {Math.max(0, target - done)} more to the bonus</p>
              <span className={`ox-clock ${urgency}`} aria-live="off">⏱ {left}s</span>
            </div>
            <p className="ox-q">Order {i + 1} of {OFFERS.length}. Decide before it&rsquo;s gone.</p>
            <div className="ox-status">
              <div><small>Daily bonus</small><b>{lost ? 'Lost' : `₹${bonus}`}</b><span>{done}/{target} orders</span></div>
              <div><small>Rejections left</small><b className={rejects >= REJECTS_ALLOWED ? 'bad' : ''}>{Math.max(0, REJECTS_ALLOWED - rejects)}</b><span>of {REJECTS_ALLOWED} allowed today</span></div>
              <div><small>Earned today</small><b>₹{earned}</b><span>before petrol</span></div>
            </div>
            <p className="ox-h">This order, the whole picture</p>
            <p className="tiny">The app shows the pay in big numbers. This is what it puts in small print.</p>
            <dl className="ox-sheet" key={i}>
              <dt>Pay</dt><dd>₹{offer.pay}</dd>
              <dt>Distance</dt><dd>{offer.km} km</dd>
              <dt>Drop-off</dt><dd>{offer.to}</dd>
              <dt>Petrol (≈ ₹{PETROL}/km)</dt><dd className="bad">−₹{Math.round(offer.km * PETROL)}</dd>
              <dt>Left for Arun</dt><dd><b>₹{netOf(offer)}</b></dd>
              <dt>Per km</dt><dd className={isBad(offer) ? 'bad' : 'good'}>₹{(offer.pay / offer.km).toFixed(1)}/km · {isBad(offer) ? 'a bad trip' : 'worth it'}</dd>
            </dl>
          </div>
        )}
        {phase === 'recap' && <OfferRecap took={took} lost={lost} done={done} target={target} bonus={bonus} onNext={() => setPhase('odometer')} />}
        {phase === 'odometer' && (
          <div className="side-card odo-card">
            <p className="kicker">09:58 · you rode 2.7 km the app doesn&rsquo;t count</p>
            <Guess id="odometer" feel="The 2.7 km nobody paid for" big={false} q="Do you report it?" options={['Report it', 'Let it go']}
              onAnswer={() => setOdoDone(true)}
              reveal={(i) => i === 0 ? 'Twenty minutes later: “Distance is calculated by the system.” Three orders went to someone else.' : 'Not worth the fight. The next order is already ringing.'} />
            {odoDone && (
              <div className="odo-x">
                <p className="ox-h">What happened on this trip</p>
                <dl className="ox-sheet">
                  <dt>The app paid for</dt><dd>10.3 km</dd>
                  <dt>You actually rode</dt><dd>13.0 km</dd>
                  <dt>Ridden for nothing</dt><dd className="bad">2.7 km</dd>
                  <dt>Petrol for it (≈ ₹{PETROL}/km)</dt><dd className="bad">−₹{Math.round(2.7 * PETROL)}</dd>
                  <dt>Time for it</dt><dd className="bad">≈ {Math.round(2.7 * 3.2)} min</dd>
                </dl>
                <p className="small">The drop-off pin sat on the wrong side of the flyover, so you rode round to reach the real door. The app pays for the distance its map planned, not the distance you rode.</p>
                <p className="small">You can&rsquo;t prove it: your scooter&rsquo;s odometer isn&rsquo;t connected to the app, and there&rsquo;s no button to dispute one trip, only a support chat.</p>
                <p className="lab-verdict bad">If one order a day goes like this: about {Math.round(2.7 * 26)} km a month, ₹{Math.round(2.7 * 26 * PETROL)} of petrol and {(2.7 * 3.2 * 26 / 60).toFixed(1)} hours of riding that nobody pays for.</p>
                <p className="tiny">Use the phone: “Next morning →”.</p>
              </div>
            )}
          </div>
        )}
        {phase === 'nextday' && (
          <div className="side-card">
            {target === 15
              ? <p className="big-q">Yesterday you finished at {done}/15. A new day, the same app.</p>
              : <Guess id="offer-upgrade" q="Twice the orders for 58% more money. Is that an upgrade?" options={['Yes, more money', 'No']} correct={1}
                  onAnswer={() => setAnswered(true)}
                  reveal={<>Play the same day under both rules and see.</>} />}
            {answered && target !== 15 && <button className="btn" onClick={() => setPhase('lab')}>Play the day →</button>}
          </div>
        )}
        {phase === 'lab' && <DayLab scheme={scheme} setScheme={setScheme} onNext={() => setPhase('reveal')} />}
        {phase === 'reveal' && <Unfold impact="offer" items={UNFOLD.offer} onDone={onDone} />}
      </div>
    </div>
  );
}

/** After the five offers: what each choice meant, and how the app scored it. */
function OfferRecap({ took, lost, done, target, bonus, onNext }: { took: Took[]; lost: boolean; done: number; target: number; bonus: number; onNext: () => void }) {
  const accepted = OFFERS.filter((_, k) => took[k] === 'acc');
  const kept = accepted.reduce((s, o) => s + netOf(o), 0);
  const mins = accepted.reduce((s, o) => s + minutesFor(o.km), 0);
  const tookBad = accepted.some(isBad);
  const line = (o: Offer, t: Took) => t === 'late' ? 'Too slow. Another rider grabbed it, and the app still counted it as a rejection.'
    : t === 'rej' ? (isBad(o) ? 'Said no to a bad trip. The sensible call, and it still counts against you.' : 'Said no. Counted against you, even though it was your choice to make.')
    : isBad(o) ? `Took a bad one. ${minutesFor(o.km)} minutes across the city for ₹${netOf(o)} after petrol.` : `Good call. ₹${netOf(o)} after petrol for ${minutesFor(o.km)} minutes.`;
  return (
    <div className="side-card offer-recap">
      <p className="kicker">You had {SECONDS} seconds for each</p>
      <p className="lab-title">Here is what each choice meant.</p>
      <ul className="or-list">
        {OFFERS.map((o, k) => (
          <li key={k} className={took[k] === 'acc' ? (isBad(o) ? 'bad' : 'good') : 'no'}>
            <b>₹{o.pay} · {o.km} km · {o.to}</b><span>{line(o, took[k])}</span>
          </li>
        ))}
      </ul>
      <div className="lab-stats">
        <Stat k="Kept after petrol" v={`₹${kept}`} />
        <Stat k="Time on the road" v={`${mins} min`} />
        <Stat k="Daily bonus" v={lost ? 'Lost' : done >= target ? `₹${bonus}` : `${done}/${target}`} tone={lost ? 'bad' : 'warn'} />
      </div>
      <p className="lab-verdict bad">{lost
        ? (OFFERS.some((o, k) => took[k] === 'rej' && isBad(o))
          ? 'Saying no to bad trips was the sensible thing to do. The app punished it anyway, and the bonus is gone for the whole day.'
          : 'Saying no, or being a few seconds slow, is part of the job. The app punished it anyway, and the bonus is gone for the whole day.')
        : tookBad ? 'You kept the bonus alive by taking trips that barely paid for petrol. That is the trade the app sets up.'
        : 'You chose well and kept the bonus. Most days, the offers are not this kind.'}</p>
      <div className="lab-next"><button className="btn" onClick={onNext}>Deliver the last order →</button></div>
    </div>
  );
}
