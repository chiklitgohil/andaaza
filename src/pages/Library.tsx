import { useEffect, useMemo, useState } from 'react';
import { CASES } from '../data';
import { LABELS, type Label } from '../data/types';
import { LABEL_INFO } from '../data/labels';
import { STOP_BY_ID } from '../data/stops';
import { CaseCard } from '../ui/CaseCard';

export default function Library({ caseId }: { caseId?: string }) {
  const [q, setQ] = useState('');
  const [label, setLabel] = useState<Label | ''>('');
  const [country, setCountry] = useState('');
  const [stop, setStop] = useState('');

  const countries = useMemo(() => [...new Set(CASES.flatMap((c) => c.countries))].sort(), []);
  const stops = useMemo(() => [...new Set(CASES.flatMap((c) => c.stops))], []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CASES.filter((c) =>
      (!label || c.label === label) &&
      (!country || c.countries.includes(country)) &&
      (!stop || c.stops.includes(stop)) &&
      (!needle || [c.title, c.hook, c.done, c.collected, c.inferred, ...c.categories].join(' ').toLowerCase().includes(needle)),
    );
  }, [q, label, country, stop]);

  useEffect(() => {
    if (caseId) document.getElementById(`case-${caseId}`)?.scrollIntoView({ block: 'start' });
  }, [caseId]);

  const counts = Object.fromEntries(LABELS.map((l) => [l, CASES.filter((c) => c.label === l).length]));

  return (
    <div className="scroll-page">
      <div className="page-inner">
        <h1>Case Library</h1>
        <p className="muted" style={{ maxWidth: 760 }}>
          Every case used in the Glass City, with its evidence label, the company&rsquo;s response, its limits and
          its sources. &ldquo;READ&rdquo; means our research opened the page; &ldquo;SNIPPET&rdquo; means we
          only saw it in search results. Facts are as of November 2026.
        </p>
        <p className="small muted">
          {CASES.length} cases ·{' '}
          {LABELS.filter((l) => counts[l]).map((l) => `${counts[l]} ${LABEL_INFO[l].short.toLowerCase()}`).join(' · ')}
        </p>
        <div className="lib-controls" role="search">
          <label className="sr-only" htmlFor="lib-q">Search cases</label>
          <input id="lib-q" type="search" placeholder="Search: location, Uber, health, India…" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="sr-only" htmlFor="lib-label">Evidence label</label>
          <select id="lib-label" value={label} onChange={(e) => setLabel(e.target.value as Label | '')}>
            <option value="">All labels</option>
            {LABELS.filter((l) => counts[l]).map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <label className="sr-only" htmlFor="lib-country">Country</label>
          <select id="lib-country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All places</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="sr-only" htmlFor="lib-stop">City stop</label>
          <select id="lib-stop" value={stop} onChange={(e) => setStop(e.target.value)}>
            <option value="">All stops</option>
            {stops.map((s) => <option key={s} value={s}>{STOP_BY_ID[s]?.name ?? s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <span className="lib-count" aria-live="polite">{list.length} shown</span>
        </div>
        <div className="lib-grid">
          {list.map((c) => <CaseCard key={c.id} c={c} open={c.id === caseId} />)}
        </div>
      </div>
    </div>
  );
}
