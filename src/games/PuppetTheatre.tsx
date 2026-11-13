import { useEffect, useState } from 'react';
import { LabelChip } from '../ui/LabelChip';
import { go } from '../router';

interface Pattern {
  id: string;
  name: string;          // India CCPA 2023 name where one exists
  what: string;
  realCase: { text: string; caseId: string };
}

const PATTERNS: Pattern[] = [
  { id: 'urgency', name: 'False urgency', what: 'A countdown that resets when you reload. Nothing actually expires.', realCase: { text: 'Fake timers and “only 2 left” messages found across thousands of shopping sites (Mathur et al., 2019)', caseId: 'mathur-dark-patterns-2019' } },
  { id: 'sneak', name: 'Basket sneaking', what: 'An extra item you never chose is already ticked in your basket.', realCase: { text: 'Named as one of India’s 13 dark patterns (CCPA, 2023)', caseId: 'india-dark-patterns-guidelines-2023' } },
  { id: 'shame', name: 'Confirm shaming', what: 'The “no” button is worded to make you feel foolish.', realCase: { text: 'Amazon’s decline button said “No, I don’t want Free Shipping” (FTC case, settled for $2.5 billion)', caseId: 'amazon-prime-2025' } },
  { id: 'drip', name: 'Drip pricing', what: 'Fees appear only at the last step, after you have committed.', realCase: { text: 'FTC alleges Ticketmaster hid fees of up to 44% until checkout (ALLEGED; company denies)', caseId: 'ticketmaster-ftc-2025' } },
  { id: 'trap', name: 'Subscription trap', what: 'A free trial is pre-selected and quietly becomes a paid plan.', realCase: { text: 'FTC alleged Prime sign-ups through confusing checkouts; FTC alleges the same of Uber One (ALLEGED)', caseId: 'uber-one-2025' } },
  { id: 'maze', name: 'Cancellation maze', what: 'Joining takes one click. Leaving takes many screens.', realCase: { text: 'FTC alleges Uber One cancellation took up to 23 screens and 32 actions (ALLEGED; Uber says about 20 seconds)', caseId: 'uber-one-2025' } },
];

function useCountdown(active: boolean) {
  const [t, setT] = useState(299);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setT((x) => (x <= 1 ? 299 : x - 1)), 1000);
    return () => clearInterval(id);
  }, [active]);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

export default function PuppetTheatre() {
  const [strings, setStrings] = useState(false);
  const [cut, setCut] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<'basket' | 'pay' | 'cancel'>('basket');
  const [cancelClicks, setCancelClicks] = useState(0);
  const on = (id: string) => !cut[id];
  const timer = useCountdown(on('urgency'));
  const allCut = PATTERNS.every((p) => cut[p.id]);

  const base = 640;
  const sneak = on('sneak') ? 149 : 0;
  const fees = 89 + 45;

  function Str({ id, children }: { id: string; children: React.ReactNode }) {
    const p = PATTERNS.find((x) => x.id === id)!;
    if (!on(id)) return <>{children}</>;
    return (
      <div className={`puppet-el ${strings ? 'strung' : ''}`}>
        {strings && (
          <div className="puppet-string" aria-hidden="true" />
        )}
        {children}
        {strings && (
          <div className="puppet-tag">
            <strong>{p.name}.</strong> {p.what}{' '}
            <button className="btn small" onClick={() => setCut((c) => ({ ...c, [id]: true }))}>✂ Cut this string</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="puppet">
      <p className="small">
        <LabelChip label="WHAT-IF" compact /> A made-up shop, <strong>Basketly</strong>, built from real dark-pattern
        types. Try checking out normally first. Then turn on the strings and cut them one by one.
      </p>
      <div className="btn-row" style={{ marginBottom: 10 }}>
        <button className={`btn ${strings ? '' : 'ghost'} small`} onClick={() => setStrings((s) => !s)} aria-pressed={strings}>
          {strings ? '◉ Strings visible' : '○ Show the strings'}
        </button>
        <span className="small muted">{Object.values(cut).filter(Boolean).length} / {PATTERNS.length} strings cut</span>
      </div>

      <div className="mock-phone" aria-label="Basketly checkout (a made-up shop)">
        <div className="mock-head">Basketly <span className="muted small">· checkout</span></div>
        {step === 'basket' && (
          <div className="mock-body">
            <Str id="urgency">
              <div className="mock-urgent">⏱ Your discount expires in <strong>{timer}</strong>!</div>
            </Str>
            {!on('urgency') && <div className="mock-fair">No countdown. Prices hold for today.</div>}
            <div className="mock-line"><span>Groceries (6 items)</span><span>₹{base}</span></div>
            <Str id="sneak">
              <label className="mock-line"><span><input type="checkbox" checked readOnly /> Premium freshness protection</span><span>₹149</span></label>
            </Str>
            <Str id="trap">
              <label className="mock-line"><span><input type="checkbox" checked readOnly /> Start my FREE Basketly+ trial (₹299/month after 7 days)</span><span>₹0</span></label>
            </Str>
            {!on('trap') && (
              <label className="mock-line mock-fair"><span><input type="checkbox" /> Optional: try Basketly+ (₹299/month after a 7-day trial; we&rsquo;ll remind you before it renews)</span></label>
            )}
            <div className="mock-line total"><span>Subtotal</span><span>₹{base + sneak}</span></div>
            {!on('drip') && <div className="mock-line"><span>Delivery + platform fee (shown upfront)</span><span>₹{fees}</span></div>}
            <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep('pay')}>Continue</button>
            <Str id="shame">
              <button className="mock-link">No thanks, I prefer paying full price like a fool</button>
            </Str>
            {!on('shame') && <button className="mock-link">No thanks</button>}
          </div>
        )}
        {step === 'pay' && (
          <div className="mock-body">
            <div className="mock-line"><span>Subtotal</span><span>₹{base + sneak}</span></div>
            <Str id="drip">
              <div>
                <div className="mock-line"><span>Delivery</span><span>₹89</span></div>
                <div className="mock-line"><span>Platform &amp; handling fee</span><span>₹45</span></div>
              </div>
            </Str>
            {!on('drip') && <div className="mock-line"><span>Fees (already shown on the first screen)</span><span>₹{fees}</span></div>}
            <div className="mock-line total"><span>Total</span><span>₹{base + sneak + fees}</span></div>
            <div className="btn-row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setStep('cancel')}>Pay &amp; then manage subscription</button>
              <button className="btn ghost small" onClick={() => setStep('basket')}>Back</button>
            </div>
          </div>
        )}
        {step === 'cancel' && (
          <div className="mock-body">
            <p className="small">Order placed. You are now in a Basketly+ trial. Try to cancel it:</p>
            <Str id="maze">
              <div>
                {cancelClicks < 4 ? (
                  <>
                    <p className="small muted">{['Are you sure? You’ll lose your benefits.', 'Tell us why you’re leaving (required).', 'Wait! Here’s 20% off to stay.', 'Final step: confirm on our website, not the app.'][cancelClicks]}</p>
                    <button className="btn ghost small" onClick={() => setCancelClicks((n) => n + 1)}>Continue cancelling ({cancelClicks + 1}/5)</button>
                  </>
                ) : (
                  <p className="small">Cancelled, after 5 screens.</p>
                )}
              </div>
            </Str>
            {!on('maze') && <p className="small mock-fair">One button: <button className="btn small">Cancel trial</button> Cancelling is as easy as joining.</p>}
            <button className="btn ghost small" style={{ marginTop: 8 }} onClick={() => { setStep('basket'); setCancelClicks(0); }}>Start over</button>
          </div>
        )}
      </div>

      <h3 style={{ marginTop: 16 }}>The real cases behind each string</h3>
      <ul className="small" style={{ paddingLeft: '1.1em' }}>
        {PATTERNS.map((p) => (
          <li key={p.id} style={{ marginBottom: 4, opacity: cut[p.id] ? 0.6 : 1 }}>
            {cut[p.id] ? '✂ ' : ''}<strong>{p.name}:</strong> {p.realCase.text}.{' '}
            <a href={`#/library/${p.realCase.caseId}`} onClick={(e) => { e.preventDefault(); go(`library/${p.realCase.caseId}`); }}>Evidence</a>
          </li>
        ))}
      </ul>
      {allCut && (
        <p className="panel small" role="status" style={{ borderColor: '#3ddc97' }}>
          All strings cut. The fair version shows every fee upfront, asks before adding anything, and lets you
          leave as easily as you joined. India&rsquo;s 2023 guidelines and several FTC cases describe these
          patterns. A 2024 industry study found deceptive patterns in 52 of 53 popular Indian apps.
        </p>
      )}
    </div>
  );
}
