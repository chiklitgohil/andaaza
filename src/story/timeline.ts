// The story's fixed moments, shared by the 3D world, the camera and the sound.
// Kept free of three.js so the sound engine can use it without pulling in the renderer.
import { atTime } from './acts';

export const PUNCTURE_AT = atTime('21:10'); // front tyre goes flat
export const SHOP_AT = atTime('21:30');     // he has pushed the scooter to the tyre shop
export const RIDE_AT = atTime('21:40');     // books a cab (the ride act)
export const HOME_AT = atTime('22:40');     // the taxi drops him home (the arrive act)
export const ROOM_AT = atTime('22:50');     // inside, on his bed

export type Mode = 'scooter' | 'pushing' | 'waiting' | 'taxi' | 'arrived' | 'room';

/** What Arun is doing at this point of the day. The taxi exists only once the ride has been booked (or skipped). */
export function modeAt(p: number, done: Record<string, boolean>): Mode {
  if (p < PUNCTURE_AT) return 'scooter';
  if (p < SHOP_AT) return 'pushing';
  if (p < HOME_AT) return done.ride ? 'taxi' : 'waiting';
  if (p < ROOM_AT) return 'arrived';
  return 'room';
}
