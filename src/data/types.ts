export const LABELS = [
  'DOCUMENTED',
  'REPORTED',
  'ALLEGED',
  'CONTESTED',
  'STATEMENT',
  'WHAT-IF',
  'FICTIONAL',
] as const;
export type Label = (typeof LABELS)[number];

export interface Source {
  url: string;
  title: string;
  publisher: string;
  type: 'primary' | 'secondary';
  /** 'opened' = we read the page; 'snippet' = only seen in search results */
  accessed: 'opened' | 'snippet';
  date?: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  /** short line for cards */
  hook: string;
  categories: string[];
  countries: string[];
  /** when the key event happened (YYYY or YYYY-MM or YYYY-MM-DD) */
  date: string;
  collected: string;
  howObtained: string;
  inferred: string;
  done: string;
  affected: string;
  label: Label;
  labelNote: string;
  companyResponse: { text: string; source?: string } | 'none found';
  outcome: { text: string; date?: string };
  sources: Source[];
  limits: string;
  whyItMatters: string;
  illustrative?: boolean;
  stops: string[];
  myths?: string[];
  asOf: string;
}

export interface Myth {
  id: string;
  claim: string;
  verdict: 'NOT SUPPORTED' | 'OVERSTATED' | 'UNVERIFIED' | 'MISREAD';
  whatEvidenceShows: string;
  fairTest: string;
  wouldChangeOurMind: string;
  caseIds: string[];
  sources: Source[];
}
