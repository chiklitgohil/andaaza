// THE RIDE HOME: Arun, out of battery and stranded by a puncture, becomes a customer of another app.
// The ride app "Gaadi", the stranger, the driver Mahesh and all prices are FICTIONAL.
// The claimed effects (phone model, battery, payment) come from REPORTED tests and ALLEGED viral posts;
// the companies deny them. Their sizes are taken from those single posts and tests.
import { useState } from 'react';
import { Phone } from '../../ui/Phone';
import { Chip } from '../../ui/Debrief';
import { useStory } from '../../story/store';
import type { Label } from '../../content/types';

type Step = 'quote' | 'guess' | 'compare' | 'discount' | 'riding' | 'receipt' | 'driver';
const BASE = 168;           // ₹, meter-style fare for this 6.2 km trip (invented)
const RAIN_SURGE = 1.4;     // disclosed "high demand" multiplier, same for everyone (invented, under India's 2× cap)

interface Factor { id: string; who: 'arun' | 'stranger'; label: string; pct: number; tag: Label; note: string }
const FACTORS: Factor[] = [
  { id: 'phone', who: 'stranger', label: 'Phone: new iPhone', pct: 0.178, tag: 'ALLEGED', note: 'Viral posts in India (Jan 2025) showed one trip at ₹342.47 on iPhone vs ₹290.79 on Android. The regulator sent notices; Ola and Uber denied it. No finding published.' },
  { id: 'card', who: 'stranger', label: 'Paying by Amex card', pct: 0.626, tag: 'ALLEGED', note: 'One viral US video (Apr 2026): $33.05 with Amex vs $20.33 with Visa. Uber says it never sets prices by card brand.' },
  { id: 'battery', who: 'arun', label: 'Battery at 6%', pct: 0.058, tag: 'CONTESTED', note: 'One Brussels newspaper test: €17.56 at 12% vs €16.60 at 84%. A US fact-check found identical prices. Uber denies using battery.' },
];

const fmt = (v: number) => `₹${Math.round(v)}`;

function noise(seed: number) {
  // ±8% moment-to-moment change for everyone: drivers move, demand shifts (invented)
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return 1 + ((x - Math.floor(x)) - 0.5) * 0.16;
}

export default function RideAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [step, setStep] = useState<Step>('quote');
  const [guess, setGuess] = useState<string | null>(null);
  const [view, setView] = useState<'claims' | 'company'>('claims');
  const [on, setOn] = useState<Record<string, boolean>>({ phone: true, card: true, battery: true });
  const [tries, setTries] = useState<{ a: number; b: number }[]>([]);
  const [median, setMedian] = useState(230);
  const [cut, setCut] = useState(32);

  const quoted = BASE * RAIN_SURGE;
  const price = (who: 'arun' | 'stranger', k = 1) => {
    if (view === 'company') return quoted * k;
    const pct = FACTORS.filter((f) => f.who === who && on[f.id]).reduce((a, f) => a + f.pct, 0);
    return quoted * (1 + pct) * k;
  };
  const arunPrice = price('arun');
  const strangerPrice = price('stranger');
  const shownWas = quoted * 1.25; // the app's own crossed-out "regular" price (invented)
  const paid = arunPrice;
  const driverGets = paid * (1 - cut / 100);

  const GUESSES = [
    { id: 'same', label: 'Same price' },
    { id: 'stranger', label: 'He pays more (iPhone)' },
    { id: 'arun', label: 'Arun pays more (6% battery)' },
    { id: 'cant', label: 'Can’t tell from two screens' },
  ];

  const tryAgain = () => {
    const n = tries.length + 1;
    setTries((t) => [...t, { a: price('arun', noise(n)), b: price('stranger', noise(n + 0.37)) }].slice(-6));
  };

  const arunScreen = (
    <div className="ride-app">
      <div className="ra-brand">gaadi</div>
      <div className="ra-route">
        <div><span className="dot-g" /> Tyre puncture shop, Ring Road</div>
        <div><span className="dot-r" /> Home · Bapunagar</div>
      </div>
      <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
      <div className="ra-badge">High demand: rain · fares are higher ({RAIN_SURGE}×)</div>
      <div className="ra-option sel">
        <div><b>Gaadi Go</b><span>4 min away · 6.2 km</span></div>
        <div className="ra-price">
          {step === 'discount' || step === 'quote' ? <s>{fmt(shownWas)}</s> : null}
          <b>{fmt(step === 'quote' || step === 'guess' ? quoted : arunPrice)}</b>
        </div>
      </div>
      {(step === 'quote' || step === 'discount') && <div className="ra-special">✨ Special price for you!</div>}
    </div>
  );

  return (
    <div className="act ride-act">
      {/* ---------- 1. the quote, on Arun's phone ---------- */}
      {(step === 'quote' || step === 'guess') && (
        <div className="ride-row">
          <Phone owner="Arun · old Android · UPI" battery={6} model="android">
            {arunScreen}
            <div className="ra-cta">
              <button className="g-btn" disabled={step === 'quote'}>Book Gaadi Go</button>
            </div>
          </Phone>
          <div className="side-card">
            {step === 'quote' && (
              <>
                <p className="kicker">21:40 · Ring Road · raining</p>
                <p className="big-q">Under the same awning, a man in a pressed shirt opens the same app on a brand-new iPhone.</p>
                <p className="muted">Same pickup. Same drop. Same second.</p>
                <button className="btn" autoFocus onClick={() => setStep('guess')}>Look at the two screens →</button>
              </>
            )}
            {step === 'guess' && (
              <>
                <p className="big-q">Will his screen show the same price as yours?</p>
                <div className="guess-grid" role="group" aria-label="Your guess">
                  {GUESSES.map((g) => (
                    <button key={g.id} className={`btn ghost ${guess === g.id ? 'picked' : ''}`} aria-pressed={guess === g.id} onClick={() => setGuess(g.id)}>{g.label}</button>
                  ))}
                </div>
                <button className="btn" disabled={!guess} onClick={() => { note('ride-guess', guess); setStep('compare'); }}>Show me both screens →</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- 2. side by side ---------- */}
      {step === 'compare' && (
        <div className="compare">
          <div className="ride-row">
            <Phone owner="Arun · old Android · 6% · UPI" battery={6} model="android">{arunScreen}</Phone>
            <div className="compare-mid">
              <div className="seg" role="radiogroup" aria-label="Which story is true?">
                <button role="radio" aria-checked={view === 'claims'} className={view === 'claims' ? 'on' : ''} onClick={() => setView('claims')}>If the viral claims are right</button>
                <button role="radio" aria-checked={view === 'company'} className={view === 'company' ? 'on' : ''} onClick={() => setView('company')}>If the company is right</button>
              </div>
              <div className="gap-readout">
                <span>{fmt(arunPrice)}</span><em>vs</em><span>{fmt(strangerPrice)}</span>
              </div>
              {view === 'claims' ? (
                <ul className="factors">
                  {FACTORS.map((f) => (
                    <li key={f.id}>
                      <label>
                        <input type="checkbox" checked={on[f.id]} onChange={(e) => setOn((o) => ({ ...o, [f.id]: e.target.checked }))} />
                        <b>{f.label}</b> → {f.who === 'arun' ? 'Arun' : 'him'} +{Math.round(f.pct * 1000) / 10}% <Chip label={f.tag} />
                      </label>
                      <span className="tiny">{f.note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="small">The companies say prices depend on route, time, demand and supply, the same for everyone at that spot and second. Only the rain surge ({RAIN_SURGE}×) applies, and it applies to both of you. <Chip label="STATEMENT" /></p>
              )}
              <div className="fair-test">
                <p className="small"><b>Here&rsquo;s the catch.</b> Real prices also jump around from second to second for everyone. Ask again a few times:</p>
                <button className="btn small" onClick={tryAgain}>↻ Both ask again</button>
                {tries.length > 0 && (
                  <ol className="tries">
                    {tries.map((t, i) => <li key={i}>{fmt(t.a)} vs {fmt(t.b)} <span className="muted">(gap {fmt(Math.abs(t.b - t.a))})</span></li>)}
                  </ol>
                )}
                {tries.length >= 3 && view === 'company' && <p className="tiny">Even with <b>no</b> personal pricing, two screens disagree by chance. A single screenshot can&rsquo;t settle it. Only many paired requests can.</p>}
              </div>
            </div>
            <Phone owner="Stranger · new iPhone · 82% · Amex" battery={82} model="iphone">
              <div className="ride-app">
                <div className="ra-brand">gaadi</div>
                <div className="ra-route"><div><span className="dot-g" /> Tyre puncture shop, Ring Road</div><div><span className="dot-r" /> Bapunagar</div></div>
                <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
                <div className="ra-badge">High demand: rain · fares are higher ({RAIN_SURGE}×)</div>
                <div className="ra-option sel"><div><b>Gaadi Go</b><span>4 min away · 6.2 km</span></div><div className="ra-price"><b>{fmt(strangerPrice)}</b></div></div>
              </div>
            </Phone>
          </div>
          <div className="verdict">
            <p>
              You guessed <b>{GUESSES.find((g) => g.id === guess)?.label}</b>. The honest answer: <b>nobody outside the company can tell from two screens</b>.
              The claims point in different directions, the companies deny all of them, and no regulator has made a finding.
            </p>
            <button className="btn" onClick={() => setStep('discount')}>Book the ride →</button>
          </div>
        </div>
      )}

      {/* ---------- 3. the "special price" ---------- */}
      {step === 'discount' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={5} model="android">
            {arunScreen}
            <div className="ra-cta"><button className="g-btn" onClick={() => setStep('riding')}>Book Gaadi Go · {fmt(arunPrice)}</button></div>
          </Phone>
          <div className="side-card">
            <p className="kicker">Before you tap “Book”</p>
            <p className="big-q">The app says you save {fmt(shownWas - arunPrice)}. Saved compared with what?</p>
            <p className="small">The crossed-out {fmt(shownWas)} is the app&rsquo;s own number. Compare with what riders on this route usually pay instead:</p>
            <label className="slider">Usual price on this route: <b>{fmt(median)}</b>
              <input type="range" min={180} max={320} value={median} onChange={(e) => setMedian(+e.target.value)} />
            </label>
            <p className={arunPrice < median ? 'good' : 'bad'}>
              {arunPrice < median ? `By this yardstick it is a real saving of ${fmt(median - arunPrice)}.` : `By this yardstick you pay ${fmt(arunPrice - median)} MORE than usual. The "discount" is not a saving.`}
            </p>
            <p className="tiny">
              <Chip label="CONTESTED" /> Consumer Reports (June 2026) found 12.4% of the discounts it checked on Uber and Lyft were illusory. Uber says CR&rsquo;s method is flawed and that a route&rsquo;s usual price is the wrong yardstick.
            </p>
          </div>
        </div>
      )}

      {/* ---------- 4. the ride ---------- */}
      {step === 'riding' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={4} model="android">
            <div className="ride-app">
              <div className="ra-brand">gaadi</div>
              <div className="ra-driver"><b>Mahesh</b> · white hatchback · GJ 01 ●●●● · ★ 4.9</div>
              <div className="ra-map big" aria-hidden="true"><i className="ra-line" /><b className="ra-car moving" onAnimationEnd={() => setStep('receipt')} /></div>
              <p className="tiny" style={{ textAlign: 'center' }}>Rain on the windscreen. The wipers keep time.</p>
            </div>
          </Phone>
          <div className="side-card"><p className="big-q">Mahesh drives in silence. His phone, on the dashboard, keeps pinging with the next request.</p></div>
        </div>
      )}

      {/* ---------- 5. receipt, then the driver's side ---------- */}
      {(step === 'receipt' || step === 'driver') && (
        <div className={`ride-row ${step === 'driver' ? 'two' : ''}`}>
          <Phone owner="Arun" battery={3} model="android">
            <div className="ride-app receipt">
              <div className="ra-brand">gaadi</div>
              <p className="r-title">You&rsquo;ve arrived</p>
              <p className="r-amt">{fmt(paid)}</p>
              <p className="tiny">Paid by UPI · 6.2 km · 19 min</p>
              <p className="r-rate">Rate Mahesh ★★★★★</p>
            </div>
          </Phone>
          {step === 'receipt' && (
            <div className="side-card">
              <p className="big-q">You paid {fmt(paid)}. How much of it reaches the man who drove you?</p>
              <button className="btn" autoFocus onClick={() => setStep('driver')}>Look at Mahesh&rsquo;s phone ↻</button>
            </div>
          )}
          {step === 'driver' && (
            <>
              <Phone owner="Mahesh · driver" battery={41} model="android" time="22:01">
                <div className="ride-app driver">
                  <div className="ra-brand">gaadi <small>partner</small></div>
                  <p className="r-title">Trip complete</p>
                  <p className="r-amt">{fmt(driverGets)}</p>
                  <p className="tiny">Your earnings for this trip</p>
                  <div className="split"><i style={{ width: `${100 - cut}%` }} /><b style={{ width: `${cut}%` }} /></div>
                  <p className="tiny">Rider paid {fmt(paid)} · platform kept {fmt(paid - driverGets)}</p>
                  <div className="ra-next">New request in 0:14 · 2.1 km away · Accept?</div>
                </div>
              </Phone>
              <div className="side-card">
                <label className="slider">Platform&rsquo;s cut: <b>{cut}%</b>
                  <input type="range" min={10} max={55} value={cut} onChange={(e) => setCut(+e.target.value)} />
                </label>
                <p className="small">Mahesh gets <b>{fmt(driverGets)}</b>. Neither you nor he could see the split when you booked. <Chip label="WHAT-IF" /></p>
                <p className="tiny"><Chip label="DOCUMENTED" /> India&rsquo;s 2025 aggregator guidelines say drivers using their own car should get at least 80% of the fare, and cap surge at 2× the base fare. States had to adopt them; adoption varies.{cut > 20 && ' At this cut, Mahesh would get less than that.'}</p>
                <p className="tiny"><Chip label="CONTESTED" /> 258 UK drivers who audited their own data found Uber&rsquo;s cut rose to as much as 50% on some trips. Uber says it does not recognise the figures.</p>
                <p className="closing">All day an app decided what Arun was worth. Tonight he paid a man in the same position.</p>
                <button className="btn" onClick={() => { note('ride', { paid: Math.round(paid), driver: Math.round(driverGets), cut }); onDone(); }}>Go inside →</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
