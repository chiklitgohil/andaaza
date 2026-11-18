import type { ReactNode } from 'react';

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

export function Toast({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'good' }) {
  return <div className={`zp-toast ${tone}`} role="status">{children}</div>;
}
