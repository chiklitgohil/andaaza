// ACT 3 lab: the arithmetic of a delivery promise. One control: the promise. The road is fixed: a rush-hour
// 3 km trip with five signals (FICTIONAL numbers, chosen to be ordinary).
import { useState } from 'react';
import { Lab, Seg, Stat } from '../lab';
import { Guess } from '../guess';

export interface TV { promise: number; km: number; pack: number; signals: number; red: number; safe: number }
const ROAD = { km: 3, pack: 3, signals: 5, red: 90, safe: 20 };
export const trip = (promise: number): TV => ({ promise, ...ROAD });

export function deadline(v: TV) {
  const sigMin = (v.signals * 0.5 * v.red) / 60;          // on average, half the signals are red
  const avail = v.promise - v.pack - sigMin;                // minutes left to actually ride
  const needed = avail > 0 ? v.km / (avail / 60) : Infinity; // km/h needed to make it
  const rideSafe = (v.km / v.safe) * 60;
  const total = v.pack + sigMin + rideSafe;                 // minutes at a safe speed, stopping at reds
  return { sigMin, avail, needed, rideSafe, total, ok: needed <= v.safe };
}

export function DeadlinePhone({ v }: { v: TV }) {
  const d = deadline(v);
  const late = Math.max(0, d.total - v.promise);
  return (
    <div className="zp-body center">
      <p className="tiny">Customer sees</p>
      <div className={`deadline ${late > 0 ? 'late' : ''}`}>Arriving in {v.promise}:00</div>
      <p className="tiny">You see</p>
      <div className="speedo"><b>{Number.isFinite(d.needed) ? Math.round(d.needed) : '∞'}</b><small>km/h needed</small></div>
      <p className="tiny">Your safe speed here: <b>{v.safe} km/h</b></p>
    </div>
  );
}

export function DeadlineLab({ promise, setPromise, onNext }: { promise: number; setPromise: (p: number) => void; onNext: () => void }) {
  const [asked, setAsked] = useState(false);
  const v = trip(promise);
  const d = deadline(v);
  const W = 300, scale = W / Math.max(v.promise, d.total);
  return (
    <Lab kicker="13:26 · 3 km, rush hour, five signals" title={asked ? 'Change the promise. The road stays the same.' : 'The customer was promised 10 minutes.'}>
      {!asked ? (
        <Guess
          id="wait-deadline" big={false}
          q="Can that be kept without speeding or skipping a red light?"
          options={['Yes', 'No']} correct={1}
          reveal={<>No. Packing and red lights eat most of it. <button className="btn small" onClick={() => setAsked(true)}>See the sum →</button></>}
        />
      ) : (
        <>
          <Seg options={[[10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']]} value={promise} onChange={setPromise} />
          <div className="timeline" aria-label="Minutes: packing, red lights, riding at a safe speed; the line is the promise">
            <i className="tl-pack" style={{ width: v.pack * scale }} />
            <i className="tl-sig" style={{ width: d.sigMin * scale }} />
            <i className="tl-ride" style={{ width: d.rideSafe * scale }} />
            <b style={{ left: v.promise * scale }} />
          </div>
          <div className="legend-row"><span><i style={{ background: '#7fa8e0' }} />packing</span><span><i style={{ background: 'var(--red)' }} />red lights</span><span><i style={{ background: 'var(--grn)' }} />riding safely</span><span>│ promise</span></div>
          <div className="lab-stats">
            <Stat k="Speed needed" v={Number.isFinite(d.needed) ? `${Math.round(d.needed)} km/h` : '—'} tone={d.ok ? 'good' : 'bad'} />
            <Stat k="Safe speed here" v={`${v.safe} km/h`} />
          </div>
          <div className="lab-next"><button className="btn" onClick={onNext}>Next order →</button></div>
        </>
      )}
    </Lab>
  );
}
