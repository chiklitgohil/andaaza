// The places in the Glass City. Each stop is one mechanism. FICTIONAL framing,
// real cases inside (pulled from data/cases by the `stops` field).

export interface Stop {
  id: string;
  name: string;
  icon: string;          // a single glyph, decorative
  time: string;          // time of day in the visitor's walk (FICTIONAL framing)
  subtitle: string;
  color: string;
  /** grid position in the city (x, z) */
  pos: [number, number];
  kind: 'pharmacy' | 'square' | 'home' | 'garage' | 'market' | 'taxi' | 'arcade' | 'loans' | 'cafe' | 'vault' | 'track';
  /** a FICTIONAL first-person moment that opens the stop */
  moment: string;
  /** the generic mechanism, in three layers */
  flow: { collected: string; inferred: string; done: string };
  /** an optional mini-game living here */
  game?: { id: 'puppet' | 'stackshift' | 'dispatcher'; label: string };
}

export const STOPS: Stop[] = [
  {
    id: 'home', name: 'Home', icon: '⌂', time: '07:10', kind: 'home',
    subtitle: 'Smart TV, speaker, doorbell camera', color: '#ffcf6e', pos: [-14, -10],
    moment: 'You wake up, ask the speaker for the weather, and the TV is already on in the background.',
    flow: {
      collected: 'What is on your screen, every few seconds; voice commands; doorbell video.',
      inferred: 'What you watch, when you are home, who lives with you.',
      done: 'Sold for ad targeting and audience measurement; kept for training algorithms.',
    },
  },
  {
    id: 'track', name: 'Running Track', icon: '◎', time: '07:45', kind: 'track',
    subtitle: 'Fitness apps and "anonymous" data', color: '#9cf5c8', pos: [-3, -16],
    moment: 'A quick run. Your watch records the route and shares it to a public leaderboard.',
    flow: {
      collected: 'GPS traces, heart rate, motion sensors.',
      inferred: 'Where you live and work; patterns that single you out, even with no name attached.',
      done: 'Published as "anonymous" maps; studied by researchers who show how easily it re-identifies.',
    },
  },
  {
    id: 'pharmacy', name: 'Pharmacy & Clinic', icon: '✚', time: '09:00', kind: 'pharmacy',
    subtitle: 'Health apps and tracking pixels', color: '#ff8a8a', pos: [8, -12],
    moment: 'You use a discount app for a prescription and book a doctor’s appointment online.',
    flow: {
      collected: 'Medications, symptoms, period and pregnancy logs, therapy intake answers, appointment clicks.',
      inferred: 'Health conditions, pregnancy, mental-health status.',
      done: 'Passed to advertising platforms through pixels and SDKs; sold by brokers.',
    },
  },
  {
    id: 'square', name: 'Town Square', icon: '✦', time: '10:30', kind: 'square',
    subtitle: 'Location data and sensitive places', color: '#7fe3ff', pos: [16, -2],
    moment: 'You pass a place of worship, a clinic and a protest. Your phone is in your pocket the whole time.',
    flow: {
      collected: 'Precise location from apps and ad auctions, many times an hour.',
      inferred: 'Religion, health visits, political activity, home and work.',
      done: 'Packaged into audience segments and sold, including to government contractors.',
    },
  },
  {
    id: 'market', name: 'Supermarket', icon: '▤', time: '12:15', kind: 'market',
    subtitle: 'Prices, ranking and dark patterns', color: '#ffb547', pos: [6, 6],
    moment: 'You order groceries and almost sign up for a subscription you didn’t mean to.',
    flow: {
      collected: 'Device, location, what you browse, what you leave in the cart.',
      inferred: 'How much you might be willing to pay; how easily you can be nudged.',
      done: 'Different prices or rankings; interfaces designed to push you towards "yes".',
    },
    game: { id: 'puppet', label: 'Cut the strings (dark patterns)' },
  },
  {
    id: 'cafe', name: 'Social Café', icon: '☕', time: '13:30', kind: 'cafe',
    subtitle: 'Social media, feeds and ad delivery', color: '#c9a7ff', pos: [-6, 4],
    moment: 'Lunch. You scroll your feed, take a quiz, and see an ad for a job.',
    flow: {
      collected: 'Profile, friends, likes, contacts you upload, the phone number you gave for security.',
      inferred: 'Personality, politics, sexuality, who is "relevant" for an ad.',
      done: 'Targeted ads, experiments on your feed, skewed delivery of job and housing ads.',
    },
  },
  {
    id: 'loans', name: 'Loan Office', icon: '₹', time: '15:00', kind: 'loans',
    subtitle: 'Contacts, credit and caller ID', color: '#ff9fb2', pos: [-16, 6],
    moment: 'A friend is short of money and installs an instant-loan app. It asks for their contacts.',
    flow: {
      collected: 'Contact lists, photos, call logs.',
      inferred: 'Who in your life can be used to pressure you.',
      done: 'In reported cases: harassment of the borrower’s contacts. Now banned by India’s RBI and Google Play.',
    },
  },
  {
    id: 'taxi', name: 'Taxi Stand', icon: '⛟', time: '18:20', kind: 'taxi',
    subtitle: 'Ride-hail prices and drivers’ pay', color: '#5aa9ff', pos: [14, 12],
    moment: 'Going home. You and a friend open the same ride app and see different fares.',
    flow: {
      collected: 'Trip request, time, location, phone, history; for drivers, every accepted and declined job.',
      inferred: 'Demand, urgency, which promotions to show; what pay a driver will accept.',
      done: 'Variable fares and "discounts"; variable, opaque pay for workers.',
    },
    game: { id: 'dispatcher', label: 'Play the dispatcher' },
  },
  {
    id: 'garage', name: 'Garage', icon: '⚙', time: '19:00', kind: 'garage',
    subtitle: 'Connected cars and insurance', color: '#b9c6ff', pos: [-12, 16],
    moment: 'You park. The car has been quietly scoring how you brake.',
    flow: {
      collected: 'Speed, braking, acceleration, late-night driving, location.',
      inferred: 'Driving risk.',
      done: 'Sold to data firms used by insurers.',
    },
  },
  {
    id: 'arcade', name: 'Arcade', icon: '◆', time: '21:00', kind: 'arcade',
    subtitle: 'Games, kids and attention design', color: '#ff6fb5', pos: [2, 18],
    moment: 'One more round of a puzzle game before bed. You are so close to your high score.',
    flow: {
      collected: 'Scores, play sessions, ads watched, purchases; children’s data.',
      inferred: 'When you are most engaged, and how much an ad shown to you is worth.',
      done: 'Rewards and difficulty tuned to keep you playing; children tracked for ads.',
    },
    game: { id: 'stackshift', label: 'Play Stack Shift' },
  },
  {
    id: 'vault', name: 'Data Vault', icon: '▣', time: '23:00', kind: 'vault',
    subtitle: 'Breaches: when collected data escapes', color: '#9aa4b2', pos: [-2, -4],
    moment: 'Late at night, a message: "Your data may have been involved in a security incident."',
    flow: {
      collected: 'Everything above, stored somewhere.',
      inferred: 'Not needed. Stolen data is valuable as it is.',
      done: 'Leaked, sold, used for fraud. The more that is collected, the more there is to lose.',
    },
  },
];

export const STOP_BY_ID = Object.fromEntries(STOPS.map((s) => [s.id, s]));
/** Extra stop ids that are not city buildings but can hold cases. */
export const OTHER_STOPS = ['mirror', 'tower', 'lab'];
export const ALL_STOP_IDS = [...STOPS.map((s) => s.id), ...OTHER_STOPS];
