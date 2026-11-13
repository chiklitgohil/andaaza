import type { CaseRecord, Myth } from './types';
import mythsJson from '../../data/myths.json';

const files = import.meta.glob('../../data/cases/*.json', { eager: true, import: 'default' }) as Record<string, CaseRecord[]>;

export const CASES: CaseRecord[] = Object.values(files)
  .flat()
  .sort((a, b) => (b.date > a.date ? 1 : -1));

export const CASE_BY_ID: Record<string, CaseRecord> = Object.fromEntries(CASES.map((c) => [c.id, c]));
export const MYTHS = mythsJson as Myth[];

export function casesForStop(stop: string): CaseRecord[] {
  return CASES.filter((c) => c.stops.includes(stop));
}

export function hasPrimary(c: CaseRecord) {
  return c.sources.some((s) => s.type === 'primary');
}
