import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { LANDMARKS, LOOP_LEN, frameAt, routeAt } from './path';
import { useStory } from '../story/store';
import { daylight, rainAt } from './daylight';
import { hourAt } from '../story/acts';
import { HOME_AT, PUNCTURE_AT, RIDE_AT, modeAt, type Mode } from '../story/timeline';
import { ARUN, M, SCALE, useModel } from './models';
import { ROOM } from './roomLayout';

/** Where Arun's phone screen is in the world, updated every frame (the camera dives to it). */
export const phoneWorld = new THREE.Vector3();
export const phoneFacing = new THREE.Vector3(0, 0, 1);
export const riderWorld = new THREE.Vector3();
export const riderForward = new THREE.Vector3(0, 0, 1);

export const home = (() => {
  const l = LANDMARKS.find((x) => x.kind === 'home')!;
  const { pos, side, tan } = frameAt(0.02);
  return { pos: pos.clone().addScaledVector(side, l.side * 7.3), face: side.clone().multiplyScalar(-l.side), tan };
})();

// where the scooter is left after the puncture: pulled onto the pavement outside the tyre shop
const parked = (() => {
  const { pos, side, tan } = frameAt(routeAt(RIDE_AT));
  return { pos: pos.clone().addScaledVector(side, -4.1), yaw: Math.atan2(tan.x, tan.z) };
})();
// where Arun stands while he waits, and where he gets out at home
const shopSpot = (() => { const { pos, side } = frameAt(routeAt(RIDE_AT)); return pos.clone().addScaledVector(side, -4.6).addScaledVector(frameAt(routeAt(RIDE_AT)).tan, 1.6); })();
const kerb = (() => { const { pos, side, tan } = frameAt(0.02); return { pos: pos.clone().addScaledVector(side, -4.4).addScaledVector(tan, -1.5), yaw: Math.atan2(side.x, side.z) }; })();

/** Procedural scooter (no CC0 scooter exists in the packs), in the same flat style. */
export function Scooter({ wheels, front, box = '#2fa36f' }: { wheels?: React.MutableRefObject<THREE.Group[]>; front?: React.RefObject<THREE.Group>; box?: string }) {
  return (
    <group>
      {[0.72, -0.62].map((z, i) => (
        <group key={z} ref={i === 0 ? front : undefined} position={[0, 0, z]}>
          <group position={[0, 0.3, 0]} ref={(el) => { if (el && wheels) wheels.current[i] = el; }}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.16, 16]} /><meshStandardMaterial color="#26262b" roughness={0.8} /></mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.14, 0.18, 12]} /><meshStandardMaterial color="#b9bcc4" metalness={0.6} roughness={0.3} /></mesh>
          </group>
        </group>
      ))}
      <mesh position={[0, 0.48, -0.32]} castShadow><boxGeometry args={[0.5, 0.42, 0.8]} /><meshStandardMaterial color="#d9473a" roughness={0.45} /></mesh>
      <mesh position={[0, 0.36, 0.2]} castShadow><boxGeometry args={[0.36, 0.08, 0.7]} /><meshStandardMaterial color="#2d2d33" /></mesh>
      <mesh position={[0, 0.76, -0.38]} castShadow><boxGeometry args={[0.44, 0.12, 0.66]} /><meshStandardMaterial color="#1f1f24" /></mesh>
      <mesh position={[0, 0.78, 0.62]} rotation={[0.3, 0, 0]} castShadow><boxGeometry args={[0.42, 0.9, 0.18]} /><meshStandardMaterial color="#d9473a" roughness={0.45} /></mesh>
      <mesh position={[0, 1.22, 0.74]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.8, 6]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 1.12, 0.84]}><sphereGeometry args={[0.1, 12, 10]} /><meshBasicMaterial color="#fff6d6" /></mesh>
      {/* delivery box on the back rack */}
      <mesh position={[0, 1.1, -0.72]} castShadow><boxGeometry args={[0.62, 0.55, 0.55]} /><meshStandardMaterial color={box} roughness={0.6} /></mesh>
      <mesh position={[0, 1.12, -1.0]}><planeGeometry args={[0.42, 0.16]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>
  );
}

// how fast Arun is moving along the route (0..1), so he doesn't walk on the spot when you stop scrolling
let routeSpeed = 0;

function Arun({ phoneRef }: { phoneRef: React.RefObject<THREE.Mesh> }) {
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
    const { progress, phase, done } = useStory.getState();
    const mode = modeAt(progress, done);
    const inApp = phase !== 'ride';
    const want: Record<Mode, string> = {
      scooter: inApp ? 'holding-right' : 'drive',
      pushing: inApp ? 'holding-right' : routeSpeed > 0.05 ? 'walk' : 'idle',
      waiting: 'holding-right',
      taxi: 'sit',
      arrived: 'holding-right',
      room: 'sit',
    };
    const w = want[mode];
    if (w !== current.current && actions[w]) {
      const prev = actions[current.current];
      actions[w].reset().fadeIn(0.35).play();
      prev?.fadeOut(0.35);
      current.current = w;
    }
    mixer.update(dt);
    const g = bodyRef.current!;
    g.visible = mode !== 'taxi';
    // seated on the scooter while riding; beside it while pushing or on the phone; on the bed edge at home
    if (mode === 'room') g.position.set(0, ROOM.seatY, 0);
    else if (w === 'drive') g.position.set(0, 0.42, -0.18);
    else if (mode === 'scooter' || mode === 'pushing') g.position.lerp(new THREE.Vector3(-0.85, 0, 0.1), 0.15);
    else g.position.set(0, 0, 0);
  });

  return (
    <group ref={bodyRef} scale={SCALE.character}>
      <primitive object={body} />
    </group>
  );
}

/** The cab that takes Arun home: a Kenney CC0 taxi with headlights. */
function Taxi({ root }: { root: React.RefObject<THREE.Group> }) {
  const { scene } = useModel(M('cars', 'taxi'));
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
    return c;
  }, [scene]);
  return (
    <group ref={root} visible={false}>
      <group scale={SCALE.car} position={[0, 0.47, 0]}><primitive object={obj} /></group>
      <mesh position={[0, 1.0, 2.15]}>
        <boxGeometry args={[1.7, 0.18, 0.05]} />
        <meshBasicMaterial color="#fff3cf" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.1, 3.6]} distance={14} intensity={18} color="#fff1c4" />
    </group>
  );
}

export function Rider() {
  const root = useRef<THREE.Group>(null);
  const scooter = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const taxi = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const phone = useRef<THREE.Mesh>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const head = useRef<THREE.PointLight>(null);
  const porch = useRef<THREE.PointLight>(null);
  const lastT = useRef(0);
  const yawSmooth = useRef<number | null>(null);
  const departed = useRef(0);   // metres the taxi has driven away after dropping Arun
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, dt) => {
    const { progress, phase, done } = useStory.getState();
    const mode = modeAt(progress, done);
    const t = routeAt(progress);
    const f = frameAt(t);
    const routeYaw = Math.atan2(f.tan.x, f.tan.z);

    const moved = (t - lastT.current + 1) % 1;
    lastT.current = t;
    routeSpeed += (Math.min(1, (moved < 0.5 ? moved : 0) / Math.max(dt, 1e-3) * 400) - routeSpeed) * Math.min(1, dt * 6);

    // ---- Arun ----
    let target: THREE.Vector3, yaw: number;
    if (mode === 'room') { target = ROOM.seat; yaw = ROOM.yaw; }
    else if (mode === 'arrived') { target = kerb.pos; yaw = kerb.yaw; }
    else if (mode === 'waiting') { target = shopSpot; yaw = parked.yaw - Math.PI / 2; }
    else target = f.pos.clone().addScaledVector(f.side, mode === 'taxi' ? -2.3 : -1.8), yaw = routeYaw; // keep left, as in India
    const g = root.current!;
    if (g.position.distanceTo(target) > 30) { g.position.copy(target); yawSmooth.current = yaw; }
    else g.position.lerp(target, 1 - Math.pow(0.0005, dt));
    if (yawSmooth.current === null) yawSmooth.current = yaw;
    let dy = yaw - yawSmooth.current;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    yawSmooth.current += dy * (1 - Math.pow(0.002, dt));
    g.rotation.y = yawSmooth.current;

    // ---- the scooter: with Arun until the shop, then left there ----
    const sc = scooter.current!;
    const withArun = mode === 'scooter' || mode === 'pushing';
    if (withArun) { sc.position.copy(g.position); sc.rotation.y = g.rotation.y; }
    else { sc.position.copy(parked.pos); sc.rotation.y = parked.yaw; }
    sc.visible = mode !== 'room';
    if (front.current) front.current.scale.y = progress >= PUNCTURE_AT ? 0.62 : 1; // the flat front tyre
    if (withArun && moved < 0.5) wheels.current.forEach((w) => { if (w) w.rotation.x += moved * 2500; });

    // ---- the taxi: from the tyre shop to Arun's kerb, then away ----
    const tx = taxi.current;
    if (tx) {
      if (mode === 'arrived' && done.arrive) departed.current += dt * 9; else if (mode !== 'arrived') departed.current = 0;
      const showTaxi = mode === 'taxi' || (mode === 'arrived' && departed.current < 60);
      tx.visible = showTaxi;
      if (mode === 'taxi') { tx.position.copy(g.position); tx.rotation.y = g.rotation.y; }
      else if (mode === 'arrived') {
        const ft = frameAt((0.02 + 0.028 + departed.current / LOOP_LEN) % 1); // pulled up past the house, clear of the camera
        tx.position.copy(ft.pos).addScaledVector(ft.side, -2.3);
        tx.rotation.y = Math.atan2(ft.tan.x, ft.tan.z);
      }
    }

    const night = daylight(hourAt(progress), rainAt(progress)).night;
    if (head.current) head.current.intensity = mode === 'scooter' ? night * 30 : 0;
    if (porch.current) porch.current.intensity = progress > HOME_AT - 0.03 && mode !== 'room' ? night * 14 : 0;

    // phone glow: buzzing, in use, or dark in the pocket
    const holding = phase !== 'ride' || mode === 'room' || mode === 'waiting' || mode === 'arrived';
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
      <group ref={scooter}>
        <Scooter wheels={wheels} front={front} />
        <pointLight ref={head} position={[0, 1.2, 2.4]} distance={16} intensity={0} color="#fff1c4" />
      </group>
      <group ref={root}>
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
          <Arun phoneRef={phone} />
        </Suspense>
      </group>
      <Suspense fallback={null}>
        <Taxi root={taxi} />
      </Suspense>
    </>
  );
}
