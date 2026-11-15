// The scroll does not have to keep the clock's pace. The taxi ride home is given more scroll than its hour,
// so the drive can be felt; on screen the taxi still moves at the scooter's pace (see world/path.ts).
import { HOME_AT, RIDE_AT } from './timeline';

export const TAXI_STRETCH = 4;                              // scroll per minute in the taxi, relative to the rest of the day
const EXTRA = (HOME_AT - RIDE_AT) * (TAXI_STRETCH - 1);
const TOTAL = 1 + EXTRA;
const TAXI_END = RIDE_AT + (HOME_AT - RIDE_AT) * TAXI_STRETCH;

/** Page height in viewport heights: the original 16, plus room for the longer taxi ride. */
export const SCREENS = Math.round(16 * TOTAL);

/** Story progress (0..1, follows the clock) → scroll position (0..1). */
export function scrollOf(p: number) {
  const q = Math.min(1, Math.max(0, p));
  const inTaxi = Math.min(Math.max(q - RIDE_AT, 0), HOME_AT - RIDE_AT);
  return (q + inTaxi * (TAXI_STRETCH - 1)) / TOTAL;
}

/** Scroll position (0..1) → story progress. */
export function progressOf(u: number) {
  const s = Math.min(1, Math.max(0, u)) * TOTAL;
  if (s <= RIDE_AT) return s;
  if (s <= TAXI_END) return RIDE_AT + (s - RIDE_AT) / TAXI_STRETCH;
  return s - EXTRA;
}
