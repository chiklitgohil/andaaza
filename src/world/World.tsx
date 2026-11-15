import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';
import { City } from './City';
import { Rider } from './Rider';
import { Lights, Rain } from './Atmosphere';
import { CameraRig } from './CameraRig';
import { Life } from './Life';
import { Room } from './Room';

export default function World() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      className="world"
      shadows
      dpr={dpr}
      camera={{ fov: 50, near: 0.05, far: 400, position: [0, 30, 40] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      aria-hidden="true"
      onCreated={({ gl }) => { if (import.meta.env.DEV) (window as unknown as { __gl: unknown }).__gl = gl; }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <Lights />
      <City />
      <Rider />
      <Life />
      <Rain />
      <Room />
      <CameraRig />
    </Canvas>
  );
}
