import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStory } from '../story/store';
import { hourAt } from '../story/acts';
import { daylight, rainAt } from './daylight';
import { riderWorld } from './Rider';

/** Sky colour, fog, sun and ambient light, driven by the time of day. */
export function Lights() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();
  useFrame(() => {
    const p = useStory.getState().progress;
    const d = daylight(hourAt(p), rainAt(p));
    if (!(scene.background instanceof THREE.Color)) scene.background = new THREE.Color();
    (scene.background as THREE.Color).copy(d.sky);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(d.sky);
    if (sun.current) {
      sun.current.intensity = d.sun * 2.2;
      sun.current.position.copy(riderWorld).add(d.sunDir);
      sun.current.target.position.copy(riderWorld);
      sun.current.target.updateMatrixWorld();
      sun.current.color.set(hourAt(p) < 8 || hourAt(p) > 17 ? '#ffb27a' : '#fff3e0');
    }
    if (amb.current) amb.current.intensity = d.ambient * 2.1;
  });
  return (
    <>
      <fog attach="fog" args={['#9ccaf0', 60, 210]} />
      <hemisphereLight ref={amb} args={['#cfe2ff', '#5a4a3a', 1]} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={200}
      />
    </>
  );
}

/** Rain: instanced streaks around the camera. */
export function Rain() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const n = 1400;
  const drops = useMemo(() => Array.from({ length: n }, () => ({
    x: (Math.random() - 0.5) * 60, y: Math.random() * 30, z: (Math.random() - 0.5) * 60, s: 18 + Math.random() * 10,
  })), []);
  const o = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    const { progress, reducedMotion } = useStory.getState();
    const r = rainAt(progress);
    const m = ref.current!;
    m.visible = r > 0.01;
    if (!m.visible) return;
    const shown = Math.floor(n * r);
    for (let i = 0; i < n; i++) {
      const d = drops[i];
      if (!reducedMotion) { d.y -= d.s * dt; if (d.y < 0) d.y += 30; }
      if (i < shown) {
        o.position.set(camera.position.x + d.x, d.y, camera.position.z + d.z);
        o.scale.set(1, 1, 1);
      } else o.scale.set(0, 0, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} raycast={() => null}>
      <boxGeometry args={[0.025, 0.7, 0.025]} />
      <meshBasicMaterial color="#b9c7dd" transparent opacity={0.45} />
    </instancedMesh>
  );
}
