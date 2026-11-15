// ACT 5 · LOG OFF AT 7. A strike call, a surge incentive two minutes before it, then the day's real ledger.
import { useEffect, useState } from 'react';
import { Phone } from '../../ui/Phone';
import { BehindScreen, PartnerHeader, Toast } from './common';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';
import { Lab, Presets, Range, Seg, Toggle, Why, Stat, useLab, rupees, type Preset } from '../lab';

interface LV { count: 'login' | 'door'; login: number; extra: number; km: number; petrol: number; mileage: number; phone: number; repairs: number; emi: number }

const PRESETS: Preset<LV>[] = [
  { name: 'The app’s sum', note: 'Pay divided by logged-in hours. No costs. This is how a headline hourly figure is usually made.', v: { count: 'login', login: 10, extra: 2.5, km: 0, petrol: 102, mileage: 45, phone: 0, repairs: 0, emi: 0 } },
  { name: 'The union’s sum', note: 'Same hours, but take away what it cost to do the work: fuel and phone.', v: { count: 'login', login: 10, extra: 2.5, km: 100, petrol: 100, mileage: 50, phone: 10, repairs: 0, emi: 0 } },
  { name: 'Arun’s door to door', note: 'Every hour away from home, and every cost of the scooter that does the work.', v: { count: 'door', login: 10, extra: 2.5, km: 130, petrol: 102, mileage: 45, phone: 15, repairs: 40, emi: 80 } },
];

const APP_RATE = 102; // the app's headline figure (a STATEMENT by Zomato's CEO, shown here in Arun's invented app)

export default function StrikeAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [choice, setChoice] = useState<'strike' | 'stay' | null>(null);
  const [step, setStep] = useState<'choice' | 'ledger' | 'reveal'>('choice');
  const [other, setOther] = useState(false);   // show the night you didn't choose
  const lab = useLab(PRESETS, 2);
  const { v, set } = lab;
  useEffect(() => {
    const ts = [0, 500, 1000].map((d) => setTimeout(sfx.chat, d));
    ts.push(setTimeout(sfx.ping, 1700));
    return () => ts.forEach(clearTimeout);
  }, []);

  const stayed = (choice === 'stay') !== other;
  const gross = 1020 + (stayed ? 450 : 0);                     // FICTIONAL day's payout
  const kmToday = v.km ? v.km + (stayed ? 15 : 0) : 0;            // three surge orders add about 15 km
  const fuel = v.mileage ? (kmToday / v.mileage) * v.petrol : 0;
  const costs = fuel + v.phone + v.repairs + v.emi;
  const hours = v.login + (stayed ? 3 : 0) + (v.count === 'door' ? v.extra : 0); // staying online adds 7–10 pm
  const net = gross - costs;
  const perHour = net / Math.max(1, hours);

  return (
    <div className="act ride-act">
      <div className={`ride-row ${step === 'ledger' ? 'lab-row' : ''}`}>
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
            <p className="big-q">Your friends are striking at 7. Your app just made staying worth five times more.</p>
            <p className="small">Staying pays you tonight. Striking only works if enough of you do it. Nobody can see what the others will choose.</p>
            {choice && <button className="btn" onClick={() => { note('strike', choice); setStep('ledger'); }}>End of shift →</button>}
          </div>
        )}
        {step === 'ledger' && (
          <Lab kicker="Arun’s own ledger" title={`The app says ₹${APP_RATE} an hour. Do the sum yourself.`} hint="Pick whose sum to do, or set every cost and hour yourself.">
            <Presets items={PRESETS} active={lab.active} onPick={lab.pick} />
            <div className="lab-sticky">
            <p className="ledger">{rupees(gross)} − {rupees(costs)} costs = <b>{rupees(net)}</b> ÷ {hours} h = <span className="big">{rupees(perHour)}/hr</span></p>
            <div className="lab-stats">
              <Stat k="The app's headline" v={`₹${APP_RATE}/hr`} />
              <Stat k="Your sum" v={`${rupees(perHour)}/hr`} tone={perHour < APP_RATE * 0.8 ? 'bad' : perHour < APP_RATE ? 'warn' : 'good'} />
              <Stat k="Costs the rider pays" v={rupees(costs)} tone={costs ? 'bad' : undefined} />
            </div>
            </div>
            <Toggle label={stayed === (choice === 'stay') ? `Show the night I didn't choose (${choice === 'stay' ? 'striking' : 'staying'})` : 'Back to the night I chose'} value={other} onChange={setOther} />
            <p className="small">Payouts today: <b>{rupees(gross)}</b>{stayed ? ' (including ₹450 of surge orders, 7–10 pm)' : ' (₹0 after 7 pm)'}</p>
            <Seg label="Which hours count?" options={[['login', 'Logged in only'], ['door', 'Door to door']]} value={v.count} onChange={(x) => set('count', x)} />
            <div className="lab-grid">
              <Range label="Logged-in hours before 7 pm" value={v.login} min={6} max={13} step={0.5} fmt={(x) => `${x} h`} onChange={(x) => set('login', x)} />
              {v.count === 'door' && <Range label="Unpaid time around it" value={v.extra} min={0} max={4} step={0.5} fmt={(x) => `${x} h`} onChange={(x) => set('extra', x)} note="getting to the zone, waiting logged out, the ride home" />}
              <Range label="Kilometres ridden before 7 pm" value={v.km} min={0} max={180} step={5} fmt={(x) => `${x} km`} onChange={(x) => set('km', x)} />
              <Range label="Petrol price" value={v.petrol} min={90} max={115} fmt={(x) => `₹${x}/L`} onChange={(x) => set('petrol', x)} />
              <Range label="Scooter mileage" value={v.mileage} min={30} max={60} fmt={(x) => `${x} km/L`} onChange={(x) => set('mileage', x)} />
              <Range label="Phone and data" value={v.phone} min={0} max={40} fmt={(x) => `₹${x}/day`} onChange={(x) => set('phone', x)} />
              <Range label="Repairs and tyres" value={v.repairs} min={0} max={100} step={5} fmt={(x) => `₹${x}/day`} onChange={(x) => set('repairs', x)} />
              <Range label="Scooter loan (EMI)" value={v.emi} min={0} max={150} step={5} fmt={(x) => `₹${x}/day`} onChange={(x) => set('emi', x)} />
            </div>
            <Why items={[
              { text: <>{v.count === 'login' ? 'Only logged-in hours count. ' : `${v.extra} unpaid hours are counted too. `}Getting to the zone, waiting while logged out and the ride home are the rider&rsquo;s time, but a logged-in average leaves them out.</> },
              { bad: costs > 0, text: <>Fuel ({rupees(fuel)}), phone, repairs and the scooter loan are all paid by the rider. A figure that ignores them describes the platform&rsquo;s payout, not the rider&rsquo;s income.</> },
              { label: 'CONTESTED', text: <>Zomato&rsquo;s CEO said in January 2026 that riders average ₹102 an hour of logged-in time, excluding tips. The Telangana Gig and Platform Workers Union says it is about ₹81 after costs.</> },
              { label: 'FICTIONAL', text: <>Arun&rsquo;s payout and costs are invented. Set them to a day you know.</> },
            ]} />
            <div className="lab-next"><button className="btn" onClick={() => setStep('reveal')}>Why the two numbers differ →</button></div>
          </Lab>
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
