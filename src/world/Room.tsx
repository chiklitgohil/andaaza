import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStory } from '../story/store';
import { ROOM_AT } from '../story/timeline';
import { ROOM, ROOM_ORIGIN } from './roomLayout';
import { M, useModel } from './models';

const FS = 1.9; // Kenney furniture units → street units (a chair comes out about 0.9 tall)

/** One Kenney furniture piece (CC0), placed in room coordinates. */
function Furn({ name, p, r = 0, s = FS }: { name: string; p: [number, number, number]; r?: number; s?: number }) {
  const { scene } = useModel(M('furniture', name));
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    if (import.meta.env.DEV) ((window as unknown as { __furn: Record<string, THREE.Object3D> }).__furn ??= {})[name] = c;
    return c;
  }, [scene, name]);
  return <primitive object={obj} position={p} rotation={[0, r, 0]} scale={s} />;
}

/** A night-time view with rain, drawn once on a canvas (no image files). */
function windowTextures() {
  const view = document.createElement('canvas'); view.width = 256; view.height = 256;
  const g = view.getContext('2d')!;
  const sky = g.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, '#0b1222'); sky.addColorStop(1, '#1d2436');
  g.fillStyle = sky; g.fillRect(0, 0, 256, 256);
  // buildings across the lane, a few lit windows
  let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let x = 0; x < 256; x += 44) {
    const h = 90 + r() * 110; g.fillStyle = '#121826'; g.fillRect(x, 256 - h, 40, h);
    for (let wy = 256 - h + 10; wy < 246; wy += 18) for (let wx = x + 6; wx < x + 36; wx += 12) if (r() < 0.35) { g.fillStyle = r() < 0.5 ? '#f3c97a' : '#9ec3ff'; g.fillRect(wx, wy, 6, 8); }
  }
  const rain = document.createElement('canvas'); rain.width = 128; rain.height = 256;
  const q = rain.getContext('2d')!;
  q.strokeStyle = 'rgba(200,215,255,0.35)'; q.lineWidth = 1;
  for (let i = 0; i < 90; i++) { const x = r() * 128, y = r() * 256; q.beginPath(); q.moveTo(x, y); q.lineTo(x - 2, y + 14); q.stroke(); }
  const v = new THREE.CanvasTexture(view); v.colorSpace = THREE.SRGBColorSpace;
  const rt = new THREE.CanvasTexture(rain); rt.wrapS = rt.wrapT = THREE.RepeatWrapping;
  return { view: v, rain: rt };
}

/**
 * Arun's rented room, where he ends the day on the edge of his bed. Built away from the street;
 * the camera cuts here at 22:50. Furniture: Kenney Furniture Kit (CC0); walls, window and small things are simple geometry.
 */
export function Room() {
  const group = useRef<THREE.Group>(null);
  const fan = useRef<THREE.Group>(null);
  const tex = useMemo(windowTextures, []);
  const { w, d, h } = ROOM;

  useFrame((_, dt) => {
    const { progress, reducedMotion } = useStory.getState();
    const on = progress >= ROOM_AT - 0.01;
    if (group.current) group.current.visible = on;
    if (!on) return;
    if (fan.current && !reducedMotion) fan.current.rotation.y += dt * 5;
    if (!reducedMotion) tex.rain.offset.y += dt * 0.9;
  });

  const wall = '#a9c4b4', trim = '#7f9a8b';
  return (
    <group ref={group} position={ROOM_ORIGIN.toArray()} visible={false}>
      {/* shell */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial color="#8d8a84" roughness={0.9} /></mesh>
      <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w, d]} /><meshStandardMaterial color="#e9e6df" /></mesh>
      <mesh position={[0, h / 2, -d / 2]}><planeGeometry args={[w, h]} /><meshStandardMaterial color={wall} roughness={0.95} /></mesh>
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[d, h]} /><meshStandardMaterial color={wall} roughness={0.95} /></mesh>
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[d, h]} /><meshStandardMaterial color={wall} roughness={0.95} /></mesh>
      <mesh position={[0, h / 2, d / 2]} rotation={[0, Math.PI, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial color={wall} roughness={0.95} /></mesh>
      {/* skirting */}
      <mesh position={[0, 0.06, -d / 2 + 0.01]}><boxGeometry args={[w, 0.12, 0.02]} /><meshStandardMaterial color={trim} /></mesh>

      {/* window on the back wall: night, buildings, rain */}
      <group position={[1.15, 1.55, -d / 2 + 0.02]}>
        <mesh><planeGeometry args={[1.3, 1.1]} /><meshBasicMaterial map={tex.view} toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.005]}><planeGeometry args={[1.3, 1.1]} /><meshBasicMaterial map={tex.rain} transparent toneMapped={false} /></mesh>
        {[[0, 0.58, 1.42, 0.07], [0, -0.58, 1.42, 0.07], [0.68, 0, 0.07, 1.2], [-0.68, 0, 0.07, 1.2], [0, 0, 0.05, 1.1], [0, 0, 1.3, 0.05]].map(([x, y, ww, hh], i) => (
          <mesh key={i} position={[x, y, 0.02]}><boxGeometry args={[ww, hh, 0.05]} /><meshStandardMaterial color="#d9d4c7" /></mesh>
        ))}
      </group>
      <pointLight position={[1.15, 1.5, -d / 2 + 0.6]} distance={4} intensity={1.2} color="#7f9cff" />

      {/* furniture: a single bed along the left wall, a side table and lamp, a rug, a chair, a box of his things */}
      <Suspense fallback={null}>
        <Furn name="bedSingle" p={[-3.24, 0, 0.05]} />
        <Furn name="pillowBlue" p={[-2.2, 0.5, -1.72]} s={1.6} />
        <Furn name="sideTableDrawers" p={[-1.33, 0, -1.7]} />
        <Furn name="lampRoundTable" p={[-0.95, 0.72, -1.82]} />
        <Furn name="rugRectangle" p={[-0.8, 0.005, 0.85]} s={1.4} />
        <Furn name="chair" p={[0.15, 0, -1.25]} r={0.5} />
        <Furn name="cardboardBoxClosed" p={[1.75, 0, -1.65]} />
      </Suspense>
      {/* by the door: the green delivery box and his helmet, still wet */}
      <group position={[1.7, 0, 1.35]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[0.62, 0.55, 0.55]} /><meshStandardMaterial color="#2fa36f" roughness={0.6} /></mesh>
        <mesh position={[0, 0.66, 0]} castShadow><sphereGeometry args={[0.2, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9e9ee" roughness={0.35} /></mesh>
      </group>
      {/* a calendar and a charger cable, the small things */}
      <mesh position={[-w / 2 + 0.01, 1.7, -0.6]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.45, 0.6]} /><meshStandardMaterial color="#f2efe6" /></mesh>
      <mesh position={[-w / 2 + 0.015, 1.92, -0.6]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.45, 0.14]} /><meshStandardMaterial color="#c8382c" /></mesh>

      {/* ceiling fan and a bare bulb */}
      <group ref={fan} position={[0, h - 0.02, 0.2]}>
        <Suspense fallback={null}><Furn name="ceilingFan" p={[-0.22, 0, 0]} s={4} /></Suspense>
      </group>
      <mesh position={[-0.9, h - 0.25, 1.2]}><sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color="#fff1c8" toneMapped={false} /></mesh>
      <pointLight position={[-0.9, h - 0.35, 1.2]} distance={9} decay={1.4} intensity={9} color="#ffd9a0" />
      <ambientLight intensity={0} />
    </group>
  );
}
