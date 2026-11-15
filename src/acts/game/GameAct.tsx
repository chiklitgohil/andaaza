import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  N, SH, ECPM, put, fits, fitsAnywhere, decideDeal, drawAdPrice, harvestChecks, baseEcpm, hue,
  type Board, type Deal, type Player, type Settings, type Country, type Device,
} from './engine';
import { Chip } from '../../ui/Debrief';
import { useStory } from '../../story/store';

const AD_SECONDS = 5;
const START_BEST = 400; // Arun's record (FICTIONAL)

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
  const [screen, setScreen] = useState<'splash' | 'play' | 'over' | 'ad' | 'final'>('splash');
  const [settings, setSettings] = useState<Settings>({ rulesOn: true, online: true, step: 500, country: 'IN', device: 'android' });
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

  const newGame = useCallback((startScore = 0) => {
    const p = player.current;
    if (score > 0 && score < p.bestStart) p.gamesBelowRecord++; else if (score >= p.bestStart) p.gamesBelowRecord = 0;
    p.bestStart = Math.max(best, score);
    p.revives = 0; p.harvestFired = false; p.setTimes = [];
    const b = Array(N * N).fill(0);
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
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
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

  const lastLethal = log.find((l) => l.deal.kind === 'LETHAL');
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
          className="g-board" ref={boardRef} role="grid" aria-label="Board, 8 by 8. Choose a piece, then use arrow keys and Enter." tabIndex={0}
          onKeyDown={onBoardKey}
          onClick={(e) => {
            if (sel == null) return;
            const rect = boardRef.current!.getBoundingClientRect();
            const cs = rect.width / N, s = SH[hand[sel]!];
            const r = Math.floor((e.clientY - rect.top) / cs) - Math.floor(s.h / 2);
            const c = Math.floor((e.clientX - rect.left) / cs) - Math.floor(s.w / 2);
            place(sel, r, c);
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
            <button className="g-btn" autoFocus onClick={() => newGame(0)}>Play</button>
            <button className="g-btn ghost" onClick={() => newGame(360)}>Continue tonight&rsquo;s game (score 360)</button>
          </div>
        )}
        {screen === 'over' && (
          <div className="g-modal">
            <p className="g-big">{score > player.current.bestStart ? 'New best!' : score >= player.current.bestStart * 0.85 ? 'So close!' : 'No more moves'}</p>
            <p>{score} points{score > player.current.bestStart ? ' · keep the streak alive?' : ` · ${player.current.bestStart - score} from your best`}</p>
            {settings.online && loaded != null ? (
              <button className="g-btn pulse" autoFocus onClick={() => setScreen('ad')}>▶ Watch an ad to keep going</button>
            ) : <p className="g-small">No ad available (offline)</p>}
            <button className="g-link" onClick={() => (revealed ? newGame(0) : endFirstGame())}>No thanks</button>
          </div>
        )}
        {screen === 'ad' && (
          <div className="g-ad" role="dialog" aria-label="Simulated advertisement">
            <div className="g-ad-tag">AD · simulated</div>
            <div className="g-ad-body">
              <div className="g-ad-title">ZIPKART GOLD</div>
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
  const marginLine = Math.ceil(player.current.bestStart * 1.1);

  return (
    <div className="act game-act">
      {phone}
      {ghost && (
        <div className="g-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true"><PieceGrid id={ghost.id} size={24} /></div>
      )}

      {!revealed && screen === 'final' && (
        <div className="reveal-cta" role="dialog" aria-label="Was it bad luck?">
          <p className="reveal-q">Was that last hand just bad luck?</p>
          {deathDeal?.kind === 'LETHAL' && <p className="muted small">It felt unfair. It might have been chosen.</p>}
          <button className="btn" autoFocus onClick={() => { setRevealed(true); newGame(0); }}>Turn the phone around ↻</button>
          <button className="btn ghost small" onClick={onDone}>Put the phone down</button>
        </div>
      )}

      {revealed && (
        <section className="blackbox" aria-label="The other side of the screen">
          <header className="bb-head">
            <p className="kicker">The other side of the screen</p>
            <h2>What the game knows, live</h2>
            <p className="small">
              A <Chip label="WHAT-IF" /> simulation of rules that researcher Ayo Omolewa <Chip label="REPORTED" /> finding in a
              hit puzzle game&rsquo;s code (Oct 2026). The developer did not respond to press questions.
            </p>
          </header>

          <div className="bb-grid">
            <div className="bb-card">
              <h3>Rule 1 · The ad harvest {armed && <span className="armed">ARMED</span>}</h3>
              {checks.map((c) => (
                <div key={c.label} className={`ck ${c.met ? 'ok' : ''}`}><span>{c.met ? '✓' : '·'}</span>{c.label}<em>{c.detail}</em></div>
              ))}
              <p className="tiny">All three at the next deal → a hand chosen because <b>no</b> placement can finish it. Fires once per game; watching an ad to revive raises the bar.</p>
            </div>

            <div className="bb-card">
              <h3>Rule 2 · Past your record</h3>
              <div className={`ck ${score >= marginLine ? 'ok' : ''}`}><span>{score >= marginLine ? '✓' : '·'}</span>Score ≥ record + 10% <em>{score} / {marginLine}</em></div>
              <p className="tiny">Past that line, every new hand has a <b>1 in 5</b> chance of being impossible.</p>
              <h3 style={{ marginTop: 10 }}>Rules 3–4 · Speed and streaks</h3>
              <p className="tiny">Fast hands near your record → harder pieces. Two games below your record → easier pieces, to keep you playing.</p>
            </div>

            <div className="bb-card">
              <h3>Your price tag</h3>
              <div className="price">
                <span className="big">${baseEcpm(settings).toFixed(2)}</span>
                <span className="tiny">per 1,000 rewarded ads <Chip label="REPORTED" /></span>
              </div>
              <div className="row">
                <label>Country <select value={settings.country} onChange={(e) => { const country = e.target.value as Country; setSettings((s) => ({ ...s, country })); player.current.lastEcpm = ECPM[country][settings.device]; }}>
                  {Object.entries(ECPM).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                </select></label>
                <label>Phone <select value={settings.device} onChange={(e) => { const device = e.target.value as Device; setSettings((s) => ({ ...s, device })); player.current.lastEcpm = ECPM[settings.country][device]; }}>
                  <option value="android">Android (Arun)</option><option value="ios">iPhone</option>
                </select></label>
              </div>
              <p className="tiny">Ad loaded right now: <b>{loaded == null ? 'none' : `$${loaded.toFixed(2)}`}</b> · your last ad: <b>${player.current.lastEcpm.toFixed(2)}</b>. (The price of each loaded ad is our invented random auction.)</p>
            </div>

            <div className="bb-card">
              <h3>Try it</h3>
              <label className="tog"><input type="checkbox" checked={settings.rulesOn} onChange={(e) => setSettings((s) => ({ ...s, rulesOn: e.target.checked }))} /> Hidden rules ON (untick for an honest random game)</label>
              <label className="tog"><input type="checkbox" checked={!settings.online} onChange={(e) => setSettings((s) => ({ ...s, online: !e.target.checked }))} /> Airplane mode / ad blocker (no ad can load → no harvest)</label>
              <label className="tog">Record step <select value={settings.step} onChange={(e) => setSettings((s) => ({ ...s, step: +e.target.value as 500 }))}><option>500</option><option>750</option><option>1000</option></select></label>
              <div className="row">
                <button className="btn small" onClick={() => { forcedAd.current = player.current.lastEcpm * 4; setLoaded(forcedAd.current); }}>Load a high-value ad for the next deal</button>
                <button className="btn ghost small" onClick={() => newGame(Math.max(0, player.current.bestStart + settings.step - 40))}>Start just below the harvest line</button>
              </div>
            </div>
          </div>

          <div className="bb-card log">
            <h3>Every hand, and who asked for it</h3>
            {lastLethal && <p className="tiny warn">Hand #{lastLethal.n} was a lethal hand: {lastLethal.deal.nodes} placements tried, 0 finish it.</p>}
            <ol className="dlog" aria-live="polite">
              {log.map((l) => (
                <li key={`${l.game}-${l.n}`} className={l.deal.kind}>
                  <b>Game {l.game} · #{l.n} · {l.deal.kind}</b> at {l.score} pts. {l.deal.why}
                </li>
              ))}
            </ol>
          </div>

          <div className="bb-card stub">
            <h3>What nobody outside can see</h3>
            <p className="tiny">The researcher also found server-side models predicting churn, lifetime value and when you&rsquo;ll click &ldquo;revive&rdquo;, fed by about 40 fields about you and your phone. Their weights are not visible, so we don&rsquo;t simulate them.</p>
          </div>

          <div className="row end">
            <button className="btn" onClick={() => { note('game', { score, best, lethal: stats.lethal, ads: stats.ads }); onDone(); }}>Put the phone down →</button>
          </div>
        </section>
      )}
    </div>
  );
}
