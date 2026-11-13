import { useState } from 'react';
import { MYTHS, CASE_BY_ID } from '../data';
import { LabelChip } from '../ui/LabelChip';

const VERDICT_COLOR: Record<string, string> = {
  'NOT SUPPORTED': '#ff6b6b',
  OVERSTATED: '#ff7a59',
  UNVERIFIED: '#ffb547',
  MISREAD: '#b28dff',
};

export default function Myths() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  return (
    <div className="scroll-page">
      <div className="page-inner">
        <h1>The Myths Room</h1>
        <p style={{ maxWidth: 780 }}>
          Some of the most-shared stories about apps are wrong, overstated or unproven. Being sceptical of
          <em> these</em> is part of taking the real problems seriously. Guess first, then flip each card.
        </p>
        <div className="myth-grid">
          {MYTHS.map((m) => {
            const open = !!flipped[m.id];
            return (
              <article key={m.id} className={`panel myth ${open ? 'open' : ''}`}>
                <p className="myth-claim">{m.claim}</p>
                {!open ? (
                  <button className="btn small" onClick={() => setFlipped((f) => ({ ...f, [m.id]: true }))}>
                    What does the evidence say?
                  </button>
                ) : (
                  <div className="small">
                    <p><span className="chip" style={{ ['--chip' as string]: VERDICT_COLOR[m.verdict] }}>{m.verdict}</span></p>
                    <p>{m.whatEvidenceShows}</p>
                    <p><strong>A fair test:</strong> {m.fairTest}</p>
                    <p><strong>What would change our mind:</strong> {m.wouldChangeOurMind}</p>
                    <p className="muted">
                      Related cases:{' '}
                      {m.caseIds.map((id, i) => CASE_BY_ID[id] && (
                        <span key={id}>
                          {i > 0 && ' · '}
                          <a href={`#/library/${id}`}>{CASE_BY_ID[id].title}</a> <LabelChip label={CASE_BY_ID[id].label} compact />
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="btn-row" style={{ marginTop: 18 }}>
          <a className="btn" href="#/exit">Next: what you can do →</a>
        </div>
      </div>
    </div>
  );
}
