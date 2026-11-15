// TRIP COMPLETE: the taxi stops outside Arun's home. What he paid, and what reached the man who drove him.
// Mahesh, his trips and costs are FICTIONAL. The guideline and the UK audit are real (see the debrief).
import { useEffect, useState } from 'react';
import { sfx } from '../../audio/sound';
import { Phone } from '../../ui/Phone';
import { useStory } from '../../story/store';
import { Lab, Presets, Range, Why, Stat, useLab, rupees, type Preset } from '../lab';

interface CV { cut: number; trips: number; cost: number }
const PRESETS: Preset<CV>[] = [
  { name: 'A 30% cut', note: 'A cut in the range drivers often describe. The platform does not show it at booking.', v: { cut: 30, trips: 12, cost: 45 } },
  { name: 'India’s 2025 guideline', note: 'Drivers using their own vehicle should get at least 80% of the fare, so a cut of at most 20%.', v: { cut: 20, trips: 12, cost: 45 } },
  { name: 'The UK audit’s worst', note: 'UK drivers who audited their own data found the platform’s share reaching about 50% on some trips.', v: { cut: 50, trips: 12, cost: 45 } },
];

export default function ArriveAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const booked = useStory((s) => (s.journal['ride-booked'] as number | undefined) ?? 235);
  const [step, setStep] = useState<'receipt' | 'driver'>('receipt');
  const lab = useLab(PRESETS);
  const { v, set } = lab;
  useEffect(() => { if (step === 'driver') sfx.reveal(); else sfx.ping(); }, [step]);

  const paid = booked;
  const driverGets = paid * (1 - v.cut / 100);
  const kept = paid - driverGets;
  const shiftNet = v.trips * (driverGets - v.cost);  // assumes his other trips pay like this one (FICTIONAL)

  return (
    <div className="act ride-act">
      <div className={`ride-row ${step === 'driver' ? 'lab-row' : ''}`}>
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
            <p className="big-q">You paid {rupees(paid)}. How much of it reaches the man who drove you?</p>
            <button className="btn" autoFocus onClick={() => setStep('driver')}>Look at Mahesh&rsquo;s phone ↻</button>
          </div>
        )}
        {step === 'driver' && (
          <>
            <Phone owner="Mahesh · driver" battery={41} model="android" time="22:41">
              <div className="ride-app driver">
                <div className="ra-brand">gaadi <small>partner</small></div>
                <p className="r-title">Trip complete</p>
                <p className="r-amt">{rupees(driverGets)}</p>
                <p className="tiny">Your earnings for this trip</p>
                <div className="split"><i style={{ width: `${100 - v.cut}%` }} /><b style={{ width: `${v.cut}%` }} /></div>
                <p className="tiny">Rider paid {rupees(paid)} · platform kept {rupees(kept)}</p>
                <div className="ra-next">New request in 0:14 · 2.1 km away · Accept?</div>
              </div>
            </Phone>
            <Lab title="Set the platform's cut. Watch Mahesh's night." hint="Neither you nor Mahesh could see this split when you booked.">
              <Presets items={PRESETS} active={lab.active} onPick={lab.pick} />
              <div className="lab-sticky">
                <div className="lab-stats">
                  <Stat k="You paid" v={rupees(paid)} />
                  <Stat k="Mahesh gets" v={rupees(driverGets)} tone={v.cut > 20 ? 'warn' : 'good'} />
                  <Stat k={`His ${v.trips} trips, after costs`} v={rupees(shiftNet)} tone={shiftNet < 1000 ? 'bad' : 'warn'} />
                </div>
              </div>
              <Range label="Platform’s cut" value={v.cut} min={10} max={60} fmt={(x) => `${x}%`} onChange={(x) => set('cut', x)} />
              <div className="lab-grid">
                <Range label="Trips in his shift" value={v.trips} min={6} max={20} onChange={(x) => set('trips', x)} />
                <Range label="Fuel and car costs per trip" value={v.cost} min={0} max={100} step={5} fmt={(x) => `₹${x}`} onChange={(x) => set('cost', x)} />
              </div>
              <Why items={[
                { label: 'DOCUMENTED', bad: v.cut > 20, text: <>India&rsquo;s 2025 aggregator guidelines say drivers using their own vehicle should get at least 80% of the fare, and cap surge at twice the base fare. States must adopt them; adoption varies.{v.cut > 20 ? ` At a ${v.cut}% cut, Mahesh gets less than that.` : ''}</> },
                { label: 'CONTESTED', text: <>258 UK drivers who audited their own data found Uber&rsquo;s share rose to as much as 50% on some trips. Uber says it does not recognise the figures.</> },
                { label: 'WHAT-IF', text: <>Gaadi and its cut are invented. Real apps rarely show either the rider or the driver how a fare is split.</> },
                { label: 'FICTIONAL', text: <>Mahesh&rsquo;s trips and costs are invented, and assume his other trips pay like yours.</> },
              ]} />
              <p className="closing">All day an app decided what Arun was worth. Tonight he paid a man in the same position.</p>
              <div className="lab-next"><button className="btn" onClick={() => { note('ride', { paid: Math.round(paid), driver: Math.round(driverGets), cut: v.cut }); onDone(); }}>Go inside →</button></div>
            </Lab>
          </>
        )}
      </div>
    </div>
  );
}
