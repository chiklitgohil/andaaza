export type Label = 'DOCUMENTED' | 'REPORTED' | 'ALLEGED' | 'CONTESTED' | 'STATEMENT' | 'WHAT-IF' | 'FICTIONAL';

export const LABEL_COLOR: Record<Label, string> = {
  DOCUMENTED: '#5fd39a',
  REPORTED: '#6fa8ff',
  ALLEGED: '#ffb547',
  CONTESTED: '#ff8063',
  STATEMENT: '#b99cff',
  'WHAT-IF': '#ff6fb5',
  FICTIONAL: '#a3abb8',
};

export const LABEL_MEANING: Record<Label, string> = {
  DOCUMENTED: 'A regulator, court, settlement, company admission or published audit.',
  REPORTED: 'Journalism or research that explains its method, not confirmed by a court or regulator.',
  ALLEGED: 'A complaint, lawsuit, union or worker claim that has not been decided.',
  CONTESTED: 'Evidence on both sides, or the company disputes it.',
  STATEMENT: 'What a company or official said.',
  'WHAT-IF': 'Our own illustration of how something could work.',
  FICTIONAL: 'Part of Arun’s invented story.',
};

export interface Source { title: string; publisher: string; url: string; opened: boolean }

export interface Fact {
  text: string;
  label: Label;
  response?: string;   // company or official response (required for ALLEGED / CONTESTED)
  sources: Source[];
}

export interface Debrief {
  actId: string;
  title: string;
  message: string;      // 2–3 sentences: the idea of the act
  facts: Fact[];
  honesty?: string;     // what is invented in this act
}
