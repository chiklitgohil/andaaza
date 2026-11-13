import { useEffect, useRef, useState } from 'react';

interface Pt { x: number; y: number; t: number; click?: boolean }

/**
 * Records your cursor movements and clicks on this page IN MEMORY ONLY,
 * then replays them, to show what a "session replay" script captures.
 * Nothing is stored or transmitted; the recording disappears when you leave the room.
 */
export function useSessionRecorder(windowMs = 30000) {
  const pts = useRef<Pt[]>([]);
  useEffect(() => {
    let last = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 30) return;
      last = now;
      pts.current.push({ x: e.clientX, y: e.clientY, t: now });
      trim(now);
    };
    const onDown = (e: PointerEvent) => {
      const now = performance.now();
      pts.current.push({ x: e.clientX, y: e.clientY, t: now, click: true });
      trim(now);
    };
    const trim = (now: number) => {
      while (pts.current.length && now - pts.current[0].t > windowMs) pts.current.shift();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      pts.current = [];
    };
  }, [windowMs]);
  return pts;
}

export function ReplayOverlay({ points, onDone }: { points: Pt[]; onDone: (stats: { moves: number; clicks: number; seconds: number }) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = innerWidth * devicePixelRatio;
    c.height = innerHeight * devicePixelRatio;
    const ctx = c.getContext('2d')!;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const pts = points.slice();
    const clicks = pts.filter((p) => p.click).length;
    const stats = { moves: pts.length - clicks, clicks, seconds: pts.length ? Math.round((pts[pts.length - 1].t - pts[0].t) / 1000) : 0 };
    if (pts.length < 2) {
      onDone(stats);
      return;
    }
    const t0 = pts[0].t;
    const dur = pts[pts.length - 1].t - t0;
    const speed = Math.max(1, dur / 6000); // play back in ~6 seconds
    const start = performance.now();
    let raf = 0;
    let i = 0;
    const draw = () => {
      const elapsed = (performance.now() - start) * speed;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 207, 110, 0.85)';
      while (i < pts.length - 1 && pts[i + 1].t - t0 <= elapsed) {
        const a = pts[i], b = pts[i + 1];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if (b.click) {
          ctx.fillStyle = 'rgba(255, 107, 107, 0.9)';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 9, 0, Math.PI * 2);
          ctx.fill();
        }
        i++;
      }
      setPct(Math.min(100, Math.round((elapsed / dur) * 100)));
      if (i < pts.length - 1) raf = requestAnimationFrame(draw);
      else onDone(stats);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <canvas ref={ref} className="replay-canvas" style={{ width: '100vw', height: '100vh' }} aria-hidden="true" />
      <div className="replay-banner panel small" role="status">
        Replaying your last 30 seconds of cursor movement… {pct}%
      </div>
    </>
  );
}
