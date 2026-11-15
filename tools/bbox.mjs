// Approximate bounding box from POSITION accessor min/max and node scales (JSON only).
import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const buf = readFileSync(f); const len = buf.readUInt32LE(12); const j = JSON.parse(buf.slice(20, 20 + len).toString('utf8'));
  let mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9];
  for (const m of j.meshes) for (const p of m.primitives) { const a=j.accessors[p.attributes.POSITION]; for(let i=0;i<3;i++){mn[i]=Math.min(mn[i],a.min[i]);mx[i]=Math.max(mx[i],a.max[i]);} }
  const sc = (j.nodes||[]).find(n=>n.scale)?.scale;
  console.log(f.split('/').pop().padEnd(32), 'size', mx.map((v,i)=>(v-mn[i]).toFixed(2)).join(' x '), 'min', mn.map(v=>v.toFixed(2)).join(','), sc?('nodeScale '+sc.join(',')):'');
}
