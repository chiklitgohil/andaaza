import * as THREE from 'three';
import { atTime } from '../story/acts';

// hour → sky colour, sun strength, ambient, how "night" it is (0..1 drives windows & street lamps)
const K: [number, string, number, number, number][] = [
  [6.6, '#e9a777', 0.7, 0.5, 0.45],
  [8, '#9ccaf0', 1.3, 0.6, 0],
  [13, '#8ec7f4', 1.6, 0.7, 0],
  [16.5, '#f2c08a', 1.2, 0.6, 0],
  [18.6, '#d9707a', 0.55, 0.45, 0.45],
  [19.8, '#3a3466', 0.2, 0.3, 0.85],
  [21, '#141a33', 0.06, 0.22, 1],
  [24.2, '#080b17', 0.02, 0.18, 1],
];

const ca = new THREE.Color(), cb = new THREE.Color(), rainC = new THREE.Color('#3b4459');

export function daylight(hour: number, rain: number) {
  let i = 1;
  while (i < K.length - 1 && hour > K[i][0]) i++;
  const [h0, s0, sun0, amb0, n0] = K[i - 1];
  const [h1, s1, sun1, amb1, n1] = K[i];
  const t = Math.min(1, Math.max(0, (hour - h0) / (h1 - h0)));
  ca.set(s0); cb.set(s1);
  const sky = ca.clone().lerp(cb, t).lerp(rainC, rain * 0.55);
  return {
    sky,
    sun: (sun0 + (sun1 - sun0) * t) * (1 - rain * 0.6),
    ambient: amb0 + (amb1 - amb0) * t,
    night: Math.min(1, n0 + (n1 - n0) * t + rain * 0.25),
    // sun moves east → west across the day
    sunDir: new THREE.Vector3(Math.cos(((hour - 6) / 13) * Math.PI) * 60, Math.max(4, Math.sin(((hour - 6) / 13) * Math.PI) * 70), 30),
  };
}

/** Rain from ~20:15 until he gets home (~22:40). */
export const rainAt = (p: number) => {
  const a = THREE.MathUtils.smoothstep(p, atTime('20:00'), atTime('20:30'));
  const b = 1 - THREE.MathUtils.smoothstep(p, atTime('22:30'), atTime('22:50'));
  return a * b;
};
