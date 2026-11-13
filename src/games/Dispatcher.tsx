// DISPATCHER: a WHAT-IF illustration of "algorithmic wage discrimination" as described by
// workers and researchers (Dubal 2023, REPORTED; Oxford/Worker Info Exchange 2025, CONTESTED).
// The pay formula below is INVENTED. No company's real formula is public.
import { useMemo, useState } from 'react';
import { LabelChip, IllustrativeTag } from '../ui/LabelChip';

interface Job { id: number; km: number; mins: number; area: string }
const JOBS: Job[] = [
  { id: 1, km: 6.2, mins: 18, area: 'Airport road' },
  { id: 2, km: 3.1, mins: 11, area: 'Old market' },
  { id: 3, km: 9.8, mins: 27, area: 'Tech park' },
  { id: 4, km: 4.4, mins: 15, area: 'University' },
  { id: 5, km: 7.5, mins: 22, area: 'Station' },
  { id: 6, km: 2.6, mins: 9, area: 'Hospital' },
  { id: 7, km: 11.0, mins: 31, area: 'Ring road' },
  { id: 8, km: 5.3, mins: 16, area: 'Lake side' },
];

// Invented model (ILLUSTRATIVE): base pay per km/min, discounted when the driver is predicted to
// accept anyway (high recent acceptance, long hours online, no recent declines).
function offer(job: Job, acceptRate: number, hoursOnline: number) {
  const base = 12 + job.km * 9 + job.mins * 1.2;
  const willingness = 0.55 * acceptRate + 0.45 * Math.min(1, hoursOnline / 10);
  const factor = 1.15 - 0.35 * willingness; // between 0.80 and 1.15
  return Math.round(base * factor);
}

export default function Dispatcher() {
  const [i, setI] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [view, setView] = useState<'driver' | 'operator'>('driver');
  const hours = 3 + i * 0.9;
  const rate = history.length ? history.filter(Boolean).length / history.length : 0.8;
  const job = JOBS[i % JOBS.length];
  const pay = offer(job, rate, hours);
  const done = i >= JOBS.length;

  const decide = (accept: boolean) => {
    setHistory((h) => [...h, accept]);
    setI((n) => n + 1);
  };

  // A second, FICTIONAL driver who accepts everything and has been online 9 hours.
  const compare = useMemo(() => JOBS.map((j) => ({
    job: j,
    you: offer(j, rate, 6),
    asha: offer(j, 1, 9),
    ravi: offer(j, 0.4, 2),
  })), [rate]);

  return (
    <div className="dispatch">
      <p className="small">
        <LabelChip label="WHAT-IF" compact /> You are <strong>a delivery driver</strong> in a made-up app. Accept
        or decline jobs. Then flip to the operator&rsquo;s console to see what the app &ldquo;learned&rdquo;.
      </p>
      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={view === 'driver'} onClick={() => setView('driver')}>Driver&rsquo;s phone</button>
        <button className="tab" role="tab" aria-selected={view === 'operator'} onClick={() => setView('operator')}>Operator&rsquo;s console</button>
      </div>

      {view === 'driver' && (
        <div className="mock-phone" style={{ marginTop: 10 }}>
          <div className="mock-head">RideNow Partner <span className="muted small">· online {hours.toFixed(1)} h</span></div>
          {!done ? (
            <div className="mock-body">
              <p className="small muted" style={{ margin: 0 }}>New job {i + 1} of {JOBS.length}</p>
              <div className="dispatch-offer">
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{pay}</div>
                <div>{job.area} · {job.km} km · ~{job.mins} min</div>
              </div>
              <p className="small muted">Accept within 15 seconds or it goes to someone else.</p>
              <div className="btn-row">
                <button className="btn" onClick={() => decide(true)}>Accept</button>
                <button className="btn ghost" onClick={() => decide(false)}>Decline</button>
              </div>
            </div>
          ) : (
            <div className="mock-body">
              <p>Shift over. You accepted {history.filter(Boolean).length} of {history.length} jobs.</p>
              <div className="btn-row">
                <button className="btn" onClick={() => setView('operator')}>See the operator&rsquo;s console →</button>
                <button className="btn ghost small" onClick={() => { setI(0); setHistory([]); }}>Drive again</button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'operator' && (
        <div style={{ marginTop: 10 }}>
          <div className="panel small">
            <p>
              In this invented app, pay is not fixed. The system predicts how likely each driver is to accept and
              offers <em>less</em> to drivers it expects to say yes anyway. <IllustrativeTag />
            </p>
            <pre className="dispatch-formula">{`offer = base(km, minutes) × (1.15 − 0.35 × willingness)
willingness = 0.55 × acceptance rate + 0.45 × (hours online ÷ 10)`}</pre>
            <p>Your acceptance rate this shift: <strong>{Math.round(rate * 100)}%</strong>.</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="simple" style={{ marginTop: 10 }}>
              <thead>
                <tr><th>Same job</th><th>You</th><th>Asha (accepts everything, 9 h online)</th><th>Ravi (choosy, 2 h online)</th></tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.job.id}><td>{r.job.area}, {r.job.km} km</td><td>₹{r.you}</td><td>₹{r.asha}</td><td>₹{r.ravi}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted">Asha and Ravi are <LabelChip label="FICTIONAL" compact /> drivers. All numbers are invented.</p>
          <div className="panel small" style={{ marginTop: 10 }}>
            <h3>What the real evidence says</h3>
            <ul style={{ paddingLeft: '1.1em' }}>
              <li><LabelChip label="REPORTED" compact /> Law professor Veena Dubal&rsquo;s fieldwork with ride-hail drivers describes pay that is personalised, variable and opaque. It is qualitative, not a pay audit. <a href="#/library/dubal-wage-discrimination-2023">Case</a></li>
              <li><LabelChip label="CONTESTED" compact /> 258 UK drivers used data-access rights to audit 1.5 million trips; researchers reported hourly pay falling after dynamic pay was introduced. Uber says it does not recognise the figures. <a href="#/library/oxford-wie-uber-pay-2025">Case</a></li>
              <li><LabelChip label="REPORTED" compact /> Fairwork India 2024 gave Ola, Uber and Porter 0 out of 10 on fair-work principles. <a href="#/library/fairwork-india-2024">Case</a></li>
            </ul>
            <p className="muted">
              Nobody outside these companies can see the real pay formula. That opacity is the point researchers make.
              The fair way to check is the one the UK drivers used: collect your own data and compare.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
