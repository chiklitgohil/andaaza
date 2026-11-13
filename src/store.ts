import { create } from 'zustand';

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

interface State {
  visited: string[];               // city stops the visitor has opened
  reducedMotion: boolean;
  markVisited: (stop: string) => void;
  setReducedMotion: (v: boolean) => void;
  reset: () => void;
}

// Kept in memory only. Nothing is written to storage or sent anywhere.
export const useStore = create<State>((set) => ({
  visited: [],
  reducedMotion: prefersReducedMotion(),
  markVisited: (stop) =>
    set((s) => (s.visited.includes(stop) ? s : { visited: [...s.visited, stop] })),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  reset: () => set({ visited: [] }),
}));
