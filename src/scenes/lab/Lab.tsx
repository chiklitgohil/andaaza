// AUDITOR'S LAB: a simulated shop with a HIDDEN pricing rule (WHAT-IF). The visitor designs tests to
// find out whether prices depend on something personal, or whether the differences are just noise.
import { useMemo, useState } from 'react';
import { LabelChip, IllustrativeTag } from '../../ui/LabelChip';
import { CASE_BY_ID } from '../../data';
import { CaseCard } from '../../ui/CaseCard';

type Device = 'iPhone' | 'Android';
type Area = 'Area A (rival shop nearby)' | 'Area B (no rival nearby)';
type History = 'New visitor' | 'Left items in cart';
type Time = 'Noon' | '8 pm';
interface Req { device: Device; area: Area; history: History; time: Time }

interface Rule { id: string; name: string; explain: string; effect: (r: Req) => number; drift: boolean }

const RULES: Rule[] = [
  { id: 'none', name: 'Nothing personal: random A/B price tests', explain: 'Every request got a randomly assigned price. Differences were real, but they had nothing to do with who you are, like the Instacart tests that the company says were randomised.', effect: () => 0, drift: false },
  { id: 'device', name: 'Device: iPhone users pay more', explain: 'Requests from iPhones were charged about 8% more. This is the claim behind the viral Ola/Uber/Zepto screenshots (ALLEGED, denied, no finding).', effect: (r) => (r.device === 'iPhone' ? 0.08 : 0), drift: false },
  { id: 'area', name: 'Location: higher where there is no competitor', explain: 'Requests from Area B paid about 9% more. This mirrors what the WSJ found for Staples in 2012.', effect: (r) => (r.area.startsWith('Area B') ? 0.09 : 0), drift: false },
  { id: 'history', name: 'History: people who hesitated pay more', explain: 'Visitors who had left items in their cart were shown about 7% more. The FTC found pricing vendors CAN use such signals; it did not show a named shop doing it.', effect: (r) => (r.history === 'Left items in cart' ? 0.07 : 0), drift: false },
  { id: 'time', name: 'Demand: evening prices are higher for everyone', explain: 'Prices rose about 10% in the evening for every visitor. That is dynamic pricing, not personal pricing. If you compared noon with evening, you might wrongly blame something personal.', effect: (r) => (r.time === '8 pm' ? 0.1 : 0), drift: true },
];

const BASE = 500; // ₹, ILLUSTRATIVE

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function price(rule: Rule, r: Req) {
  // every request also gets ±6% noise, as random tests and moment-to-moment changes do
  return Math.round(BASE * (1 + rule.effect(r) + gauss() * 0.06));
}

function stats(xs: number[]) {
  const n = xs.length;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const ci = n > 1 ? (1.96 * sd) / Math.sqrt(n) : NaN;
  return { n, mean, sd, ci };
}

const VARS: { key: keyof Req; label: string; options: string[] }[] = [
  { key: 'device', label: 'Phone', options: ['iPhone', 'Android'] },
  { key: 'area', label: 'Location', options: ['Area A (rival shop nearby)', 'Area B (no rival nearby)'] },
  { key: 'history', label: 'History', options: ['New visitor', 'Left items in cart'] },
  { key: 'time', label: 'Time of request', options: ['Noon', '8 pm'] },
];

export default function Lab() {
  const [rule, setRule] = useState<Rule>(() => RULES[Math.floor(Math.random() * RULES.length)]);
  const [a, setA] = useState<Req>({ device: 'iPhone', area: 'Area A (rival shop nearby)', history: 'New visitor', time: 'Noon' });
  const [b, setB] = useState<Req>({ device: 'Android', area: 'Area A (rival shop nearby)', history: 'New visitor', time: 'Noon' });
  const [reps, setReps] = useState(1);
  const [results, setResults] = useState<{ a: number[]; b: number[]; changed: string[] } | null>(null);
  const [runs, setRuns] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);

  const changed = VARS.filter((v) => a[v.key] !== b[v.key]).map((v) => v.label);

  const run = () => {
    const ra = Array.from({ length: reps }, () => price(rule, a));
    const rb = Array.from({ length: reps }, () => price(rule, b));
    setResults({ a: ra, b: rb, changed });
    setRuns((n) => n + 1);
  };

  const sa = results ? stats(results.a) : null;
  const sb = results ? stats(results.b) : null;
  const diff = sa && sb ? sb.mean - sa.mean : 0;
  const overlap = sa && sb && reps > 1 ? Math.abs(diff) < (sa.ci + sb.ci) : null;

  const advice = useMemo(() => {
    if (!results) return null;
    const notes: string[] = [];
    if (results.changed.length === 0) notes.push('Both groups are identical, so this measures pure noise. Useful as a control!');
    if (results.changed.length > 1) notes.push(`You changed ${results.changed.length} things at once (${results.changed.join(', ')}). If prices differ, you can't tell which one caused it.`);
    if (results.changed.includes('Time of request')) notes.push('The two groups were not tested at the same time. Prices that change for everyone over the day can look personal.');
    if (reps === 1) notes.push('One request each is like comparing two screenshots. With ±6% noise, a big gap can appear by pure chance.');
    if (reps > 1 && overlap) notes.push('The ranges overlap: this difference could easily be noise. Try more repeats.');
    if (reps > 1 && overlap === false && results.changed.length === 1) notes.push(`The ranges don't overlap: a real difference linked to ${results.changed[0]} is likely, in this test.`);
    return notes;
  }, [results, reps, overlap]);

  const newShop = () => {
    setRule(RULES[Math.floor(Math.random() * RULES.length)]);
    setResults(null);
    setRuns(0);
    setGuess(null);
  };

  const maxP = BASE * 1.35, minP = BASE * 0.75;
  const xPos = (p: number) => `${((p - minP) / (maxP - minP)) * 100}%`;

  return (
    <div className="scroll-page">
      <div className="page-inner">
        <p className="muted small" style={{ margin: 0 }}>Act 4</p>
        <h1>The Auditor&rsquo;s Lab</h1>
        <p style={{ maxWidth: 780 }}>
          Seeing two different prices does not prove you are being targeted. Researchers, journalists and regulators
          have to <strong>test</strong>. Here is a made-up shop, <strong>Pricely</strong>, with a hidden pricing rule.
          Your job: find out whether prices depend on something about the shopper, or whether the gaps are noise.{' '}
          <LabelChip label="WHAT-IF" compact /> <IllustrativeTag />
        </p>

        <div className="lab-grid">
          <section className="panel" aria-labelledby="design-h">
            <h2 id="design-h" style={{ fontSize: '1.2rem' }}>1 · Design your test</h2>
            <div className="lab-groups">
              {(['A', 'B'] as const).map((g) => {
                const req = g === 'A' ? a : b;
                const set = g === 'A' ? setA : setB;
                return (
                  <fieldset key={g} className="lab-group">
                    <legend>Shopper group {g}</legend>
                    {VARS.map((v) => (
                      <label key={v.key} className="lab-field">
                        <span>{v.label}</span>
                        <select value={req[v.key]} onChange={(e) => set({ ...req, [v.key]: e.target.value } as Req)}>
                          {v.options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </label>
                    ))}
                  </fieldset>
                );
              })}
            </div>
            <p className="small">
              Changing: <strong>{changed.length ? changed.join(', ') : 'nothing (a control test)'}</strong>
              {changed.length > 1 && <span style={{ color: 'var(--done)' }}> · more than one thing</span>}
            </p>
            <label className="lab-field" style={{ maxWidth: 360 }}>
              <span>Requests per group: <strong>{reps}</strong></span>
              <input type="range" min={1} max={60} value={reps} onChange={(e) => setReps(+e.target.value)} />
            </label>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn" onClick={run}>Run the test</button>
              <button className="btn ghost small" onClick={() => { setReps(1); }}>Two-screenshot test (1 each)</button>
            </div>
          </section>

          <section className="panel" aria-labelledby="res-h" aria-live="polite">
            <h2 id="res-h" style={{ fontSize: '1.2rem' }}>2 · Results {runs > 0 && <span className="muted small">(test #{runs})</span>}</h2>
            {!results && <p className="muted small">Run a test to see prices.</p>}
            {results && sa && sb && (
              <>
                {(['A', 'B'] as const).map((g) => {
                  const xs = g === 'A' ? results.a : results.b;
                  const s = g === 'A' ? sa : sb;
                  return (
                    <div key={g} className="lab-strip-row">
                      <div className="small"><strong>Group {g}</strong> average ₹{s.mean.toFixed(0)}{reps > 1 && <span className="muted"> ± {s.ci.toFixed(0)} (95% range)</span>}</div>
                      <div className="lab-strip" role="img" aria-label={`Group ${g}: ${xs.length} prices, average ${s.mean.toFixed(0)} rupees`}>
                        {reps > 1 && <div className="lab-ci" style={{ left: xPos(s.mean - s.ci), width: `calc(${xPos(s.mean + s.ci)} - ${xPos(s.mean - s.ci)})` }} />}
                        {xs.map((p, i) => <span key={i} className={`lab-dot ${g === 'A' ? 'ga' : 'gb'}`} style={{ left: xPos(p) }} />)}
                        <span className="lab-mean" style={{ left: xPos(s.mean) }} />
                      </div>
                    </div>
                  );
                })}
                <p className="small">Difference in averages (B − A): <strong>₹{diff.toFixed(0)}</strong> ({((diff / sa.mean) * 100).toFixed(1)}%)</p>
                <ul className="small lab-advice">
                  {advice?.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </>
            )}
          </section>
        </div>

        <section className="panel" style={{ marginTop: 14 }} aria-labelledby="verdict-h">
          <h2 id="verdict-h" style={{ fontSize: '1.2rem' }}>3 · Your verdict</h2>
          <p className="small">What is Pricely&rsquo;s hidden rule? (Run as many tests as you like first.)</p>
          <div className="btn-row">
            {RULES.map((r) => (
              <button key={r.id} className={`btn small ${guess === r.id ? '' : 'ghost'}`} onClick={() => setGuess(r.id)} disabled={!!guess}>{r.name}</button>
            ))}
          </div>
          {guess && (
            <div className="panel small" role="status" style={{ marginTop: 10, borderColor: guess === rule.id ? '#3ddc97' : 'var(--danger)' }}>
              <p><strong>{guess === rule.id ? '✓ Correct.' : '✗ Not quite.'}</strong> The hidden rule was: <strong>{rule.name}</strong>.</p>
              <p>{rule.explain}</p>
              <p className="muted">It took you {runs} test{runs === 1 ? '' : 's'}. Real auditors repeat tests many times, change one thing at a time, and test both groups at the same moment.</p>
              <button className="btn small" onClick={newShop}>Try a new shop with a different hidden rule</button>
            </div>
          )}
        </section>

        <section style={{ marginTop: 22 }}>
          <h2>How the real investigators did it</h2>
          <div className="lab-methods">
            <div className="panel small">
              <h3>The fair-test checklist</h3>
              <ol>
                <li><strong>Change one thing</strong> (only the phone, or only the location).</li>
                <li><strong>Same moment</strong>: prices change over time for everyone.</li>
                <li><strong>Repeat many times</strong>: one pair of screenshots can mislead.</li>
                <li><strong>Include a control</strong>: two identical groups show you how big the noise is.</li>
                <li><strong>Ask the company</strong> and report its answer.</li>
                <li><strong>Correlation is not intent</strong>: a pattern doesn&rsquo;t prove anyone meant it.</li>
              </ol>
            </div>
            {['hannak-2014', 'instacart-eversight-2025', 'cr-uber-lyft-2026', 'ola-uber-ccpa-2025', 'princeton-review-2015'].map((id) =>
              CASE_BY_ID[id] ? <CaseCard key={id} c={CASE_BY_ID[id]} compact /> : null,
            )}
          </div>
          <div className="btn-row" style={{ marginTop: 14 }}>
            <a className="btn" href="#/myths">Next: the Myths Room →</a>
            <a className="btn ghost" href="#/exit">What you can do</a>
          </div>
        </section>
      </div>
    </div>
  );
}
