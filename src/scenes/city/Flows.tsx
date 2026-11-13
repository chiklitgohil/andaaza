import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Stop } from '../../data/stops';

export const TOWER_POS = new THREE.Vector3(0, 0, -34);
export const TOWER_TOP = new THREE.Vector3(0, 24, -34);

/** The Broker Tower, looming at the edge of the city. */
export function TowerSilhouette({ glow }: { glow: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current?.material as THREE.MeshStandardMaterial | undefined;
    if (m) m.emissiveIntensity = 0.35 + glow * 0.15 + Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <group position={TOWER_POS.toArray()}>
      <mesh ref={ref} position={[0, 12, 0]}>
        <cylinderGeometry args={[1.6, 4.2, 24, 6, 1, true]} />
        <meshStandardMaterial color="#c9a7ff" emissive="#c9a7ff" emissiveIntensity={0.4} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} wireframe />
      </mesh>
      <mesh position={[0, 24.6, 0]}>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#c9a7ff" emissive="#c9a7ff" emissiveIntensity={1.4} flatShading />
      </mesh>
    </group>
  );
}

const PER_STOP = 10;

/**
 * Packets travel from each visited building UP to the Broker Tower (collected signals, cyan)
 * and back DOWN (decisions: prices, ads, scores, amber). One instanced mesh for all.
 */
export function Packets({ stops, visited, reducedMotion }: { stops: Stop[]; visited: string[]; reducedMotion: boolean }) {
  const up = useRef<THREE.InstancedMesh>(null);
  const down = useRef<THREE.InstancedMesh>(null);
  const curves = useMemo(
    () => stops.map((s) => {
      const a = new THREE.Vector3(s.pos[0], 4, s.pos[1]);
      const mid = a.clone().lerp(TOWER_TOP, 0.5).add(new THREE.Vector3(0, 12, 0));
      return new THREE.QuadraticBezierCurve3(a, mid, TOWER_TOP);
    }),
    [stops],
  );
  const lines = useMemo(
    () => curves.map((c) => new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(c.getPoints(40)),
      new THREE.LineBasicMaterial({ color: '#7fe3ff', transparent: true, opacity: 0.18 }),
    )),
    [curves],
  );
  const o = useMemo(() => new THREE.Object3D(), []);
  const count = stops.length * PER_STOP;

  useFrame(({ clock }) => {
    const t = reducedMotion ? 0.37 : clock.elapsedTime;
    stops.forEach((s, si) => {
      const on = visited.includes(s.id);
      for (let k = 0; k < PER_STOP; k++) {
        const idx = si * PER_STOP + k;
        const p = ((t * 0.12 + k / PER_STOP + si * 0.13) % 1 + 1) % 1;
        const q = 1 - (((t * 0.08 + k / PER_STOP + si * 0.29) % 1 + 1) % 1);
        if (up.current) {
          if (on) { curves[si].getPoint(p, o.position); o.scale.setScalar(0.22); } else { o.position.set(0, -50, 0); o.scale.setScalar(0.001); }
          o.updateMatrix();
          up.current.setMatrixAt(idx, o.matrix);
        }
        if (down.current) {
          if (on && k % 2 === 0) { curves[si].getPoint(q, o.position); o.position.y -= 0.6; o.scale.setScalar(0.3); } else { o.position.set(0, -50, 0); o.scale.setScalar(0.001); }
          o.updateMatrix();
          down.current.setMatrixAt(idx, o.matrix);
        }
      }
    });
    if (up.current) up.current.instanceMatrix.needsUpdate = true;
    if (down.current) down.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={up} args={[undefined, undefined, count]} raycast={() => null}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color="#7fe3ff" />
      </instancedMesh>
      <instancedMesh ref={down} args={[undefined, undefined, count]} raycast={() => null}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ffcf6e" />
      </instancedMesh>
      {stops.map((s, i) => visited.includes(s.id) && <primitive key={s.id} object={lines[i]} />)}
    </group>
  );
}

const OVERVIEW = { pos: new THREE.Vector3(0, 34, 40), look: new THREE.Vector3(0, 0, -2) };

/** Smoothly flies the camera between the overview and the selected stop. */
export function CameraRig({ target, reducedMotion }: { target: Stop | null; reducedMotion: boolean }) {
  const { camera } = useThree();
  const look = useRef(OVERVIEW.look.clone());
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (target) {
      // shift the view left so the open drawer on the right does not cover the building
      goalLook.set(target.pos[0] + 3.2, 2, target.pos[1]);
      goalPos.set(target.pos[0] + 3, 12, target.pos[1] + 18);
    } else {
      goalPos.copy(OVERVIEW.pos);
      goalLook.copy(OVERVIEW.look);
    }
    const k = reducedMotion ? 1 : 1 - Math.pow(0.04, dt);
    camera.position.lerp(goalPos, k);
    look.current.lerp(goalLook, k);
    camera.lookAt(look.current);
  });
  return null;
}
