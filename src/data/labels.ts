import type { Label } from './types';

export const LABEL_INFO: Record<Label, { short: string; long: string; color: string }> = {
  DOCUMENTED: {
    short: 'Documented',
    long: 'Established by a regulator finding or order, a court record, a company admission, a peer-reviewed measurement or a reproducible technical analysis.',
    color: '#3ddc97',
  },
  REPORTED: {
    short: 'Reported',
    long: 'Found by credible investigative journalism or independent researchers who describe their method, but not confirmed by a regulator or court.',
    color: '#5aa9ff',
  },
  ALLEGED: {
    short: 'Alleged',
    long: 'Claimed in a lawsuit, complaint, regulator notice or viral post that has not been decided. Not proven. The company’s response is shown next to it.',
    color: '#ffb547',
  },
  CONTESTED: {
    short: 'Contested',
    long: 'Credible evidence on more than one side, or the company disputes the method. Reasonable people disagree.',
    color: '#ff7a59',
  },
  STATEMENT: {
    short: 'Statement',
    long: 'What a company, official or insider said. Recorded as a statement, not as proof that it is true.',
    color: '#b28dff',
  },
  'WHAT-IF': {
    short: 'What-if',
    long: 'Our own invented illustration of how a mechanism could work. There is no public evidence that any named company does exactly this.',
    color: '#ff6fb5',
  },
  FICTIONAL: {
    short: 'Fictional',
    long: 'An invented story element (a character, a street, a shop) used to guide you through the city.',
    color: '#9aa4b2',
  },
};
