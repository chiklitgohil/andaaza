import { DEBRIEFS } from '../content/debriefs';
import { LABEL_COLOR, LABEL_MEANING, type Label } from '../content/types';

export function Chip({ label }: { label: Label }) {
  return (
    <span className="chip" style={{ ['--c' as string]: LABEL_COLOR[label] }} title={LABEL_MEANING[label]}>
      {label}
    </span>
  );
}

export function DebriefPanel({ actId, onClose }: { actId: string; onClose: () => void }) {
  const d = DEBRIEFS[actId];
  if (!d) { onClose(); return null; }
  const sources = d.facts.flatMap((f) => f.sources).filter((s, i, a) => a.findIndex((x) => x.url === s.url) === i);
  return (
    <aside className="debrief" role="dialog" aria-labelledby="debrief-title" tabIndex={-1} ref={(el) => el?.focus({ preventScroll: true })}>
      <p className="kicker">What just happened</p>
      <h2 id="debrief-title">{d.title}</h2>
      <p className="lede">{d.message}</p>
      <ul className="facts">
        {d.facts.map((f, i) => (
          <li key={i}>
            <Chip label={f.label} />
            <span>{f.text}</span>
            {f.response && <span className="resp">Response: {f.response}</span>}
          </li>
        ))}
      </ul>
      {d.honesty && <p className="honesty"><Chip label="WHAT-IF" /> {d.honesty}</p>}
      <details className="sources">
        <summary>Sources ({sources.length})</summary>
        <ol>
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a> · {s.publisher}
              <span className={`acc ${s.opened ? 'read' : 'snip'}`}>{s.opened ? 'READ' : 'SNIPPET ONLY'}</span>
            </li>
          ))}
        </ol>
      </details>
      <button className="btn" onClick={onClose}>Keep going →</button>
    </aside>
  );
}
