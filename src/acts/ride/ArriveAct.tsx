// TRIP COMPLETE: the taxi stops outside Arun's home. What he paid, and what reached the man who drove him.
// Mahesh, his trips and costs are FICTIONAL. The cut is a WHAT-IF; the real guideline and audit unfold afterwards.
import { useEffect, useState } from 'react';
import { sfx } from '../../audio/sound';
import { Phone } from '../../ui/Phone';
import { useStory } from '../../story/store';
import { Lab, Range, Stat, rupees } from '../lab';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';

const TRIPS = 12, COST = 45;   // Mahesh's shift: trips, and fuel and car costs per trip (FICTIONAL)

export default function ArriveAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const booked = useStory((s) => (s.journal['ride-booked'] as number | undefined) ?? 235);
  const [step, setStep] = useState<'receipt' | 'driver' | 'reveal'>('receipt');
  const [cut, setCut] = useState(30);
  const [guessed, setGuessed] = useState(false);
  const [rated, setRated] = useState(false);
  useEffect(() => { if (step === 'driver') sfx.reveal(); else if (step === 'receipt') sfx.ping(); }, [step]);

  const paid = booked;
  const driverGets = paid * (1 - cut / 100);
  const shiftNet = TRIPS * (driverGets - COST);
  const options = [1, 0.8, 0.7, 0.5].map((k) => rupees(paid * k));

  return (
    <div className="act ride-act">
      <div className={`ride-row ${step !== 'receipt' ? 'lab-row' : ''}`}>
        <Phone owner="Arun" battery={3} model="android" time="22:40">
          <div className="ride-app receipt">
            <div className="ra-brand">gaadi</div>
            <p className="r-title">You&rsquo;ve arrived</p>
            <p className="r-amt">{rupees(paid)}</p>
            <p className="tiny">Paid by UPI · 6.2 km · 19 min</p>
            <p className="r-rate">Rate Mahesh ★★★★★</p>
          </div>
        </Phone>
        {step === 'receipt' && (
          <div className="side-card">
            <p className="kicker">22:40 · outside your building</p>
            <Guess id="arrive-reaches" q={`You paid ${rupees(paid)}. How much reaches Mahesh?`} options={options}
              onAnswer={() => setGuessed(true)}
              reveal={<>Nobody told you, and nobody told him. Look at his phone.</>} />
            {guessed && <button className="btn" onClick={() => setStep('driver')}>Look at Mahesh&rsquo;s phone ↻</button>}
          </div>
        )}
        {step !== 'receipt' && (
          <Phone owner="Mahesh · driver" battery={41} model="android" time="22:41">
            <div className="ride-app driver">
              <div className="ra-brand">gaadi <small>partner</small></div>
              <p className="r-title">Trip complete</p>
              <p className="r-amt">{rupees(driverGets)}</p>
              <p className="tiny">Your earnings for this trip</p>
              <div className="split"><i style={{ width: `${100 - cut}%` }} /><b style={{ width: `${cut}%` }} /></div>
              <p className="tiny">Rider paid {rupees(paid)} · platform kept {rupees(paid - driverGets)}</p>
              <div className="ra-next">New request in 0:14 · 2.1 km away · Accept?</div>
            </div>
          </Phone>
        )}
        {step === 'driver' && (
          <Lab kicker="Imagine the platform’s cut" title={`Mahesh gets ${rupees(driverGets)} of your ${rupees(paid)}.`}>
            <Range label="Platform’s cut" value={cut} min={10} max={60} fmt={(x) => `${x}%`} onChange={setCut} />
            <div className="lab-stats">
              <Stat k="Mahesh gets" v={rupees(driverGets)} tone={cut > 20 ? 'warn' : 'good'} />
              <Stat k={`His ${TRIPS} trips tonight, after fuel`} v={rupees(shiftNet)} tone={shiftNet < 1000 ? 'bad' : 'warn'} />
            </div>
            <Guess id="rate" feel="Rating Mahesh" big={false} q="The app asks you to rate Mahesh. The ride was slow in the rain." options={['★★★★★', '★★★★']}
              onAnswer={() => setRated(true)}
              reveal={(i) => i === 0 ? 'Five. You know what a four does to someone in your job.' : 'A four. Tomorrow his app may send him fewer rides. Nobody will tell him why.'} />
            {rated && <div className="lab-next"><button className="btn" onClick={() => { note('ride', { paid: Math.round(paid), driver: Math.round(driverGets), cut }); setStep('reveal'); }}>What&rsquo;s the real cut? →</button></div>}
          </Lab>
        )}
        {step === 'reveal' && <Unfold items={UNFOLD.arrive} onDone={onDone} doneLabel="Go inside →" />}
      </div>
    </div>
  );
}
