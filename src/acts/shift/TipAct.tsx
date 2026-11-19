// ACT 4 · THE TIP. A WHAT-IF in Arun's (fictional) app, built on two DOCUMENTED US cases:
// DoorDash (NY AG, 2025) counted tips toward a guaranteed minimum; Amazon Flex (FTC, 2021) used tips to
// cover cuts to drivers' pay while telling them they got 100%. We know of no such finding in India.
// On screen: one guess, the customer's tip slider, and one choice (how the app counts tips). Sources are at the end.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Lab, Seg } from '../lab';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';

type Formula = 'top' | 'fill' | 'cut';
const G = 60, P = 34, K = 60;   // order guarantee, platform's minimum share, pay cut per rupee of tip (all FICTIONAL)

/** What Arun receives for an order, under each formula. */
function payoutFor(f: Formula, tip: number) {
  if (f === 'top') return G + tip;
  if (f === 'fill') return Math.max(G, P + tip);
  return Math.max(0, G - (K / 100) * tip) + tip;
}

export default function TipAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [formula, setFormula] = useState<Formula>('fill');   // Arun's app (the what-if)
  const [tip, setTip] = useState(20);
  const [chat, setChat] = useState(false);
  const [step, setStep] = useState<'guess' | 'play' | 'reveal'>('guess');
  const payout = payoutFor(formula, tip);
  const reaches = payout - G;                        // how much more Arun gets because of the tip

  const X = (t: number) => (t / 100) * 300, Y = (p: number) => 108 - (p / (G + 100)) * 100;
  const line = (f: (t: number) => number) => Array.from({ length: 21 }, (_, i) => i * 5).map((t) => `${X(t)},${Y(f(t))}`).join(' ');

  return (
    <div className="act ride-act">
      <div className="ride-row lab-row">
        <Phone owner="Customer · Shanti Heights" battery={88} model="iphone" time="17:30" className="small-phone">
          <div className="cust-app">
            <p className="zp-title">Your order is on its way</p>
            <p className="tiny">Arun is 2 min away</p>
            <p className="small">Say thanks with a tip. <b>100% goes to your delivery partner.</b></p>
            <label className="slider dark">Tip: <b>₹{tip}</b><input type="range" min={0} max={100} step={5} value={tip} disabled={step === 'guess'} onChange={(e) => setTip(+e.target.value)} /></label>
          </div>
        </Phone>
        <Phone owner="Arun · Flopcart Partner" battery={33} model="android" time="17:30">
          <PartnerHeader earned={741} />
          <div className="zp-body center">
            <p className="zp-title">Order delivered ✓</p>
            <p className="zp-pay">{step === 'guess' ? '₹ ?' : `₹${Math.round(payout)}`}</p>
            <p className="tiny">Your earnings for this order (includes tip)</p>
            {step !== 'guess' && (!chat ? (
              <button className="zp-go small ghost" onClick={() => { setChat(true); setTimeout(sfx.chat, 600); }}>Ask support: do I get my tips?</button>
            ) : (
              <Toast>Support: &ldquo;Hi Arun! You receive 100% of customer tips. 😊&rdquo;</Toast>
            ))}
          </div>
        </Phone>
        {step === 'guess' && (
          <div className="side-card">
            <p className="kicker">17:30 · a kind customer</p>
            <Guess id="tip-reaches" q="The order pays ₹60. The customer tips ₹20. How much more does Arun get?"
              options={['₹20', '₹10', '₹0']} correct={2}
              reveal={<>₹0. The tip filled the ₹60 the app had promised, so the app paid less. <button className="btn small" onClick={() => setStep('play')}>Try other tips →</button></>} />
          </div>
        )}
        {step === 'play' && (
          <Lab kicker="Drag the tip on the customer’s phone" title={reaches >= tip ? `Arun gets all ₹${tip}.` : `Tip ₹${tip}. Arun gets ₹${Math.round(reaches)} more. The app keeps ₹${Math.round(tip - reaches)}.`}>
            <Seg label="How the app counts tips" options={[['top', 'On top'], ['fill', 'Fills the promise'], ['cut', 'Covers a pay cut']]} value={formula} onChange={setFormula} />
            <svg className="lab-svg" viewBox="0 0 310 124" role="img" aria-label="Arun's pay against the tip: what customers believe, and this formula">
              <polygon points={`${line((t) => G + t)} ${Array.from({ length: 21 }, (_, i) => 100 - i * 5).map((t) => `${X(t)},${Y(payoutFor(formula, t))}`).join(' ')}`} fill="rgba(224,96,74,0.18)" />
              <polyline points={line((t) => G + t)} fill="none" stroke="#f1ece2" strokeDasharray="4 4" strokeWidth="1.5" />
              <polyline points={line((t) => payoutFor(formula, t))} fill="none" stroke="#f0a23c" strokeWidth="2.5" />
              <circle cx={X(tip)} cy={Y(payout)} r="4" fill="#f0a23c" />
              <text x="2" y="122">tip ₹0</text><text x="262" y="122">₹100</text>
              <text x="4" y={Y(G + 100) + 12}>what customers believe</text>
            </svg>
            <div className="legend-row"><span><i style={{ background: '#f0a23c' }} />what Arun gets</span><span><i style={{ background: 'rgba(224,96,74,0.5)' }} />tip kept by the app</span></div>
            <div className="lab-next"><button className="btn" onClick={() => { note('tip', { tip, payout: Math.round(payout), extra: Math.round(reaches) }); setStep('reveal'); }}>Why would an app do this? →</button></div>
          </Lab>
        )}
        {step === 'reveal' && <Unfold impact="tip" items={UNFOLD.tip} onDone={onDone} />}
      </div>
    </div>
  );
}
