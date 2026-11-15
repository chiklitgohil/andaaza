import { useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// All models are Kenney CC0 packs (kenney.nl), bundled with the site. No network requests at runtime
// beyond this site's own files. Draco is OFF so no decoder is ever fetched from a CDN.
const BASE = `${import.meta.env.BASE_URL}models/`;
export const M = (kit: string, name: string) => `${BASE}${kit}/${name}.glb`;

export const SCALE = {
  commercial: 9,
  suburban: 7.5,
  tree: 8,
  roads: 9,
  car: 1.55,
  character: 2.35,
};

export const COMMERCIAL = 'abcdefghijklmn'.split('').map((c) => M('commercial', `building-${c}`));
export const BACKGROUND = ['a', 'b', 'c', 'd', 'e', 'f', 'wide-a', 'wide-b'].map((c) => M('commercial', `low-detail-building-${c}`));
export const SKYSCRAPERS = ['a', 'b', 'c'].map((c) => M('commercial', `building-skyscraper-${c}`));
export const HOUSES = 'abcdefg'.split('').map((c) => M('suburban', `building-type-${c}`));
export const CARS = ['taxi', 'sedan', 'hatchback-sports', 'van', 'delivery', 'truck', 'suv', 'garbage-truck'].map((n) => M('cars', n));
export const PEOPLE = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'worker']
  .map((n) => M('characters', `character-${n}`));
export const ARUN = M('characters', 'character-male-f');

export function useModel(url: string) {
  return useGLTF(url, false) as unknown as { scene: THREE.Group; animations: THREE.AnimationClip[] };
}

/** Materials that should glow warm at night (lit windows and shop fronts). */
export const nightMaterials = new Set<THREE.MeshStandardMaterial>();

interface Part { geo: THREE.BufferGeometry; mat: THREE.Material; local: THREE.Matrix4 }

/** Draws many copies of one model with one draw call per mesh part. */
export function InstancedModel({ url, items, shadows = false, glow = false }: { url: string; items: THREE.Matrix4[]; shadows?: boolean; glow?: boolean }) {
  const { scene } = useModel(url);
  const parts = useMemo<Part[]>(() => {
    scene.updateMatrixWorld(true);
    const out: Part[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (glow && mat.map) {
        mat.emissive = new THREE.Color('#ffb15c');
        mat.emissiveMap = mat.map;
        mat.emissiveIntensity = 0;
        nightMaterials.add(mat);
      }
      out.push({ geo: m.geometry, mat, local: m.matrixWorld.clone() });
    });
    return out;
  }, [scene, glow]);
  if (!items.length) return null;
  return <>{parts.map((p, i) => <PartMesh key={i} part={p} items={items} shadows={shadows} />)}</>;
}

function PartMesh({ part, items, shadows }: { part: Part; items: THREE.Matrix4[]; shadows: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current!;
    const tmp = new THREE.Matrix4();
    items.forEach((it, i) => m.setMatrixAt(i, tmp.multiplyMatrices(it, part.local)));
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [items, part]);
  return (
    <instancedMesh ref={ref} args={[part.geo, part.mat, items.length]} castShadow={shadows} receiveShadow raycast={() => null} />
  );
}

export const mat4 = (x: number, y: number, z: number, rotY: number, s: number) =>
  new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(s, s, s));

/** Preload everything we use (from this site's own files). */
[...COMMERCIAL, ...BACKGROUND, ...SKYSCRAPERS, ...HOUSES, ...CARS, ARUN].forEach((u) => useGLTF.preload(u, false));
