// The Andaaza Loop's "ask" beat: a question, a few big answers, then the result.
// Guesses with a right answer count towards the visitor's Andaaza score at the end.
import { useState, type ReactNode } from 'react';
import { useStory } from '../story/store';
import { sfx } from '../audio/sound';

export interface GuessProps {
  id: string;                                   // journal key: guess:<id>
  q: ReactNode;
  options: string[];
  correct?: number;                             // leave out when there is no single right answer
  reveal: ReactNode | ((pick: number) => ReactNode);
  onAnswer?: (pick: number) => void;
  big?: boolean;                                // the question as a headline
}

export function Guess({ id, q, options, correct, reveal, onAnswer, big = true }: GuessProps) {
  const note = useStory((s) => s.note);
  const [pick, setPick] = useState<number | null>(null);
  const answer = (i: number) => {
    if (pick != null) return;
    setPick(i);
    if (correct != null) {
      note(`guess:${id}`, { right: i === correct });
      if (i === correct) sfx.success(); else sfx.error();
    } else sfx.reveal();
    onAnswer?.(i);
  };
  return (
    <div className="guess">
      <p className={big ? 'big-q' : 'guess-q'}>{q}</p>
      <div className={`guess-opts n${options.length}`} role="group" aria-label="Your guess">
        {options.map((o, i) => {
          const state = pick == null ? '' : i === correct ? 'right' : i === pick ? (correct == null ? 'picked' : 'wrong') : 'dim';
          return (
            <button key={o} className={`guess-btn ${state}`} disabled={pick != null} aria-pressed={pick === i} onClick={() => answer(i)}>
              {o}{pick != null && i === correct && <span aria-hidden="true"> ✓</span>}
            </button>
          );
        })}
      </div>
      {pick != null && <p className="guess-reveal">{typeof reveal === 'function' ? reveal(pick) : reveal}</p>}
    </div>
  );
}

/** How the visitor's guesses went, for the end screen. */
export function scoreOf(journal: Record<string, unknown>) {
  const all = Object.entries(journal).filter(([k]) => k.startsWith('guess:')).map(([, v]) => v as { right: boolean });
  return { made: all.length, right: all.filter((g) => g.right).length };
}
