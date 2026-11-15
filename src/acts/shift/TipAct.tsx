// ACT 4 · THE TIP. A WHAT-IF in Arun's (fictional) app, built on two DOCUMENTED US cases:
// DoorDash (NY AG, 2025) counted tips toward a guaranteed minimum; Amazon Flex (FTC, 2021) used tips to
// cover cuts to drivers' pay while telling them they got 100%. We know of no such finding in India.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';

const GUARANTEE = 60; // ₹, what the app "guarantees" for this order (FICTIONAL)
const BASE = 34;      // ₹, the platform's own contribution before tips (FICTIONAL)

export default function TipAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [tip, setTip] = useState(20);
  const [fair, setFair] = useState(false);
  const [chat, setChat] = useState(false);
  const [step, setStep] = useState<'tip' | 'reveal'>('tip');
  // the trick: the tip fills the gap up to the guarantee, so the platform pays less, not you more
  const payout = fair ? GUARANTEE + tip : Math.max(GUARANTEE, BASE + tip);
  const platformPays = payout - tip;

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Customer · Shanti Heights" battery={88} model="iphone" time="17:30" className="small-phone">
          <div className="cust-app">
            <p className="zp-title">Your order is on its way</p>
            <p className="tiny">Arun is 2 min away</p>
            <p className="small">Say thanks with a tip. <b>100% goes to your delivery partner.</b></p>
            <label className="slider dark">Tip: <b>₹{tip}</b><input type="range" min={0} max={60} step={5} value={tip} onChange={(e) => setTip(+e.target.value)} /></label>
          </div>
        </Phone>
        <Phone owner="Arun · Zipkart Partner" battery={33} model="android" time="17:31">
          <PartnerHeader earned={741} />
          <div className="zp-body center">
            <p className="zp-title">Order delivered ✓</p>
            <p className="zp-pay">₹{payout}</p>
            <p className="tiny">Your earnings for this order (includes tip)</p>
            <div className="mini-split"><span>Platform ₹{platformPays}</span><span>Customer tip ₹{tip}</span></div>
            {!chat ? (
              <button className="zp-go small ghost" onClick={() => setChat(true)}>Ask support: do I get my tips?</button>
            ) : (
              <Toast>Support: &ldquo;Hi Arun! You receive 100% of customer tips. 😊&rdquo;</Toast>
            )}
          </div>
        </Phone>
        <div className="side-card">
          {step === 'tip' ? (
            <>
              <p className="kicker">17:30 · a kind customer</p>
              <p className="big-q">Drag the customer&rsquo;s tip. Watch Arun&rsquo;s earnings.</p>
              <p className="small">
                {fair ? 'Now the tip is added on top of the guarantee, as the customer believed.' :
                  tip <= GUARANTEE - BASE ? `From ₹0 to ₹${GUARANTEE - BASE}, Arun gets exactly ₹${GUARANTEE}. The tip doesn't reach him; it replaces what the platform would have paid.` :
                    'Only the part of the tip above the gap reaches Arun.'}
              </p>
              <label className="tog"><input type="checkbox" checked={fair} onChange={(e) => setFair(e.target.checked)} /> Show how customers think it works</label>
              <button className="btn" onClick={() => { note('tip', { tip, payout }); setStep('reveal'); }}>Why would an app do this? →</button>
            </>
          ) : (
            <BehindScreen
              title={"“100% of tips”, technically"}
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
    </div>
  );
}
