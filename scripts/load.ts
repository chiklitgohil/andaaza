import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CaseRecord, Myth } from '../src/data/types';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadCases(): { file: string; c: CaseRecord }[] {
  const dir = join(ROOT, 'data', 'cases');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => (JSON.parse(readFileSync(join(dir, f), 'utf8')) as CaseRecord[]).map((c) => ({ file: f, c })));
}

export function loadMyths(): Myth[] {
  return JSON.parse(readFileSync(join(ROOT, 'data', 'myths.json'), 'utf8'));
}
