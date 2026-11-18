// The day, as a scroll timeline. progress 0..1 maps to 06:40 → 00:10 and to Arun's position on his loop.

export interface Beat {
  at: number;          // scroll progress where this narration card is centred
  time: string;
  lines: string[];     // second person, short
  ask?: Feel;          // a question in Arun's shoes, answered with one tap while you scroll (never scored)
}

/** A "what would you do / how does it feel" moment. There is no right answer; each reply is what it costs Arun. */
export interface Feel { id: string; k: string; q: string; options: string[]; replies: string[] }

export interface Act {
  id: string;
  at: number;          // scroll progress where the phone buzzes (scroll locks here)
  time: string;
  title: string;
  prompt: string;      // what the phone says when it buzzes
  ready: boolean;      // built yet?
}

export const START_HOUR = 6 + 15 / 60;
export const END_HOUR = 24 + 10 / 60;
export const hourAt = (p: number) => START_HOUR + p * (END_HOUR - START_HOUR);
export const clock = (p: number) => {
  const h = hourAt(p);
  const hh = Math.floor(h) % 24, mm = Math.floor((h % 1) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

/** Scroll progress for a clock time like "21:40" (times after midnight wrap). */
export const atTime = (hm: string) => { const [h, m] = hm.split(":").map(Number); const hr = (h < 6 ? h + 24 : h) + m / 60; return (hr - START_HOUR) / (END_HOUR - START_HOUR); };

export const ACTS: Act[] = [
  { id: 'verify', at: atTime('06:50'), time: '06:50', title: 'Verify it’s you', prompt: 'Tap to go online', ready: true },
  { id: 'offer', at: atTime('09:30'), time: '09:30', title: 'The offer', prompt: 'New order! 15 s to accept', ready: true },
  { id: 'wait', at: atTime('13:05'), time: '13:05', title: 'Ready in 2 minutes', prompt: 'Arrived at restaurant', ready: true },
  { id: 'tip', at: atTime('17:30'), time: '17:30', title: 'The tip', prompt: 'Your customer added a tip!', ready: true },
  { id: 'strike', at: atTime('18:58'), time: '18:58', title: 'Log off at 7', prompt: '₹150/order tonight only!', ready: true },
  { id: 'ride', at: atTime('21:40'), time: '21:40', title: 'The ride home', prompt: 'Battery 6% · Book a ride home?', ready: true },
  { id: 'arrive', at: atTime('22:40'), time: '22:40', title: 'Trip complete', prompt: 'You’ve arrived · Rate your driver', ready: true },
  { id: 'game', at: atTime('23:30'), time: '23:30', title: 'One more game', prompt: 'Stack · your best: 400', ready: true },
];

export const BEATS: Beat[] = [
  { at: atTime('06:15'), time: '06:15', lines: ['Andaaza', 'andaaza (n.) · a guess, an estimate. What your apps make of you.','For the next few minutes, you are Arun, a food delivery rider in Ahmedabad.', 'Scroll to live one day of his life, from 06:15 to midnight. When his phone buzzes, pick it up.'] },
  { at: atTime('06:32'), time: '06:32', lines: ['The bag is on your back. The scooter coughs, then starts.', 'Your phone is the only boss you will see today.'],
    ask: { id: 'mother', k: 'Home for dinner?', q: 'Your mother asks if you’ll be home for dinner.', options: ['“Yes, by nine”', '“I’ll try”'], replies: ['You both know the bonus decides that, not you.', 'She sets a plate aside anyway. She always does.'] } },
  { at: atTime('08:00'), time: '08:00', lines: ['The city wakes up hungry.'] },
  { at: atTime('11:30'), time: '11:30', lines: ['The sun climbs. So does the temperature.'],
    ask: { id: 'toilet', k: 'A toilet, 2 km away', q: 'You need a toilet. The nearest one is 2 km away. An order just landed.', options: ['Hold it', 'Go, and risk the order'], replies: ['You hold it. The order is twelve minutes away.', 'You go. The order goes to someone else. So does the money.'] } },
  { at: atTime('15:00'), time: '15:00', lines: ['43°C. The road shimmers.'],
    ask: { id: 'water', k: 'Water, or the timer', q: 'Your bottle is empty. A shop is 300 m off the route. The timer says six minutes.', options: ['Stop for water', 'Keep riding'], replies: ['You drink it in one go. The app marks you “Delayed”.', 'You keep riding. Your head starts to pound.'] } },
  { at: atTime('18:00'), time: '18:00', lines: ['Evening rush. Everyone wants dinner at once.'],
    ask: { id: 'guard', k: 'The guard at the service lift', q: 'A guard sends you to the service lift and makes you wait. The customer is watching the clock.', options: ['Say something', 'Stay quiet'], replies: ['He shrugs. The customer rates you three stars for being late.', 'You stay polite. A complaint about you costs more than a complaint by you.'] } },
  { at: atTime('20:30'), time: '20:30', lines: ['The clouds that waited all afternoon finally break.'],
    ask: { id: 'rain', k: 'One raincoat', q: 'One raincoat. Who does it cover?', options: ['You', 'The food'], replies: ['You stay dry. The bag leaks. The customer sends a photo of a soggy box.', 'You cover the food. A wet order gets a bad rating. A wet rider gets nothing.'] } },
  { at: atTime('21:10'), time: '21:10', lines: ['Last order of the night. On the ring road, the front tyre goes soft. Then flat.'] },
  { at: atTime('21:20'), time: '21:20', lines: ['You push the scooter. It is heavier with a flat.'] },
  { at: atTime('21:30'), time: '21:30', lines: ['The puncture shop is pulling its shutter down.', 'Home is 6 kilometres away. Your phone: 6%.'],
    ask: { id: 'call', k: 'Six percent battery', q: 'Six percent. Who gets it?', options: ['Call home', 'Save it for the ride app'], replies: ['Your mother picks up on the first ring. Now 4%.', 'You save it. Calling home can wait. Getting home can’t.'] } },
  { at: atTime('22:00'), time: '22:00', lines: ['The scooter stays chained outside the shop.', 'In the back seat, the wipers keep time.'] },
  { at: atTime('22:22'), time: '22:22', lines: ['Mahesh’s phone pings on the dashboard.', 'His next request arrives before you have even got out.'] },
  { at: atTime('22:52'), time: '22:52', lines: ['Your room. Shoes off. The fan clicks.', 'Your legs are still riding. One game, then sleep.'],
    ask: { id: 'why-game', k: 'Why open the game', q: 'You should sleep. You open a game. Why?', options: ['To switch off', 'To win at something', 'Habit'], replies: ['Your thumbs keep working after the rest of you stops.', 'All day an app decided how you did. This one feels like yours.', 'Your hand finds the phone before you decide anything.'] } },
  { at: atTime('00:10'), time: '00:10', lines: ['The city keeps ordering.', 'Tomorrow, you go online again at 06:50.'] },
];
