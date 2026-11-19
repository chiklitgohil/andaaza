// The whole soundscape is synthesised in the browser with the Web Audio API: no audio files,
// nothing downloaded, nothing sent. It stays silent until the visitor turns sound on.
import { useStory } from '../story/store';
import { hourAt } from '../story/acts';
import { rainAt } from '../world/daylight';
import { HOME_AT as HOME, PUNCTURE_AT as PUNCTURE, modeAt, type Mode } from '../story/timeline';
export const END_AT = 0.985;

let ctx: AudioContext | null = null;
let enabled = false;
let master: GainNode, world: GainNode, muffle: BiquadFilterNode, sfxBus: GainNode;
let noiseBuf: AudioBuffer;
const layer: Record<string, GainNode> = {};
const engOsc: OscillatorNode[] = [];
let engFilter: BiquadFilterNode;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------- building blocks ----------
function noise(dest: AudioNode) {
  const s = ctx!.createBufferSource();
  s.buffer = noiseBuf; s.loop = true;
  s.connect(dest); s.start(0, Math.random() * 2);
  return s;
}
function filt(type: BiquadFilterType, freq: number, q = 0.7) {
  const f = ctx!.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f;
}
function gain(v = 0) { const g = ctx!.createGain(); g.gain.value = v; return g; }
function chain(...n: (AudioNode | AudioParam)[]) {
  // the last link may be an AudioParam (an LFO modulating a frequency or a gain)
  for (let i = 0; i < n.length - 1; i++) (n[i] as AudioNode).connect(n[i + 1] as AudioNode);
  return n[0] as AudioNode;
}
function panner(p: number) { const s = ctx!.createStereoPanner(); s.pan.value = p; return s; }
function target(param: AudioParam, v: number, tc = 0.25) { param.setTargetAtTime(v, ctx!.currentTime, tc); }

/** A short enveloped tone. */
function tone(freq: number, dur: number, vol: number, o: { type?: OscillatorType; to?: number; pan?: number; at?: number; attack?: number; dest?: AudioNode; lp?: number } = {}) {
  if (!ctx || !enabled) return;
  const t = ctx.currentTime + (o.at ?? 0);
  const osc = ctx.createOscillator();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
  const g = gain(0);
  const a = o.attack ?? 0.005;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dur);
  const nodes: AudioNode[] = [osc];
  if (o.lp) nodes.push(filt('lowpass', o.lp));
  nodes.push(g, panner(o.pan ?? 0), o.dest ?? sfxBus);
  chain(...nodes);
  osc.start(t); osc.stop(t + a + dur + 0.05);
}

/** A short enveloped burst of filtered noise. */
function burst(dur: number, vol: number, o: { type?: BiquadFilterType; freq?: number; to?: number; q?: number; pan?: number; at?: number; attack?: number; dest?: AudioNode; panTo?: number } = {}) {
  if (!ctx || !enabled) return;
  const t = ctx.currentTime + (o.at ?? 0);
  const f = filt(o.type ?? 'bandpass', o.freq ?? 1000, o.q ?? 0.8);
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
  const g = gain(0);
  const a = o.attack ?? 0.005;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dur);
  const p = panner(o.pan ?? 0);
  if (o.panTo != null) { p.pan.setValueAtTime(o.pan ?? 0, t); p.pan.linearRampToValueAtTime(o.panTo, t + a + dur); }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  chain(s, f, g, p, o.dest ?? sfxBus);
  s.start(t, Math.random() * 1.5); s.stop(t + a + dur + 0.05);
}

// ---------- the world bed ----------
function build() {
  ctx = new AudioContext();
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  master = gain(0); chain(master, comp, ctx.destination);
  muffle = filt('lowpass', 18000, 0.5);
  world = gain(1); chain(world, muffle, master);
  sfxBus = gain(1.6); sfxBus.connect(master);

  const bed = (name: string, ...f: AudioNode[]) => { layer[name] = gain(0); chain(...f, layer[name], world); noise(f[0]); };
  bed('city', filt('lowpass', 300));                        // the low rumble of a city
  bed('hiss', filt('bandpass', 900, 0.5));                  // tyres and wind
  bed('rain', filt('highpass', 1100), filt('lowpass', 7500));
  bed('rainLow', filt('lowpass', 200));
  bed('car', filt('lowpass', 110));                         // inside a taxi
  bed('fan', filt('bandpass', 150, 2.5));                   // the ceiling fan in Arun's room

  // the scooter: two detuned oscillators with a putter
  engFilter = filt('lowpass', 380, 3);
  const trem = gain(0.75);
  layer.engine = gain(0);
  chain(engFilter, trem, layer.engine, world);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 11;
  const lfoAmt = gain(4); chain(lfo, lfoAmt);
  const flutter = ctx.createOscillator(); flutter.frequency.value = 23;
  const flAmt = gain(0.25); chain(flutter, flAmt, trem.gain);
  for (const [type, mul] of [['sawtooth', 1], ['square', 2.02]] as [OscillatorType, number][]) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = 44 * mul;
    const g = gain(type === 'square' ? 0.25 : 0.5);
    chain(o, g, engFilter); lfoAmt.connect(o.frequency);
    o.start(); engOsc.push(o);
  }
  lfo.start(); flutter.start();

  schedule(horn, 2500);
  schedule(birds, 3000);
  schedule(crickets, 900);
  schedule(thunder, 9000);
  schedule(bell, 6000);
  schedule(passBy, 2000);
  requestAnimationFrame(tick);
  useStory.subscribe(onStory);
  addEventListener('pointerdown', onPointer, true);
  addEventListener('input', onInput, true);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend(); else if (enabled) void ctx.resume();
  });
}

let lastP = 0, lastT = performance.now(), speed = 0;
let lastMode: Mode = 'scooter';
function tick() {
  requestAnimationFrame(tick);
  if (!ctx || !enabled) return;
  const s = useStory.getState();
  const p = s.progress, h = hourAt(p);
  const now = performance.now(), dt = Math.max(0.001, (now - lastT) / 1000);
  const v = Math.abs(p - lastP) / dt;
  lastP = p; lastT = now;
  speed += (clamp01(v / 0.035) - speed) * Math.min(1, dt * 3);

  const inPhone = s.phase === 'phone' || s.phase === 'surface' || s.phase === 'debrief';
  const end = p >= END_AT && s.phase === 'ride';
  const home = p >= HOME;
  const mode = modeAt(p, s.done);
  const room = mode === 'room';
  const riding = mode === 'scooter' && (s.phase === 'ride' || s.phase === 'buzz');
  if ((mode === 'taxi') !== (lastMode === 'taxi')) sfx.car(mode === 'taxi');   // in the back seat: rumble and wipers
  lastMode = mode;
  target(layer.fan.gain, room ? 0.05 : 0, 0.6);
  const rain = rainAt(p);
  const t = traffic(h) * (home ? 0.25 : 1);

  target(layer.city.gain, 0.06 + 0.24 * t);
  target(layer.hiss.gain, 0.012 + (riding ? 0.09 : 0.02) * speed + 0.02 * t);
  target(layer.rain.gain, rain * (home ? 0.06 : 0.12), 0.8);
  target(layer.rainLow.gain, rain * 0.1, 0.8);
  target(layer.engine.gain, riding ? 0.08 + 0.16 * speed : 0, 0.15);
  const f = 40 + 38 * speed;
  target(engOsc[0].frequency, f, 0.2); target(engOsc[1].frequency, f * 2.02, 0.2);
  target(engFilter.frequency, 300 + 500 * speed, 0.2);
  target(world.gain, end ? 0.6 : inPhone ? 0.55 : room ? 0.7 : 1, 0.4);
  target(muffle.frequency, inPhone ? 650 : s.phase === 'dive' ? 1800 : room ? 900 : 18000, 0.3); // walls muffle the street
}

/** How busy the street is at a given hour (0..1). */
function traffic(h: number) {
  if (h < 7) return 0.25 + (h - 6.25) * 0.6;
  if (h < 20.5) return h > 14 && h < 16 ? 0.8 : 1;
  return Math.max(0.15, 1 - (h - 20.5) * 0.35);
}

function schedule(fn: () => number, first: number) {
  const run = () => { const next = fn(); setTimeout(run, next); };
  setTimeout(run, first);
}
function ambientOk() {
  if (!ctx || !enabled || document.hidden) return null;
  const s = useStory.getState();
  return { s, h: hourAt(s.progress), rain: rainAt(s.progress), home: s.progress >= HOME, out: s.phase === 'ride' || s.phase === 'buzz' };
}

// ---------- random street events ----------
function horn() {
  const a = ambientOk();
  if (!a || !a.out || a.home) return 2000;
  const t = traffic(a.h);
  if (Math.random() < 0.35 + 0.5 * t + 0.3 * speed) {
    const pan = rnd(-0.9, 0.9), far = rnd(0.25, 1);
    const kind = pick(['scooter', 'car', 'auto', 'truck']);
    const n = Math.random() < 0.5 ? 1 : Math.random() < 0.6 ? 2 : 3;
    const base = { scooter: 520, car: 410, auto: 690, truck: 250 }[kind]!;
    const len = kind === 'truck' ? rnd(0.4, 0.7) : rnd(0.09, 0.28);
    for (let i = 0; i < n; i++) {
      const at = i * (len + 0.07);
      tone(base, len, 0.022 * far, { type: 'square', pan, at, attack: 0.01, lp: kind === 'auto' ? 1600 : 2400, dest: world });
      tone(base * 1.26, len, 0.016 * far, { type: 'square', pan, at, attack: 0.01, lp: 2400, dest: world });
    }
  }
  return rnd(1800, 6500) / (0.4 + t);
}

function birds() {
  const a = ambientOk();
  if (!a || !a.out || a.home || a.rain > 0.15) return 2500;
  const dawn = a.h < 9.5, day = a.h < 18;
  if (dawn || (day && Math.random() < 0.25)) {
    const pan = rnd(-0.8, 0.8), base = rnd(2600, 4200), n = Math.floor(rnd(2, 6));
    for (let i = 0; i < n; i++) {
      const at = i * rnd(0.09, 0.16);
      tone(base * rnd(0.9, 1.1), rnd(0.04, 0.09), dawn ? 0.018 : 0.01, { pan, at, to: base * rnd(1.2, 1.6), dest: world });
    }
  }
  return dawn ? rnd(700, 2200) : rnd(3000, 8000);
}

function crickets() {
  const a = ambientOk();
  if (!a || a.h < 20.3 || a.rain > 0.45) return 1500;
  const pan = rnd(-0.9, 0.9), f = rnd(4300, 4800), vol = rnd(0.008, 0.016) * (a.home ? 1.5 : 1);
  for (let i = 0; i < 3; i++) tone(f, 0.022, vol, { pan, at: i * 0.045, attack: 0.003, dest: world });
  return rnd(250, 900);
}

function thunder() {
  const a = ambientOk();
  if (!a || a.rain < 0.55) return 6000;
  const pan = rnd(-0.6, 0.6);
  burst(0.25, 0.08, { type: 'highpass', freq: 1500, pan, dest: world });
  burst(rnd(2.5, 4.5), 0.4, { type: 'lowpass', freq: 160, to: 50, q: 0.5, pan, attack: 0.12, at: 0.05, dest: world });
  return rnd(14000, 30000);
}

function bell() {
  const a = ambientOk();
  if (!a || !a.out || a.h > 7.4) return 8000;
  const pan = rnd(0.3, 0.8), base = 540;
  for (const [m, v] of [[1, 0.02], [2.0, 0.01], [2.76, 0.008], [5.4, 0.004]]) tone(base * m, 2.8, v, { pan, dest: world });
  return rnd(5000, 11000);
}

function passBy() {
  const a = ambientOk();
  if (!a || !a.out || a.home) return 2000;
  const t = traffic(a.h);
  if (Math.random() < t * (0.3 + speed)) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    burst(rnd(0.9, 1.6), 0.05 * t, { freq: rnd(400, 700), to: rnd(200, 350), q: 0.6, pan: -0.9 * dir, panTo: 0.9 * dir, attack: 0.5, dest: world });
  }
  return rnd(900, 3500);
}

// ---------- story events ----------
let buzzTimer = 0;
let lastProgress = 0;
let endPlayed = false;
function onStory(st: ReturnType<typeof useStory.getState>, prev: ReturnType<typeof useStory.getState>) {
  if (st.phase !== prev.phase) {
    clearInterval(buzzTimer);
    if (st.phase === 'buzz') { phoneBuzz(); buzzTimer = window.setInterval(phoneBuzz, 2600); }
    if (st.phase === 'dive') sfx.whoosh();
    if (st.phase === 'phone') sfx.unlock();
    if (st.phase === 'surface') tone(520, 0.6, 0.03, { to: 390, attack: 0.05 });
    if (st.phase === 'debrief') burst(0.18, 0.03, { type: 'highpass', freq: 3000 });
  }
  if (lastProgress < PUNCTURE && st.progress >= PUNCTURE && st.progress < PUNCTURE + 0.02 && enabled) {
    burst(0.06, 0.25, { type: 'lowpass', freq: 900 });
    burst(2.2, 0.06, { type: 'highpass', freq: 2500, at: 0.05, attack: 0.05 });
  }
  if (st.progress >= END_AT && st.phase === 'ride') { if (!endPlayed) { endPlayed = true; sfx.pad(); } }
  else if (st.progress < END_AT - 0.01) endPlayed = false;
  lastProgress = st.progress;
}

function phoneBuzz() {
  if (!ctx || !enabled) return;
  for (const at of [0, 0.45]) tone(150, 0.3, 0.07, { type: 'square', lp: 260, at, attack: 0.02 });
  tone(1320, 0.12, 0.03, { at: 0.95 }); tone(1760, 0.25, 0.03, { at: 1.07 });
}

// ---------- interface ----------
let lastInput = 0;
function onPointer(e: Event) {
  const el = (e.target as HTMLElement | null)?.closest?.('button:not(:disabled), [role="radio"], input[type="checkbox"]');
  if (el && !el.classList.contains('g-piece')) sfx.click();
}
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  if (el?.type !== 'range' || performance.now() - lastInput < 45) return;
  lastInput = performance.now();
  const k = (+el.value - +el.min) / Math.max(1, +el.max - +el.min);
  tone(500 + 900 * k, 0.025, 0.02, { type: 'triangle' });
}

let adTimer = 0, droneNodes: AudioScheduledSourceNode[] = [], droneGain: GainNode | null = null;
const PENTA = [523, 587, 659, 784, 880, 1047, 1175, 1319];

export const sfx = {
  click: () => tone(1900, 0.03, 0.025, { type: 'triangle' }),
  ping: () => { tone(1175, 0.1, 0.035); tone(1568, 0.22, 0.035, { at: 0.09 }); },
  chat: () => tone(880, 0.07, 0.03, { to: 1250 }),
  cash: () => { tone(2093, 0.08, 0.03, { type: 'triangle' }); tone(2637, 0.3, 0.03, { type: 'triangle', at: 0.07 }); burst(0.05, 0.03, { type: 'highpass', freq: 5000 }); },
  error: () => { tone(330, 0.12, 0.035, { type: 'square', lp: 1400 }); tone(247, 0.22, 0.035, { type: 'square', lp: 1400, at: 0.13 }); },
  success: () => [660, 880, 1320].forEach((f, i) => tone(f, 0.18, 0.03, { at: i * 0.08 })),
  shutter: () => { burst(0.03, 0.1, { type: 'highpass', freq: 3000 }); burst(0.04, 0.08, { type: 'highpass', freq: 2200, at: 0.07 }); },
  tick: () => burst(0.015, 0.06, { freq: 3200, q: 4 }),
  /** A clock tick that tightens as time runs out (k: 0 = plenty of time, 1 = almost gone); a heartbeat joins near the end. */
  clock: (k: number) => {
    const f = 1150 + 950 * k;
    burst(0.025, 0.08 + 0.1 * k, { freq: f, q: 7 });
    tone(f / 2, 0.045, 0.012 + 0.03 * k, { type: 'square', lp: 2000 });
    if (k > 0.6) { tone(62, 0.16, 0.06 * k, { to: 44 }); tone(58, 0.14, 0.045 * k, { to: 42, at: 0.18 }); }
  },
  /** A new order lands: the phone buzzes against your leg, then pings. */
  order: () => { burst(0.22, 0.07, { type: 'lowpass', freq: 160, q: 2 }); burst(0.22, 0.07, { type: 'lowpass', freq: 160, q: 2, at: 0.3 }); tone(1175, 0.1, 0.04, { at: 0.12 }); tone(1568, 0.2, 0.04, { at: 0.2 }); },
  whoosh: () => burst(1.4, 0.09, { freq: 300, to: 2600, q: 1.2, attack: 1.0 }),
  unlock: () => { tone(988, 0.06, 0.03); tone(1480, 0.12, 0.03, { at: 0.06 }); },
  reveal: () => { burst(0.9, 0.05, { freq: 2400, to: 300, q: 1.5, attack: 0.05 }); tone(110, 1.4, 0.05, { type: 'sawtooth', lp: 400, attack: 0.2 }); },
  place: () => { tone(260, 0.08, 0.06, { to: 150 }); burst(0.02, 0.04, { freq: 2500, q: 2 }); },
  clear: (lines: number) => {
    for (let i = 0; i < 2 + lines * 2; i++) tone(PENTA[Math.min(PENTA.length - 1, i)], 0.2, 0.035, { type: 'triangle', at: i * 0.055 });
    burst(0.5, 0.03, { type: 'highpass', freq: 4000, to: 9000, attack: 0.02 });
  },
  over: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.35, 0.04, { type: 'triangle', at: i * 0.16 })),
  adStart: () => {
    clearInterval(adTimer);
    let i = 0;
    const tune = [523, 659, 784, 1047, 784, 659, 880, 784];
    adTimer = window.setInterval(() => { if (enabled) tone(tune[i++ % tune.length], 0.1, 0.022, { type: 'square', lp: 3000 }); }, 150);
  },
  adStop: () => clearInterval(adTimer),
  /** A low machine hum while the back of the phone is open. */
  drone: (on: boolean) => {
    if (!ctx) return;
    if (!on) {
      if (droneGain) { const g = droneGain, ns = droneNodes; target(g.gain, 0, 0.4); setTimeout(() => ns.forEach((n) => n.stop()), 1500); }
      droneGain = null; droneNodes = [];
      return;
    }
    if (droneGain) return;
    droneGain = gain(0);
    const lp = filt('lowpass', 320, 4);
    chain(lp, droneGain, sfxBus);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13;
    const amt = gain(140); chain(lfo, amt, lp.frequency); lfo.start();
    droneNodes.push(lfo);
    for (const f of [55, 82.4, 110.6]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start(); droneNodes.push(o); }
    target(droneGain.gain, 0.05, 1.2);
  },
  /** Inside the taxi: road rumble, wipers, the driver's phone. */
  car: (on: boolean) => {
    if (!ctx) return;
    target(layer.car.gain, on ? 0.22 : 0, 0.5);
    clearInterval(carTimer);
    if (on) {
      let n = 0;
      carTimer = window.setInterval(() => {
        if (!enabled) return;
        burst(0.35, 0.03, { freq: 1600, to: 700, q: 0.8, pan: n % 2 ? 0.4 : -0.4 });
        tone(70, 0.08, 0.04, { at: 0.33 });
        if (++n % 7 === 0) sfx.ping();
      }, 1150);
    }
  },
  /** A warm chord for the end of the day. */
  pad: () => [196, 247, 294, 370, 440].forEach((f, i) => tone(f, 5, 0.018, { type: 'triangle', attack: 1.8, at: i * 0.12 })),
};
let carTimer = 0;

// ---------- on / off ----------
export function setSound(on: boolean) {
  enabled = on;
  if (on && !ctx) build();
  if (!ctx) return;
  if (on) { void ctx.resume(); target(master.gain, 1.5, 0.2); }
  else { target(master.gain, 0, 0.1); sfx.adStop(); clearInterval(buzzTimer); setTimeout(() => { if (!enabled) void ctx?.suspend(); }, 600); }
}

// Sound is on by default, but browsers only let a page play sound after the visitor's first click, tap or key press.
// Building the audio graph waits for that moment (scrolling alone does not count).
const GESTURES = ['pointerdown', 'keydown', 'touchend'] as const;
function firstGesture() {
  GESTURES.forEach((e) => removeEventListener(e, firstGesture, true));
  if (useStory.getState().sound && !enabled) setSound(true);
}
GESTURES.forEach((e) => addEventListener(e, firstGesture, true));

// dev only: lets the test harness read levels (stripped from the production build)
if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__snd = { get ctx() { return ctx; }, get master() { return master; }, layer, story: useStory };
