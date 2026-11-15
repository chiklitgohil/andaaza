import * as THREE from 'three';
import { atTime } from '../story/acts';
import { HOME_AT, PUNCTURE_AT, RIDE_AT, SHOP_AT } from '../story/timeline';

// Arun's daily loop through a fictional Ahmedabad neighbourhood: starts and ends at home.
const W = 150, H = 90, R = 22;
const pts: THREE.Vector3[] = [];
const corner = (cx: number, cz: number, a0: number) => {
  for (let i = 0; i <= 6; i++) {
    const a = a0 + (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector3(cx + Math.cos(a) * R, 0, cz + Math.sin(a) * R));
  }
};
// counter-clockwise rounded rectangle
corner(W / 2 - R, H / 2 - R, 0);
corner(-W / 2 + R, H / 2 - R, Math.PI / 2);
corner(-W / 2 + R, -H / 2 + R, Math.PI);
corner(W / 2 - R, -H / 2 + R, (3 * Math.PI) / 2);

export const LOOP = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
export const LOOP_LEN = LOOP.getLength();

/**
 * Where along the loop Arun (or the taxi carrying him) is, for a given scroll progress.
 * The scooter covers most of the loop over the working day; after the puncture he pushes it a few metres
 * to the tyre shop; the taxi then covers the last quarter much faster, ending at home.
 */
const KEYS: [number, number][] = [[0, 0.02], [PUNCTURE_AT, 0.74], [SHOP_AT, 0.765], [RIDE_AT, 0.77], [HOME_AT, 1.02]];
export const routeAt = (progress: number) => {
  const p = Math.min(1, Math.max(0, progress));
  let t = KEYS[KEYS.length - 1][1];
  for (let i = 1; i < KEYS.length; i++) {
    const [p0, t0] = KEYS[i - 1], [p1, t1] = KEYS[i];
    if (p <= p1) { t = t0 + ((p - p0) / (p1 - p0)) * (t1 - t0); break; }
  }
  return ((t % 1) + 1) % 1;
};
/** Loop position at a clock time, e.g. where the restaurant must be for the 13:05 stop. */
const tAt = (hm: string) => routeAt(atTime(hm));

export const frameAt = (t: number) => {
  const pos = LOOP.getPointAt(t);
  const tan = LOOP.getTangentAt(t).normalize();
  const side = new THREE.Vector3(-tan.z, 0, tan.x); // points to the outside-left of travel
  return { pos, tan, side };
};

/**
 * Landmarks along the loop (t in 0..1). Names are FICTIONAL. The ones the story stops at are placed where
 * Arun actually is at that time; side −1 is the kerb Arun rides along (he keeps left).
 */
export const LANDMARKS = [
  { t: 0.0, side: -1, kind: 'home', sign: 'ઘર · HOME', color: '#e9b872' },
  { t: 0.1, side: -1, kind: 'chai', sign: 'ગરમ ચા · CHAI', color: '#c4572c' },
  { t: 0.16, side: 1, kind: 'store', sign: 'FLOPCART · DARK STORE', color: '#3fb27f' },
  { t: 0.27, side: 1, kind: 'shop', sign: 'MEDICAL STORE', color: '#2f8f6a' },
  { t: tAt('13:05') + 0.004, side: -1, kind: 'restaurant', sign: 'SHREE GANESH · RESTAURANT', color: '#d8442e' },
  { t: 0.45, side: 1, kind: 'shop', sign: 'KIRANA STORE', color: '#c98a2b' },
  { t: tAt('17:30') + 0.004, side: -1, kind: 'apartment', sign: 'SHANTI HEIGHTS', color: '#6d7fb0' },
  { t: 0.65, side: 1, kind: 'shop', sign: 'MOBILE REPAIR', color: '#3a6fc4' },
  { t: tAt('21:40') + 0.002, side: -1, kind: 'tyre', sign: 'TYRE PUNCTURE ✱ 24 HRS', color: '#e0a92c' },
  { t: 0.88, side: 1, kind: 'shop', sign: 'SWEET MART', color: '#d4608a' },
];
