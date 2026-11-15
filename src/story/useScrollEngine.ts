import { useEffect, useRef } from 'react';
import { ACTS } from './acts';
import { useStory } from './store';

export const SCREENS = 16; // page height in viewport heights

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);

function lock(on: boolean) {
  document.documentElement.style.overflow = on ? 'hidden' : '';
}

/**
 * Native scroll → story progress. When Arun reaches an act that is built and not yet played,
 * scrolling locks there and his phone buzzes.
 */
export function useScrollEngine() {
  const last = useRef(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = useStory.getState();
        if (s.phase !== 'ride') return;
        const p = Math.min(1, Math.max(0, scrollY / maxScroll()));
        const act = ACTS.find((a) => a.ready && !s.done[a.id] && p >= a.at && last.current < a.at + 0.002);
        if (act) {
          scrollTo({ top: act.at * maxScroll(), behavior: 'instant' as ScrollBehavior });
          s.setProgress(act.at);
          last.current = act.at;
          lock(true);
          s.buzz(act.id);
          return;
        }
        last.current = p;
        s.setProgress(p);
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const unsub = useStory.subscribe((st, prev) => {
      if (prev.phase !== 'ride' && st.phase === 'ride') { lock(false); onScroll(); }
    });
    return () => { removeEventListener('scroll', onScroll); unsub(); lock(false); };
  }, []);
}

/** Jump to an act (chapter dots). Acts before it are treated as already passed. */
export function jumpTo(p: number) {
  scrollTo({ top: p * maxScroll(), behavior: useStory.getState().reducedMotion ? 'instant' as ScrollBehavior : 'smooth' });
}
