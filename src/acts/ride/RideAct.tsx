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
import { ARUN, STRANGER, claims, label, priceFor, type Mode } from './PriceLab';

type Step = 'quote' | 'guess' | 'compare' | 'discount' | 'booked';
const BASE = 168;           // ₹, meter-style fare for this 6.2 km trip (invented)
const RAIN_SURGE = 1.4;     // disclosed "high demand" multiplier, same for everyone (invented, under India's 2× cap)

const fmt = (v: number) => `₹${Math.round(v)}`;

function noise(seed: number) {
  // ±8% moment-to-moment change for everyone: drivers move, demand shifts (invented)
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return 1 + ((x - Math.floor(x)) - 0.5) * 0.16;
}

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

  const quoted = BASE * RAIN_SURGE;
  const arunPrice = priceFor(ARUN, mode, quoted);
  const strangerPrice = priceFor(STRANGER, mode, quoted);
  const shownWas = quoted * 1.25; // the app's own crossed-out "regular" price (invented)
  const gap = strangerPrice - arunPrice;

  const tryAgain = () => {
    const n = tries.length + 1;
    setTries((t) => [...t, { a: arunPrice * noise(n), b: strangerPrice * noise(n + 0.37) }].slice(-4));
  };

  const screen = (price: number, crossed: boolean) => (
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
        <div className="ra-price">{crossed && <s>{fmt(shownWas)}</s>}<b>{fmt(price)}</b></div>
      </div>
      {crossed && <div className="ra-special">✨ Special price for you!</div>}
    </div>
  );

  const claimed = [...claims(STRANGER).map((c) => `his ${c.text.replace(/^an? /, '')} +${Math.round(c.pct * 100)}%`), ...claims(ARUN).map((c) => `your ${c.text.replace(/^an? /, '')} +${Math.round(c.pct * 100)}%`)];

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
            <Phone owner={`Arun · ${label(ARUN)}`} battery={ARUN.battery} model="android">{screen(arunPrice, false)}</Phone>
            <div className="compare-mid lab">
              <p className="kicker">Same corner, same second</p>
              <div className="gap-readout"><span>{fmt(arunPrice)}</span><em>{Math.abs(gap) < 1 ? 'same' : gap > 0 ? `he pays ${fmt(gap)} more` : `you pay ${fmt(-gap)} more`}</em><span>{fmt(strangerPrice)}</span></div>
              <Seg label="Flip the hidden switch" options={[['claims', 'What critics claim'], ['company', 'What the companies say']]} value={mode} onChange={setMode} />
              <p className="small">{mode === 'claims' ? `Claimed: ${claimed.join(', ')}.` : 'Nothing personal is used. Only the trip, the time and the rain.'}</p>
              <div className="fair-test">
                <p className="small">Prices also jump from second to second. Ask again:</p>
                <button className="btn small" onClick={tryAgain}>↻ Both ask again</button>
                {tries.length > 0 && <ol className="tries">{tries.map((t, i) => <li key={i}>{fmt(t.a)} vs {fmt(t.b)}</li>)}</ol>}
              </div>
              <div className="lab-footer"><button className="btn" onClick={() => setStep('discount')}>Book the ride →</button></div>
            </div>
            <Phone owner={`Stranger · ${label(STRANGER)}`} battery={STRANGER.battery} model="iphone">{screen(strangerPrice, false)}</Phone>
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
          <Phone owner="Arun" battery={5} model="android">
            <div className="ride-app">
              <div className="ra-brand">gaadi</div>
              <p className="r-title">Your ride is here</p>
              <div className="ra-driver"><b>Mahesh</b> · yellow taxi · GJ 01 ●●●● · ★ 4.9</div>
              <div className="ra-map" aria-hidden="true"><i className="ra-line" /><b className="ra-car" /></div>
              <p className="tiny" style={{ textAlign: 'center' }}>Fare {fmt(arunPrice)} · pay by UPI at the end</p>
            </div>
          </Phone>
          <Unfold kicker="21:44 · Mahesh pulls up" items={UNFOLD.ride} onDone={onDone} doneLabel="Get in →" />
        </div>
      )}
    </div>
  );
}
