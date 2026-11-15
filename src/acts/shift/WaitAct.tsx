// ACT 3 · READY IN 2 MINUTES. Unpaid waiting, a deadline at a red light, the heat.
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';

type Step = 'wait' | 'deliver' | 'heat' | 'reveal';

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

  // waiting: the food is "ready" in the app, not in the kitchen. Hold the button to let time pass.
  useEffect(() => {
    if (step !== 'wait' || !holding || mins >= READY_AT) return;
    const id = setInterval(() => setMins((m) => Math.min(READY_AT, m + 1)), 220);
    return () => clearInterval(id);
  }, [holding, step, mins]);

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
        <Phone owner="Arun · Zipkart Partner" battery={52} model="android" time={time}>
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
                  className="zp-go small"
                  onPointerDown={() => setHolding(true)} onPointerUp={() => setHolding(false)} onPointerLeave={() => setHolding(false)}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHolding(true); }} onKeyUp={() => setHolding(false)}
                >Hold to wait…</button>
              ) : (
                <button className="zp-go small" onClick={() => { note('wait', { mins }); setStep('deliver'); }}>Food handed over · Start delivery</button>
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
                  <button className="zp-rej" onClick={() => setChoice('fast')}>Squeeze through on amber, take the wrong side</button>
                  <button className="zp-acc" onClick={() => setChoice('safe')}>Wait for green</button>
                </div>
              ) : (
                <Toast tone={choice === 'fast' ? 'warn' : 'info'}>
                  {choice === 'fast' ? 'You make it with a minute to spare. A truck horn is still ringing in your ears.' : 'Delivered 4 minutes after the customer’s timer. The app shows "Delayed". You wonder if it counts against you.'}
                </Toast>
              )}
              {choice && <button className="zp-go small" onClick={() => { note('wait-choice', choice); setStep('heat'); }}>Next order →</button>}
            </div>
          )}
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
            <p className="big-q">The app says the food is ready. The kitchen says two minutes. It is never two minutes.</p>
            <p className="small">Hold the button to wait. Watch what your earnings do while you stand here.</p>
            {mins >= READY_AT && <p className="bad">{READY_AT} minutes of your shift. ₹0.</p>}
          </div>
        )}
        {step === 'deliver' && (
          <div className="side-card">
            <p className="big-q">The customer is watching a countdown. You are watching a red light.</p>
            <p className="small">The clock on their screen keeps running while you wait. What do you do?</p>
          </div>
        )}
        {step === 'heat' && <div className="side-card"><p className="big-q">By 2:40 pm the road shimmers. Your bonus needs you online until 4.</p></div>}
        {step === 'reveal' && (
          <BehindScreen
            title="Work the app does not count"
            onNext={onDone}
            points={[
              { label: 'REPORTED', text: <>Interviews with Indian delivery riders (arXiv, 2025) describe waiting and constant app-tapping as unpaid &ldquo;invisible labour&rdquo;. Zomato says its hourly figures include waiting time.</> },
              { label: 'CONTESTED', text: <>All 13 Blinkit and Zepto riders Reuters interviewed (2022) said 10-minute deadlines often made them speed. Blinkit&rsquo;s CEO said riders are not penalised for delays.</> },
              { label: 'STATEMENT', text: <>In January 2026, after the Labour Minister met the platforms, Blinkit dropped &ldquo;10 minutes&rdquo; from its branding. Zomato&rsquo;s CEO says riders never see the customer&rsquo;s timer.</> },
              { label: 'REPORTED', text: <>A reporter who worked shifts in Delhi&rsquo;s 43°C heat (The Wire, May 2026) earned ₹44 for 57 minutes and found a cooler with an empty tank. Platforms said they provide coolers, vests and glucose.</> },
            ]}
          />
        )}
      </div>
    </div>
  );
}
