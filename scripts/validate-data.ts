// Honesty audit for the case library. Runs before every build; the build fails on any error.
import { LABELS } from '../src/data/types';
import { ALL_STOP_IDS } from '../src/data/stops';
import { loadCases, loadMyths } from './load';

const errors: string[] = [];
const warnings: string[] = [];
const cases = loadCases();
const myths = loadMyths();
const ids = new Set<string>();
const mythIds = new Set(myths.map((m) => m.id));

// Words that must never describe what a named company did in our own invented illustrations.
const COMPANY_HINTS = /\b(Google|Meta|Facebook|Amazon|Apple|Uber|Ola|Lyft|Instacart|TikTok|Zepto|Swiggy|Zomato|Paytm|Airtel|Hungry Studio)\b/;

const REQUIRED: (keyof (typeof cases)[number]['c'])[] = [
  'id', 'title', 'hook', 'date', 'collected', 'howObtained', 'inferred', 'done', 'affected',
  'label', 'labelNote', 'limits', 'whyItMatters', 'asOf',
];

for (const { file, c } of cases) {
  const where = `${file} › ${c.id ?? '(no id)'}`;
  for (const k of REQUIRED) {
    const v = c[k];
    if (typeof v !== 'string' || !v.trim()) errors.push(`${where}: missing "${String(k)}"`);
  }
  if (ids.has(c.id)) errors.push(`${where}: duplicate id`);
  ids.add(c.id);
  if (!LABELS.includes(c.label)) errors.push(`${where}: invalid label "${c.label}"`);
  if (!Array.isArray(c.sources) || c.sources.length === 0) errors.push(`${where}: no sources`);
  for (const s of c.sources ?? []) {
    if (!/^https:\/\//.test(s.url)) errors.push(`${where}: source URL must be https (${s.url})`);
    if (!['primary', 'secondary'].includes(s.type)) errors.push(`${where}: source type invalid`);
    if (!['opened', 'snippet'].includes(s.accessed)) errors.push(`${where}: source "accessed" invalid`);
    if (!s.title || !s.publisher) errors.push(`${where}: source needs title and publisher`);
  }
  if (!c.sources?.some((s) => s.type === 'primary')) warnings.push(`${where}: secondary sources only (shown as such in the UI)`);
  if (!c.sources?.some((s) => s.accessed === 'opened')) warnings.push(`${where}: no source was opened (snippet-only)`);
  if (c.companyResponse === undefined) errors.push(`${where}: companyResponse missing (use "none found")`);
  if ((c.label === 'ALLEGED' || c.label === 'CONTESTED') && c.companyResponse === 'none found') {
    errors.push(`${where}: ${c.label} claims must show the company's response`);
  }
  if (typeof c.companyResponse === 'object' && !c.companyResponse.text?.trim()) errors.push(`${where}: empty response text`);
  if (!c.outcome?.text) errors.push(`${where}: outcome missing`);
  if (!Array.isArray(c.stops) || c.stops.length === 0) errors.push(`${where}: not placed at any stop`);
  for (const s of c.stops ?? []) if (!ALL_STOP_IDS.includes(s)) errors.push(`${where}: unknown stop "${s}"`);
  for (const m of c.myths ?? []) if (!mythIds.has(m)) errors.push(`${where}: unknown myth "${m}"`);
  if ((c.label === 'WHAT-IF' || c.label === 'FICTIONAL') && COMPANY_HINTS.test(c.done)) {
    errors.push(`${where}: ${c.label} text must not name a real company`);
  }
  if (!/^\d{4}(-\d{2}(-\d{2})?)?(-\d{4})?$/.test(c.date)) errors.push(`${where}: bad date "${c.date}"`);
}

for (const m of myths) {
  for (const id of m.caseIds) if (!ids.has(id)) errors.push(`myths › ${m.id}: unknown case "${id}"`);
}

const byLabel = Object.fromEntries(LABELS.map((l) => [l, cases.filter((x) => x.c.label === l).length]));
const opened = cases.flatMap((x) => x.c.sources).filter((s) => s.accessed === 'opened').length;
const total = cases.flatMap((x) => x.c.sources).length;

console.log(`Cases: ${cases.length}   Myths: ${myths.length}`);
console.log('By label:', byLabel);
console.log(`Sources: ${total} (${opened} opened, ${total - opened} snippet-only)`);
if (warnings.length) {
  console.log(`\n${warnings.length} warnings:`);
  warnings.forEach((w) => console.log('  ! ' + w));
}
if (errors.length) {
  console.error(`\n${errors.length} ERRORS:`);
  errors.forEach((e) => console.error('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ Honesty audit passed.');
