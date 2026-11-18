// ACT 6: the claimed price effects for two fixed phones. Effect sizes come from single viral posts and small tests,
// which the companies deny (see debriefs.ts). "company" = nothing personal is used, as the companies say.
export type Model = 'old' | 'iphone';
export type Pay = 'upi' | 'amex';
export interface PhoneSet { model: Model; battery: number; pay: Pay }
export type Mode = 'company' | 'claims';

export const ARUN: PhoneSet = { model: 'old', battery: 6, pay: 'upi' };
export const STRANGER: PhoneSet = { model: 'iphone', battery: 82, pay: 'amex' };
export const label = (p: PhoneSet) => `${p.model === 'iphone' ? 'New iPhone' : 'Old Android'} · ${p.battery}% · ${p.pay === 'amex' ? 'Amex card' : 'UPI'}`;

/** What people have claimed for this phone, in plain words, and how big. */
export function claims(p: PhoneSet) {
  const L: { text: string; pct: number }[] = [];
  if (p.model === 'iphone') L.push({ text: 'an iPhone', pct: 0.178 });
  if (p.battery <= 20) L.push({ text: `a ${p.battery}% battery`, pct: 0.058 });
  if (p.pay === 'amex') L.push({ text: 'an Amex card', pct: 0.626 });
  return L;
}

export function priceFor(p: PhoneSet, mode: Mode, quoted: number) {
  const pct = mode === 'company' ? 0 : claims(p).reduce((s, a) => s + a.pct, 0);
  return quoted * (1 + pct);
}
