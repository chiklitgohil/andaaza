import * as THREE from 'three';

// Arun's rented room is built away from the street, so it never collides with the city.
// Units match the street (a character is about 1.5 units tall). The camera cuts here at 22:50.
export const ROOM_ORIGIN = new THREE.Vector3(0, 0, -400);
const at = (x: number, y: number, z: number) => ROOM_ORIGIN.clone().add(new THREE.Vector3(x, y, z));

export const ROOM = {
  w: 5, d: 4.2, h: 2.9,               // interior size (x, z, height)
  seat: at(-1.96, 0, -1.5),           // on the mattress, back against the headboard
  seatY: 0.42,                        // hips at mattress height (the sit pose's own offset)
  yaw: 0,                             // legs along the bed, towards the door and the camera
  camFar: at(1.9, 1.75, 1.9),         // from the doorway
  camNear: at(0.55, 1.45, 0.8),       // pushed in by 23:30, just before the phone buzzes
  look: at(-1.9, 0.9, -1.1),
};
