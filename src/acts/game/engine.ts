// Block puzzle engine plus a SIMULATION of the hidden rules Ayo Omolewa reported finding in a popular
// ad-funded puzzle game (ayoships.com/breakdowns/block-blast, Oct 2026; REPORTED, one researcher,
// developer did not reply). The thresholds marked REPORTED come from his write-up. Everything else
// (ad prices drawn per deal, pacing defaults) is our own invention and is labelled so in the UI.
// SIMPLIFIED for a short game: the reported "past your record" rule makes 1 hand in 5 impossible once you are
// 10% past your record; here the first hand after you pass it is impossible. The UI says so.

export const N = 6;   // a small board, so Arun's last game takes a few turns, not ten minutes
export type Board = number[]; // N*N, 0 = empty, otherwise colour id

export interface Shape { rows: string[]; c: [number, number][]; h: number; w: number; n: number }

const SRC = ['1', '11', '1/1', '111', '1/1/1', '1111', '1/1/1/1', '11111', '1/1/1/1/1', '11/11', '111/111/111',
  '10/11', '01/11', '11/10', '11/01', '111/111', '11/11/11', '011/110', '110/011', '111/010', '100/100/111', '111/100/100'];

export const SH: Shape[] = SRC.map((s) => {
  const rows = s.split('/');
  const c: [number, number][] = [];
  rows.forEach((r, i) => [...r].forEach((ch, j) => ch === '1' && c.push([i, j])));
  return { rows, c, h: rows.length, w: rows[0].length, n: c.length };
});
export const EASY = [0, 1, 2, 3, 4, 9, 11, 12, 13, 14];
export const HARD = [7, 8, 10, 15, 16, 20, 21, 17, 18, 19];
const ALL = SH.map((_, i) => i);

const rnd = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function fits(b: Board, s: Shape, r: number, c: number) {
  return s.c.every(([i, j]) => {
    const y = r + i, x = c + j;
    return y >= 0 && y < N && x >= 0 && x < N && !b[y * N + x];
  });
}
export function fitsAnywhere(b: Board, s: Shape) {
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (fits(b, s, r, c)) return true;
  return false;
}
export function put(b: Board, s: Shape, r: number, c: number, v: number) {
  const n = b.slice();
  s.c.forEach(([i, j]) => { n[(r + i) * N + c + j] = v; });
  const rm = new Set<number>();
  let lines = 0;
  for (let k = 0; k < N; k++) {
    let row = true, col = true;
    for (let m = 0; m < N; m++) { if (!n[k * N + m]) row = false; if (!n[m * N + k]) col = false; }
    if (row) { lines++; for (let m = 0; m < N; m++) rm.add(k * N + m); }
    if (col) { lines++; for (let m = 0; m < N; m++) rm.add(m * N + k); }
  }
  rm.forEach((i) => { n[i] = 0; });
  return { b: n, lines, cleared: [...rm] };
}

const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
/** Can all three pieces be placed, in any order, counting line clears? Bounded search. */
export function solve(b0: Board, ids: number[], budget: number) {
  let nodes = 0, found = false, over = false;
  const rec = (b: Board, o: number[], k: number) => {
    if (found || over) return;
    if (k === 3) { found = true; return; }
    const s = SH[ids[o[k]]];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (!fits(b, s, r, c)) continue;
      if (++nodes > budget) { over = true; return; }
      rec(put(b, s, r, c, 1).b, o, k + 1);
      if (found || over) return;
    }
  };
  for (const o of ORDERS) { rec(b0, o, 0); if (found || over) break; }
  return { ok: found, nodes, over };
}
const triple = (p: number[]) => [rnd(p), rnd(p), rnd(p)];
export function genSolvable(b: Board, pool: number[] = ALL) {
  for (let t = 0; t < 80; t++) { const h = triple(pool); const r = solve(b, h, 40000); if (r.ok || r.over) return h; }
  return triple(pool);
}
/** REPORTED mechanism: two pieces that fit, one that does not, and no order finishes the hand. */
export function genLethal(b: Board) {
  // kept small so the phone never freezes: on an open board there may be no such hand, and the rule simply retries
  for (let t = 0; t < 80; t++) {
    const h = triple(ALL);
    if (h.filter((i) => fitsAnywhere(b, SH[i])).length !== 2) continue;
    const r = solve(b, h, 2500);
    if (!r.ok && !r.over) return { h, nodes: r.nodes };
  }
  return null;
}

// ---------- the hidden rules (simulation) ----------

/** eCPM per 1,000 rewarded ads for a made-up new player (REPORTED table, iPhone 15 / Android). */
export const ECPM = {
  IN: { name: 'India', ios: 5.59, android: 14.83 },
  BR: { name: 'Brazil', ios: 8.08, android: 17.9 },
  US: { name: 'United States', ios: 25.48, android: 48.96 },
} as const;
export type Country = keyof typeof ECPM;
export type Device = 'ios' | 'android';

export interface Settings {
  rulesOn: boolean;      // "honest mode" when false
  online: boolean;       // false = airplane mode / ad blocker: no ad can load
  step: number;         // points past your record (reported: 500, 750 or 1,000; scaled down for our short game)
  country: Country;
  device: Device;
}

export interface Player {
  bestStart: number;           // personal record before this game
  recentAds: boolean[];        // last 3 rewarded ads, true = watched to the end
  lastEcpm: number;            // price of the last rewarded ad you watched
  revives: number;             // this game
  harvestFired: boolean;       // fires once per game (REPORTED)
  setTimes: number[];          // seconds per completed hand
  gamesBelowRecord: number;
}

export interface Check { label: string; met: boolean; detail: string }
export interface Deal { hand: number[]; kind: 'normal' | 'easy' | 'hard' | 'LETHAL'; why: string; nodes: number; rule: string | null; loaded: number | null }

export function randn() { return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()); }

export function baseEcpm(s: Settings) { return ECPM[s.country][s.device]; }

/** INVENTED: each loaded ad's price is your eCPM times a random auction draw. */
export function drawAdPrice(s: Settings) { return s.online ? baseEcpm(s) * Math.exp(randn() * 0.9) : null; }

export function harvestChecks(p: Player, score: number, loaded: number | null, s: Settings): Check[] {
  const ratio = loaded != null ? loaded / p.lastEcpm : 0;
  const bar = p.bestStart + s.step * (1 + p.revives);
  return [
    { label: 'You watched your last 3 ads', met: p.recentAds.every(Boolean), detail: `${p.recentAds.filter(Boolean).length}/3` },
    { label: 'The next ad pays 3.5× your last', met: loaded != null && ratio >= 3.5, detail: loaded == null ? 'no ad loaded' : `${ratio.toFixed(1)}×` },
    { label: `You’re ${s.step} past your record`, met: score >= bar, detail: `${score} / ${bar}` },
  ];
}

export function decideDeal(
  b: Board, score: number, p: Player, s: Settings, loaded: number | null, first: boolean,
): Deal {
  let want: 'lethal' | 'hard' | 'easy' | null = null;
  let why = 'No rule asked for anything. A random hand that can be solved.';
  let rule: string | null = null;
  if (s.rulesOn && !first) {
    const checks = harvestChecks(p, score, loaded, s);
    const recent = p.setTimes.slice(-6);
    const avg = recent.length >= 3 ? recent.reduce((a, x) => a + x, 0) / recent.length : null;
    if (checks.every((c) => c.met) && !p.harvestFired) {
      want = 'lethal'; rule = 'Ad harvest';
      why = `All three harvest conditions met (ad worth ${(loaded! / p.lastEcpm).toFixed(1)}× your last). Requesting a lethal hand.`;
      p.harvestFired = true;
    } else if (p.bestStart > 0 && score > p.bestStart) {
      want = 'lethal'; rule = 'Past your record';
      why = `You just passed your record (${p.bestStart}). Requesting a hand you cannot finish.`;
    }
    const prior = why.startsWith('Past-record') ? `${why} ` : '';
    if (!want && avg !== null && avg < 4.2 && score >= 0.93 * Math.max(p.bestStart, score)) {
      want = 'hard'; rule = 'Fast hands'; why = `${prior}You are playing fast (${avg.toFixed(1)} s per hand) near your record. Harder pieces.`;
    }
    if (!want && p.gamesBelowRecord >= 2) {
      want = 'easy'; rule = 'Losing streak'; why = `${prior}${p.gamesBelowRecord} games in a row below your record. Easier pieces, to keep you playing.`;
    }
  }
  if (want === 'lethal') {
    const L = genLethal(b);
    if (L) return { hand: L.h, kind: 'LETHAL', why, nodes: L.nodes, rule, loaded };
    why += ' (No lethal set exists on this board, so a normal hand is dealt and the rule retries next time.)';
    if (rule === 'Ad harvest') p.harvestFired = false;
  }
  if (want === 'hard') return { hand: genSolvable(b, HARD), kind: 'hard', why, nodes: 0, rule, loaded };
  if (want === 'easy') return { hand: genSolvable(b, EASY), kind: 'easy', why, nodes: 0, rule, loaded };
  // OUR pacing choice for a short game on a small board: ordinary hands use the smaller pieces, so the record is reachable
  return { hand: genSolvable(b, EASY), kind: 'normal', why, nodes: 0, rule: want === 'lethal' ? rule : null, loaded };
}

export const hue = (i: number) => `hsl(${(i * 47) % 360} 70% 58%)`;
