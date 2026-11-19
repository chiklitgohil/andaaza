// THE RIDE HOME: Arun, out of battery and stranded by a puncture, becomes a customer of another app.
// The ride app "Gaadi", the stranger, the driver Mahesh and all prices are FICTIONAL.
// The claimed effects (phone model, battery, payment) come from single viral posts and tests, which the companies deny.
import { useEffect, useState } from 'react';
import { sfx } from '../../audio/sound';
import { Phone } from '../../ui/Phone';
import { useStory } from '../../story/store';
import { Seg } from '../lab';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';
import { ARUN, STRANGER, AREAS, PhoneControls, claims, label, priceFor, type Mode, type PhoneSet } from './PriceLab';

type Step = 'quote' | 'guess' | 'compare' | 'discount' | 'booked' | 'tracked';
const BASE = 168;           // ₹, meter-style fare for this 6.2 km trip (invented)
const RAIN_SURGE = 1.4;     // disclosed "high demand" multiplier, same for everyone (invented, under India's 2× cap)

const fmt = (v: number) => `₹${Math.round(v)}`;

function noise(seed: number) {
  // ±8% moment-to-moment change for everyone: drivers move, demand shifts (invented)
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return 1 + ((x - Math.floor(x)) - 0.5) * 0.16;
}

// What a real ride app says it collects about riders: Uber's own privacy notice (see debriefs.ts). Gaadi is invented.
const TRACKED: [string, string[]][] = [
  ['Where you are', ['Your precise location, from booking to drop-off', 'Your location whenever the app is open on screen', 'Every pickup, drop-off, date and time']],
  ['Your phone', ['Phone model and operating system', 'How your phone moves (motion sensors)', 'IP address and device IDs', 'Advertising ID', 'Mobile network']],
  ['Your face and ID', ['Selfies for facial verification', 'Government ID documents']],
  ['What you say', ['Recordings of calls with drivers and support', 'Chat logs and transcripts', 'In-app audio recordings']],
  ['Your habits', ['Your search history in the app', 'Pages and features you look at', 'How often you cancel, and your ratings']],
  ['Guessed about you', ['Your gender, guessed from your first name', 'Your interests, to sell ads', 'Your “risk of conflict” with other users']],
  ['Bought from others', ['Your age range and household income range', 'Interests, lifestyle and shopping habits', 'What you watch and stream', 'Card activity, from business partners']],
];

const GUESSES = [
  { id: 'same', label: 'Same price' },
  { id: 'stranger', label: 'He pays more (iPhone)' },
  { id: 'arun', label: 'Arun pays more (6% battery)' },
  { id: 'cant', label: 'Can’t tell from two screens' },
];

export default function RideAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [step, setStep] = useState<Step>('quote');
  useEffect(() => { if (step === 'booked') sfx.ping(); }, [step]);
  const [guessed, setGuessed] = useState(false);
  const [discountAsked, setDiscountAsked] = useState(false);
  const [mode, setMode] = useState<Mode>('claims');
  const [tries, setTries] = useState<{ a: number; b: number }[]>([]);
  const [phones, setPhones] = useState<[PhoneSet, PhoneSet]>([ARUN, STRANGER]);
  const [testing, setTesting] = useState(false);
  const changed = phones[0] !== ARUN || phones[1] !== STRANGER;

  const quoted = BASE * RAIN_SURGE;
  const arunPrice = priceFor(phones[0], mode, quoted);
  const strangerPrice = priceFor(phones[1], mode, quoted);
  const shownWas = quoted * 1.25; // the app's own crossed-out "regular" price (invented)
  const gap = strangerPrice - arunPrice;

  const tryAgain = () => {
    const n = tries.length + 1;
    setTries((t) => [...t, { a: arunPrice * noise(n), b: strangerPrice * noise(n + 0.37) }].slice(-4));
  };

  const screen = (price: number, crossed: boolean, who = 0) => (
    <div className="ride-app">
      <div className="ra-brand">gaadi</div>
      <div className="ra-route">
        <div><span className="dot-g" /> Tyre puncture shop, Ring Road</div>
        <div><span className="dot-r" /> {phones[who].area === 'mixed' ? 'Home · Bapunagar' : AREAS[phones[who].area]}</div>
      </div>
      <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
      <div className="ra-badge">High demand: rain · fares are higher ({RAIN_SURGE}×)</div>
      <div className="ra-option sel">
        <div><b>Gaadi Go</b><span>4 min away · 6.2 km</span></div>
        <div className="ra-price">{crossed && <s>{fmt(shownWas)}</s>}<b>{fmt(price)}</b></div>
      </div>
      {crossed && <div className="ra-special">✨ Special price for you!</div>}
    </div>
  );

  const claimed = [...claims(phones[1]).map((c) => `his ${c.text} +${Math.round(c.pct * 100)}%`), ...claims(phones[0]).map((c) => `your ${c.text} +${Math.round(c.pct * 100)}%`)];

  return (
    <div className="act ride-act">
      {(step === 'quote' || step === 'guess') && (
        <div className="ride-row">
          <Phone owner="Arun · old Android · UPI" battery={6} model="android">
            {screen(quoted, step === 'quote')}
            <div className="ra-cta"><button className="g-btn" disabled>Book Gaadi Go</button></div>
          </Phone>
          <div className="side-card">
            {step === 'quote' ? (
              <>
                <p className="kicker">21:40 · Ring Road · raining</p>
                <p className="big-q">Under the same awning, a man opens the same app on a new iPhone.</p>
                <p className="muted">Same trip. Same second.</p>
                <button className="btn" autoFocus onClick={() => setStep('guess')}>Look at his screen →</button>
              </>
            ) : (
              <Guess id="ride-same" q="Will his screen show the same price as yours?"
                options={GUESSES.map((g) => g.label)} correct={3}
                onAnswer={(i) => { note('ride-guess', GUESSES[i].id); setGuessed(true); }}
                reveal={<>Nobody outside the company can tell from two screens. Let&rsquo;s look anyway.</>} />
            )}
            {guessed && step === 'guess' && <button className="btn" onClick={() => setStep('compare')}>Show me both screens →</button>}
          </div>
        </div>
      )}

      {step === 'compare' && (
        <div className="compare">
          <div className="ride-row">
            <Phone owner={`Arun · ${label(phones[0])}`} battery={phones[0].battery} model={phones[0].model === 'iphone' ? 'iphone' : 'android'}>{screen(arunPrice, false, 0)}</Phone>
            <div className="compare-mid lab">
              <p className="kicker">Same corner, same second</p>
              <div className="gap-readout"><span>{fmt(arunPrice)}</span><em>{Math.abs(gap) < 1 ? 'same' : gap > 0 ? `he pays ${fmt(gap)} more` : `you pay ${fmt(-gap)} more`}</em><span>{fmt(strangerPrice)}</span></div>
              <Seg label="Flip the hidden switch" options={[['claims', 'What critics claim'], ['company', 'What the companies say']]} value={mode} onChange={setMode} />
              <p className="small">{mode === 'company' ? 'Nothing personal is used. Only the trip, the time and the rain.' : claimed.length ? `Claimed: ${claimed.join(', ')}.` : 'Nothing anyone has claimed applies to these two phones.'}</p>
              <button className={`btn ghost small test-toggle ${testing ? 'on' : ''}`} aria-expanded={testing} onClick={() => setTesting((x) => !x)}>{testing ? 'Hide the test controls ▴' : 'Test it yourself: change either phone ▾'}</button>
              {testing && (
                <div className="tester">
                  <div className="pl-two">
                    <PhoneControls who="Your phone" p={phones[0]} onChange={(p) => setPhones([p, phones[1]])} />
                    <PhoneControls who="His phone" p={phones[1]} onChange={(p) => setPhones([phones[0], p])} />
                  </div>
                  <div className="row">
                    <button className="btn ghost small" onClick={() => setPhones([phones[0], phones[0]])}>Make both phones identical</button>
                    {changed && <button className="btn ghost small" onClick={() => setPhones([ARUN, STRANGER])}>Back to tonight</button>}
                  </div>
                </div>
              )}
              <div className="fair-test">
                <p className="small">Prices also jump from second to second. Ask again:</p>
                <button className="btn small" onClick={tryAgain}>↻ Both ask again</button>
                {tries.length > 0 && <ol className="tries">{tries.map((t, i) => <li key={i}>{fmt(t.a)} vs {fmt(t.b)}</li>)}</ol>}
              </div>
              <div className="lab-footer"><button className="btn" onClick={() => setStep('discount')}>Book the ride →</button></div>
            </div>
            <Phone owner={`Stranger · ${label(phones[1])}`} battery={phones[1].battery} model={phones[1].model === 'iphone' ? 'iphone' : 'android'}>{screen(strangerPrice, false, 1)}</Phone>
          </div>
        </div>
      )}

      {step === 'discount' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={5} model="android">
            {screen(arunPrice, true)}
            <div className="ra-cta"><button className="g-btn" disabled={!discountAsked} onClick={() => { note('ride-booked', Math.round(arunPrice)); setStep('booked'); }}>Book Gaadi Go · {fmt(arunPrice)}</button></div>
          </Phone>
          <div className="side-card">
            <p className="kicker">Before you tap “Book”</p>
            <Guess id="ride-discount" q={`“You save ${fmt(shownWas - arunPrice)}!” Compared with what?`}
              options={['What this trip usually costs', 'A price the app picked']} correct={1}
              onAnswer={() => setDiscountAsked(true)}
              reveal={<>The crossed-out price is the app&rsquo;s own number. Nothing shows what this trip usually costs. Now book.</>} />
          </div>
        </div>
      )}

      {step === 'booked' && (
        <div className="ride-row">
          <Phone owner="Arun" battery={5} model="android" time="21:44">
            <div className="ride-app">
              <div className="ra-brand">gaadi</div>
              <p className="r-title">Your ride is here</p>
              <div className="ra-driver"><b>Mahesh</b> · yellow taxi · GJ 01 ●●●● · ★ 4.9</div>
              <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
              <p className="tiny" style={{ textAlign: 'center' }}>Fare {fmt(arunPrice)} · pay by UPI at the end</p>
            </div>
          </Phone>
          <Unfold kicker="21:44 · Mahesh pulls up" impact="ride" items={UNFOLD.ride} onDone={() => setStep('tracked')} doneLabel="One last thing →" />
        </div>
      )}

      {step === 'tracked' && (
        <div className="ride-row lab-row">
          <Phone owner="Arun" battery={5} model="android" time="21:44">
            <div className="ride-app">
              <div className="ra-brand">gaadi</div>
              <p className="r-title">Your ride is here</p>
              <div className="ra-driver"><b>Mahesh</b> · yellow taxi · GJ 01 ●●●● · ★ 4.9</div>
              <p className="tiny" style={{ textAlign: 'center' }}>Fare {fmt(arunPrice)} · pay by UPI at the end</p>
            </div>
          </Phone>
          <div className="side-card tracked">
            <p className="kicker">21:44 · before you get in</p>
            <p className="big-q">You only wanted a ride home. This is what a ride app says it collects about you.</p>
            <div className="tr-grid">
              {TRACKED.map(([group, items], g) => (
                <div key={group} className="tr-group" style={{ animationDelay: `${g * 0.35}s` }}>
                  <p className="tr-h">{group}</p>
                  <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="tiny">Gaadi is made up. This list is from Uber&rsquo;s own privacy notice for riders. Some items need your permission and some don&rsquo;t apply in every country. Battery level is not on it.</p>
            <div className="lab-next"><button className="btn" autoFocus onClick={onDone}>Get in →</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
