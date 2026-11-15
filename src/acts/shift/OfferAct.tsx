// ACT 2 · THE OFFER. Orders on a timer, a rejection limit, a bonus target that moves.
// All amounts are FICTIONAL, shaped like those riders reported to Newslaundry (Blinkit, 2025).
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { useLab } from '../lab';
import { DayLab, DayPhone, DAY_PRESETS, simulate } from './DayLab';

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

export default function OfferAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [done, setDone] = useState(11);       // orders already done this morning (FICTIONAL)
  const [earned, setEarned] = useState(392);
  const [rejects, setRejects] = useState(0);
  const [lost, setLost] = useState(false);
  const [phase, setPhase] = useState<'offers' | 'odometer' | 'nextday' | 'lab' | 'reveal'>('offers');
  const lab = useLab(DAY_PRESETS);
  const [target, setTarget] = useState(15);
  const [bonus, setBonus] = useState(130);
  const offer = OFFERS[i];

  useEffect(() => {
    if (phase !== 'offers') return;
    setLeft(SECONDS);
    sfx.ping();
    const id = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [i, phase]);
  useEffect(() => { if (phase === 'offers' && left > 0 && left <= 3) sfx.tick(); if (phase === 'offers' && left <= 0) decide(false, true); }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  function decide(accept: boolean, timeout = false) {
    if (accept) { setDone((d) => d + 1); setEarned((e) => e + offer.pay); sfx.cash(); }
    else {
      const r = rejects + 1;
      setRejects(r);
      if (r > REJECTS_ALLOWED) { setLost(true); sfx.error(); }
      void timeout;
    }
    if (i + 1 >= OFFERS.length) { note('offer', { done: done + (accept ? 1 : 0), rejects: rejects + (accept ? 0 : 1) }); setPhase('odometer'); }
    else setI(i + 1);
  }

  const pct = Math.min(100, (done / target) * 100);

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun · Flopcart Partner" battery={phase === 'lab' ? 12 : 71} model="android" time={phase === 'lab' ? '22:30' : phase === 'nextday' || phase === 'reveal' ? '07:02' : '11:48'}>
          {phase === 'lab' ? (
            <>
              <PartnerHeader earned={Math.round(simulate(lab.v).gross + simulate(lab.v).bonus)} online={false} />
              <DayPhone v={lab.v} />
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
              <div className="zp-offer" key={i}>
                <div className="zp-timer"><i style={{ width: `${(left / SECONDS) * 100}%` }} /></div>
                <p className="zp-pay">₹{offer.pay}</p>
                <p className="tiny">{offer.km} km · ₹{(offer.pay / offer.km).toFixed(1)}/km</p>
                <p className="zp-route">{offer.from} → {offer.to}</p>
                <div className="zp-actions">
                  <button className="zp-rej" onClick={() => decide(false)}>Reject</button>
                  <button className="zp-acc" autoFocus onClick={() => decide(true)}>Accept · {left}s</button>
                </div>
                <p className="tiny">Rejections today: {rejects} of {REJECTS_ALLOWED} allowed</p>
              </div>
            </div>
          )}
          {phase === 'odometer' && (
            <div className="zp-body center">
              <p className="zp-title">Order delivered ✓</p>
              <div className="odo"><div><small>App distance</small><b>10.3 km</b></div><div><small>Your scooter</small><b>13.0 km</b></div></div>
              <p className="tiny">Paid for 10.3 km. The pin was on the wrong side of the flyover.</p>
              <button className="zp-go small" onClick={() => setPhase('nextday')}>Next morning →</button>
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
                  {phase === 'nextday' && <button className="zp-go small" onClick={() => setPhase('lab')}>Plan today →</button>}
                </>
              )}
            </div>
          )}
        </Phone>

        {phase === 'offers' && (
          <div className="side-card">
            <p className="kicker">11:48 · four more to the bonus</p>
            <p className="big-q">Each order disappears in {SECONDS} seconds. You see the pay before you see the whole route.</p>
            <p className="small">Turn down a bad one and you risk the bonus. Accept everything and some trips pay less than your fuel.</p>
          </div>
        )}
        {phase === 'odometer' && (
          <div className="side-card"><p className="big-q">You rode 2.7 km the app doesn&rsquo;t count.</p><p className="small">Nobody else can see your odometer. The app&rsquo;s number is the one that pays.</p></div>
        )}
        {phase === 'nextday' && (
          <div className="side-card">
            {target === 15
              ? <p className="big-q">Yesterday you finished at {done}/15. A new day, the same app.</p>
              : <><p className="big-q">Twice the orders for 58% more money. Is that an upgrade?</p><p className="small">Plan today and find out.</p></>}
          </div>
        )}
        {phase === 'lab' && <DayLab lab={lab} onNext={() => setPhase('reveal')} />}
        {phase === 'reveal' && (
          <BehindScreen
            title="The finish line moved overnight"
            onNext={onDone}
            points={[
              { label: 'REPORTED', text: <>Blinkit riders told Newslaundry (2025) the bonus ladder changed from ₹130 for 15 orders to ₹205 for 30. Blinkit did not answer questions.</> },
              { label: 'CONTESTED', text: <>In 2023 Blinkit switched from a flat fee to distance-based pay; riders said per-order pay fell from ₹25 to ₹15 and shut dark stores in protest. Blinkit called it an opt-in model that pays for effort.</> },
              { label: 'REPORTED', text: <>Swiggy&rsquo;s daily incentive was reported to be forfeited after more than one rejection (2021). Zomato temporarily waived rejection penalties during the Dec 2025 strike.</> },
              { label: 'ALLEGED', text: <>Riders say pins can be up to 1 km off, so they ride distance they aren&rsquo;t paid for.</> },
              { label: 'DOCUMENTED', text: <>When Shipt switched to a black-box pay formula, a worker-built audit (MIT) found 41% of workers were paid less, by about 11% on average.</> },
            ]}
          />
        )}
      </div>
    </div>
  );
}
