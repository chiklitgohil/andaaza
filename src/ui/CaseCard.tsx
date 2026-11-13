import type { CaseRecord } from '../data/types';
import { hasPrimary } from '../data';
import { LabelChip } from './LabelChip';

export function SourceList({ sources }: { sources: CaseRecord['sources'] }) {
  return (
    <ul className="sources">
      {sources.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a>{' '}
          <span className="muted">· {s.publisher}{s.date ? ` · ${s.date}` : ''} · {s.type}</span>
          <span
            className={`acc ${s.accessed}`}
            title={s.accessed === 'opened' ? 'Our research opened and read this page.' : 'Seen only as a search-result snippet; we could not open it.'}
          >
            {s.accessed === 'opened' ? 'READ' : 'SNIPPET'}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CaseCard({ c, open = false, compact = false }: { c: CaseRecord; open?: boolean; compact?: boolean }) {
  const resp = c.companyResponse;
  return (
    <article className="case-card" id={`case-${c.id}`} aria-labelledby={`case-title-${c.id}`}>
      <div className="case-meta">
        <LabelChip label={c.label} />
        <span>{c.date}</span>
        <span>· {c.countries.join(', ')}</span>
      </div>
      <h3 id={`case-title-${c.id}`}>{c.title}</h3>
      <p className="case-hook">{c.hook}</p>
      <details className="more" open={open}>
        <summary>{compact ? 'Evidence' : 'Collected → inferred → done, response and sources'}</summary>
        <dl className="case-grid">
          <dt className="c">Collected</dt><dd>{c.collected}</dd>
          <dt>How</dt><dd>{c.howObtained}</dd>
          <dt className="i">Inferred</dt><dd>{c.inferred}</dd>
          <dt className="d">Done</dt><dd>{c.done}</dd>
          <dt>Affected</dt><dd>{c.affected}</dd>
          <dt>Outcome</dt><dd>{c.outcome.text}{c.outcome.date ? ` (${c.outcome.date})` : ''}</dd>
        </dl>
        <p className="small"><strong>Why this label:</strong> {c.labelNote}</p>
        <div className="response">
          <strong>Company response: </strong>
          {resp === 'none found' ? <span className="muted">None found in our research.</span> : (
            <>
              {resp.text}
              {resp.source && <span className="muted"> ({resp.source})</span>}
            </>
          )}
        </div>
        <p className="small"><strong>Limits:</strong> {c.limits}</p>
        <p className="small"><strong>Why it matters:</strong> {c.whyItMatters}</p>
        <strong className="small">Sources</strong>
        {!hasPrimary(c) && <span className="small muted"> (secondary sources only, so treat with extra care)</span>}
        <SourceList sources={c.sources} />
        <p className="muted" style={{ fontSize: '0.72rem', margin: '6px 0 0' }}>As of {c.asOf}. Case id: {c.id}</p>
      </details>
    </article>
  );
}
