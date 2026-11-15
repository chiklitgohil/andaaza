// Reads glTF/GLB JSON headers only (no code execution) to list size, textures, animations.
import { readFileSync, statSync } from 'node:fs';
const files = process.argv.slice(2);
for (const f of files) {
  const buf = readFileSync(f);
  let json;
  if (f.endsWith('.glb')) { const len = buf.readUInt32LE(12); json = JSON.parse(buf.slice(20, 20 + len).toString('utf8')); }
  else json = JSON.parse(buf.toString('utf8'));
  const imgs = (json.images || []).map((i) => i.uri ? (i.uri.startsWith('data:') ? 'embedded-uri' : i.uri) : 'embedded');
  const anims = (json.animations || []).map((a) => a.name);
  const bufs = (json.buffers || []).map((b) => b.uri ? (b.uri.startsWith('data:') ? 'embedded-uri' : b.uri) : 'glb');
  console.log(`${f.split('/').slice(-1)[0]}  ${(statSync(f).size/1024).toFixed(0)}KB  meshes=${(json.meshes||[]).length} skins=${(json.skins||[]).length} imgs=[${imgs}] bufs=[${bufs}] anims(${anims.length})=${anims.slice(0,40).join(',')}`);
}
