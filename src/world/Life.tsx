import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { LANDMARKS, LOOP_LEN, frameAt } from './path';
import { CARS, PEOPLE, SCALE, useModel } from './models';
import { useStory } from '../story/store';
import { daylight, rainAt } from './daylight';
import { hourAt } from '../story/acts';

// ---------------- traffic ----------------
interface CarSpec { url: string; t0: number; speed: number; lane: number }

function Car({ spec }: { spec: CarSpec }) {
  const { scene } = useModel(spec.url);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
    return c;
  }, [scene]);
  const ref = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Mesh>(null);
  const t = useRef(spec.t0);
  useFrame((_, dt) => {
    const { reducedMotion, progress } = useStory.getState();
    if (!reducedMotion) t.current = (t.current + (spec.speed * dt) / LOOP_LEN + 1) % 1;
    const { pos, tan, side } = frameAt(t.current);
    const dir = spec.speed >= 0 ? 1 : -1;
    const g = ref.current!;
    g.position.copy(pos).addScaledVector(side, spec.lane);
    g.rotation.y = Math.atan2(tan.x * dir, tan.z * dir);
    const night = daylight(hourAt(progress), rainAt(progress)).night;
    if (lights.current) lights.current.visible = night > 0.3;
  });
  return (
    <group ref={ref}>
      <group scale={SCALE.car} position={[0, 0.47, 0]}><primitive object={obj} /></group>
      <mesh ref={lights} position={[0, 1.0, 2.15]}>
        <boxGeometry args={[1.7, 0.18, 0.05]} />
        <meshBasicMaterial color="#fff3cf" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Traffic() {
  const specs = useMemo<CarSpec[]>(() => {
    const out: CarSpec[] = [];
    let s = 5;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 12; i++) {
      const sameWay = i % 3 === 0;
      out.push({
        url: CARS[i % CARS.length],
        t0: r(),
        speed: (sameWay ? 1 : -1) * (5 + r() * 5),
        lane: sameWay ? -2.3 : 2.3, // keep left (India): same-way traffic left, oncoming on the right
      });
    }
    return out;
  }, []);
  return <>{specs.map((sp, i) => <Car key={i} spec={sp} />)}</>;
}

// ---------------- people ----------------
function Person({ url, pos, rot, clip }: { url: string; pos: THREE.Vector3; rot: number; clip: string }) {
  const { scene, animations } = useModel(url);
  const body = useMemo(() => skClone(scene) as THREE.Group, [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(body), [body]);
  useEffect(() => {
    const a = animations.find((x) => x.name === clip) ?? animations.find((x) => x.name === 'idle');
    if (a) { const act = mixer.clipAction(a); act.time = Math.random() * a.duration; act.play(); }
    body.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
  }, [animations, mixer, body, clip]);
  useFrame((_, dt) => { if (!useStory.getState().reducedMotion) mixer.update(dt); });
  return (
    <group position={pos.toArray()} rotation={[0, rot, 0]} scale={SCALE.character}>
      <primitive object={body} />
    </group>
  );
}

function People() {
  const crowd = useMemo(() => {
    const out: { url: string; pos: THREE.Vector3; rot: number; clip: string }[] = [];
    LANDMARKS.forEach((l, i) => {
      if (l.kind === 'home') return;
      const { pos, side } = frameAt(l.t);
      const n = l.kind === 'chai' || l.kind === 'restaurant' || l.kind === 'store' ? 3 : 1;
      for (let k = 0; k < n; k++) {
        const along = frameAt((l.t + (k - 1) * (2.2 / LOOP_LEN) + 1) % 1);
        const p = along.pos.clone().addScaledVector(side, l.side * (6.4 + (k % 2) * 0.9));
        const face = side.clone().multiplyScalar(-l.side);
        out.push({
          url: PEOPLE[(i * 3 + k) % PEOPLE.length],
          pos: new THREE.Vector3(p.x, 0.14, p.z),
          rot: Math.atan2(face.x, face.z) + (k - 1) * 0.6,
          clip: k === 1 ? 'interact-right' : 'idle',
        });
      }
      void pos;
    });
    return out;
  }, []);
  return <>{crowd.map((c, i) => <Person key={i} {...c} />)}</>;
}

export function Life() {
  return (
    <Suspense fallback={null}>
      <Traffic />
      <People />
    </Suspense>
  );
}
