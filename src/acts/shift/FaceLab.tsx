// ACT 1 lab: one control, the company's pass mark. Arun's conditions are fixed (helmet off, under a streetlight,
// an old phone). Every point value and spread is invented to show the mechanism; real systems do not publish theirs.
import { useState } from 'react';
import { Lab, Range } from '../lab';
import { Guess } from '../guess';
import { Toast } from './common';

const SCORE = 81;          // Arun's match score this morning (FICTIONAL)
const START_MARK = 80;     // today's pass mark (FICTIONAL)
const RAISED = 90;         // the stricter mark in the question

/** Standard normal cumulative distribution. */
function phi(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
// Honest riders in Arun's conditions score around 81 (spread 7); someone else using his account around 50 (spread 13).
const HONEST = { mean: SCORE, sd: 7 }, OTHER = { mean: 50, sd: 13 };
/** Of 1,000 honest riders in Arun's conditions, and 1,000 tries by someone else, how many each way. */
const errors = (mark: number) => ({
  locked: Math.round(phi((mark - HONEST.mean) / HONEST.sd) * 1000),
  impostors: Math.round((1 - phi((mark - OTHER.mean) / OTHER.sd)) * 1000),
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

// chart geometry: scores 20..100 across 320 px, curve height 60 px above a baseline at y = 70
const X = (s: number) => (s - 20) * 4;
const hump = (c: { mean: number; sd: number }, s: number) => 70 - Math.exp(-((s - c.mean) ** 2) / (2 * c.sd * c.sd)) * 60;
const curve = (c: { mean: number; sd: number }) => Array.from({ length: 41 }, (_, i) => 20 + i * 2).map((s) => `${X(s)},${hump(c, s)}`).join(' ');
/** The area under a hump between two scores, for shading the mistakes. */
const area = (c: { mean: number; sd: number }, a: number, b: number) => {
  if (b <= a) return '';
  const pts: string[] = [`${X(a)},70`];
  for (let s = a; s <= b; s += 1) pts.push(`${X(s)},${hump(c, s)}`);
  pts.push(`${X(b)},70`);
  return pts.join(' ');
};

export function FaceLab({ mark, setMark, onNext }: { mark: number; setMark: (m: number) => void; onNext: () => void }) {
  const [asked, setAsked] = useState(false);
  const e = errors(mark), e0 = errors(START_MARK), eR = errors(RAISED);
  const trade = mark > START_MARK
    ? `Raising the pass mark from ${START_MARK} to ${mark} stops ${e0.impostors - e.impostors} more cheats, and locks out ${e.locked - e0.locked} more honest riders.`
    : mark < START_MARK
      ? `Lowering it from ${START_MARK} to ${mark} lets ${e0.locked - e.locked} more honest riders work, and lets in ${e.impostors - e0.impostors} more cheats.`
      : `At ${START_MARK}, ${e.locked} honest riders are turned away for every ${e.impostors} cheats who get through.`;
  return (
    <Lab kicker="06:58 · you got in, just" title={asked ? 'Now you are the company. Set the pass mark.' : 'Your selfie scored 81. The pass mark was 80.'}>
      {!asked ? (
        <>
          <p className="small">The app compares your selfie with your profile photo and gives it a <b>match score</b> out of 100. The company decides the <b>pass mark</b>. In dim light with an old phone, Arun&rsquo;s own face only reaches 81.</p>
          <Guess
            id="verify-mark" big={false}
            q={`To stop people logging in as someone else, the company raises the pass mark to ${RAISED}. Of 1,000 honest riders checking in like Arun, how many are now locked out?`}
            options={['About 50', 'About 300', 'Over 800']} correct={2}
            reveal={<>{eR.locked} of 1,000, and it stops only {e0.impostors - eR.impostors} more cheats. <button className="btn small" onClick={() => setAsked(true)}>See why →</button></>}
          />
        </>
      ) : (
        <>
          <Range label="Company’s pass mark" value={mark} min={60} max={98} fmt={(v) => `${v}/100`} onChange={setMark} />
          <svg className="lab-svg" viewBox="0 0 320 96" role="img" aria-label={`Scores for Arun's own face and for someone else, with the pass mark at ${mark}`}>
            <polygon points={area(HONEST, 20, Math.min(mark, 100))} fill="rgba(224, 96, 74, 0.6)" />
            <polygon points={area(OTHER, Math.max(mark, 20), 100)} fill="rgba(240, 162, 60, 0.6)" />
            <polyline points={curve(OTHER)} fill="none" stroke="#c9c3b6" strokeWidth="1.5" />
            <polyline points={curve(HONEST)} fill="none" stroke="#7fd1a0" strokeWidth="2" />
            <line x1={X(mark)} x2={X(mark)} y1="2" y2="72" stroke="#f1ece2" strokeDasharray="3 3" />
            <text x={X(OTHER.mean) - 28} y="6">someone else</text>
            <text x={X(HONEST.mean) + 6} y="6" fill="#7fd1a0">Arun</text>
            <text x="2" y="86">← refused</text>
            <text x={Math.min(X(mark) + 3, 272)} y="86">pass →</text>
            <text x="2" y="95">score 20</text><text x="296" y="95">100</text>
          </svg>
          <p className="tiny chart-key">Each hump shows how often each score comes up. Everything left of the dashed line is refused. <span className="k-red">Red</span>: honest riders wrongly refused. <span className="k-amber">Amber</span>: someone else wrongly let in.</p>
          <div className="face-stats">
            <div className="fs bad"><b>{e.locked}</b><span>of 1,000 honest riders locked out</span><small>Each one loses the morning and waits for support.</small></div>
            <div className="fs warn"><b>{e.impostors}</b><span>of 1,000 tries by someone else let in</span><small>Someone works on another person&rsquo;s account.</small></div>
          </div>
          <p className="lab-verdict bad">{trade}</p>
          <dl className="face-why">
            <dt>Who picks the pass mark?</dt><dd>The company.</dd>
            <dt>Who pays when it&rsquo;s wrong?</dt><dd>The rider who is locked out, not the company.</dd>
            <dt>Why is Arun&rsquo;s score so low?</dt><dd>The light and his phone&rsquo;s camera, not his face.</dd>
          </dl>
          <p className="tiny muted">These numbers are made up to show the trade-off. Real companies don&rsquo;t publish theirs.</p>
          <div className="lab-next"><button className="btn" onClick={onNext}>Book today&rsquo;s slots →</button></div>
        </>
      )}
    </Lab>
  );
}
