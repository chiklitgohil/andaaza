import { create } from 'zustand';

function reduced(): boolean {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

export type Phase = 'ride' | 'buzz' | 'dive' | 'phone' | 'surface' | 'debrief';

interface State {
  progress: number;
  phase: Phase;
  actId: string | null;      // the act currently buzzing / open
  done: Record<string, boolean>;
  reducedMotion: boolean;
  sound: boolean;            // on by default; it starts at the visitor's first click (a browser rule)
  journal: Record<string, unknown>;   // choices, guesses and results for the "Your day" recap
  phoneClock: string | null; // the time on Arun's phone while a stop is open; the top bar shows it too
  setProgress: (p: number) => void;
  buzz: (id: string) => void;
  dive: () => void;
  openPhone: () => void;
  surface: () => void;
  showDebrief: () => void;
  finish: () => void;
  note: (key: string, value: unknown) => void;
  restart: () => void;
}

// In memory only: nothing is stored or sent.
export const useStory = create<State>((set, get) => ({
  progress: 0,
  phase: 'ride',
  actId: null,
  done: {},
  reducedMotion: reduced(),
  sound: true,
  journal: {},
  phoneClock: null,
  setProgress: (p) => set({ progress: p }),
  buzz: (id) => set({ phase: 'buzz', actId: id, phoneClock: null }),
  dive: () => set({ phase: 'dive' }),
  openPhone: () => set({ phase: 'phone' }),
  surface: () => set({ phase: 'surface' }),
  showDebrief: () => set({ phase: 'debrief' }),
  finish: () => {
    const id = get().actId;
    set((s) => ({ phase: 'ride', actId: null, phoneClock: null, done: id ? { ...s.done, [id]: true } : s.done }));
  },
  note: (key, value) => set((s) => ({ journal: { ...s.journal, [key]: value } })),
  restart: () => set({ phase: 'ride', actId: null, done: {}, journal: {}, progress: 0, phoneClock: null }),
}));
