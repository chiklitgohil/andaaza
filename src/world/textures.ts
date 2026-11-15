import * as THREE from 'three';

/** Facade texture: a grid of windows. Returns a colour map (white walls, dark windows) and an emissive mask. */
export function facadeTextures() {
  const w = 64, h = 128;
  const make = (lit: boolean) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d')!;
    g.fillStyle = lit ? '#000' : '#fff';
    g.fillRect(0, 0, w, h);
    let seed = 3;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let y = 8; y < h - 8; y += 16) {
      for (let x = 6; x < w - 6; x += 14) {
        const on = r() > 0.45;
        g.fillStyle = lit ? (on ? '#ffd08a' : '#000') : '#2a2f3a';
        g.fillRect(x, y, 8, 10);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = lit ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.NearestFilter;
    return t;
  };
  return { map: make(false), emissive: make(true) };
}

/** A shop sign as a texture. */
export function signTexture(text: string, bg: string) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 96;
  const g = c.getContext('2d')!;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 96);
  g.strokeStyle = 'rgba(255,255,255,0.65)';
  g.lineWidth = 4;
  g.strokeRect(6, 6, 500, 84);
  g.fillStyle = '#fff';
  g.font = "bold 40px 'Nirmala UI','Shruti','Noto Sans Gujarati','Segoe UI',sans-serif";
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let size = 40;
  while (g.measureText(text).width > 470 && size > 18) { size -= 2; g.font = `bold ${size}px 'Nirmala UI','Shruti','Noto Sans Gujarati','Segoe UI',sans-serif`; }
  g.fillText(text, 256, 50);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
