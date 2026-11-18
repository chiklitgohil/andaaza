// ACT 5 · LOG OFF AT 7. A strike call, a surge incentive two minutes before it, then the day's real ledger.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// The riders' group chat keeps moving while the offer counts down (all FICTIONAL). Times in ms from opening the phone.
const CHAT: { at: number; who: string; text: string }[] = [
  { at: 0, who: 'Imran', text: 'Tonight at 7 we all log off. Fair pay, no 10-min pressure.' },
  { at: 1200, who: 'Suresh', text: 'Delhi and Hyderabad are doing it too 💪' },
  { at: 2400, who: 'Imran', text: 'If we stay split, nothing changes.' },
  { at: 5500, who: 'Ravi', text: 'Did you all just get ₹150 an order?? 😳' },
  { at: 7500, who: 'Imran', text: 'That’s the point. Don’t take it.' },
  { at: 9500, who: 'Suresh', text: 'Arun, you in?' },
  { at: 11500, who: 'Ravi', text: 'My EMI is due Monday bhai…' },
  { at: 13500, who: 'Imran', text: '@Arun ?' },
  { at: 16000, who: 'Suresh', text: 'Seen. No reply 👀' },
  { at: 19500, who: 'Imran', text: 'We need everyone. Yes or no, Arun?' },
];
const POP_AT = 3600;   // the app's offer arrives a moment after the strike call
const DECIDE = 20;     // seconds to decide before the offer disappears

const APP_RATE = 102; // the app's headline figure (a STATEMENT by Zomato's CEO, shown here in Arun's invented app)

export default function StrikeAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [choice, setChoice] = useState<'strike' | 'stay' | null>(null);
  const [step, setStep] = useState<'choice' | 'ledger' | 'reveal'>('choice');
  const [sum, setSum] = useState<Sum>('door');
  const [replied, setReplied] = useState(false);
  const [t, setT] = useState(0);                 // ms since the phone opened; stops when Arun decides
  const [expired, setExpired] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (choice) return;
    const id = setInterval(() => setT((x) => x + 250), 250);
    return () => clearInterval(id);
  }, [choice]);
  const shown = CHAT.filter((m) => m.at <= t);
  const popped = t >= POP_AT;
  const left = Math.max(0, Math.ceil(DECIDE - (t - POP_AT) / 1000));
  useEffect(() => { if (shown.length) sfx.chat(); }, [shown.length]);
  useEffect(() => { if (popped) sfx.ping(); }, [popped]);
  useEffect(() => { if (popped && !choice && left > 0 && left <= 5) sfx.tick(); }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (popped && !choice && left <= 0) { setExpired(true); setChoice('strike'); note('strike-expired', true); sfx.error(); }
  }, [left, popped, choice, note]);
  useLayoutEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight; }, [shown.length, choice, popped]);
  const reaction = choice === 'stay' ? null : expired ? { who: 'Suresh', text: 'Arun went quiet. The offer must have timed out.' } : { who: 'Imran', text: 'Arun’s in 💪' };

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
              <div className="chat-head">Riders · Bapunagar (86){!choice && t > 2400 ? <small> · typing…</small> : null}</div>
              <div className="chat-log" ref={log}>
                {shown.map((m) => <div key={m.at} className={`bubble ${m.text.includes('Arun') ? 'at-you' : ''}`}><b>{m.who}</b> {m.text}</div>)}
                {choice && reaction && <div className="bubble"><b>{reaction.who}</b> {reaction.text}</div>}
              </div>
              {popped && <div className="zp-pop">
                <div className="zp-brand">flopcart <small>partner</small></div>
                <p className="zp-big">₹150 / order</p>
                <p className="tiny">Tonight only, 6 pm – midnight · rejection penalties waived</p>
                {!choice && <div className="zp-timer"><i style={{ width: `${(left / DECIDE) * 100}%` }} /></div>}
                {!choice ? (
                  <div className="zp-actions">
                    <button className="zp-rej" onClick={() => setChoice('strike')}>Log off at 7</button>
                    <button className="zp-acc" onClick={() => { setChoice('stay'); sfx.cash(); }}>Stay online · {left}s</button>
                  </div>
                ) : (
                  <Toast tone={choice === 'stay' ? 'good' : expired ? 'warn' : 'info'}>{choice === 'stay' ? 'You stay. Three orders at ₹150. Imran stops replying.' : expired ? 'The offer expired while you were deciding. No shift tonight.' : 'You log off. ₹0 tonight. The group fills with photos of empty dark stores.'}</Toast>
                )}
              </div>}
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
            {popped && !choice && <p className={`small countdown ${left <= 5 ? 'urgent' : ''}`}>The offer disappears in <b>{left}s</b>. The group is waiting for your answer. If you don&rsquo;t decide, you don&rsquo;t get the shift.</p>}
            {!popped && <p className="small">Read the group. The app is about to make its move.</p>}
            {choice && (
              <Guess id="imran" feel="Imran asks if you were with them" big={false} q="Later, Imran messages: “Were you with us tonight?” You reply…"
                options={choice === 'strike' ? ['“Yes. I logged off.”', '“Yes. Rent is due Friday.”', 'Leave it on read'] : ['“Sorry. I couldn’t afford not to.”', '“Next time.”', 'Leave it on read']}
                onAnswer={() => setReplied(true)}
                reveal={(i) => (choice === 'strike'
                  ? ['He sends a photo of an empty dark store. For one night, it worked.', 'He writes back: “Same for all of us.”', 'The group celebrates without you.']
                  : ['He writes back: “None of us can.”', 'He doesn’t reply.', 'The group keeps talking without you.'])[i]} />
            )}
            {replied && <button className="btn" onClick={() => { note('strike', choice); setStep('ledger'); }}>End of shift →</button>}
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
