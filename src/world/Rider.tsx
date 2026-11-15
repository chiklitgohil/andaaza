import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { LANDMARKS, frameAt, routeAt } from './path';
import { useStory } from '../story/store';
import { daylight, rainAt } from './daylight';
import { atTime, hourAt } from '../story/acts';
import { ARUN, SCALE, useModel } from './models';

/** Where Arun's phone screen is in the world, updated every frame (the camera dives to it). */
export const phoneWorld = new THREE.Vector3();
export const phoneFacing = new THREE.Vector3(0, 0, 1);
export const riderWorld = new THREE.Vector3();
export const riderForward = new THREE.Vector3(0, 0, 1);

const HOME_AT = atTime('22:40');
export const home = (() => {
  const l = LANDMARKS.find((x) => x.kind === 'home')!;
  const { pos, side, tan } = frameAt(0.02);
  return { pos: pos.clone().addScaledVector(side, l.side * 7.3), face: side.clone().multiplyScalar(-l.side), tan };
})();

/** Procedural scooter (no CC0 scooter exists in the packs), in the same flat style. */
function Scooter({ wheels }: { wheels: React.MutableRefObject<THREE.Group[]> }) {
  return (
    <group>
      {[0.72, -0.62].map((z, i) => (
        <group key={z} position={[0, 0.3, z]} ref={(el) => { if (el) wheels.current[i] = el; }}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.16, 16]} /><meshStandardMaterial color="#26262b" roughness={0.8} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.14, 0.18, 12]} /><meshStandardMaterial color="#b9bcc4" metalness={0.6} roughness={0.3} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.48, -0.32]} castShadow><boxGeometry args={[0.5, 0.42, 0.8]} /><meshStandardMaterial color="#d9473a" roughness={0.45} /></mesh>
      <mesh position={[0, 0.36, 0.2]} castShadow><boxGeometry args={[0.36, 0.08, 0.7]} /><meshStandardMaterial color="#2d2d33" /></mesh>
      <mesh position={[0, 0.76, -0.38]} castShadow><boxGeometry args={[0.44, 0.12, 0.66]} /><meshStandardMaterial color="#1f1f24" /></mesh>
      <mesh position={[0, 0.78, 0.62]} rotation={[0.3, 0, 0]} castShadow><boxGeometry args={[0.42, 0.9, 0.18]} /><meshStandardMaterial color="#d9473a" roughness={0.45} /></mesh>
      <mesh position={[0, 1.22, 0.74]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.8, 6]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 1.12, 0.84]}><sphereGeometry args={[0.1, 12, 10]} /><meshBasicMaterial color="#fff6d6" /></mesh>
      {/* green delivery box on the back rack */}
      <mesh position={[0, 1.1, -0.72]} castShadow><boxGeometry args={[0.62, 0.55, 0.55]} /><meshStandardMaterial color="#2fa36f" roughness={0.6} /></mesh>
      <mesh position={[0, 1.12, -1.0]}><planeGeometry args={[0.42, 0.16]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>
  );
}

function Arun({ phoneRef, screenRef }: { phoneRef: React.RefObject<THREE.Mesh>; screenRef: React.RefObject<THREE.MeshBasicMaterial> }) {
  const { scene, animations } = useModel(ARUN);
  const body = useMemo(() => skClone(scene) as THREE.Group, [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(body), [body]);
  const actions = useMemo(() => Object.fromEntries(animations.map((a) => [a.name, mixer.clipAction(a)])), [animations, mixer]);
  const current = useRef<string>('');
  const bodyRef = useRef<THREE.Group>(null);

  // put a phone in his right hand
  useEffect(() => {
    body.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
    const hand = body.getObjectByName('arm-right');
    if (hand && phoneRef.current) hand.add(phoneRef.current);
  }, [body, phoneRef]);

  useFrame((_, dt) => {
    const { progress, phase } = useStory.getState();
    const atHome = progress >= HOME_AT;
    const want = atHome ? 'sit' : phase === 'ride' ? 'drive' : 'holding-right';
    if (want !== current.current && actions[want]) {
      const prev = actions[current.current];
      actions[want].reset().fadeIn(0.35).play();
      prev?.fadeOut(0.35);
      current.current = want;
    }
    mixer.update(dt);
    const g = bodyRef.current!;
    // seated on the scooter while riding; standing beside it with the phone otherwise
    if (atHome) { g.position.set(0, 0.42, 0); g.rotation.set(0, 0, 0); }
    else if (want === 'drive') { g.position.set(0, 0.42, -0.18); g.rotation.set(0, 0, 0); }
    else { g.position.lerp(new THREE.Vector3(-0.85, 0, 0.1), 0.15); g.rotation.set(0, 0, 0); }
    void screenRef;
  });

  return (
    <group ref={bodyRef} scale={SCALE.character}>
      <primitive object={body} />
    </group>
  );
}

export function Rider() {
  const root = useRef<THREE.Group>(null);
  const scooter = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const phone = useRef<THREE.Mesh>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const head = useRef<THREE.PointLight>(null);
  const porch = useRef<THREE.PointLight>(null);
  const lastT = useRef(0);
  const yawSmooth = useRef<number | null>(null);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, dt) => {
    const { progress, phase } = useStory.getState();
    const g = root.current!;
    const atHome = progress >= HOME_AT;
    let target: THREE.Vector3, yaw: number;
    if (atHome) {
      target = home.pos;
      yaw = Math.atan2(home.face.x, home.face.z);
    } else {
      const t = routeAt(progress);
      const { pos, tan, side } = frameAt(t);
      target = pos.clone().addScaledVector(side, -1.8); // keep left, as in India
      yaw = Math.atan2(tan.x, tan.z);
    }
    g.position.lerp(target, 1 - Math.pow(0.0005, dt));
    if (yawSmooth.current === null) yawSmooth.current = yaw;
    let dy = yaw - yawSmooth.current;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    yawSmooth.current += dy * (1 - Math.pow(0.002, dt));
    g.rotation.y = yawSmooth.current;

    // scooter parked to one side at home
    if (scooter.current) scooter.current.position.set(atHome ? 1.6 : 0, 0, atHome ? -1.2 : 0);

    const t = routeAt(progress);
    const moved = (t - lastT.current + 1) % 1;
    lastT.current = t;
    if (moved < 0.5) wheels.current.forEach((w) => { if (w) w.rotation.x += moved * 2500; });

    const night = daylight(hourAt(progress), rainAt(progress)).night;
    if (head.current) head.current.intensity = atHome ? 0 : night * 30;
    if (porch.current) porch.current.intensity = progress > HOME_AT - 0.03 ? night * 14 : 0;

    // phone glow: buzzing, in use, or dark in the pocket
    const holding = phase !== 'ride' || atHome;
    if (phone.current) phone.current.visible = holding;
    if (screen.current) {
      screen.current.color.set(phase === 'buzz' ? (Math.sin(state.clock.elapsedTime * 6) > 0 ? '#ffd166' : '#ffffff') : '#e8f0ff');
    }
    if (phone.current) {
      phone.current.getWorldPosition(phoneWorld);
      phoneFacing.set(0, 0, 1).applyQuaternion(phone.current.getWorldQuaternion(tmpQ));
    }
    riderWorld.copy(g.position);
    riderForward.set(Math.sin(g.rotation.y), 0, Math.cos(g.rotation.y));
  });

  const porchPos = home.pos.clone().addScaledVector(home.face, -1.2).add(new THREE.Vector3(0, 3, 0));
  return (
    <>
    <pointLight ref={porch} position={porchPos.toArray()} distance={9} decay={1.6} color="#ffb46b" intensity={0} />
    <group ref={root}>
      <group ref={scooter}>
        <Scooter wheels={wheels} />
        <pointLight ref={head} position={[0, 1.2, 2.4]} distance={16} intensity={0} color="#fff1c4" />
      </group>
      {/* the phone; Arun's skeleton adopts it into his right hand once loaded (size in his local units) */}
      <mesh ref={phone} position={[0, -0.13, 0.07]} rotation={[-1.2, 0, 0]} scale={1 / SCALE.character}>
        <boxGeometry args={[0.16, 0.3, 0.02]} />
        <meshStandardMaterial color="#111" />
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.14, 0.27]} />
          <meshBasicMaterial ref={screen} color="#e8f0ff" toneMapped={false} />
        </mesh>
      </mesh>
      <Suspense fallback={null}>
        <Arun phoneRef={phone} screenRef={screen} />
      </Suspense>
    </group>
    </>
  );
}
