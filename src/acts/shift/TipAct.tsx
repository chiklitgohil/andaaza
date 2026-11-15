// ACT 4 · THE TIP. A WHAT-IF in Arun's (fictional) app, built on two DOCUMENTED US cases:
// DoorDash (NY AG, 2025) counted tips toward a guaranteed minimum; Amazon Flex (FTC, 2021) used tips to
// cover cuts to drivers' pay while telling them they got 100%. We know of no such finding in India.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Lab, Presets, Range, Seg, Why, Stat, useLab, rupees, type Preset, type WhyItem } from '../lab';

type Formula = 'top' | 'fill' | 'cut';
interface PV { formula: Formula; G: number; P: number; k: number; tip: number; orders: number; tipped: number; avgTip: number }

const PRESETS: Preset<PV>[] = [
  { name: 'Tips fill the guarantee', note: 'The order is "guaranteed" ₹60. The tip is counted towards that ₹60, so the platform pays less.', v: { formula: 'fill', G: 60, P: 34, k: 60, tip: 20, orders: 300, tipped: 5, avgTip: 20 } },
  { name: 'What customers believe', note: 'The tip is added on top of what Arun would have earned anyway.', v: { formula: 'top', G: 60, P: 34, k: 60, tip: 20, orders: 300, tipped: 5, avgTip: 20 } },
  { name: 'Tips cover a pay cut', note: 'The platform quietly cuts its own pay by part of every tip.', v: { formula: 'cut', G: 60, P: 34, k: 60, tip: 20, orders: 300, tipped: 5, avgTip: 20 } },
  { name: 'A big tipper', note: 'A generous ₹60 tip under the guarantee formula. Some of it finally gets through.', v: { formula: 'fill', G: 60, P: 34, k: 60, tip: 60, orders: 300, tipped: 5, avgTip: 20 } },
];

/** What Arun receives for an order, under each formula. */
function payoutFor(v: PV, tip: number) {
  if (v.formula === 'top') return v.G + tip;
  if (v.formula === 'fill') return Math.max(v.G, v.P + tip);
  return Math.max(0, v.G - (v.k / 100) * tip) + tip;
}

export default function TipAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const lab = useLab(PRESETS);
  const { v, set } = lab;
  const [chat, setChat] = useState(false);
  const [step, setStep] = useState<'tip' | 'reveal'>('tip');
  const payout = payoutFor(v, v.tip);
  const platformPays = payout - v.tip;
  const reaches = payout - v.G;                     // how much more Arun gets because of the tip
  const perTipped = v.G + v.avgTip - payoutFor(v, v.avgTip);
  const monthKept = v.orders * (v.tipped / 100) * perTipped;

  // payout vs tip, for the chart
  const X = (t: number) => (t / 100) * 300, Y = (p: number) => 108 - (p / (v.G + 100)) * 100;
  const line = (f: (t: number) => number) => Array.from({ length: 21 }, (_, i) => i * 5).map((t) => `${X(t)},${Y(f(t))}`).join(' ');

  const why: WhyItem[] = [];
  if (v.formula === 'top') why.push({ text: <>Every rupee of the tip reaches Arun. This is what &ldquo;100% goes to your delivery partner&rdquo; sounds like it means.</> });
  if (v.formula === 'fill') {
    why.push({ bad: reaches === 0, label: 'DOCUMENTED', text: <>The tip counts towards the ₹{v.G} guarantee. Any tip up to ₹{Math.max(0, v.G - v.P)} changes nothing for Arun; it only lowers what the platform pays. New York&rsquo;s Attorney General found DoorDash paid workers this way (settled for $16.75 million, no admission).</> });
  }
  if (v.formula === 'cut') {
    why.push({ bad: true, label: 'DOCUMENTED', text: <>The platform cuts its own pay by {v.k}% of the tip, so only {100 - v.k}% of the tip is really extra. The FTC found Amazon used Flex drivers&rsquo; tips to make up for cutting their pay (Amazon paid $61.7 million). The {v.k}% is invented.</> });
  }
  why.push({ label: 'WHAT-IF', text: <>Flopcart is invented, and we know of no regulator finding that an Indian platform does this.</> });

  return (
    <div className="act ride-act">
      <div className="ride-row lab-row">
        <Phone owner="Customer · Shanti Heights" battery={88} model="iphone" time="17:30" className="small-phone">
          <div className="cust-app">
            <p className="zp-title">Your order is on its way</p>
            <p className="tiny">Arun is 2 min away</p>
            <p className="small">Say thanks with a tip. <b>100% goes to your delivery partner.</b></p>
            <label className="slider dark">Tip: <b>₹{v.tip}</b><input type="range" min={0} max={100} step={5} value={v.tip} onChange={(e) => set('tip', +e.target.value)} /></label>
          </div>
        </Phone>
        <Phone owner="Arun · Flopcart Partner" battery={33} model="android" time="17:31">
          <PartnerHeader earned={741} />
          <div className="zp-body center">
            <p className="zp-title">Order delivered ✓</p>
            <p className="zp-pay">₹{Math.round(payout)}</p>
            <p className="tiny">Your earnings for this order (includes tip)</p>
            <div className="mini-split"><span>Platform ₹{Math.round(platformPays)}</span><span>Customer tip ₹{v.tip}</span></div>
            {!chat ? (
              <button className="zp-go small ghost" onClick={() => { setChat(true); setTimeout(sfx.chat, 600); }}>Ask support: do I get my tips?</button>
            ) : (
              <Toast>Support: &ldquo;Hi Arun! You receive 100% of customer tips. 😊&rdquo;</Toast>
            )}
          </div>
        </Phone>
        {step === 'tip' ? (
          <Lab kicker="17:30 · a kind customer" title="Drag the tip. Watch what reaches Arun." hint="Then change how the app counts tips, and see who really keeps the money.">
            <Presets items={PRESETS} active={lab.active} onPick={lab.pick} />

      <div className="lab-sticky">
            <div className={`lab-verdict ${reaches >= v.tip ? 'good' : reaches > 0 ? 'warn' : 'bad'}`}>
              Customer tipped ₹{v.tip}. Arun gets ₹{Math.round(reaches)} more than without a tip. {reaches < v.tip && <>The other ₹{Math.round(v.tip - reaches)} stays with the platform.</>}
            </div>
      </div>
            <Seg label="How the app counts tips" options={[['top', 'On top'], ['fill', 'Fills the guarantee'], ['cut', 'Covers a pay cut']]} value={v.formula} onChange={(x) => set('formula', x)} />
            <div className="lab-grid">
              <Range label="Tip" value={v.tip} min={0} max={100} step={5} fmt={(x) => `₹${x}`} onChange={(x) => set('tip', x)} />
              <Range label="Order guarantee" value={v.G} min={30} max={100} step={5} fmt={(x) => `₹${x}`} onChange={(x) => set('G', x)} />
              {v.formula === 'fill' && <Range label="Platform’s minimum share" value={v.P} min={0} max={v.G} step={2} fmt={(x) => `₹${x}`} onChange={(x) => set('P', x)} />}
              {v.formula === 'cut' && <Range label="Pay cut per rupee of tip" value={v.k} min={0} max={100} step={10} fmt={(x) => `${x}%`} onChange={(x) => set('k', x)} />}
            </div>
            <svg className="lab-svg" viewBox="0 0 310 124" role="img" aria-label="Arun's pay against the tip: what customers believe, and this formula">
              <polygon points={`${line((t) => v.G + t)} ${Array.from({ length: 21 }, (_, i) => 100 - i * 5).map((t) => `${X(t)},${Y(payoutFor(v, t))}`).join(' ')}`} fill="rgba(224,96,74,0.18)" />
              <polyline points={line((t) => v.G + t)} fill="none" stroke="#f1ece2" strokeDasharray="4 4" strokeWidth="1.5" />
              <polyline points={line((t) => payoutFor(v, t))} fill="none" stroke="#f0a23c" strokeWidth="2.5" />
              <circle cx={X(v.tip)} cy={Y(payout)} r="4" fill="#f0a23c" />
              <text x="2" y="122">tip ₹0</text><text x="262" y="122">₹100</text>
              <text x="4" y={Y(v.G + 100) + 12}>what customers believe</text>
            </svg>
            <div className="legend-row"><span><i style={{ background: '#f0a23c' }} />what Arun gets</span><span><i style={{ background: 'rgba(224,96,74,0.5)' }} />tip kept by the platform</span></div>
            <Why items={why} />
            <p className="lab-k" style={{ display: 'block', marginTop: 12 }}>Over a month</p>
            <div className="lab-grid">
              <Range label="Orders a month" value={v.orders} min={100} max={500} step={20} onChange={(x) => set('orders', x)} />
              <Range label="Orders with a tip" value={v.tipped} min={1} max={40} fmt={(x) => `${x}%`} onChange={(x) => set('tipped', x)} />
            </div>
            <Range label="Average tip" value={v.avgTip} min={5} max={60} step={5} fmt={(x) => `₹${x}`} onChange={(x) => set('avgTip', x)} />
            <div className="lab-stats">
              <Stat k="Tips that never reach Arun, per month" v={rupees(monthKept)} tone={monthKept > 0 ? 'bad' : 'good'} />
              <Stat k="Across 10,000 riders" v={rupees(monthKept * 10000)} tone={monthKept > 0 ? 'bad' : 'good'} />
            </div>
            <Why title="Where the month numbers come from" open={false} items={[
              { label: 'REPORTED', text: <>A Telangana union says only about 5% of orders get a tip at all, which is the starting value here.</> },
              { label: 'FICTIONAL', text: <>Order counts, the guarantee and the 10,000 riders are invented.</> },
            ]} />
            <div className="lab-next"><button className="btn" onClick={() => { note('tip', { tip: v.tip, payout: Math.round(payout), extra: Math.round(reaches) }); setStep('reveal'); }}>Why would an app do this? →</button></div>
          </Lab>
        ) : (
          <BehindScreen
              title={'“100% of tips”, technically'}
              onNext={onDone}
              points={[
                { label: 'WHAT-IF', text: <>Arun&rsquo;s app is invented, and we know of no regulator finding that an Indian platform does this. It shows a mechanism US regulators did document:</> },
                { label: 'DOCUMENTED', text: <>New York&rsquo;s Attorney General (2025): DoorDash counted tips toward workers&rsquo; guaranteed pay, so with a $10 guarantee a $0, $3, $6 or $9 tip all paid exactly $10. $16.75 million settlement, no admission.</> },
                { label: 'DOCUMENTED', text: <>FTC (2021): Amazon used Flex drivers&rsquo; tips to make up for cutting their pay, while form emails told complaining drivers they received 100% of tips. Amazon paid $61.7 million.</> },
                { label: 'REPORTED', text: <>In India, a Telangana union says only about 5% of orders get tips at all. Zomato&rsquo;s CEO reports average earnings that exclude tips.</> },
              ]}
            />
        )}
      </div>
    </div>
  );
}
