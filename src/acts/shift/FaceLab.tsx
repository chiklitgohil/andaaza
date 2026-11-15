// ACT 1 lab: how a match score and a company-chosen pass mark decide whether a rider can work.
// Every point value and spread is invented to show the mechanism; the factors come from reports.
import { Lab, Presets, Range, Seg, Toggle, Why, Stat, useLab, type Preset, type WhyItem } from '../lab';
import { Toast } from './common';

export interface FV { light: number; helmet: boolean; smudge: boolean; cam: 'old' | 'mid' | 'new'; change: 'none' | 'beard' | 'glasses'; strict: number }

export const FACE_PRESETS: Preset<FV>[] = [
  { name: '06:50, as Arun was', note: 'Still dark, helmet on, a dusty lens, an ₹8,000 phone.', v: { light: 15, helmet: true, smudge: true, cam: 'old', change: 'none', strict: 80 } },
  { name: 'Under a streetlight', note: 'Helmet off and a little light. Close, but is it enough?', v: { light: 45, helmet: false, smudge: false, cam: 'old', change: 'none', strict: 80 } },
  { name: 'Daylight, new phone', note: 'The kind of conditions a face matcher works best in.', v: { light: 90, helmet: false, smudge: false, cam: 'new', change: 'none', strict: 80 } },
  { name: 'Shaved his beard', note: 'Good light and no helmet, but his face no longer looks like his profile photo.', v: { light: 85, helmet: false, smudge: false, cam: 'old', change: 'beard', strict: 80 } },
  { name: 'Company gets stricter', note: 'Nothing about Arun changes. Someone at the company raises the pass mark.', v: { light: 70, helmet: false, smudge: false, cam: 'old', change: 'none', strict: 92 } },
];

export function faceScore(v: FV) {
  const why: WhyItem[] = [];
  let score = 94;
  const add = (pts: number, text: string, label?: WhyItem['label']) => {
    if (!pts) return;
    score += pts;
    why.push({ delta: `${pts > 0 ? '+' : '−'}${Math.abs(pts)}`, text, label, bad: pts < 0 });
  };
  add(-Math.round(Math.max(0, 60 - v.light) * 0.45), 'Low light hides the edges of a face. More than a dozen Indian drivers told MIT Technology Review they had to find better light, even pull over under a streetlight, to avoid being locked out.', 'REPORTED');
  if (v.helmet) add(-18, 'A helmet covers the forehead and the outline of the face, so there is less to compare.', 'WHAT-IF');
  if (v.smudge) add(-8, 'A dusty or scratched lens blurs the picture.', 'WHAT-IF');
  if (v.cam === 'old') add(-6, 'An expert told MIT Technology Review that a phone camera without good contrast makes the edges of a face hard to detect.', 'REPORTED');
  if (v.cam === 'new') add(2, 'A newer camera gives a sharper picture.', 'WHAT-IF');
  if (v.change === 'beard') add(-12, 'His face has changed since the profile photo. Many drivers surveyed by MIT Technology Review suspected a change in appearance, such as facial hair, caused their lockout.', 'REPORTED');
  if (v.change === 'glasses') add(-5, 'New glasses change the area around the eyes.', 'WHAT-IF');
  return { score: Math.max(0, Math.min(100, score)), why };
}

/** Standard normal cumulative distribution. */
function phi(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/** What Arun's phone shows while you change the conditions. */
export function FacePhone({ v }: { v: FV }) {
  const { score } = faceScore(v);
  const pass = score >= v.strict;
  const bright = 0.35 + (v.light / 100) * 0.9;
  return (
    <div className="zp-body">
      <p className="zp-title">Verify it&rsquo;s you</p>
      <div className={`selfie ${v.light > 50 ? 'lit' : ''} ${pass ? 'ok' : 'fail'}`} style={{ filter: `brightness(${bright})` }} aria-label="Simulated selfie preview (no camera is used)">
        <div className="face">
          <div className={`helmet ${v.helmet ? '' : 'off'}`} />
          <div className="eyes" /><div className="mouth" />
        </div>
        <div className="oval" />
        {v.smudge && <div className="smudge" />}
        <span className="sim-tag">SIMULATED · no camera</span>
      </div>
      <div className="face-meter" aria-label={`Match score ${score} out of 100; pass mark ${v.strict}`}>
        <i style={{ width: `${score}%` }} className={pass ? 'ok' : 'no'} />
        <b style={{ left: `${v.strict}%` }} />
      </div>
      <p className="tiny">Match score <b>{score}</b> · pass mark <b>{v.strict}</b></p>
      <Toast tone={pass ? 'good' : 'warn'}>{pass ? 'Verified. You’re online.' : 'Face does not match your profile photo.'}</Toast>
    </div>
  );
}

export function FaceLab({ lab, onNext }: { lab: ReturnType<typeof useLab<FV>>; onNext: () => void }) {
  const { v, set } = lab;
  const { score, why } = faceScore(v);
  const pass = score >= v.strict;
  // 1,000 honest riders checking in under these same conditions, and 1,000 attempts by someone else
  const locked = Math.round(phi((v.strict - score) / 7) * 1000);
  const impostors = Math.round((1 - phi((v.strict - 50) / 13)) * 1000);
  const curve = (mean: number, sd: number) => {
    const pts: string[] = [];
    for (let x = 20; x <= 100; x += 2) { const y = Math.exp(-((x - mean) ** 2) / (2 * sd * sd)); pts.push(`${(x - 20) * 4},${70 - y * 60}`); }
    return pts.join(' ');
  };
  const mark = (v.strict - 20) * 4;
  return (
    <Lab title="What decides whether you can work today?" hint="Pick a morning, or change anything yourself. Arun's phone shows the result.">
      <Presets items={FACE_PRESETS} active={lab.active} onPick={lab.pick} />
      <Range label="Light on your face" value={v.light} min={0} max={100} fmt={(x) => (x < 25 ? 'dark' : x < 55 ? 'dim' : x < 80 ? 'good' : 'daylight')} onChange={(x) => set('light', x)} />
      <div className="lab-grid">
        <Toggle label="Helmet on" value={v.helmet} onChange={(x) => set('helmet', x)} />
        <Toggle label="Dusty lens" value={v.smudge} onChange={(x) => set('smudge', x)} />
      </div>
      <Seg label="Phone camera" options={[['old', '₹8,000 phone'], ['mid', 'Mid-range'], ['new', 'New flagship']]} value={v.cam} onChange={(x) => set('cam', x)} />
      <Seg label="Since your profile photo" options={[['none', 'No change'], ['beard', 'Shaved beard'], ['glasses', 'New glasses']]} value={v.change} onChange={(x) => set('change', x)} />
      <Range label="Company’s pass mark (strictness)" value={v.strict} min={60} max={98} fmt={(x) => `${x}/100`} onChange={(x) => set('strict', x)} />

      <div className={`lab-verdict ${pass ? 'good' : 'bad'}`}>{pass ? `Score ${score}: you pass and can start work.` : `Score ${score}, below the pass mark of ${v.strict}: locked out. Try again, or wait for support.`}</div>
      <Why items={[...why, { text: <>Nothing in this list is about whether Arun is really Arun. It is about light, plastic and pixels.</> }]} />

      <p className="lab-k" style={{ display: 'block', marginTop: 14 }}>One pass mark, everyone in your conditions</p>
      <svg className="lab-svg" viewBox="0 0 320 84" role="img" aria-label="Score spread for honest riders and for impostors, with the pass mark">
        <polyline points={curve(50, 13)} fill="none" stroke="#e0604a" strokeWidth="2" />
        <polyline points={curve(score, 7)} fill="none" stroke="#7fd1a0" strokeWidth="2" />
        <line x1={mark} x2={mark} y1="4" y2="72" stroke="#f1ece2" strokeDasharray="3 3" />
        <text x="2" y="82">score 20</text><text x="290" y="82">100</text>
        <text x={Math.min(mark + 4, 262)} y="12">pass mark</text>
      </svg>
      <div className="legend-row"><span><i style={{ background: '#7fd1a0' }} />honest riders</span><span><i style={{ background: '#e0604a' }} />someone else using the account</span></div>
      <div className="lab-stats">
        <Stat k="Honest riders locked out, of 1,000" v={locked} tone={locked > 100 ? 'bad' : locked > 20 ? 'warn' : 'good'} />
        <Stat k="Impostor tries let in, of 1,000" v={impostors} tone={impostors > 20 ? 'bad' : 'good'} />
      </div>
      <Why title="Who pays for each mistake?" items={[
        { text: <>Every face check makes two kinds of error. A higher pass mark lets in fewer impostors and locks out more honest workers. The company chooses the trade-off; the worker who is locked out loses the morning.</> },
        { label: 'DOCUMENTED', text: <>A US government test of 189 face-recognition algorithms (NIST, 2019) found most made more errors for some demographic groups than others. One pass mark is not equally fair to every face.</> },
        { label: 'FICTIONAL', text: <>All point values, scores and spreads here are invented to show the mechanism. Real systems do not publish theirs.</> },
      ]} />
      <div className="lab-next"><button className="btn" onClick={onNext}>Book today&rsquo;s slots →</button></div>
    </Lab>
  );
}
