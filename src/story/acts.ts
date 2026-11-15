// The day, as a scroll timeline. progress 0..1 maps to 06:40 → 00:10 and to Arun's position on his loop.

export interface Beat {
  at: number;          // scroll progress where this narration card is centred
  time: string;
  lines: string[];     // second person, short
}

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
  { id: 'game', at: atTime('23:30'), time: '23:30', title: 'One more game', prompt: 'Stack · your best: 400', ready: true },
];

export const BEATS: Beat[] = [
  { at: atTime('06:15'), time: '06:15', lines: ['THE LAST MILE', 'You are Arun. Ahmedabad. 06:15.', 'Scroll to start your day.'] },
  { at: atTime('06:32'), time: '06:32', lines: ['The bag is on your back. The scooter coughs, then starts.', 'Your phone is the only boss you will see today.'] },
  { at: atTime('08:00'), time: '08:00', lines: ['The city wakes up hungry.'] },
  { at: atTime('11:30'), time: '11:30', lines: ['The sun climbs. So does the temperature.'] },
  { at: atTime('15:00'), time: '15:00', lines: ['43°C. The road shimmers.'] },
  { at: atTime('18:00'), time: '18:00', lines: ['Evening rush. Everyone wants dinner at once.'] },
  { at: atTime('20:30'), time: '20:30', lines: ['The clouds that waited all afternoon finally break.'] },
  { at: atTime('21:10'), time: '21:10', lines: ['Last order of the night. On the ring road, the front tyre goes soft. Then flat.'] },
  { at: atTime('21:30'), time: '21:30', lines: ['The puncture shop is pulling its shutter down.', 'Home is 6 kilometres away. Your phone: 6%.'] },
  { at: atTime('22:40'), time: '22:40', lines: ['Home. Shoes off. Your legs are still riding.'] },
  { at: atTime('00:10'), time: '00:10', lines: ['The city keeps ordering.', 'Tomorrow, you go online again at 06:50.'] },
];
