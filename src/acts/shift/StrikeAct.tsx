// ACT 5 · LOG OFF AT 7. A strike call, a surge incentive two minutes before it, then the day's real ledger.
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Lab, Seg, Stat, rupees } from '../lab';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';

type Sum = 'app' | 'costs' | 'door';
// Arun's day (FICTIONAL): 10 logged-in hours before 7 pm, 2.5 unpaid hours around them, 130 km,
// petrol ₹102/L at 45 km/L, and daily phone, repairs and scooter-loan costs.
const DAY = { login: 10, extra: 2.5, km: 130, petrol: 102, mileage: 45, phone: 15, repairs: 40, emi: 80 };

const APP_RATE = 102; // the app's headline figure (a STATEMENT by Zomato's CEO, shown here in Arun's invented app)

export default function StrikeAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [choice, setChoice] = useState<'strike' | 'stay' | null>(null);
  const [step, setStep] = useState<'choice' | 'ledger' | 'reveal'>('choice');
  const [sum, setSum] = useState<Sum>('door');
  useEffect(() => {
    const ts = [0, 500, 1000].map((d) => setTimeout(sfx.chat, d));
    ts.push(setTimeout(sfx.ping, 1700));
    return () => ts.forEach(clearTimeout);
  }, []);

  const stayed = choice === 'stay';
  const gross = 1020 + (stayed ? 450 : 0);                     // FICTIONAL day's payout
  const ledger = (k: Sum) => {
    const kmToday = DAY.km + (stayed ? 15 : 0);                 // three surge orders add about 15 km
    const fuel = (kmToday / DAY.mileage) * DAY.petrol;
    const costs = k === 'app' ? 0 : fuel + DAY.phone + DAY.repairs + DAY.emi;
    const hours = DAY.login + (stayed ? 3 : 0) + (k === 'door' ? DAY.extra : 0); // staying online adds 7–10 pm
    const net = gross - costs;
    return { costs, hours, net, perHour: net / hours };
  };
  const { costs, hours, net, perHour } = ledger(sum);
  const doorRate = ledger('door').perHour;
  const bucket = doorRate >= 90 ? 0 : doorRate >= 60 ? 1 : 2;
  const [asked, setAsked] = useState(false);

  return (
    <div className="act ride-act">
      <div className="ride-row">
        <Phone owner="Arun" battery={24} model="android" time={step === 'choice' ? '18:58' : '23:05'}>
          {step === 'choice' ? (
            <div className="chat">
              <div className="chat-head">Riders · Bapunagar (86)</div>
              <div className="bubble">Imran: Tonight at 7 we all log off. Fair pay, no 10-min pressure.</div>
              <div className="bubble">Suresh: Delhi and Hyderabad are doing it too 💪</div>
              <div className="bubble">Imran: If we stay split, nothing changes.</div>
              <div className="zp-pop">
                <div className="zp-brand">flopcart <small>partner</small></div>
                <p className="zp-big">₹150 / order</p>
                <p className="tiny">Tonight only, 6 pm – midnight · rejection penalties waived</p>
                {!choice ? (
                  <div className="zp-actions">
                    <button className="zp-rej" onClick={() => setChoice('strike')}>Log off at 7</button>
                    <button className="zp-acc" onClick={() => { setChoice('stay'); sfx.cash(); }}>Stay online</button>
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
                <p className="zp-pay">₹{APP_RATE}/hr</p>
                <p className="tiny">Average partner earnings this week (logged-in time)</p>
                {step === 'ledger' && <p className="tiny" style={{ marginTop: 18 }}>Your own sum: <b style={{ color: perHour < APP_RATE ? '#c0392b' : '#1e8a57' }}>{rupees(perHour)}/hr</b></p>}
              </div>
            </>
          )}
        </Phone>

        {step === 'choice' && (
          <div className="side-card">
            <p className="kicker">18:58 · two minutes to seven</p>
            <p className="big-q">Your friends strike at 7. The app just made staying pay five times more.</p>
            {choice && <button className="btn" onClick={() => { note('strike', choice); setStep('ledger'); }}>End of shift →</button>}
          </div>
        )}
        {step === 'ledger' && (
          <Lab kicker="23:05 · Arun’s own sum" title={asked ? 'Whose sum? Pick one.' : `The app says ₹${APP_RATE} an hour.`}>
            {!asked ? (
              <Guess id="strike-sum" big={false}
                q="Take off fuel, phone, repairs and the scooter loan. Count every hour away from home. What’s left?"
                options={['₹90 or more', '₹60–90', 'Under ₹60']} correct={bucket}
                reveal={<>{rupees(doorRate)} an hour. <button className="btn small" onClick={() => setAsked(true)}>Show the sum →</button></>} />
            ) : (
              <>
                <Seg options={[['app', 'The app’s sum'], ['costs', '− costs'], ['door', '− costs, every hour']]} value={sum} onChange={setSum} />
                <p className="ledger">{rupees(gross)}{costs ? ` − ${rupees(costs)}` : ''} = <b>{rupees(net)}</b> ÷ {hours} h = <span className="big">{rupees(perHour)}/hr</span></p>
                <div className="lab-stats">
                  <Stat k="The app’s headline" v={`₹${APP_RATE}/hr`} />
                  <Stat k="This sum" v={`${rupees(perHour)}/hr`} tone={perHour < APP_RATE * 0.8 ? 'bad' : perHour < APP_RATE ? 'warn' : 'good'} />
                </div>
                <div className="lab-next"><button className="btn" onClick={() => setStep('reveal')}>Why the numbers differ →</button></div>
              </>
            )}
          </Lab>
        )}
        {step === 'reveal' && <Unfold items={UNFOLD.strike} onDone={onDone} />}
      </div>
    </div>
  );
}
