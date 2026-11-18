// ACT 1 lab: one control, the company's pass mark. Arun's conditions are fixed (helmet off, under a streetlight,
// an old phone). Every point value and spread is invented to show the mechanism; real systems do not publish theirs.
import { useState } from 'react';
import { Lab, Range, Stat } from '../lab';
import { Guess } from '../guess';
import { Toast } from './common';

const SCORE = 81;          // Arun's match score this morning (FICTIONAL)
const START_MARK = 80;

/** Standard normal cumulative distribution. */
function phi(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
/** Of 1,000 honest riders in Arun's conditions, and 1,000 tries by someone else, how many each way. */
const errors = (mark: number) => ({
  locked: Math.round(phi((mark - SCORE) / 7) * 1000),
  impostors: Math.round((1 - phi((mark - 50) / 13)) * 1000),
});

/** Arun's phone while you move the pass mark. */
export function FacePhone({ mark }: { mark: number }) {
  const pass = SCORE >= mark;
  return (
    <div className="zp-body">
      <p className="zp-title">Verify it&rsquo;s you</p>
      <div className={`selfie lit ${pass ? 'ok' : 'fail'}`} aria-label="Simulated selfie preview (no camera is used)">
        <div className="face"><div className="helmet off" /><div className="eyes" /><div className="mouth" /></div>
        <div className="oval" />
        <span className="sim-tag">SIMULATED · no camera</span>
      </div>
      <div className="face-meter" aria-label={`Match score ${SCORE} out of 100; pass mark ${mark}`}>
        <i style={{ width: `${SCORE}%` }} className={pass ? 'ok' : 'no'} />
        <b style={{ left: `${mark}%` }} />
      </div>
      <p className="tiny">Match score <b>{SCORE}</b> · pass mark <b>{mark}</b></p>
      <Toast tone={pass ? 'good' : 'warn'}>{pass ? 'Verified. You’re online.' : 'Face does not match your profile photo.'}</Toast>
    </div>
  );
}

export function FaceLab({ mark, setMark, onNext }: { mark: number; setMark: (m: number) => void; onNext: () => void }) {
  const [asked, setAsked] = useState(false);
  const { locked, impostors } = errors(mark);
  const base = errors(START_MARK);
  const curve = (mean: number, sd: number) => {
    const pts: string[] = [];
    for (let x = 20; x <= 100; x += 2) { const y = Math.exp(-((x - mean) ** 2) / (2 * sd * sd)); pts.push(`${(x - 20) * 4},${70 - y * 60}`); }
    return pts.join(' ');
  };
  const x = (mark - 20) * 4;
  return (
    <Lab kicker="06:58 · you got in" title={asked ? 'Now you set the pass mark.' : 'Arun scored 81. The pass mark was 80.'}>
      {!asked ? (
        <Guess
          id="verify-mark" big={false}
          q="The company raises the pass mark to stop cheats. Who pays most for it?"
          options={['The cheats', 'Honest riders like Arun']} correct={1}
          reveal={<>Honest riders. Drag the pass mark and watch. <button className="btn small" onClick={() => setAsked(true)}>Show me →</button></>}
        />
      ) : (
        <>
          <Range label="Company’s pass mark" value={mark} min={60} max={98} fmt={(v) => `${v}/100`} onChange={setMark} />
          <svg className="lab-svg" viewBox="0 0 320 84" role="img" aria-label="Score spread for honest riders and for someone else using the account, with the pass mark">
            <polyline points={curve(50, 13)} fill="none" stroke="#e0604a" strokeWidth="2" />
            <polyline points={curve(SCORE, 7)} fill="none" stroke="#7fd1a0" strokeWidth="2" />
            <line x1={x} x2={x} y1="4" y2="72" stroke="#f1ece2" strokeDasharray="3 3" />
            <text x={Math.min(x + 4, 262)} y="12">pass mark</text>
          </svg>
          <div className="legend-row"><span><i style={{ background: '#7fd1a0' }} />honest riders</span><span><i style={{ background: '#e0604a' }} />someone else</span></div>
          <div className="lab-stats">
            <Stat k="Honest riders locked out, of 1,000" v={locked} tone={locked > base.locked ? 'bad' : 'warn'} />
            <Stat k="Cheats let in, of 1,000" v={impostors} tone={impostors > 20 ? 'bad' : 'good'} />
          </div>
          <div className="lab-next"><button className="btn" onClick={onNext}>Book today&rsquo;s slots →</button></div>
        </>
      )}
    </Lab>
  );
}
