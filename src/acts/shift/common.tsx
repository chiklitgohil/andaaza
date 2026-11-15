import { useEffect, type ReactNode } from 'react';
import { sfx } from '../../audio/sound';
import { Chip } from '../../ui/Debrief';
import type { Label } from '../../content/types';

/** Header of Arun's FICTIONAL delivery app, "Flopcart Partner". */
export function PartnerHeader({ earned, online = true, extra }: { earned: number; online?: boolean; extra?: ReactNode }) {
  return (
    <div className="zp-head">
      <div className="zp-brand">flopcart <small>partner</small></div>
      <div className="zp-row">
        <span className={`zp-online ${online ? 'on' : ''}`}>{online ? '● Online' : '○ Offline'}</span>
        <span className="zp-earned">Today ₹{earned}</span>
      </div>
      {extra}
    </div>
  );
}

export interface Reveal { text: ReactNode; label: Label }

/** The "other side of the screen" card that appears after you've played. */
export function BehindScreen({ title, points, children, onNext, nextLabel = 'Put the phone away →' }: {
  title: string; points: Reveal[]; children?: ReactNode; onNext: () => void; nextLabel?: string;
}) {
  useEffect(() => { sfx.reveal(); }, []);
  return (
    <div className="side-card behind">
      <p className="kicker">Behind the screen</p>
      <p className="big-q">{title}</p>
      <ul className="reveal-list">
        {points.map((p, i) => <li key={i}><Chip label={p.label} /> <span>{p.text}</span></li>)}
      </ul>
      {children}
      <button className="btn" onClick={onNext}>{nextLabel}</button>
    </div>
  );
}

export function Toast({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'good' }) {
  return <div className={`zp-toast ${tone}`} role="status">{children}</div>;
}
