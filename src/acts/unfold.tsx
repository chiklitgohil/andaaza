// The Andaaza Loop's "unfold" beat: after each stop, the story behind it arrives one short line at a time.
// Scroll (wheel or trackpad), tap the panel, or press ↓ / Space for the next line. Questions wait for an answer.
// No sources or evidence labels here: the wording carries the evidence level, and everything is listed at the end.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { sfx } from '../audio/sound';
import { Guess } from './guess';

export type UnfoldItem =
  | { say: ReactNode }
  | { id: string; ask: ReactNode; options: string[]; correct?: number; reveal: ReactNode };

const isAsk = (x: UnfoldItem): x is Extract<UnfoldItem, { ask: ReactNode }> => 'ask' in x;

export function Unfold({ items, onDone, kicker = 'Behind the screen', doneLabel = 'Keep going →' }: {
  items: UnfoldItem[]; onDone: () => void; kicker?: string; doneLabel?: string;
}) {
  const [n, setN] = useState(1);                       // how many lines are showing
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const box = useRef<HTMLDivElement>(null);
  const acc = useRef(0);
  const cool = useRef(0);
  const cur = items[n - 1];
  const blocked = isAsk(cur) && !answered[n - 1];
  const finished = n >= items.length && !blocked;

  const next = useCallback(() => {
    if (blocked || n >= items.length) return;
    setN((x) => x + 1);
    sfx.tick();
  }, [blocked, n, items.length]);

  // the page itself is scroll-locked during a stop, so a scroll gesture anywhere moves the story on
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest?.('.phone')) return;
      if (e.deltaY <= 0) return;
      const now = performance.now();
      if (now < cool.current) return;
      acc.current += e.deltaY;
      if (acc.current > 70) { acc.current = 0; cool.current = now + 450; next(); }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest?.('input, select, textarea')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !(e.target as HTMLElement).closest?.('button'))) { e.preventDefault(); next(); }
    };
    let y0: number | null = null;
    const onTouchStart = (e: TouchEvent) => { y0 = e.touches[0]?.clientY ?? null; };
    const onTouchEnd = (e: TouchEvent) => { const y1 = e.changedTouches[0]?.clientY; if (y0 != null && y1 != null && y0 - y1 > 40) next(); y0 = null; };
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('keydown', onKey);
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey); removeEventListener('touchstart', onTouchStart); removeEventListener('touchend', onTouchEnd); };
  }, [next]);

  useEffect(() => { sfx.reveal(); }, []);
  // keep the newest line in view
  useEffect(() => { const el = box.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, [n, answered]);

  return (
    <section className="side-card unfold" aria-label={kicker}>
      <p className="kicker">{kicker}</p>
      <div className="uf-lines" ref={box} aria-live="polite" onClick={(e) => { if (!(e.target as HTMLElement).closest('button')) next(); }}>
        {items.slice(0, n).map((it, i) => (
          <div key={i} className={`uf-line ${i < n - 1 ? 'past' : 'now'}`}>
            {isAsk(it)
              ? <Guess id={it.id} q={it.ask} options={it.options} correct={it.correct} reveal={it.reveal} big={false} onAnswer={() => setAnswered((a) => ({ ...a, [i]: true }))} />
              : <p>{it.say}</p>}
          </div>
        ))}
      </div>
      <div className="uf-foot">
        {finished
          ? <button className="btn" autoFocus onClick={onDone}>{doneLabel}</button>
          : blocked
            ? <span className="uf-hint">Make your guess</span>
            : <button className="uf-more" onClick={next} aria-label="Next line">scroll <span aria-hidden="true">▾</span></button>}
        <span className="uf-count" aria-hidden="true">{n}/{items.length}</span>
      </div>
    </section>
  );
}
