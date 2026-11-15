import * as THREE from 'three';
import { atTime } from '../story/acts';

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

/** Where along the loop Arun is, for a given scroll progress. He is home from ~22:40. */
export const routeAt = (progress: number) => {
  const u = Math.min(1, Math.max(0, progress / atTime('22:40')));
  // ease so he lingers a little at each end
  return (0.02 + u * 0.96) % 1;
};

export const frameAt = (t: number) => {
  const pos = LOOP.getPointAt(t);
  const tan = LOOP.getTangentAt(t).normalize();
  const side = new THREE.Vector3(-tan.z, 0, tan.x); // points to the outside-left of travel
  return { pos, tan, side };
};

/** Landmarks along the loop (t in 0..1). Names are FICTIONAL. */
export const LANDMARKS = [
  { t: 0.0, side: -1, kind: 'home', sign: 'ઘર · HOME', color: '#e9b872' },
  { t: 0.1, side: 1, kind: 'store', sign: 'ZIPKART · DARK STORE', color: '#3fb27f' },
  { t: 0.18, side: -1, kind: 'chai', sign: 'ગરમ ચા · CHAI', color: '#c4572c' },
  { t: 0.3, side: 1, kind: 'restaurant', sign: 'SHREE GANESH · RESTAURANT', color: '#d8442e' },
  { t: 0.38, side: -1, kind: 'shop', sign: 'MEDICAL STORE', color: '#2f8f6a' },
  { t: 0.47, side: 1, kind: 'apartment', sign: 'SHANTI HEIGHTS', color: '#6d7fb0' },
  { t: 0.55, side: -1, kind: 'shop', sign: 'KIRANA STORE', color: '#c98a2b' },
  { t: 0.64, side: 1, kind: 'shop', sign: 'MOBILE REPAIR', color: '#3a6fc4' },
  { t: 0.74, side: -1, kind: 'shop', sign: 'TYRE PUNCTURE ✱ 24 HRS', color: '#e0a92c' },
  { t: 0.86, side: 1, kind: 'shop', sign: 'SWEET MART', color: '#d4608a' },
];
