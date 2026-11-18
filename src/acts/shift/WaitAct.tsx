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
  useEffect(() => { if (step === 'deliver' && light === 0) sfx.ping(); }, [light, step]);

  // the red light and the customer's countdown run together
  useEffect(() => {
    if (step !== 'deliver' || choice) return;
    const id = setInterval(() => { setLight((l) => Math.max(0, l - 3)); setDeadline((d) => Math.max(0, d - 3)); }, 100);
    return () => clearInterval(id);
  }, [step, choice]);

  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const time = step === 'wait' ? `13:${String(5 + mins).padStart(2, '0')}` : step === 'deliver' ? '13:26' : '14:40';

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
              <p className="tiny">Customer sees</p>
              <div className={`deadline ${deadline < 90 ? 'late' : ''}`}>Arriving in {mm(deadline)}</div>
              <div className="signal"><span className={light > 0 ? 'red' : 'green'} /> {light > 0 ? `Red light · ${light}s` : 'Green'}</div>
              {!choice ? (
                <div className="zp-actions col">
                  <button className="zp-rej" onClick={() => { setChoice('fast'); sfx.whoosh(); }}>Squeeze through on amber, take the wrong side</button>
                  <button className="zp-acc" onClick={() => setChoice('safe')}>Wait for green</button>
                </div>
              ) : (
                <Toast tone={choice === 'fast' ? 'warn' : 'info'}>
                  {choice === 'fast' ? 'You make it with a minute to spare. A truck horn is still ringing in your ears.' : 'Delivered 4 minutes after the customer’s timer. The app shows "Delayed". You wonder if it counts against you.'}
                </Toast>
              )}
              {choice && <button className="zp-go small" onClick={() => { note('wait-choice', choice); setStep('lab'); }}>Next order →</button>}
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
          <div className="side-card">
            <p className="big-q">Their countdown keeps running. Your light is red. What do you do?</p>
          </div>
        )}
        {step === 'lab' && <DeadlineLab promise={promise} setPromise={setPromise} onNext={() => setStep('heat')} />}
        {step === 'heat' && <div className="side-card"><p className="big-q">By 2:40 pm the road shimmers. Your bonus needs you online until 4.</p></div>}
        {step === 'reveal' && <Unfold items={UNFOLD.wait} onDone={onDone} />}
      </div>
    </div>
  );
}
