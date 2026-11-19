import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  N, SH, ECPM, put, fits, fitsAnywhere, decideDeal, drawAdPrice, harvestChecks, baseEcpm, hue,
  type Board, type Deal, type Player, type Settings, type Country, type Device,
} from './engine';
import { Guess } from '../guess';
import { Unfold } from '../unfold';
import { UNFOLD } from '../../content/unfold';
import { useStory } from '../../story/store';
import { sfx } from '../../audio/sound';

const AD_SECONDS = 5;
const START_BEST = 120;  // Arun's record (FICTIONAL)
const START_SCORE = 100; // tonight's game, continued: close enough to the record to beat it in a few turns
// tonight's board, part-filled and scattered (6×6, 0 = empty): room for a few hands before it gets tight
const START_BOARD = [
  3, 0, 0, 0, 0, 9,
  0, 0, 0, 0, 0, 0,
  0, 0, 12, 0, 0, 0,
  0, 7, 0, 0, 14, 0,
  2, 0, 0, 0, 14, 0,
  2, 0, 0, 18, 0, 0,
];

interface LogEntry { n: number; deal: Deal; score: number; game: number }

function PieceGrid({ id, size }: { id: number; size: number }) {
  const s = SH[id];
  return (
    <div className="pg" style={{ gridTemplateColumns: `repeat(${s.w}, ${size}px)` }}>
      {s.rows.flatMap((r, i) => [...r].map((ch, j) => (
        <i key={`${i}-${j}`} style={{ width: size, height: size, background: ch === '1' ? hue(id + 1) : 'transparent' }} />
      )))}
    </div>
  );
}

export default function GameAct({ onDone }: { onDone: () => void }) {
  const note = useStory((s) => s.note);
  const [revealed, setRevealed] = useState(false);
  const [unfold, setUnfold] = useState(false);
  const [testing, setTesting] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [screen, setScreen] = useState<'splash' | 'play' | 'over' | 'ad' | 'final'>('splash');
  const [settings, setSettings] = useState<Settings>({ rulesOn: true, online: true, step: 20, country: 'IN', device: 'android' });
  const [board, setBoard] = useState<Board>(() => Array(N * N).fill(0));
  const [hand, setHand] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(START_BEST);
  const [loaded, setLoaded] = useState<number | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [cursor, setCursor] = useState<[number, number]>([3, 3]);
  const [preview, setPreview] = useState<{ r: number; c: number } | null>(null);
  const [adLeft, setAdLeft] = useState(AD_SECONDS);
  const [game, setGame] = useState(1);
  const [flash, setFlash] = useState<string | null>(null);
  const [stats, setStats] = useState({ lethal: 0, ads: 0, deals: 0 });
  const player = useRef<Player>({ bestStart: START_BEST, recentAds: [true, true, true], lastEcpm: ECPM.IN.android, revives: 0, harvestFired: false, setTimes: [], gamesBelowRecord: 0 });
  const handStart = useRef(performance.now());
  const boardRef = useRef<HTMLDivElement>(null);
  const forcedAd = useRef<number | null>(null);
  const lastDeal = useRef<Deal | null>(null);

  const dealNew = useCallback((b: Board, sc: number, first: boolean, g: number) => {
    const ld = forcedAd.current ?? drawAdPrice(settings);
    forcedAd.current = null;
    setLoaded(ld);
    const d = decideDeal(b, sc, player.current, settings, ld, first);
    lastDeal.current = d;
    setHand(d.hand.slice());
    handStart.current = performance.now();
    setStats((s) => ({ ...s, deals: s.deals + 1, lethal: s.lethal + (d.kind === 'LETHAL' ? 1 : 0) }));
    setLog((l) => [{ n: l.length + 1, deal: d, score: sc, game: g }, ...l].slice(0, 60));
  }, [settings]);

  const newGame = useCallback((startScore = START_SCORE) => {
    const p = player.current;
    if (score > 0 && score < p.bestStart) p.gamesBelowRecord++; else if (score >= p.bestStart) p.gamesBelowRecord = 0;
    p.bestStart = Math.max(best, score);
    p.revives = 0; p.harvestFired = false; p.setTimes = [];
    const b = startScore === START_SCORE ? START_BOARD.slice() : Array(N * N).fill(0);
    setBest(p.bestStart);
    setBoard(b); setScore(startScore); setSel(null);
    const g = game + (screen === 'splash' ? 0 : 1);
    setGame(g);
    setScreen('play');
    dealNew(b, startScore, true, g);
  }, [best, score, game, screen, dealNew]);

  const checkOver = useCallback((b: Board, h: (number | null)[]) => {
    const alive = h.some((id) => id != null && fitsAnywhere(b, SH[id]));
    if (!alive) setScreen('over');
  }, []);

  const place = useCallback((k: number, r: number, c: number) => {
    const id = hand[k];
    if (id == null || screen !== 'play') return false;
    const s = SH[id];
    if (!fits(board, s, r, c)) return false;
    const o = put(board, s, r, c, id + 1);
    const gained = s.n + (o.lines ? 10 * o.lines * o.lines : 0);
    const sc = score + gained;
    const h = hand.slice(); h[k] = null;
    setBoard(o.b); setScore(sc); setSel(null); setPreview(null);
    if (o.lines) sfx.clear(o.lines); else sfx.place();
    if (o.lines) setFlash(o.lines > 1 ? `${o.lines} lines! +${gained}` : `Clear! +${gained}`);
    if (sc > best) setBest(sc);
    if (h.every((x) => x == null)) {
      player.current.setTimes.push((performance.now() - handStart.current) / 1000);
      dealNew(o.b, sc, false, game);
    } else {
      setHand(h);
      checkOver(o.b, h);
    }
    return true;
  }, [hand, screen, board, score, best, dealNew, game, checkOver]);

  // after a new hand is dealt, check for game over
  useEffect(() => { if (screen === 'play' && hand.length) checkOver(board, hand); }, [hand]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 900); return () => clearTimeout(t); }, [flash]);

  // sound: game over, the ad jingle, the machine hum behind the screen
  useEffect(() => { if (screen === 'over') sfx.over(); if (screen === 'ad') { sfx.adStart(); return () => sfx.adStop(); } }, [screen]);
  useEffect(() => { sfx.drone(revealed); }, [revealed]);
  useEffect(() => () => { sfx.drone(false); sfx.adStop(); }, []);

  // the simulated ad
  useEffect(() => {
    if (screen !== 'ad') return;
    setAdLeft(AD_SECONDS);
    const id = setInterval(() => setAdLeft((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [screen]);
  useEffect(() => { if (screen === 'ad' && adLeft <= 0) finishAd(true); }, [adLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  function finishAd(completed: boolean) {
    const p = player.current;
    p.recentAds = [completed, ...p.recentAds].slice(0, 3);
    if (!completed) { setScreen('over'); return; }
    p.lastEcpm = loaded ?? p.lastEcpm;
    p.revives++;
    p.harvestFired = false; // a revive raises the bar; the rule can fire again (REPORTED)
    setStats((s) => ({ ...s, ads: s.ads + 1 }));
    const b = board.slice();
    for (let i = (N / 2) * N; i < N * N; i++) b[i] = 0;
    setBoard(b);
    setScreen('play');
    dealNew(b, score, false, game);
  }

  const endFirstGame = () => {
    note('game', { score, best, lethal: stats.lethal, ads: stats.ads });
    setScreen('final');
  };

  // ---------- pointer drag ----------
  const drag = useRef<{ k: number; moved: boolean } | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; id: number } | null>(null);
  const cellAt = (x: number, y: number, id: number) => {
    const rect = boardRef.current!.getBoundingClientRect();
    const cs = rect.width / N, s = SH[id];
    return { r: Math.round((y - rect.top) / cs - s.h / 2), c: Math.round((x - rect.left) / cs - s.w / 2) };
  };
  const onPieceDown = (e: React.PointerEvent, k: number) => {
    const id = hand[k];
    if (id == null || screen !== 'play') return;
    drag.current = { k, moved: false };
    try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); } catch { /* no active pointer (e.g. synthetic events) */ }
  };
  const onPieceMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const id = hand[drag.current.k]!;
    drag.current.moved = true;
    setGhost({ x: e.clientX, y: e.clientY, id });
    setPreview(cellAt(e.clientX, e.clientY, id));
  };
  const onPieceUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null; setGhost(null);
    if (!d) return;
    if (d.moved) { const t = cellAt(e.clientX, e.clientY, hand[d.k]!); if (!place(d.k, t.r, t.c)) setPreview(null); }
    else setSel((s) => (s === d.k ? null : d.k));
  };
  const onBoardKey = (e: React.KeyboardEvent) => {
    if (sel == null) return;
    const [r, c] = cursor;
    const mv: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (mv[e.key]) { e.preventDefault(); const n: [number, number] = [Math.max(0, Math.min(N - 1, r + mv[e.key][0])), Math.max(0, Math.min(N - 1, c + mv[e.key][1]))]; setCursor(n); setPreview({ r: n[0], c: n[1] }); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); place(sel, r, c); }
  };

  const pvCells = useMemo(() => {
    const k = drag.current?.k ?? sel;
    if (!preview || k == null || hand[k] == null) return null;
    const s = SH[hand[k]!];
    const ok = fits(board, s, preview.r, preview.c);
    return { ok, set: new Set(s.c.map(([i, j]) => (preview.r + i) * N + preview.c + j)) };
  }, [preview, sel, hand, board]);

  const deathDeal = lastDeal.current;

  // ---------- the phone ----------
  const phone = (
    <div className={`phone ${revealed ? 'moved' : ''}`} aria-label="Arun's phone">
      <div className="phone-notch" />
      <div className="phone-screen game">
        <div className="g-top">
          <span className="g-logo">STACK</span>
          <span className="g-score"><small>SCORE</small>{score}</span>
          <span className="g-best"><small>BEST</small>{best}</span>
        </div>

        <div
          className="g-board" ref={boardRef} role="grid" aria-label={`Board, ${N} by ${N}. Choose a piece, then use arrow keys and Enter.`} tabIndex={0}
          onKeyDown={onBoardKey}
          onClick={(e) => {
            if (sel == null || hand[sel] == null) return;
            // use exactly the cell the hover preview showed, so the block lands where it was drawn
            const t = cellAt(e.clientX, e.clientY, hand[sel]!);
            place(sel, t.r, t.c);
          }}
          onMouseMove={(e) => { if (sel != null && !drag.current) setPreview(cellAt(e.clientX, e.clientY, hand[sel]!)); }}
        >
          {board.map((v, i) => (
            <div key={i} className={`cell ${pvCells?.set.has(i) ? (pvCells.ok ? 'pv' : 'bad') : ''}`} style={v ? { background: hue(v), boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.25)' } : undefined} />
          ))}
          {flash && <div className="g-flash">{flash}</div>}
        </div>

        <div className="g-tray" role="group" aria-label="Your three pieces">
          {hand.map((id, k) => (
            <button
              key={k} className={`g-piece ${sel === k ? 'sel' : ''}`} disabled={id == null || screen !== 'play'}
              aria-pressed={sel === k} aria-label={id == null ? 'used' : `Piece ${k + 1}, ${SH[id].n} blocks`}
              onPointerDown={(e) => onPieceDown(e, k)} onPointerMove={onPieceMove} onPointerUp={onPieceUp}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(k); boardRef.current?.focus(); } }}
            >
              {id != null && <PieceGrid id={id} size={16} />}
            </button>
          ))}
        </div>

        {screen === 'splash' && (
          <div className="g-modal">
            <div className="g-logo big">STACK</div>
            <p>Your best: <b>{best}</b></p>
            <button className="g-btn" autoFocus onClick={() => newGame(START_SCORE)}>Continue tonight&rsquo;s game · {START_SCORE} points</button>
          </div>
        )}
        {screen === 'over' && (
          <div className="g-modal">
            <p className="g-big">{score > player.current.bestStart ? 'New best!' : score >= player.current.bestStart * 0.85 ? 'So close!' : 'No more moves'}</p>
            <p>{score} points{score > player.current.bestStart ? ' · keep the streak alive?' : ` · ${player.current.bestStart - score} from your best`}</p>
            {settings.online && loaded != null ? (
              <button className="g-btn pulse" autoFocus onClick={() => setScreen('ad')}>▶ Watch an ad to keep going</button>
            ) : <p className="g-small">No ad available (offline)</p>}
            <button className="g-link" onClick={() => (revealed ? newGame(START_SCORE) : endFirstGame())}>No thanks</button>
          </div>
        )}
        {screen === 'ad' && (
          <div className="g-ad" role="dialog" aria-label="Simulated advertisement">
            <div className="g-ad-tag">AD · simulated</div>
            <div className="g-ad-body">
              <div className="g-ad-title">FLOPCART GOLD</div>
              <div>Groceries in minutes. ₹0 delivery for 3 months!</div>
            </div>
            <div className="g-ad-bar"><i style={{ width: `${((AD_SECONDS - adLeft) / AD_SECONDS) * 100}%` }} /></div>
            <div className="g-ad-foot">
              <span>Reward in {Math.max(0, adLeft)} s</span>
              {adLeft <= AD_SECONDS - 2 && <button className="g-link" onClick={() => finishAd(false)}>✕ close early (no reward)</button>}
            </div>
          </div>
        )}
        {screen === 'final' && (
          <div className="g-modal">
            <p className="g-big">Game over</p>
            <p>{score} points. Arun puts the phone face-down.</p>
            <p className="g-small">Then picks it up again.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ---------- the reveal: the other side of the screen ----------
  const checks = harvestChecks(player.current, score, loaded, settings);
  const armed = settings.rulesOn && checks.every((c) => c.met) && !player.current.harvestFired;

  return (
    <div className="act game-act">
      {phone}
      {ghost && (
        <div className="g-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true"><PieceGrid id={ghost.id} size={24} /></div>
      )}

      {!revealed && !unfold && screen === 'final' && (
        <div className="reveal-cta" role="dialog" aria-label="Was it bad luck?">
          <Guess id="game-luck" q="Was that last hand just bad luck?" options={['Bad luck', 'Chosen for me']}
            onAnswer={() => setAnswered(true)}
            reveal={deathDeal?.kind === 'LETHAL' ? 'It felt unfair. It might have been chosen.' : 'From the front of the phone, you can’t tell.'} />
          {answered && <button className="btn" autoFocus onClick={() => { setRevealed(true); newGame(START_SCORE); }}>Turn the phone around ↻</button>}
          {answered && <button className="btn ghost small" onClick={() => setUnfold(true)}>Put the phone down</button>}
        </div>
      )}

      {revealed && !unfold && (
        <section className="blackbox slim" aria-label="The other side of the screen">
          <header className="bb-head">
            <p className="kicker">The other side of the screen</p>
            <h2>What the game knows, live</h2>
            <p className="small">Keep playing. These are rules one developer says he found inside a hit puzzle game, simulated here.</p>
          </header>
          <div className="bb-grid two">
            <div className="bb-card">
              <h3>Rule 1 · Harvest {armed && <span className="armed">ARMED</span>}</h3>
              {checks.map((c) => (
                <div key={c.label} className={`ck ${c.met ? 'ok' : ''}`}><span>{c.met ? '✓' : '·'}</span>{c.label}<em>{c.detail}</em></div>
              ))}
              <p className="tiny">All three → the next hand cannot be placed. (Reported: 500 to 1,000 points past your record. Scaled down here for a short game.)</p>
            </div>
            <div className="bb-card">
              <h3>Rule 2 · Past your record</h3>
              <div className={`ck ${score > player.current.bestStart ? 'ok' : ''}`}><span>{score > player.current.bestStart ? '✓' : '·'}</span>You passed your record<em>{score} / {player.current.bestStart}</em></div>
              <p className="tiny">Then the next hand cannot be finished. (Reported: 1 hand in 5, once you&rsquo;re 10% past it. Made certain here to keep the game short.)</p>
              <label className="tog hero-tog"><input type="checkbox" checked={settings.rulesOn} onChange={(e) => setSettings((s) => ({ ...s, rulesOn: e.target.checked }))} /> Hidden rules {settings.rulesOn ? 'ON' : 'OFF'}</label>
            </div>
          </div>
          <button className={`btn ghost small test-toggle ${testing ? 'on' : ''}`} aria-expanded={testing} onClick={() => setTesting((x) => !x)}>{testing ? 'Hide the test controls ▴' : 'Test it yourself: Wi-Fi, country, phone, ads ▾'}</button>
          {testing && (
            <div className="bb-card tester">
              <label className="tog"><input type="checkbox" checked={!settings.online} onChange={(e) => setSettings((s) => ({ ...s, online: !e.target.checked }))} /> Wi-Fi off / ad blocker on (no ad can load, so nothing to harvest)</label>
              <div className="row">
                <label>Country <select value={settings.country} onChange={(e) => { const country = e.target.value as Country; setSettings((s) => ({ ...s, country })); player.current.lastEcpm = ECPM[country][settings.device]; }}>
                  {Object.entries(ECPM).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select></label>
                <label>Phone <select value={settings.device} onChange={(e) => { const device = e.target.value as Device; setSettings((s) => ({ ...s, device })); player.current.lastEcpm = ECPM[settings.country][device]; }}>
                  <option value="android">Android (Arun)</option><option value="ios">iPhone</option>
                </select></label>
              </div>
              <p className="tiny">What a player like this is reportedly worth: <b>${baseEcpm(settings).toFixed(2)}</b> per 1,000 ads watched. Ad loaded right now: <b>{loaded == null ? 'none' : `$${loaded.toFixed(2)}`}</b> (each ad&rsquo;s price is our own made-up auction).</p>
              <button className="btn small" onClick={() => { forcedAd.current = player.current.lastEcpm * 4; setLoaded(forcedAd.current); }}>Load a high-value ad for the next hand</button>
            </div>
          )}

          <div className="bb-card log">
            <h3>Last hands</h3>
            <ol className="dlog" aria-live="polite">
              {log.slice(0, 5).map((l) => (
                <li key={`${l.game}-${l.n}`} className={l.deal.kind}><b>#{l.n} · {l.deal.kind === 'LETHAL' ? 'impossible' : l.deal.kind.toLowerCase()}</b> at {l.score} pts</li>
              ))}
            </ol>
          </div>
          <div className="row end">
            <button className="btn" onClick={() => setUnfold(true)}>What does it mean? →</button>
          </div>
        </section>
      )}

      {unfold && (
        <div className="game-unfold">
          <Unfold impact="game" items={UNFOLD.game} doneLabel="Put the phone down →" onDone={onDone} />
        </div>
      )}
    </div>
  );
}
