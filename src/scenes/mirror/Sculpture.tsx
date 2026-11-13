import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Signal, SignalGroup } from '../../fingerprint/collect';
import { fnv1a } from '../../fingerprint/collect';

const GROUP_COLOR: Record<SignalGroup, string> = {
  device: '#7fe3ff',
  locale: '#9cf5c8',
  graphics: '#c9a7ff',
  hardware: '#ffcf6e',
  network: '#ff9fb2',
  settings: '#b9c6ff',
};

/** Seeded pseudo-random generator so the sculpture shape is derived from YOUR values. */
function rng(seed: string) {
  let s = parseInt(fnv1a(seed), 16) || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

interface Props {
  signals: Signal[];
  visibleCount: number;
  crystallised: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
  idCode: string;
}

export function Sculpture({ signals, visibleCount, crystallised, activeId, onSelect, reducedMotion, idCode }: Props) {
  const targets = useMemo(() => {
    const r = rng(idCode || 'seed');
    return signals.map((s, i) => {
      // orbit position (scattered)
      const a = (i / signals.length) * Math.PI * 2;
      const orbitR = 2.4 + (i % 3) * 0.45;
      const orbit = new THREE.Vector3(Math.cos(a) * orbitR, 1.6 + Math.sin(i * 1.7) * 0.9, Math.sin(a) * orbitR * 0.6);
      // crystal position: a tight cluster whose shape depends on the hash of all values
      const v = s.value ? rng(s.value + idCode) : r;
      const phi = Math.acos(2 * v() - 1);
      const theta = 2 * Math.PI * v();
      const rad = 0.35 + v() * 0.75;
      const crystal = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * rad,
        1.75 + Math.cos(phi) * rad * 1.3,
        Math.sin(phi) * Math.sin(theta) * rad,
      );
      const rot = new THREE.Euler(v() * Math.PI, v() * Math.PI, v() * Math.PI);
      const scale = s.value ? 0.16 + Math.min(0.22, s.value.length / 260) : 0.09;
      return { orbit, crystal, rot, scale, phase: r() * Math.PI * 2 };
    });
  }, [signals, idCode]);

  return (
    <group>
      {signals.map((s, i) => (
        <Shard
          key={s.id}
          signal={s}
          target={targets[i]}
          index={i}
          visible={i < visibleCount}
          crystallised={crystallised}
          active={activeId === s.id}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
        />
      ))}
      {crystallised && <CoreGlow />}
    </group>
  );
}

function CoreGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.75, 0]}>
      <icosahedronGeometry args={[0.32, 1]} />
      <meshBasicMaterial color="#7fe3ff" transparent opacity={0.35} wireframe />
    </mesh>
  );
}

function Shard({
  signal, target, index, visible, crystallised, active, onSelect, reducedMotion,
}: {
  signal: Signal;
  target: { orbit: THREE.Vector3; crystal: THREE.Vector3; rot: THREE.Euler; scale: number; phase: number };
  index: number;
  visible: boolean;
  crystallised: boolean;
  active: boolean;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const color = signal.value ? GROUP_COLOR[signal.group] : '#3a4660';
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const base = crystallised ? target.crystal : target.orbit;
    tmp.copy(base);
    if (!crystallised && !reducedMotion) {
      const a = t * 0.18 + target.phase;
      const r = Math.hypot(base.x, base.z);
      tmp.x = Math.cos(a + index) * r;
      tmp.z = Math.sin(a + index) * r * 0.6;
      tmp.y += Math.sin(t * 0.8 + index) * 0.08;
    }
    if (!visible) tmp.set(0, -2, 0);
    const k = reducedMotion ? 1 : 1 - Math.pow(0.02, dt);
    m.position.lerp(tmp, k);
    const targetScale = (visible ? target.scale : 0.001) * (active ? 1.6 : 1);
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, targetScale, reducedMotion ? 1 : k));
    if (!reducedMotion) {
      m.rotation.x += dt * 0.3;
      m.rotation.y += dt * 0.45;
    }
  });

  return (
    <mesh
      ref={ref}
      rotation={target.rot}
      scale={0.001}
      onClick={(e) => { e.stopPropagation(); onSelect(signal.id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = ''; }}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active ? 1.4 : signal.value ? 0.55 : 0.1}
        roughness={0.15}
        metalness={0.3}
        flatShading
        transparent
        opacity={signal.value ? 0.92 : 0.45}
      />
      {active && (
        <Html center distanceFactor={7} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bldg-label" style={{ transform: 'translateY(-34px)' }}>{signal.label}</div>
        </Html>
      )}
    </mesh>
  );
}
