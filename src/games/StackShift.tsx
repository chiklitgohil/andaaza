// STACK SHIFT: an ORIGINAL, simplified block puzzle. It is not a copy of any real game.
// It illustrates (WHAT-IF) the mechanism described in Ayo Omolewa's REPORTED analysis of a popular
// puzzle game: a dealer that can hand out unplaceable pieces right after you beat your best,
// when a (pretend) ad is worth the most. The "fair dealer" mode is the control condition.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LabelChip, IllustrativeTag } from '../ui/LabelChip';

const N = 8;
type Cell = 0 | 1;
type Piece = { id: string; cells: [number, number][]; color: string };

const SHAPES: [number, number][][] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
];
const COLORS = ['#7fe3ff', '#c9a7ff', '#ffcf6e', '#9cf5c8', '#ff9fb2', '#5aa9ff'];

let uid = 0;
const mk = (shape: [number, number][]): Piece => ({ id: `p${uid++}`, cells: shape, color: COLORS[uid % COLORS.length] });

function fits(board: Cell[][], p: Piece, r: number, c: number) {
  return p.cells.every(([dr, dc]) => {
    const rr = r + dr, cc = c + dc;
    return rr >= 0 && cc >= 0 && rr < N && cc < N && board[rr][cc] === 0;
  });
}
function fitsAnywhere(board: Cell[][], p: Piece) {
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (fits(board, p, r, c)) return true;
  return false;
}
const empty = (): Cell[][] => Array.from({ length: N }, () => Array<Cell>(N).fill(0));

interface DealerState { adValue: number; lastAd: number; adsWatched: number }

export default function StackShift() {
  const [mode, setMode] = useState<'fair' | 'rigged'>('fair');
  const [board, setBoard] = useState<Cell[][]>(empty);
  const [tray, setTray] = useState<Piece[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(40); // FICTIONAL starting personal best
  const [over, setOver] = useState(false);
  const [strings, setStrings] = useState(false);
  const [dealer, setDealer] = useState<DealerState>({ adValue: 1, lastAd: 1, adsWatched: 3 });
  const [lethalDealt, setLethalDealt] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const TRIP = 20; // ILLUSTRATIVE points past personal best (the analysis reports 1,000 in a game with bigger scores)

  const deal = useCallback((b: Cell[][], sc: number, d: DealerState) => {
    const tripwire = sc >= best + TRIP;
    const adRatio = d.adValue / d.lastAd;
    const rigged = mode === 'rigged' && tripwire && d.adsWatched >= 3 && adRatio >= 3.5;
    if (rigged) {
      // try to find three pieces that cannot be placed anywhere
      const unplaceable = SHAPES.map(mk).filter((p) => !fitsAnywhere(b, p));
      const pool = unplaceable.length ? unplaceable : SHAPES.slice(-3).map(mk);
      setLethalDealt((n) => n + 1);
      setLog((l) => [`Dealer: score ${sc} ≥ best ${best} + ${TRIP}, ad worth ${adRatio.toFixed(1)}× the last → dealt a "lethal" hand.`, ...l].slice(0, 5));
      return [0, 1, 2].map((i) => ({ ...pool[i % pool.length], id: `p${uid++}` }));
    }
    return [0, 1, 2].map(() => mk(SHAPES[Math.floor(Math.random() * SHAPES.length)]));
  }, [best, mode]);

  const reset = useCallback(() => {
    const b = empty();
    setBoard(b);
    setScore(0);
    setOver(false);
    setSel(null);
    const d = { adValue: 1, lastAd: 1, adsWatched: 3 };
    setDealer(d);
    setTray(deal(b, 0, d));
    setLog([]);
  }, [deal]);

  useEffect(() => { reset(); }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // the pretend ad market drifts (ILLUSTRATIVE)
  useEffect(() => {
    const id = setInterval(() => setDealer((d) => ({ ...d, adValue: Math.max(0.5, Math.min(6, d.adValue + (Math.random() - 0.45) * 0.9)) })), 900);
    return () => clearInterval(id);
  }, []);

  const selected = tray.find((p) => p.id === sel) ?? null;

  const place = (r: number, c: number) => {
    if (!selected || over || !fits(board, selected, r, c)) return;
    const b = board.map((row) => row.slice()) as Cell[][];
    selected.cells.forEach(([dr, dc]) => { b[r + dr][c + dc] = 1; });
    let gained = selected.cells.length;
    const fullRows = [...Array(N).keys()].filter((i) => b[i].every((x) => x === 1));
    const fullCols = [...Array(N).keys()].filter((j) => b.every((row) => row[j] === 1));
    fullRows.forEach((i) => { for (let j = 0; j < N; j++) b[i][j] = 0; });
    fullCols.forEach((j) => { for (let i = 0; i < N; i++) b[i][j] = 0; });
    gained += (fullRows.length + fullCols.length) * 10;
    const sc = score + gained;
    let rest = tray.filter((p) => p.id !== selected.id);
    if (rest.length === 0) rest = deal(b, sc, dealer);
    setBoard(b);
    setScore(sc);
    setTray(rest);
    setSel(null);
    if (rest.every((p) => !fitsAnywhere(b, p))) {
      setOver(true);
      if (sc > best) setBest(sc);
    }
  };

  const previewCells = useMemo(() => {
    if (!selected || !hover) return new Set<string>();
    const ok = fits(board, selected, hover[0], hover[1]);
    return new Set(selected.cells.map(([dr, dc]) => `${hover[0] + dr},${hover[1] + dc},${ok ? 'ok' : 'bad'}`));
  }, [selected, hover, board]);
  const isPreview = (r: number, c: number) => {
    for (const k of previewCells) { const [a, b2, s] = k.split(','); if (+a === r && +b2 === c) return s; }
    return null;
  };

  const adRatio = dealer.adValue / dealer.lastAd;
  const tripOn = score >= best + TRIP;

  return (
    <div className="stack">
      <p className="small">
        <LabelChip label="WHAT-IF" compact /> <strong>Stack Shift</strong> is our own simplified puzzle. Place
        pieces to fill rows or columns. Play once with the <em>fair dealer</em>, then switch to the{' '}
        <em>rigged dealer</em> and try to beat your best.
      </p>
      <div className="btn-row" style={{ marginBottom: 8 }}>
        <div role="radiogroup" aria-label="Dealer" className="btn-row">
          <button className={`btn small ${mode === 'fair' ? '' : 'ghost'}`} role="radio" aria-checked={mode === 'fair'} onClick={() => setMode('fair')}>Fair dealer</button>
          <button className={`btn small ${mode === 'rigged' ? '' : 'ghost'}`} role="radio" aria-checked={mode === 'rigged'} onClick={() => setMode('rigged')}>Rigged dealer</button>
        </div>
        <button className={`btn small ${strings ? '' : 'ghost'}`} onClick={() => setStrings((s) => !s)} aria-pressed={strings}>{strings ? '◉ Inside the dealer' : '○ Look inside the dealer'}</button>
      </div>
      <div className="stack-hud small">
        <span>Score <strong>{score}</strong></span>
        <span>Personal best <strong>{best}</strong></span>
        {over && <span style={{ color: 'var(--danger)' }}>No moves left</span>}
      </div>

      <div className="stack-wrap">
        <div className="stack-board" role="grid" aria-label="Board, 8 by 8" onMouseLeave={() => setHover(null)}>
          {board.map((row, r) => (
            <div role="row" key={r} className="stack-row">
              {row.map((v, c) => {
                const pv = isPreview(r, c);
                return (
                  <button
                    key={c}
                    role="gridcell"
                    className={`stack-cell ${v ? 'filled' : ''} ${pv === 'ok' ? 'pv-ok' : pv === 'bad' ? 'pv-bad' : ''}`}
                    aria-label={`Row ${r + 1}, column ${c + 1}${v ? ', filled' : ''}`}
                    onMouseEnter={() => setHover([r, c])}
                    onFocus={() => setHover([r, c])}
                    onClick={() => place(r, c)}
                    disabled={over}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="stack-tray" aria-label="Pieces">
          {tray.map((p) => {
            const h = Math.max(...p.cells.map(([r]) => r)) + 1;
            const w = Math.max(...p.cells.map(([, c]) => c)) + 1;
            const placeable = fitsAnywhere(board, p);
            return (
              <button
                key={p.id}
                className={`stack-piece ${sel === p.id ? 'sel' : ''} ${placeable ? '' : 'dead'}`}
                onClick={() => setSel(p.id)}
                aria-pressed={sel === p.id}
                aria-label={`Piece of ${p.cells.length} blocks${placeable ? '' : ', cannot be placed'}`}
                style={{ gridTemplateColumns: `repeat(${w}, 12px)`, gridTemplateRows: `repeat(${h}, 12px)` }}
              >
                {p.cells.map(([r, c], i) => (
                  <span key={i} style={{ gridRow: r + 1, gridColumn: c + 1, background: p.color }} />
                ))}
              </button>
            );
          })}
          <p className="muted" style={{ fontSize: '0.72rem', margin: 0 }}>Pick a piece, then click a square (its top-left corner goes there).</p>
        </div>
      </div>

      {over && (
        <div className="panel small" role="status" style={{ marginTop: 10 }}>
          {mode === 'rigged' && lethalDealt > 0 ? (
            <p>Game over, but this hand was <strong>dealt to be impossible</strong>. In a real ad-funded game,
              this is the moment a &ldquo;watch an ad to continue?&rdquo; offer would appear, right when you are
              closest to a new record and most likely to say yes.</p>
          ) : (
            <p>Game over. With the fair dealer, pieces are random. Bad luck happens, but nobody chose it for you.</p>
          )}
          <button className="btn small" onClick={reset}>Play again</button>
        </div>
      )}

      {strings && (
        <div className="panel stack-inside small" style={{ marginTop: 10 }}>
          <h3>Inside the dealer {mode === 'fair' && <span className="muted">(fair mode: these rules are switched off)</span>}</h3>
          <ul>
            <li>Personal-best tripwire: score ≥ best + {TRIP} <IllustrativeTag /> → <strong style={{ color: tripOn ? 'var(--done)' : 'var(--muted)' }}>{tripOn ? 'TRIPPED' : 'not yet'}</strong></li>
            <li>Rewarded ads watched ≥ 3 → <strong>{dealer.adsWatched}</strong> (pretend)</li>
            <li>Value of the ad loaded now vs the last one ≥ 3.5× → <strong style={{ color: adRatio >= 3.5 ? 'var(--done)' : 'var(--muted)' }}>{adRatio.toFixed(1)}×</strong> <IllustrativeTag /></li>
            <li>Lethal hands dealt this game: <strong>{lethalDealt}</strong></li>
          </ul>
          {log.map((l, i) => <div key={i} className="muted" style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem' }}>{l}</div>)}
          <p style={{ marginTop: 8 }}>
            These three conditions mirror rules that <strong>Ayo Omolewa</strong> reports finding in a popular puzzle
            game&rsquo;s downloaded rule files (<LabelChip label="REPORTED" compact />: one author, partly
            reproducible, no developer response found). Our version is simplified and its numbers are invented.{' '}
            <a href="https://ayoships.com/breakdowns/block-blast" target="_blank" rel="noreferrer noopener">Read the original breakdown</a>{' '}
            · <a href="#/library/block-blast-analysis-2026">Case card</a>
          </p>
          <p className="muted">
            Scepticism check: a single bad hand proves nothing. To test a dealer fairly you would play many games
            in both modes and compare how often unplaceable hands appear near a personal best versus elsewhere.
            The Auditor&rsquo;s Lab teaches this.
          </p>
        </div>
      )}
    </div>
  );
}
