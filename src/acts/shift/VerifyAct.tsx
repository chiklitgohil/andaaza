// ACT 1 · VERIFY IT'S YOU. The selfie is SIMULATED: this page never touches your camera.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';
import { FaceLab, FacePhone } from './FaceLab';

type Step = 'offline' | 'selfie' | 'lab' | 'slots' | 'reveal';
const FIXES = [
  { id: 'helmet', label: 'Take off the helmet' },
  { id: 'light', label: 'Move under the street light' },
  { id: 'wipe', label: 'Wipe the camera lens' },
];
const SLOTS = [
  { id: 'a', t: '07:00 – 11:00', note: '' },
  { id: 'b', t: '12:00 – 16:00', note: 'Required for today’s bonus' },
  { id: 'c', t: '18:00 – 23:00', note: 'Peak · required for today’s bonus' },
];

export default function VerifyAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [step, setStep] = useState<Step>('offline');
  const [tries, setTries] = useState(0);
  const [fixed, setFixed] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<'none' | 'fail' | 'ok' | 'checking'>('none');
  const [slots, setSlots] = useState<Record<string, boolean>>({ a: true });
  const clock = `06:${String(50 + tries * 4).padStart(2, '0')}`;
  const ready = fixed.helmet && fixed.light;
  const [mark, setMark] = useState(80);

  const capture = () => {
    setResult('checking');
    sfx.shutter();
    setTimeout(() => {
      const n = tries + 1;
      setTries(n);
      // it passes once the helmet is off and the light is better, but never on the first try
      const ok = ready && n >= 2;
      setResult(ok ? 'ok' : 'fail');
      if (ok) sfx.success(); else sfx.error();
    }, 1300);
  };

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun · Flopcart Partner" battery={100} model="android" time={clock}>
          <PartnerHeader earned={0} online={step === 'slots' || step === 'reveal'} />
          {step === 'offline' && (
            <div className="zp-body center">
              <p className="zp-big">Good morning, Arun</p>
              <p className="tiny">Rating 4.82 ★ · Silver partner</p>
              <button className="zp-go" onClick={() => setStep('selfie')}>GO ONLINE</button>
            </div>
          )}
          {step === 'selfie' && (
            <div className="zp-body">
              <p className="zp-title">Verify it&rsquo;s you</p>
              <p className="tiny">For your safety, take a selfie to go online.</p>
              <div className={`selfie ${fixed.light ? 'lit' : ''} ${result}`} aria-label="Simulated selfie preview (no camera is used)">
                <div className="face">
                  <div className={`helmet ${fixed.helmet ? 'off' : ''}`} />
                  <div className="eyes" /><div className="mouth" />
                </div>
                <div className="oval" />
                {!fixed.wipe && <div className="smudge" />}
                <span className="sim-tag">SIMULATED · no camera</span>
              </div>
              {result === 'checking' && <Toast>Checking your face…</Toast>}
              {result === 'fail' && <Toast tone="warn">Face does not match your profile photo. Attempt {tries} of 3. Repeated failures may block your account.</Toast>}
              {result === 'ok' && <Toast tone="good">Verified. You&rsquo;re online.</Toast>}
              {result !== 'ok' ? (
                <button className="zp-go small" disabled={result === 'checking' || tries >= 3} onClick={capture}>{tries === 0 ? 'Take selfie' : 'Try again'}</button>
              ) : (
                <button className="zp-go small" onClick={() => setStep('lab')}>Continue</button>
              )}
              {tries >= 3 && result === 'fail' && (
                <>
                  <Toast tone="warn">Account under review. Contact support (in-app chat only).</Toast>
                  <button className="zp-go small ghost" onClick={() => { setFixed({ helmet: true, light: true, wipe: true }); setTries(1); setResult('none'); }}>
                    Wait for support (22 min later: &ldquo;remove helmet, use good light&rdquo;)
                  </button>
                </>
              )}
            </div>
          )}
          {step === 'lab' && <FacePhone mark={mark} />}
          {step === 'slots' && (
            <div className="zp-body">
              <p className="zp-title">Book today&rsquo;s slots</p>
              <div className="zp-bonus">Daily bonus <b>₹205</b> for 30 orders · login 12–4 pm required</div>
              {SLOTS.map((s) => (
                <label key={s.id} className={`zp-slot ${slots[s.id] ? 'on' : ''}`}>
                  <input type="checkbox" checked={!!slots[s.id]} onChange={(e) => setSlots((x) => ({ ...x, [s.id]: e.target.checked }))} />
                  <span><b>{s.t}</b>{s.note && <em>{s.note}</em>}</span>
                </label>
              ))}
              <button className="zp-go small" onClick={() => { note('verify', { tries, slots: Object.keys(slots).filter((k) => slots[k]) }); setStep('reveal'); }}>Confirm slots</button>
            </div>
          )}
          {step === 'reveal' && (
            <div className="zp-body center">
              <p className="zp-big">You&rsquo;re online</p>
              <p className="tiny">Waiting for orders near Bapunagar…</p>
            </div>
          )}
        </Phone>

        {step === 'selfie' && (
          <div className="side-card">
            <p className="kicker">{clock} · still dark · helmet on</p>
            <p className="big-q">No face match, no work. What do you change?</p>
            <div className="guess-grid one">
              {FIXES.map((f) => (
                <button key={f.id} className={`btn ghost ${fixed[f.id] ? 'picked' : ''}`} onClick={() => setFixed((x) => ({ ...x, [f.id]: true }))} disabled={fixed[f.id]}>
                  {fixed[f.id] ? '✓ ' : ''}{f.label}
                </button>
              ))}
            </div>
            {tries > 0 && <p className="tiny">Minutes lost to the face check so far: {tries * 4}. The morning rush has started without you.</p>}
          </div>
        )}
        {step === 'lab' && <FaceLab mark={mark} setMark={setMark} onNext={() => setStep('slots')} />}
        {step === 'slots' && (
          <div className="side-card">
            <p className="big-q">The bonus needs you online 12–4 pm, the hottest hours.</p>
            <p className="small">Try unticking that slot.</p>
            {!slots.b && <p className="bad">Without the 12–4 pm slot, today&rsquo;s bonus is gone.</p>}
          </div>
        )}
        {step === 'reveal' && <Unfold impact="verify" items={UNFOLD.verify} onDone={onDone} />}
      </div>
    </div>
  );
}
