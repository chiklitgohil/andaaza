// DEV-TIME ONLY link checker. This runs on the developer's machine, never in the published site.
// Usage: npm run check-links
import { loadCases, loadMyths } from './load';

const urls = new Map<string, string[]>();
for (const { c } of loadCases()) for (const s of c.sources) urls.set(s.url, [...(urls.get(s.url) ?? []), c.id]);
for (const m of loadMyths()) for (const s of m.sources) urls.set(s.url, [...(urls.get(s.url) ?? []), `myth:${m.id}`]);

async function check(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    let r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
    if (r.status === 405 || r.status === 403 || r.status === 404) {
      r = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
    }
    return String(r.status);
  } catch (e) {
    return `ERR ${(e as Error).name}`;
  } finally {
    clearTimeout(t);
  }
}

const list = [...urls.keys()];
const results: [string, string][] = [];
const pool = 8;
for (let i = 0; i < list.length; i += pool) {
  const batch = list.slice(i, i + pool);
  const r = await Promise.all(batch.map(check));
  batch.forEach((u, j) => results.push([u, r[j]]));
}
const bad = results.filter(([, s]) => !/^2|^3/.test(s));
console.log(`Checked ${results.length} URLs. ${results.length - bad.length} OK, ${bad.length} not OK:`);
for (const [u, s] of bad) console.log(`${s}\t${u}\t(${urls.get(u)!.join(', ')})`);
