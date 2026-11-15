// THE RIDE HOME: Arun, out of battery and stranded by a puncture, becomes a customer of another app.
// The ride app "Gaadi", the stranger, the driver Mahesh and all prices are FICTIONAL.
// The claimed effects (phone model, battery, payment) come from REPORTED tests and ALLEGED viral posts;
// the companies deny them. Their sizes are taken from those single posts and tests.
import { useEffect, useState } from 'react';
import { sfx } from '../../audio/sound';
import { Phone } from '../../ui/Phone';
import { Chip } from '../../ui/Debrief';
import { useStory } from '../../story/store';
import { PriceLab, priceFor, SCENARIOS, MODELS, PAYS, AREAS, type Mode, type PhoneSet } from './PriceLab';

type Step = 'quote' | 'guess' | 'compare' | 'discount' | 'booked';
const BASE = 168;           // ₹, meter-style fare for this 6.2 km trip (invented)
const RAIN_SURGE = 1.4;     // disclosed "high demand" multiplier, same for everyone (invented, under India's 2× cap)

const fmt = (v: number) => `₹${Math.round(v)}`;

function noise(seed: number) {
  // ±8% moment-to-moment change for everyone: drivers move, demand shifts (invented)
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return 1 + ((x - Math.floor(x)) - 0.5) * 0.16;
}

export default function RideAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [step, setStep] = useState<Step>('quote');
  useEffect(() => { if (step === 'booked') sfx.ping(); }, [step]);
  const [guess, setGuess] = useState<string | null>(null);
  const [phones, setPhones] = useState<[PhoneSet, PhoneSet]>(SCENARIOS[0].v);
  const [scenario, setScenario] = useState<number | null>(0);
  const [mode, setMode] = useState<Mode>('reported');
  const [tries, setTries] = useState<{ a: number; b: number }[]>([]);
  const [median, setMedian] = useState(230);

  const quoted = BASE * RAIN_SURGE;
  const price = (i: 0 | 1, k = 1) => priceFor(phones[i], mode, quoted).price * k;
  const arunPrice = price(0);
  const strangerPrice = price(1);
  const label = (p: PhoneSet) => `${MODELS[p.model]} · ${p.battery}% · ${PAYS[p.pay]}`;
  const shownWas = quoted * 1.25; // the app's own crossed-out "regular" price (invented)

  const GUESSES = [
    { id: 'same', label: 'Same price' },
    { id: 'stranger', label: 'He pays more (iPhone)' },
    { id: 'arun', label: 'Arun pays more (6% battery)' },
    { id: 'cant', label: 'Can’t tell from two screens' },
  ];

  const tryAgain = () => {
    const n = tries.length + 1;
    setTries((t) => [...t, { a: price(0, noise(n)), b: price(1, noise(n + 0.37)) }].slice(-6));
  };

  const arunScreen = (
    <div className="ride-app">
      <div className="ra-brand">gaadi</div>
      <div className="ra-route">
        <div><span className="dot-g" /> Tyre puncture shop, Ring Road</div>
        <div><span className="dot-r" /> {phones[0].area === 'mixed' ? 'Home · Bapunagar' : AREAS[phones[0].area]}</div>
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

      {/* ---------- 2. side by side: build your own comparison ---------- */}
      {step === 'compare' && (
        <div className="compare">
          <div className="ride-row">
            <Phone owner={`Arun · ${label(phones[0])}`} battery={phones[0].battery} model={phones[0].model === 'iphone' ? 'iphone' : 'android'}>{arunScreen}</Phone>
            <div className="compare-mid lab wide">
              <p className="kicker">Try it yourself</p>
              <p className="lab-title">Same corner, same second. Change anything about either phone.</p>
              <PriceLab phones={phones} setPhones={setPhones} active={scenario} setActive={setScenario} mode={mode} setMode={setMode} quoted={quoted} prices={[arunPrice, strangerPrice]} />
              <div className="fair-test">
                <p className="small"><b>Here&rsquo;s the catch.</b> Real prices also jump around from second to second for everyone. Ask again a few times:</p>
                <button className="btn small" onClick={tryAgain}>↻ Both ask again</button>
                {tries.length > 0 && (
                  <ol className="tries">
                    {tries.map((t, i) => <li key={i}>{fmt(t.a)} vs {fmt(t.b)} <span className="muted">(gap {fmt(Math.abs(t.b - t.a))})</span></li>)}
                  </ol>
                )}
                {tries.length >= 3 && <p className="tiny">Even with <b>no</b> personal pricing, two screens disagree by chance. A single screenshot can&rsquo;t settle it. Only many paired requests, with everything else held equal, can.</p>}
              </div>
              <p className="small" style={{ marginTop: 12 }}>
                You guessed <b>{GUESSES.find((g) => g.id === guess)?.label}</b>. The honest answer: <b>nobody outside the company can tell from two screens</b>.
                The claims point in different directions, the companies deny all of them, and no regulator has made a finding.
              </p>
              {/* always visible at the bottom of the panel, however far you have scrolled */}
              <div className="lab-footer">
                <span className="tiny">Done comparing? Your fare: <b>{fmt(arunPrice)}</b></span>
                <button className="btn" onClick={() => setStep('discount')}>Book the ride →</button>
              </div>
            </div>
            <Phone owner={`Stranger · ${label(phones[1])}`} battery={phones[1].battery} model={phones[1].model === 'iphone' ? 'iphone' : 'android'}>
              <div className="ride-app">
                <div className="ra-brand">gaadi</div>
                <div className="ra-route"><div><span className="dot-g" /> Tyre puncture shop, Ring Road</div><div><span className="dot-r" /> {AREAS[phones[1].area]}</div></div>
                <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
                <div className="ra-badge">High demand: rain · fares are higher ({RAIN_SURGE}×)</div>
                <div className="ra-option sel"><div><b>Gaadi Go</b><span>4 min away · 6.2 km</span></div><div className="ra-price"><b>{fmt(strangerPrice)}</b></div></div>
              </div>
            </Phone>
          </div>
        </div>
      )}

      {/* ---------- 3. the "special price" ---------- */}
      {step === 'discount' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={5} model="android">
            {arunScreen}
            <div className="ra-cta"><button className="g-btn" onClick={() => { note('ride-booked', Math.round(arunPrice)); setStep('booked'); }}>Book Gaadi Go · {fmt(arunPrice)}</button></div>
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

      {/* ---------- 4. booked: the taxi pulls up; the ride itself happens in the street ---------- */}
      {step === 'booked' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={5} model="android">
            <div className="ride-app">
              <div className="ra-brand">gaadi</div>
              <p className="r-title">Your ride is here</p>
              <div className="ra-driver"><b>Mahesh</b> · yellow taxi · GJ 01 ●●●● · ★ 4.9</div>
              <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
              <p className="tiny" style={{ textAlign: 'center' }}>Fare {fmt(arunPrice)} · pay by UPI at the end</p>
            </div>
          </Phone>
          <div className="side-card">
            <p className="kicker">21:44 · the shutter comes down behind you</p>
            <p className="big-q">You leave the scooter outside the shop and get in.</p>
            <p className="small">Scroll to ride home through the rain.</p>
            <button className="btn" autoFocus onClick={onDone}>Get in →</button>
          </div>
        </div>
      )}
    </div>
  );
}
