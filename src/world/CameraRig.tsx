import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStory } from '../story/store';
import { home, phoneWorld, riderWorld } from './Rider';
import { atTime } from '../story/acts';
import { LOOP_LEN, frameAt, routeAt } from './path';

const HOME_AT = atTime('22:40');

/**
 * Follows Arun along his loop. The camera itself rides the road (sampled a little behind him on the
 * same curve), so it never cuts through buildings on bends. On "dive", it flies into his phone.
 */
export function CameraRig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const goal = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);
  const diveT = useRef(0);
  const first = useRef(true);

  useFrame((_, dt) => {
    const { progress, phase, reducedMotion } = useStory.getState();
    const cam = camera as THREE.PerspectiveCamera;
    const t = routeAt(progress);

    // framing: a high establishing shot at dawn, then a chase cam that sways side to side
    const wide = 1 - THREE.MathUtils.smoothstep(progress, 0.0, 0.04);
    const sway = Math.sin(progress * Math.PI * 7);
    const back = 7.5 + wide * 22;
    const up = 2.7 + wide * 18 + Math.abs(sway) * 0.6;
    const lateral = 2.2 * sway;                       // stays over the carriageway
    const ct = (t - back / LOOP_LEN + 1) % 1;
    const f = frameAt(ct);
    goal.copy(f.pos).addScaledVector(f.side, lateral).add(new THREE.Vector3(0, up, 0));
    const ahead = frameAt((t + 4 / LOOP_LEN) % 1).pos;
    goalLook.copy(riderWorld).lerp(ahead, 0.35).add(new THREE.Vector3(0, 1.3, 0));
    if (progress >= HOME_AT) {
      // at home: a quiet low shot of Arun on his doorstep, slowly pushing in
      const push = THREE.MathUtils.smoothstep(progress, HOME_AT, atTime('23:30'));
      const across = new THREE.Vector3(home.face.z, 0, -home.face.x);
      goal.copy(home.pos).addScaledVector(home.face, 6 - push * 2.5).addScaledVector(across, 2.2 - push).add(new THREE.Vector3(0, 2.2 - push * 0.6, 0));
      goalLook.copy(home.pos).add(new THREE.Vector3(0, 1.1, 0));
    }

    const diving = phase === 'dive' || phase === 'phone';
    // a slow, deliberate push from wherever we are straight into the phone (1.6 s)
    diveT.current = reducedMotion ? (diving ? 1 : 0) : THREE.MathUtils.clamp(diveT.current + (diving ? dt / 1.6 : -dt / 0.8), 0, 1);
    if (diving && diveT.current >= 1 && phase === 'dive') useStory.getState().openPhone();
    const k = THREE.MathUtils.smootherstep(diveT.current, 0, 1);
    const approach = goal.clone().sub(phoneWorld).normalize();
    const screen = phoneWorld.clone().addScaledVector(approach, 0.14);
    const pos = goal.clone().lerp(screen, k);
    const lk = goalLook.clone().lerp(phoneWorld, Math.min(1, k * 2.2));

    const s = first.current || reducedMotion ? 1 : 1 - Math.pow(0.04, dt);
    first.current = false;
    camera.position.lerp(pos, k > 0.001 ? 1 : s);
    look.current.lerp(lk, k > 0.001 ? 1 : s);
    camera.lookAt(look.current);
    cam.fov = THREE.MathUtils.lerp(cam.fov, 52 - k * 14, 0.2);
    cam.updateProjectionMatrix();
  });
  return null;
}
