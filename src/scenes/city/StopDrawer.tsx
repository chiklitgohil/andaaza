import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { Stop } from '../../data/stops';
import { casesForStop } from '../../data';
import { CaseCard } from '../../ui/CaseCard';
import { LabelChip } from '../../ui/LabelChip';
import { LABELS } from '../../data/types';

const GAMES = {
  puppet: lazy(() => import('../../games/PuppetTheatre')),
  stackshift: lazy(() => import('../../games/StackShift')),
  dispatcher: lazy(() => import('../../games/Dispatcher')),
};

type Tab = 'here' | 'cases' | 'game';

export function StopDrawer({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('here');
  const ref = useRef<HTMLDivElement>(null);
  const cases = casesForStop(stop.id).sort((a, b) => LABELS.indexOf(a.label) - LABELS.indexOf(b.label));

  useEffect(() => {
    setTab('here');
    ref.current?.focus();
  }, [stop.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const Game = stop.game ? GAMES[stop.game.id] : null;
  const labelCounts = LABELS.map((l) => [l, cases.filter((c) => c.label === l).length] as const).filter(([, n]) => n);

  return (
    <aside
      className="panel drawer"
      role="dialog"
      aria-modal="false"
      aria-labelledby="drawer-title"
      tabIndex={-1}
      ref={ref}
      style={{ borderTop: `3px solid ${stop.color}` }}
    >
      <div className="drawer-head">
        <button className="btn ghost small drawer-close" onClick={onClose} aria-label="Close and return to the city">✕ Close</button>
        <p className="muted small" style={{ margin: 0 }}>{stop.time} · {stop.subtitle}</p>
        <h2 id="drawer-title">{stop.icon} {stop.name}</h2>
        <div className="tabs" role="tablist" aria-label={`${stop.name} sections`}>
          <button className="tab" role="tab" aria-selected={tab === 'here'} onClick={() => setTab('here')}>What happens here</button>
          <button className="tab" role="tab" aria-selected={tab === 'cases'} onClick={() => setTab('cases')}>Evidence ({cases.length} cases)</button>
          {stop.game && (
            <button className="tab" role="tab" aria-selected={tab === 'game'} onClick={() => setTab('game')}>▶ {stop.game.label}</button>
          )}
        </div>
      </div>
      <div className="drawer-body" role="tabpanel">
        {tab === 'here' && (
          <>
            <p><LabelChip label="FICTIONAL" compact /> <em>{stop.moment}</em></p>
            <p className="small muted">
              Below is the general mechanism, summarised from the real cases in the Evidence tab. Collecting
              data is not proof it is misused. Each case says what is actually documented.
            </p>
            <div className="flow">
              <div className="flow-step"><span className="layer-tag layer-collected">COLLECTED</span><div>{stop.flow.collected}</div></div>
              <div className="flow-arrow" aria-hidden="true">▼ sent up to the broker tower</div>
              <div className="flow-step"><span className="layer-tag layer-inferred">INFERRED</span><div>{stop.flow.inferred}</div></div>
              <div className="flow-arrow" aria-hidden="true">▼ comes back down as a decision</div>
              <div className="flow-step"><span className="layer-tag layer-done">DONE</span><div>{stop.flow.done}</div></div>
            </div>
            <p className="small">
              How solid is the evidence here?{' '}
              {labelCounts.map(([l, n]) => (
                <span key={l} style={{ marginRight: 6, display: 'inline-block' }}><LabelChip label={l} compact /> ×{n}</span>
              ))}
            </p>
            <h3 style={{ marginTop: 14 }}>Start with these</h3>
            {cases.slice(0, 2).map((c) => <CaseCard key={c.id} c={c} compact />)}
            <div className="btn-row">
              <button className="btn" onClick={() => setTab('cases')}>See all {cases.length} cases</button>
              {stop.game && <button className="btn ghost" onClick={() => setTab('game')}>▶ {stop.game.label}</button>}
            </div>
          </>
        )}
        {tab === 'cases' && cases.map((c) => <CaseCard key={c.id} c={c} compact />)}
        {tab === 'game' && Game && (
          <Suspense fallback={<p className="muted">Loading…</p>}>
            <Game />
          </Suspense>
        )}
      </div>
    </aside>
  );
}
