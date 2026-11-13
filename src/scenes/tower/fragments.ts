import type { Label } from '../../data/types';

/**
 * Profile fragments, one or more per city stop. Wording in quotes is taken from real, documented
 * segment names or inferences in the cited case. Others are labelled WHAT-IF.
 */
export interface Fragment { stop: string; text: string; label: Label; caseId?: string; note: string }

export const FRAGMENTS: Fragment[] = [
  { stop: 'home', text: 'Household viewing history, matched to age and income', label: 'DOCUMENTED', caseId: 'vizio-2017', note: 'FTC alleged Vizio linked second-by-second viewing data to household demographics.' },
  { stop: 'home', text: 'Child’s voice recordings kept', label: 'DOCUMENTED', caseId: 'alexa-ring-2023', note: 'FTC/DOJ alleged Alexa kept children’s recordings and used them to train algorithms.' },
  { stop: 'track', text: 'Likely home and workplace (from daily routes)', label: 'DOCUMENTED', caseId: 'de-montjoye-2013', note: 'Research shows a few location points single out most people. This is a capability, not a known sale.' },
  { stop: 'pharmacy', text: 'Bought heart or blood-pressure medication', label: 'DOCUMENTED', caseId: 'goodrx-2023', note: 'FTC alleged GoodRx uploaded lists of such buyers to Facebook for ad targeting.' },
  { stop: 'pharmacy', text: 'Seeking therapy', label: 'DOCUMENTED', caseId: 'betterhelp-2023', note: 'FTC alleged BetterHelp shared intake data with ad platforms.' },
  { stop: 'pharmacy', text: 'Depression or anxiety list (offered for sale)', label: 'DOCUMENTED', caseId: 'duke-mental-health-brokers-2023', note: '11 of 37 brokers contacted were willing to sell such data (Duke, 2023).' },
  { stop: 'square', text: '“Christian church goers”', label: 'DOCUMENTED', caseId: 'inmarket-2024', note: 'A real audience segment named in the FTC’s InMarket complaint.' },
  { stop: 'square', text: 'Visited a reproductive-health clinic', label: 'DOCUMENTED', caseId: 'xmode-2024', note: 'FTC alleged X-Mode sold data that could track people to such clinics.' },
  { stop: 'square', text: 'Attended a protest', label: 'DOCUMENTED', caseId: 'gravy-mobilewalla-2024', note: 'FTC alleged Mobilewalla categorised people who attended protests.' },
  { stop: 'market', text: '“Wealthy and not healthy”', label: 'DOCUMENTED', caseId: 'inmarket-2024', note: 'A real segment name from the FTC’s InMarket complaint.' },
  { stop: 'market', text: 'Hesitated over the price and left items in the cart', label: 'DOCUMENTED', caseId: 'ftc-surveillance-pricing-2025', note: 'FTC found pricing vendors CAN use mouse movements and abandoned carts. Use by any named shop is not shown.' },
  { stop: 'cafe', text: 'Personality type and political leaning', label: 'CONTESTED', caseId: 'cambridge-analytica-2019', note: 'Harvesting is documented; whether such profiles work well is contested.' },
  { stop: 'cafe', text: 'Uses a dating app, so sexual orientation can be inferred', label: 'DOCUMENTED', caseId: 'grindr-norway-2021', note: 'Norway’s courts held that using Grindr reveals sexual orientation.' },
  { stop: 'loans', text: 'Needs cash urgently, plus their whole contact list', label: 'REPORTED', caseId: 'india-loan-apps-harassment', note: 'Reported harassment of borrowers’ contacts by illegal loan apps.' },
  { stop: 'taxi', text: 'Accepts almost every job offered', label: 'WHAT-IF', caseId: 'dubal-wage-discrimination-2023', note: 'Our illustration of what drivers and researchers describe; no real formula is public.' },
  { stop: 'garage', text: 'Brakes hard and drives late at night', label: 'DOCUMENTED', caseId: 'gm-onstar-2026', note: 'FTC alleged GM sold such driving data to consumer reporting agencies.' },
  { stop: 'arcade', text: 'Most likely to watch an ad right after beating a personal best', label: 'REPORTED', caseId: 'block-blast-analysis-2026', note: 'One analyst’s reverse-engineering of a puzzle game’s rules.' },
  { stop: 'vault', text: 'Password reused on another site', label: 'DOCUMENTED', caseId: '23andme-2023', note: 'Credential stuffing exposed relatives’ data at 23andMe.' },
];

/** FICTIONAL bidders with ILLUSTRATIVE bids. They stand for kinds of buyer, not real companies. */
export const BIDDERS = [
  { id: 'insurer', name: 'An insurer', wants: ['garage', 'pharmacy', 'track'], color: '#5aa9ff' },
  { id: 'lender', name: 'A lender', wants: ['loans', 'market', 'vault'], color: '#ff9fb2' },
  { id: 'retailer', name: 'A retailer', wants: ['market', 'home', 'arcade'], color: '#ffb547' },
  { id: 'campaign', name: 'A political campaign', wants: ['cafe', 'square'], color: '#c9a7ff' },
  { id: 'screener', name: 'A background-check firm', wants: ['vault', 'cafe', 'square'], color: '#9cf5c8' },
];
