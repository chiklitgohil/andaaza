// ACT 5 · LOG OFF AT 7. A strike call, a surge incentive two minutes before it, then the day's real ledger.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { Chip } from '../../ui/Debrief';

export default function StrikeAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [choice, setChoice] = useState<'strike' | 'stay' | null>(null);
  const [step, setStep] = useState<'choice' | 'ledger' | 'reveal'>('choice');
  const [hours, setHours] = useState(12.5);
  const [fuel, setFuel] = useState(260);
  const [other, setOther] = useState(90);
  const gross = 1020 + (choice === 'stay' ? 450 : 0);   // FICTIONAL day's payout
  const net = gross - fuel - other;
  const appRate = 102;                                   // the app's headline figure (a STATEMENT by Zomato's CEO)

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun" battery={24} model="android" time={step === 'choice' ? '18:58' : '21:05'}>
          {step === 'choice' ? (
            <div className="chat">
              <div className="chat-head">Riders · Bapunagar (86)</div>
              <div className="bubble">Imran: Tonight at 7 we all log off. Fair pay, no 10-min pressure.</div>
              <div className="bubble">Suresh: Delhi and Hyderabad are doing it too 💪</div>
              <div className="bubble">Imran: If we stay split, nothing changes.</div>
              <div className="zp-pop">
                <div className="zp-brand">zipkart <small>partner</small></div>
                <p className="zp-big">₹150 / order</p>
                <p className="tiny">Tonight only, 6 pm – midnight · rejection penalties waived</p>
                {!choice ? (
                  <div className="zp-actions">
                    <button className="zp-rej" onClick={() => setChoice('strike')}>Log off at 7</button>
                    <button className="zp-acc" onClick={() => setChoice('stay')}>Stay online</button>
                  </div>
                ) : (
                  <Toast tone={choice === 'stay' ? 'good' : 'info'}>{choice === 'stay' ? 'You stay. Three orders at ₹150. Imran stops replying.' : 'You log off. ₹0 tonight. The group fills with photos of empty dark stores.'}</Toast>
                )}
              </div>
            </div>
          ) : (
            <>
              <PartnerHeader earned={gross} online={false} />
              <div className="zp-body center">
                <p className="zp-title">Great day, Arun!</p>
                <p className="zp-pay">₹{appRate}/hr</p>
                <p className="tiny">Average partner earnings this week (logged-in time)</p>
              </div>
            </>
          )}
        </Phone>

        {step === 'choice' && (
          <div className="side-card">
            <p className="kicker">18:58 · two minutes to seven</p>
            <p className="big-q">Your friends are striking at 7. Your app just made staying worth five times more.</p>
            {choice && <button className="btn" onClick={() => { note('strike', choice); setStep('ledger'); }}>End of shift →</button>}
          </div>
        )}
        {step === 'ledger' && (
          <div className="side-card">
            <p className="kicker">Arun&rsquo;s own ledger</p>
            <p className="big-q">The app says ₹{appRate} an hour. Do the sum yourself.</p>
            <p className="small">Payouts today: <b>₹{gross}</b> <Chip label="FICTIONAL" /></p>
            <label className="slider">Hours away from home: <b>{hours}</b><input type="range" min={8} max={14} step={0.5} value={hours} onChange={(e) => setHours(+e.target.value)} /></label>
            <label className="slider">Fuel: <b>₹{fuel}</b><input type="range" min={100} max={400} step={10} value={fuel} onChange={(e) => setFuel(+e.target.value)} /></label>
            <label className="slider">Phone data, repairs, scooter EMI share: <b>₹{other}</b><input type="range" min={0} max={300} step={10} value={other} onChange={(e) => setOther(+e.target.value)} /></label>
            <p className="ledger">₹{gross} − ₹{fuel} − ₹{other} = <b>₹{net}</b> ÷ {hours} h = <span className="big">₹{Math.round(net / hours)}/hr</span></p>
            <button className="btn" onClick={() => setStep('reveal')}>Why the two numbers differ →</button>
          </div>
        )}
        {step === 'reveal' && (
          <BehindScreen
            title="Whose hour is it?"
            onNext={onDone}
            points={[
              { label: 'CONTESTED', text: <>Zomato&rsquo;s CEO said in January 2026 that riders average ₹102 an hour excluding tips, counting all logged-in time. The Telangana Gig and Platform Workers Union says the figure is about ₹81 after costs.</> },
              { label: 'REPORTED', text: <>On 25 and 31 December 2025 rider unions called national strikes over pay, safety and 10-minute delivery. Platforms offered surge incentives of ₹120–150 per order that evening; Eternal called this routine for the festive season.</> },
              { label: 'REPORTED', text: <>A 2024 survey of over 10,000 app-based workers in 8 Indian cities (&ldquo;Prisoners on Wheels&rdquo;) found 78% of delivery workers work more than 10 hours a day.</> },
              { label: 'DOCUMENTED', text: <>Fairwork India 2024 rated 11 platforms on fair pay, conditions, contracts, management and representation; none scored above 6 out of 10.</> },
            ]}
          />
        )}
      </div>
    </div>
  );
}
