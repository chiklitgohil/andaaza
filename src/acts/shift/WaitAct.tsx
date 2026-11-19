// ACT 3 · READY IN 2 MINUTES. Unpaid waiting, a deadline at a red light, the heat.
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';
import { DeadlineLab, DeadlinePhone, trip } from './DeadlineLab';

type Step = 'wait' | 'deliver' | 'lab' | 'heat' | 'reveal';

export default function WaitAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [step, setStep] = useState<Step>('wait');
  const [mins, setMins] = useState(0);           // minutes waited (story time)
  const [holding, setHolding] = useState(false);
  const [deadline, setDeadline] = useState(150); // seconds left on the customer's clock (story time)
  const [light, setLight] = useState(90);
  const [choice, setChoice] = useState<'fast' | 'safe' | null>(null);
  const [waiting, setWaiting] = useState(false);   // chose to wait: the red runs out faster on screen
  const RED = 90, PROMISE = 150, RIDE_LEFT = 180;  // story seconds: the red, the customer's timer, the ride still to go (FICTIONAL)
  const [cooler, setCooler] = useState(false);
  const READY_AT = 18;
  const [promise, setPromise] = useState(10);
  const monthHours = Math.round((READY_AT * 4 * 26) / 60);   // 4 waits a day, 26 days a month (FICTIONAL)
  // once the food arrives, give the reader a moment before "Start delivery" can be pressed
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (mins < READY_AT) return;
    setHolding(false);
    const t = setTimeout(() => setArmed(true), 900);
    return () => clearTimeout(t);
  }, [mins]);

  // waiting: the food is "ready" in the app, not in the kitchen. Hold the button to let time pass.
  useEffect(() => {
    if (step !== 'wait' || !holding || mins >= READY_AT) return;
    const id = setInterval(() => setMins((m) => Math.min(READY_AT, m + 1)), 220);
    return () => clearInterval(id);
  }, [holding, step, mins]);

  useEffect(() => { if (mins > 0) sfx.tick(); if (mins === READY_AT) sfx.ping(); }, [mins]);
  // the red light and the customer's countdown run together, six story seconds per real second (faster once you choose to wait)
  useEffect(() => {
    if (step !== 'deliver' || choice) return;
    const id = setInterval(() => { setLight((l) => Math.max(0, l - 6)); setDeadline((d) => Math.max(0, d - 6)); }, waiting ? 140 : 1000);
    return () => clearInterval(id);
  }, [step, choice, waiting]);
  useEffect(() => {
    if (step !== 'deliver' || choice) return;
    if (light <= 0) { setChoice('safe'); sfx.ping(); return; }   // green: you waited it out
    if (!waiting && light < RED) sfx.clock(1 - deadline / PROMISE);
  }, [light]); // eslint-disable-line react-hooks/exhaustive-deps
  const lateBy = Math.max(0, Math.round((RIDE_LEFT - deadline) / 60));

  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const time = step === 'wait' ? `13:${String(5 + mins).padStart(2, '0')}` : step === 'deliver' || step === 'lab' ? '13:26' : '14:40';

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun · Flopcart Partner" battery={52} model="android" time={time}>
          <PartnerHeader earned={433} />
          {step === 'wait' && (
            <div className="zp-body center">
              <p className="zp-title">Shree Ganesh Restaurant</p>
              <Toast tone="good">Order ready for pickup ✓</Toast>
              <p className="tiny">Kitchen: &ldquo;2 minutes, bhai.&rdquo;</p>
              <div className="wait-clock"><b>{mins}</b><small>minutes waiting</small></div>
              <p className="tiny">Earnings while waiting: <b>₹0</b></p>
              {mins < READY_AT ? (
                <button
                  key="hold"
                  className="zp-go small"
                  onPointerDown={() => setHolding(true)} onPointerUp={() => setHolding(false)} onPointerLeave={() => setHolding(false)}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHolding(true); }} onKeyUp={() => setHolding(false)}
                >Hold to wait…</button>
              ) : (
                // a different element (key), so letting go of "Hold to wait" can't click it by accident
                <button key="go" className="zp-go small" disabled={!armed} onClick={() => { note('wait', { mins }); setStep('deliver'); }}>Food handed over · Start delivery</button>
              )}
            </div>
          )}
          {step === 'deliver' && (
            <div className="zp-body center">
              <p className="zp-title">Delivering to Shanti Heights</p>
              <p className="tiny">1.2 km left</p>
              <p className="tiny">Customer sees</p>
              <div className={`deadline ${deadline < RIDE_LEFT ? 'late' : ''}`}>Arriving in {mm(deadline)}</div>
              {choice && <Toast tone={choice === 'fast' ? 'warn' : 'info'}>{choice === 'fast' ? 'Delivered ✓ · on time' : 'Delivered ✓ · Delayed'}</Toast>}
            </div>
          )}
          {step === 'lab' && <DeadlinePhone v={trip(promise)} />}
          {(step === 'heat' || step === 'reveal') && (
            <div className="zp-body center">
              <p className="zp-title">43°C · Heat advisory</p>
              <Toast>Stay hydrated! Rest points near you: 1</Toast>
              <button className="zp-go small" onClick={() => { setCooler(true); setStep('reveal'); }}>Go to rest point</button>
              {cooler && <p className="tiny">The cooler blows warm air. The water jug is empty.</p>}
            </div>
          )}
        </Phone>

        {step === 'wait' && (
          <div className="side-card">
            <p className="kicker">13:05 · the lunch rush</p>
            <p className="big-q">The app says the food is ready. The kitchen says two minutes. Hold the button to wait.</p>
            {mins >= READY_AT && (
              <Guess id="wait-hours" big={false}
                q={`Waits like this, about 4 a day, 26 days a month. How many unpaid hours is that?`}
                options={['About 5', 'About 15', 'About 30']} correct={2}
                reveal={`About ${monthHours} hours a month, paid ₹0.`} />
            )}
          </div>
        )}
        {step === 'deliver' && (
          <div className="side-card junction">
            <p className="kicker">13:26 · the junction on Naroda Road</p>
            <div className="jx">
              <div className={`tlight ${choice === 'fast' ? 'ran' : ''}`} role="img" aria-label={light > 0 ? `Traffic light: red, ${light} seconds left` : 'Traffic light: green'}>
                <i className={`lamp red ${light > 0 ? 'on' : ''}`} />
                <i className="lamp amber" />
                <i className={`lamp green ${light <= 0 ? 'on' : ''}`} />
                <b>{light > 0 ? `${light}s` : 'GO'}</b>
              </div>
              <div className="jx-text">
                <p className="big-q">{choice === 'fast' ? 'You went through on red.' : light > 0 ? 'The light just turned red.' : 'Green.'}</p>
                <dl className="ox-sheet">
                  <dt>Customer&rsquo;s timer</dt><dd className={deadline < RIDE_LEFT ? 'bad' : ''}>{mm(deadline)}</dd>
                  <dt>Ride still to go</dt><dd>1.2 km · about {mm(RIDE_LEFT)}</dd>
                  <dt>Red light left</dt><dd>{light > 0 ? `${light}s` : '—'}</dd>
                </dl>
              </div>
            </div>
            {!choice ? (
              <>
                <p className="small">Wait for green and you&rsquo;ll be late. Go now and you might make it.</p>
                <div className="jx-actions">
                  <button className="btn danger" onClick={() => { setChoice('fast'); sfx.whoosh(); }}>Go now, through the red</button>
                  <button className="btn ghost" disabled={waiting} onClick={() => setWaiting(true)}>{waiting ? `Waiting… ${light}s` : 'Wait for green'}</button>
                </div>
              </>
            ) : (
              <>
                <p className="lab-verdict bad">{choice === 'fast'
                  ? 'A truck horn blares beside you. You make it with a minute to spare, hands shaking.'
                  : `You waited. You arrive about ${lateBy} minute${lateBy === 1 ? '' : 's'} after the customer’s timer ran out, and the app marks the order “Delayed”.`}</p>
                <div className="lab-next"><button className="btn" onClick={() => { note('wait-choice', choice); setStep('lab'); }}>Next order →</button></div>
              </>
            )}
          </div>
        )}
        {step === 'lab' && <DeadlineLab promise={promise} setPromise={setPromise} onNext={() => setStep('heat')} />}
        {step === 'heat' && (
          <div className="side-card">
            <p className="kicker">14:40 · 43°C</p>
            <Guess id="heat" feel="43°C, and the bonus needs you until 4" q="Your head is spinning. The bonus needs you online until 4. Do you log off?" options={['Log off and rest', 'Stay for the bonus']}
              reveal={(i) => i === 0 ? 'You sit in the shade. Today’s bonus is gone.' : 'You stay. At a red light, the road tilts for a second.'} />
          </div>
        )}
        {step === 'reveal' && <Unfold impact="wait" items={UNFOLD.wait} onDone={onDone} />}
      </div>
    </div>
  );
}
