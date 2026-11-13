import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Stop } from '../../data/stops';

function Glass({ color, opacity = 0.28, children, ...props }: { color: string; opacity?: number; children: React.ReactNode } & JSX.IntrinsicElements['mesh']) {
  return (
    <mesh {...props}>
      {children}
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.1} metalness={0.2} emissive={color} emissiveIntensity={0.12} depthWrite={false} />
      <Edges color={color} threshold={15} />
    </mesh>
  );
}

function Solid({ color, emissive = 0.6, children, ...props }: { color: string; emissive?: number; children: React.ReactNode } & JSX.IntrinsicElements['mesh']) {
  return (
    <mesh {...props}>
      {children}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} flatShading />
    </mesh>
  );
}

/** A small glowing "core" inside each glass building: the data it holds. */
function Core({ color, y, active }: { color: string; y: number; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.8;
    const s = active ? 1.25 + Math.sin(clock.elapsedTime * 4) * 0.1 : 1;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={[0, y, 0]}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} flatShading />
    </mesh>
  );
}

function Shape({ s, active }: { s: Stop; active: boolean }) {
  const c = s.color;
  switch (s.kind) {
    case 'home':
      return (
        <group>
          <Glass color={c} position={[0, 1.3, 0]}><boxGeometry args={[3.2, 2.6, 2.8]} /></Glass>
          <Glass color={c} position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[2.6, 1.6, 4]} /></Glass>
          {/* TV glow */}
          <Solid color="#9fd8ff" emissive={1.4} position={[0, 1.2, 1.42]}><planeGeometry args={[1.4, 0.8]} /></Solid>
          <Core color={c} y={1.4} active={active} />
        </group>
      );
    case 'track':
      return (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} scale={[1.6, 1, 1]}>
            <torusGeometry args={[2.2, 0.28, 6, 40]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} />
          </mesh>
          <Core color={c} y={1.2} active={active} />
        </group>
      );
    case 'pharmacy':
      return (
        <group>
          <Glass color={c} position={[0, 2, 0]}><boxGeometry args={[3, 4, 3]} /></Glass>
          <Solid color={c} emissive={1.2} position={[0, 4.6, 0]}><boxGeometry args={[1.4, 0.4, 0.3]} /></Solid>
          <Solid color={c} emissive={1.2} position={[0, 4.6, 0]}><boxGeometry args={[0.4, 1.4, 0.3]} /></Solid>
          <Core color={c} y={2} active={active} />
        </group>
      );
    case 'square':
      return (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <circleGeometry args={[3.4, 8]} />
            <meshStandardMaterial color="#13213a" />
          </mesh>
          {/* place of worship */}
          <Glass color={c} position={[-1.4, 1.2, -0.6]}><boxGeometry args={[1.6, 2.4, 1.6]} /></Glass>
          <Glass color={c} position={[-1.4, 3.2, -0.6]}><coneGeometry args={[0.7, 1.6, 6]} /></Glass>
          {/* clinic */}
          <Glass color={c} position={[1.5, 0.9, -0.4]}><boxGeometry args={[1.6, 1.8, 1.4]} /></Glass>
          {/* protest signs */}
          {[0, 1, 2].map((i) => (
            <Solid key={i} color="#ffcf6e" emissive={0.5} position={[-0.6 + i * 0.6, 0.9, 1.6]}><boxGeometry args={[0.45, 0.35, 0.05]} /></Solid>
          ))}
          <Core color={c} y={2.6} active={active} />
        </group>
      );
    case 'market':
      return (
        <group>
          <Glass color={c} position={[0, 1.2, 0]}><boxGeometry args={[5, 2.4, 3.2]} /></Glass>
          <Solid color={c} emissive={0.5} position={[0, 2.5, 1.75]} rotation={[0.4, 0, 0]}><boxGeometry args={[5.2, 0.12, 0.9]} /></Solid>
          {/* price tags */}
          {[-1.6, -0.5, 0.6, 1.7].map((x, i) => (
            <Solid key={i} color="#fff3c4" emissive={0.8} position={[x, 3.2 + (i % 2) * 0.3, 0]}><boxGeometry args={[0.6, 0.35, 0.04]} /></Solid>
          ))}
          <Core color={c} y={1.2} active={active} />
        </group>
      );
    case 'cafe':
      return (
        <group>
          <Glass color={c} position={[0, 1.4, 0]}><cylinderGeometry args={[1.8, 1.8, 2.8, 8]} /></Glass>
          <Solid color={c} emissive={0.9} position={[0, 3.4, 0]}><torusGeometry args={[0.6, 0.12, 6, 16]} /></Solid>
          <Core color={c} y={1.4} active={active} />
        </group>
      );
    case 'loans':
      return (
        <group>
          <Glass color={c} position={[0, 1.6, 0]}><boxGeometry args={[3.4, 3.2, 2.6]} /></Glass>
          <Glass color={c} position={[0, 3.6, 0]}><boxGeometry args={[3.8, 0.4, 3]} /></Glass>
          {[-1.2, -0.4, 0.4, 1.2].map((x) => (
            <Solid key={x} color={c} emissive={0.6} position={[x, 1.6, 1.4]}><cylinderGeometry args={[0.1, 0.1, 3.2, 6]} /></Solid>
          ))}
          <Core color={c} y={1.7} active={active} />
        </group>
      );
    case 'taxi':
      return (
        <group>
          <Glass color={c} position={[0, 2.4, 0]}><boxGeometry args={[4, 0.2, 2.4]} /></Glass>
          {[-1.8, 1.8].map((x) => (
            <Solid key={x} color={c} emissive={0.6} position={[x, 1.2, 0]}><boxGeometry args={[0.15, 2.4, 0.15]} /></Solid>
          ))}
          <Solid color="#ffcf6e" emissive={0.7} position={[0, 0.45, 0]}><boxGeometry args={[1.8, 0.6, 0.9]} /></Solid>
          <Solid color="#ffcf6e" emissive={0.7} position={[0, 0.9, 0]}><boxGeometry args={[1.0, 0.4, 0.8]} /></Solid>
          <Core color={c} y={3.2} active={active} />
        </group>
      );
    case 'garage':
      return (
        <group>
          <Glass color={c} position={[0, 1.4, 0]}><boxGeometry args={[4, 2.8, 3]} /></Glass>
          <Solid color={c} emissive={0.4} position={[0, 1.1, 1.52]}><planeGeometry args={[2.6, 2]} /></Solid>
          <Solid color="#9fd8ff" emissive={0.6} position={[0, 0.4, 2.6]}><boxGeometry args={[1.6, 0.5, 0.8]} /></Solid>
          <Core color={c} y={2.2} active={active} />
        </group>
      );
    case 'arcade':
      return (
        <group>
          <Glass color={c} position={[0, 1.8, 0]}><boxGeometry args={[3.4, 3.6, 3]} /></Glass>
          {[0, 1, 2].map((i) => (
            <Solid key={i} color={c} emissive={1.1} position={[0, 0.8 + i * 1.1, 1.52]}><planeGeometry args={[3.2, 0.12]} /></Solid>
          ))}
          <FloatingBlocks color={c} />
          <Core color={c} y={1.8} active={active} />
        </group>
      );
    case 'vault':
      return (
        <group>
          <Glass color={c} opacity={0.4} position={[0, 1.6, 0]}><boxGeometry args={[3, 3.2, 3]} /></Glass>
          <Solid color={c} emissive={0.6} position={[0, 1.6, 1.52]}><torusGeometry args={[0.9, 0.14, 6, 24]} /></Solid>
          <Core color={c} y={1.6} active={active} />
        </group>
      );
  }
}

function FloatingBlocks({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.5;
  });
  return (
    <group ref={g} position={[0, 4.6, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2.1) * 0.9, 0, Math.sin(i * 2.1) * 0.9]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function Building({
  s, active, visited, onOpen, showLabel = true,
}: { s: Stop; active: boolean; visited: boolean; onOpen: (id: string) => void; showLabel?: boolean }) {
  return (
    <group
      position={[s.pos[0], 0, s.pos[1]]}
      onClick={(e) => { e.stopPropagation(); onOpen(s.id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = ''; }}
    >
      <Shape s={s} active={active} />
      {/* base pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.6, 3.8, 32]} />
        <meshBasicMaterial color={s.color} transparent opacity={active ? 0.9 : visited ? 0.55 : 0.22} />
      </mesh>
      {showLabel && <Html position={[0, 5.4, 0]} center distanceFactor={active ? 16 : 40} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`bldg-label ${visited ? 'visited' : ''}`}>
          {s.icon} {s.name}{visited ? ' ✓' : ''}
        </div>
      </Html>}
    </group>
  );
}

/** Background filler buildings: instanced, so they cost one draw call. */
export function Filler({ avoid }: { avoid: [number, number][] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const items = useMemo(() => {
    const out: { x: number; z: number; h: number; w: number }[] = [];
    let seed = 7;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let gx = -26; gx <= 26; gx += 4) {
      for (let gz = -24; gz <= 26; gz += 4) {
        const x = gx + (r() - 0.5) * 1.2;
        const z = gz + (r() - 0.5) * 1.2;
        if (avoid.some(([ax, az]) => Math.hypot(ax - x, az - z) < 5.2)) continue;
        if (Math.abs(x) < 1.2 || Math.abs(z - 0) < 1.2) continue; // main roads
        if (r() < 0.35) continue;
        out.push({ x, z, h: 0.6 + r() * (Math.hypot(x, z) > 18 ? 7 : 3.5), w: 1.2 + r() * 1.4 });
      }
    }
    return out;
  }, [avoid]);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    items.forEach((it, i) => {
      o.position.set(it.x, it.h / 2, it.z);
      o.scale.set(it.w, it.h, it.w);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} raycast={() => null}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1b2a47" emissive="#0d1830" emissiveIntensity={0.6} transparent opacity={0.55} roughness={0.3} />
    </instancedMesh>
  );
}
