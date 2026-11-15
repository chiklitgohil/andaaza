import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LANDMARKS, LOOP, LOOP_LEN, frameAt } from './path';
import { signTexture } from './textures';
import { Scooter } from './Rider';
import { daylight, rainAt } from './daylight';
import { hourAt } from '../story/acts';
import { useStory } from '../story/store';
import {
  BACKGROUND, COMMERCIAL, HOUSES, InstancedModel, M, SCALE, SKYSCRAPERS, mat4, nightMaterials,
} from './models';

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

/** A flat ribbon that follows the loop. */
function ribbon(offset: number, width: number, y: number, segments = 480) {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const { pos: p, side } = frameAt((i / segments) % 1);
    const a = p.clone().addScaledVector(side, offset - width / 2);
    const b = p.clone().addScaledVector(side, offset + width / 2);
    pos.push(a.x, y, a.z, b.x, y, b.z);
    if (i < segments) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Roads() {
  const road = useMemo(() => ribbon(0, 9, 0.02), []);
  const walkL = useMemo(() => ribbon(6.4, 3.4, 0.14), []);
  const walkR = useMemo(() => ribbon(-6.4, 3.4, 0.14), []);
  const kerbL = useMemo(() => ribbon(4.65, 0.3, 0.16), []);
  const kerbR = useMemo(() => ribbon(-4.65, 0.3, 0.16), []);
  const dashes = useRef<THREE.InstancedMesh>(null);
  const count = 140;
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { pos, tan } = frameAt(i / count);
      o.position.set(pos.x, 0.04, pos.z);
      o.rotation.set(0, Math.atan2(tan.x, tan.z), 0);
      o.updateMatrix();
      dashes.current!.setMatrixAt(i, o.matrix);
    }
    dashes.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[520, 420]} />
        <meshStandardMaterial color="#8a7f6a" roughness={1} />
      </mesh>
      <mesh geometry={road} receiveShadow><meshStandardMaterial color="#3a3c42" roughness={0.85} /></mesh>
      <mesh geometry={walkL} receiveShadow><meshStandardMaterial color="#b3a993" roughness={1} /></mesh>
      <mesh geometry={walkR} receiveShadow><meshStandardMaterial color="#b3a993" roughness={1} /></mesh>
      <mesh geometry={kerbL}><meshStandardMaterial color="#e8e2d2" /></mesh>
      <mesh geometry={kerbR}><meshStandardMaterial color="#e8e2d2" /></mesh>
      <instancedMesh ref={dashes} args={[undefined, undefined, count]} raycast={() => null}>
        <boxGeometry args={[0.18, 0.02, 1.6]} />
        <meshBasicMaterial color="#e4dcc6" />
      </instancedMesh>
    </group>
  );
}

const nearLoop = (x: number, z: number, d: number) => {
  for (let k = 0; k < 90; k++) { const q = LOOP.getPointAt(k / 90); if (Math.hypot(q.x - x, q.z - z) < d) return true; }
  return false;
};
const tDist = (a: number, b: number) => Math.abs(((a - b + 1.5) % 1) - 0.5);

/** Decide where every building, tree, pole and lamp goes (deterministic). */
function useLayout() {
  return useMemo(() => {
    const r = seeded(17);
    const byUrl = new Map<string, THREE.Matrix4[]>();
    const add = (url: string, m: THREE.Matrix4) => { if (!byUrl.has(url)) byUrl.set(url, []); byUrl.get(url)!.push(m); };
    const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];

    // street-facing buildings on both sides of Arun's road
    const step = 10.5 / LOOP_LEN;
    for (const sgn of [1, -1]) {
      for (let t = 0; t < 1; t += step) {
        if (LANDMARKS.some((l) => l.side === sgn && tDist(t, l.t) < 0.022)) continue;
        const { pos, side } = frameAt(t);
        const homeish = tDist(t, 0) < 0.07;
        const url = homeish ? pick(HOUSES) : pick(COMMERCIAL);
        const s = homeish ? SCALE.suburban : SCALE.commercial * (0.9 + r() * 0.25);
        const p = pos.clone().addScaledVector(side, sgn * (homeish ? 13.5 : 12.8));
        const face = side.clone().multiplyScalar(-sgn); // front faces the road
        add(url, mat4(p.x, 0, p.z, Math.atan2(face.x, face.z), s));
      }
    }
    // trees on the inner pavement, electricity poles on the outer
    for (let t = 0; t < 1; t += 23 / LOOP_LEN) {
      const { pos, side } = frameAt(t);
      const [a, b, c] = [r(), r(), r()];
      // keep shop fronts clear: no tree in front of a landmark's sign on this side of the road
      const blocks = LANDMARKS.some((l) => l.side === -1 && tDist(t, l.t) < 0.025);
      if (a > 0.35 && !blocks) { const p = pos.clone().addScaledVector(side, -6.6); add(M('suburban', b > 0.5 ? 'tree-large' : 'tree-small'), mat4(p.x, 0.14, p.z, c * 6, SCALE.tree)); }
    }
    for (let t = 0.005; t < 1; t += 19 / LOOP_LEN) {
      if (LANDMARKS.some((l) => l.side === 1 && tDist(t, l.t) < 0.012)) continue; // nor a pole
      const { pos, side, tan } = frameAt(t);
      const p = pos.clone().addScaledVector(side, 7.6);
      add(M('roads', 'electricity-pole'), mat4(p.x, 0.14, p.z, Math.atan2(tan.x, tan.z) + Math.PI / 2, 10));
    }
    // background city
    for (let x = -240; x <= 240; x += 12) {
      for (let z = -200; z <= 200; z += 12) {
        const jx = x + (r() - 0.5) * 4, jz = z + (r() - 0.5) * 4;
        if (nearLoop(jx, jz, 22) || r() < 0.25) continue;
        const inside = Math.abs(jx) < 60 && Math.abs(jz) < 30;
        const far = Math.hypot(jx, jz) > 150;
        const url = inside ? pick(HOUSES) : far && r() < 0.35 ? pick(SKYSCRAPERS) : pick(BACKGROUND);
        const s = inside ? SCALE.suburban : SCALE.commercial * (0.8 + r() * 0.5);
        add(url, mat4(jx, 0, jz, Math.floor(r() * 4) * (Math.PI / 2), s));
        if (inside && r() > 0.5) add(M('suburban', 'tree-large'), mat4(jx + 5, 0, jz + 3, r() * 6, SCALE.tree));
      }
    }
    return byUrl;
  }, []);
}

function Buildings() {
  const layout = useLayout();
  useFrame(() => {
    const p = useStory.getState().progress;
    const night = daylight(hourAt(p), rainAt(p)).night;
    nightMaterials.forEach((m) => { m.emissiveIntensity = night * 0.1; });
  });
  return (
    <>
      {[...layout.entries()].map(([url, items]) => (
        <InstancedModel key={url} url={url} items={items} glow={url.includes('/commercial/') || url.includes('/suburban/building')} shadows={!url.includes('low-detail')} />
      ))}
    </>
  );
}

function Landmark({ l }: { l: (typeof LANDMARKS)[number] }) {
  const { pos, side } = frameAt(l.t);
  const face = side.clone().multiplyScalar(-l.side);
  const p = pos.clone().addScaledVector(side, l.side * 12.5);
  const rot = Math.atan2(face.x, face.z);
  const tex = useMemo(() => signTexture(l.sign, l.color), [l]);
  const url = l.kind === 'home' ? M('suburban', 'building-type-c') : l.kind === 'apartment' ? M('commercial', 'building-skyscraper-b') : M('commercial', `building-${'cfhk'[Math.floor(l.t * 40) % 4]}`);
  const items = useMemo(() => [mat4(0, 0, 0, 0, l.kind === 'home' ? SCALE.suburban : SCALE.commercial)], [l.kind]);
  return (
    <group position={[p.x, 0, p.z]} rotation={[0, rot, 0]}>
      <InstancedModel url={url} items={items} glow shadows />
      {/* shop sign and a warm lit doorway, facing the road */}
      <mesh position={[0, l.kind === 'restaurant' ? 4.5 : 3.9, 5.35]}>
        <planeGeometry args={[6.6, 1.25]} />
        <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.35} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.15, 4.72]}>
        <planeGeometry args={[1.8, 2.3]} />
        <meshBasicMaterial color="#ffcf8a" />
      </mesh>
      {l.kind === 'restaurant' && <RestaurantFront />}
      {l.kind === 'tyre' && <TyreShopFront />}
    </group>
  );
}

/** Shree Ganesh: an awning, two parasol tables, a lit kitchen hatch, and riders' scooters waiting at the kerb. */
function RestaurantFront() {
  const awning = useMemo(() => [mat4(0, 1.5, 4.4, 0, 5.5)], []);
  const parasols = useMemo(() => [mat4(-2.7, 0, 6.2, 0, 5.5), mat4(2.2, 0, 6.3, 0.5, 5.5)], []);
  const chair = (x: number, z: number, c: string) => (
    <mesh key={`${x}${z}`} position={[x, 0.32, z]} castShadow><boxGeometry args={[0.42, 0.64, 0.42]} /><meshStandardMaterial color={c} roughness={0.7} /></mesh>
  );
  return (
    <>
      <InstancedModel url={M('commercial', 'detail-awning-wide')} items={awning} shadows />
      <InstancedModel url={M('commercial', 'detail-parasol-a')} items={parasols} shadows />
      {[chair(-3.6, 6.2, '#d23b2f'), chair(-1.8, 6.2, '#d23b2f'), chair(1.3, 6.5, '#f1ece2'), chair(3.1, 6.1, '#f1ece2')]}
      {/* kitchen hatch, lit */}
      <mesh position={[-2.7, 1.8, 4.76]}><planeGeometry args={[1.5, 0.9]} /><meshBasicMaterial color="#ffd9a0" /></mesh>
      {/* other riders' scooters, waiting for the same "ready" food */}
      <group position={[4.2, 0, 7.4]} rotation={[0, Math.PI / 2, 0]}><Scooter box="#e4572e" /></group>
      <group position={[5.9, 0, 7.4]} rotation={[0, Math.PI / 2 + 0.15, 0]}><Scooter box="#2fa36f" /></group>
    </>
  );
}

/** The tyre-puncture stall at 21:30: shutter half down, tyres stacked, one bare bulb. */
function TyreShopFront() {
  return (
    <>
      <mesh position={[0, 1.75, 4.8]} castShadow><boxGeometry args={[2.1, 1.1, 0.08]} /><meshStandardMaterial color="#9aa0a8" metalness={0.4} roughness={0.5} /></mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-2.7, 0.18 + i * 0.3, 5.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.42, 0.15, 8, 18]} /><meshStandardMaterial color="#1e1e22" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.9, 2.55, 5.05]}><sphereGeometry args={[0.1, 10, 8]} /><meshBasicMaterial color="#fff2c0" toneMapped={false} /></mesh>
    </>
  );
}

function StreetLamps() {
  const bulbs = useRef<THREE.InstancedMesh>(null);
  const n = 34;
  const lampItems = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let i = 0; i < n; i++) {
      const sgn = i % 2 ? 1 : -1;
      const { pos, side } = frameAt(i / n);
      const p = pos.clone().addScaledVector(side, sgn * 5.3);
      const face = side.clone().multiplyScalar(-sgn);
      out.push(mat4(p.x, 0.14, p.z, Math.atan2(face.x, face.z) + Math.PI, SCALE.roads));
    }
    return out;
  }, []);
  const bulbMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#fff1c4', toneMapped: false }), []);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const sgn = i % 2 ? 1 : -1;
      const { pos, side } = frameAt(i / n);
      const q = pos.clone().addScaledVector(side, sgn * 3.6);
      o.position.set(q.x, 5.25, q.z); o.updateMatrix();
      bulbs.current!.setMatrixAt(i, o.matrix);
    }
    bulbs.current!.instanceMatrix.needsUpdate = true;
  }, []);
  useFrame(() => {
    const p = useStory.getState().progress;
    const night = daylight(hourAt(p), rainAt(p)).night;
    bulbMat.color.set(night > 0.3 ? '#fff1c4' : '#9a978c');
  });
  return (
    <group>
      <InstancedModel url={M('roads', 'light-square')} items={lampItems} />
      <instancedMesh ref={bulbs} args={[undefined, bulbMat, n]} raycast={() => null}>
        <sphereGeometry args={[0.22, 8, 6]} />
      </instancedMesh>
    </group>
  );
}

export function City() {
  return (
    <group>
      <Roads />
      <Suspense fallback={null}>
        <Buildings />
        <StreetLamps />
        {LANDMARKS.map((l) => <Landmark key={l.t} l={l} />)}
      </Suspense>
    </group>
  );
}
