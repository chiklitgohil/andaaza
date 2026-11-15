import type { ReactNode } from 'react';

/** A phone frame with a status bar. Used for Arun's phone and other people's phones. */
export function Phone({
  children, owner, battery = 64, time = '21:40', model = 'android', className = '', label,
}: {
  children: ReactNode; owner?: string; battery?: number; time?: string; model?: 'android' | 'iphone'; className?: string; label?: string;
}) {
  const low = battery <= 15;
  return (
    <div className={`phone ${model} ${className}`} aria-label={label ?? `${owner ?? 'A'} phone`}>
      {model === 'iphone' ? <div className="phone-notch" /> : <div className="phone-punch" />}
      <div className="phone-screen app">
        <div className="statusbar">
          <span>{time}</span>
          <span className="sb-right">
            <span className="sb-signal" aria-hidden="true">▂▄▆</span>
            <span className={`sb-batt ${low ? 'low' : ''}`} aria-label={`Battery ${battery}%`}>
              <i style={{ width: `${battery}%` }} />
            </span>
            <span className={low ? 'sb-low' : ''}>{battery}%</span>
          </span>
        </div>
        {children}
      </div>
      {owner && <div className="phone-owner">{owner}</div>}
    </div>
  );
}
