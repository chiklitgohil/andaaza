// Reads what any ordinary website can read about this browser WITHOUT asking permission.
// Everything stays in this tab's memory. Nothing is stored or sent anywhere.

export type SignalGroup = 'device' | 'locale' | 'graphics' | 'hardware' | 'network' | 'settings';

export interface Signal {
  id: string;
  label: string;
  group: SignalGroup;
  /** human-readable value, or null when this browser does not expose it */
  value: string | null;
  api: string;
  /** what this could help a site infer (plain language) */
  reveals: string;
  /** browser support note when relevant */
  support?: string;
}

const nav = navigator as Navigator & {
  deviceMemory?: number;
  connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean; type?: string };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
  userAgentData?: { brands?: { brand: string; version: string }[]; platform?: string; mobile?: boolean };
};

/** FNV-1a 32-bit hash: turns long strings into a short, comparable code. */
export function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function canvasHash(): string | null {
  try {
    const c = document.createElement('canvas');
    c.width = 240;
    c.height = 60;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.textBaseline = 'top';
    ctx.font = "16px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Glass City \u{1F50D} 0.1+0.2', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Glass City \u{1F50D} 0.1+0.2', 4, 17);
    ctx.beginPath();
    ctx.arc(50, 30, 20, 0, Math.PI * 2);
    ctx.stroke();
    return fnv1a(c.toDataURL());
  } catch {
    return null;
  }
}

async function audioHash(): Promise<string | null> {
  try {
    const AC = (window as unknown as { OfflineAudioContext?: typeof OfflineAudioContext }).OfflineAudioContext;
    if (!AC) return null;
    const ctx = new AC(1, 5000, 44100);
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 10000;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -50;
    comp.knee.value = 40;
    comp.ratio.value = 12;
    comp.attack.value = 0;
    comp.release.value = 0.25;
    osc.connect(comp);
    comp.connect(ctx.destination);
    osc.start(0);
    const buf = await ctx.startRendering();
    const data = buf.getChannelData(0);
    let sum = 0;
    for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
    return fnv1a(sum.toString());
  } catch {
    return null;
  }
}

function webgl(): { vendor: string | null; renderer: string | null } {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return { vendor: null, renderer: null };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { vendor: String(vendor), renderer: String(renderer) };
  } catch {
    return { vendor: null, renderer: null };
  }
}

const FONT_CANDIDATES = [
  'Arial', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Courier New',
  'Georgia', 'Helvetica Neue', 'Impact', 'Lucida Console', 'Lucida Grande', 'Menlo', 'Monaco',
  'Palatino Linotype', 'Segoe UI', 'SF Pro Text', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
  'Verdana', 'Ubuntu', 'DejaVu Sans', 'Noto Sans', 'Roboto', 'Nirmala UI', 'Mangal', 'Kokila',
  'Gill Sans', 'Futura', 'Avenir', 'Optima', 'Garamond', 'Franklin Gothic Medium', 'Liberation Sans',
];

function detectFonts(): string[] {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (!ctx) return [];
    const text = 'mmmmmmmmmmlliWW@#0123';
    const bases = ['monospace', 'sans-serif', 'serif'];
    const baseW = bases.map((b) => {
      ctx.font = `72px ${b}`;
      return ctx.measureText(text).width;
    });
    return FONT_CANDIDATES.filter((f) =>
      bases.some((b, i) => {
        ctx.font = `72px '${f}', ${b}`;
        return ctx.measureText(text).width !== baseW[i];
      }),
    );
  } catch {
    return [];
  }
}

function mq(q: string): boolean {
  try {
    return window.matchMedia(q).matches;
  } catch {
    return false;
  }
}

export async function collectSignals(): Promise<Signal[]> {
  const gl = webgl();
  const fonts = detectFonts();
  const tz = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return null;
    }
  })();
  const offset = -new Date().getTimezoneOffset() / 60;
  let battery: string | null = null;
  if (typeof nav.getBattery === 'function') {
    try {
      const b = await nav.getBattery();
      battery = `${Math.round(b.level * 100)}%${b.charging ? ', charging' : ', not charging'}`;
    } catch {
      battery = null;
    }
  }
  const conn = nav.connection;
  const audio = await audioHash();
  const brands = nav.userAgentData?.brands?.filter((b) => !/not.?a.?brand/i.test(b.brand)).map((b) => `${b.brand} ${b.version}`);

  const s: Signal[] = [
    {
      id: 'ua', label: 'Browser and operating system', group: 'device',
      value: brands && brands.length ? `${brands.join(', ')} on ${nav.userAgentData?.platform ?? 'unknown OS'}` : navigator.userAgent,
      api: 'navigator.userAgent / userAgentData',
      reveals: 'Your device family and OS version. Orbitz used Mac vs PC to re-rank hotels (2012).',
    },
    {
      id: 'screen', label: 'Screen size', group: 'device',
      value: `${screen.width} × ${screen.height} (window ${innerWidth} × ${innerHeight})`,
      api: 'screen.width / innerWidth',
      reveals: 'Device class (laptop, big monitor), and combined with other values, helps single you out.',
    },
    {
      id: 'dpr', label: 'Pixel density', group: 'device',
      value: `${window.devicePixelRatio}×`,
      api: 'window.devicePixelRatio',
      reveals: 'Whether you have a high-resolution (often more expensive) display.',
    },
    {
      id: 'lang', label: 'Languages', group: 'locale',
      value: (navigator.languages || [navigator.language]).join(', '),
      api: 'navigator.languages',
      reveals: 'Languages you read, which can hint at where you are from.',
    },
    {
      id: 'tz', label: 'Time zone', group: 'locale',
      value: tz ? `${tz} (UTC${offset >= 0 ? '+' : ''}${offset})` : null,
      api: 'Intl.DateTimeFormat().resolvedOptions()',
      reveals: 'Your rough region, even without location permission.',
    },
    {
      id: 'clock', label: 'Local time right now', group: 'locale',
      value: new Date().toLocaleTimeString(),
      api: 'new Date()',
      reveals: 'When you are browsing. Late-night sessions are a known marketing signal.',
    },
    {
      id: 'cores', label: 'CPU cores', group: 'hardware',
      value: navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : null,
      api: 'navigator.hardwareConcurrency',
      reveals: 'How powerful (and roughly how new or costly) your computer is.',
    },
    {
      id: 'memory', label: 'Device memory (rounded)', group: 'hardware',
      value: nav.deviceMemory ? `${nav.deviceMemory} GB or more` : null,
      api: 'navigator.deviceMemory',
      reveals: 'Another hint at device price class.',
      support: 'Only Chromium browsers (Chrome, Edge, Opera) expose this.',
    },
    {
      id: 'gpu', label: 'Graphics chip', group: 'graphics',
      value: gl.renderer ? `${gl.renderer}${gl.vendor ? ` (${gl.vendor})` : ''}` : null,
      api: 'WebGL WEBGL_debug_renderer_info',
      reveals: 'Often your exact GPU model. Safari reports only "Apple GPU"; Firefox rounds it into buckets.',
    },
    {
      id: 'canvas', label: 'Canvas drawing fingerprint', group: 'graphics',
      value: canvasHash(),
      api: 'canvas.toDataURL()',
      reveals: 'Tiny differences in how your machine draws text and shapes. Found on 14,371 of the top 1 million sites in a 2016 Princeton crawl.',
    },
    {
      id: 'audio', label: 'Audio processing fingerprint', group: 'graphics',
      value: audio,
      api: 'OfflineAudioContext',
      reveals: 'Tiny differences in how your machine processes sound, without playing any sound.',
    },
    {
      id: 'fonts', label: 'Installed fonts (of 36 tested)', group: 'device',
      value: fonts.length ? `${fonts.length}: ${fonts.join(', ')}` : null,
      api: 'canvas measureText()',
      reveals: 'Fonts installed by your OS and apps (for example Office or design tools).',
    },
    {
      id: 'battery', label: 'Battery', group: 'hardware',
      value: battery,
      api: 'navigator.getBattery()',
      reveals: 'Battery level and charging. Researchers showed in 2015 that it could act as a short-term tracking ID.',
      support: 'Firefox removed this in version 52 (2017) for privacy reasons; Safari never shipped it; Chrome still has it.',
    },
    {
      id: 'net', label: 'Network type', group: 'network',
      value: conn ? `${conn.effectiveType ?? '?'}${conn.downlink ? `, ~${conn.downlink} Mbps` : ''}${conn.rtt ? `, ${conn.rtt} ms` : ''}${conn.saveData ? ', data saver on' : ''}` : null,
      api: 'navigator.connection',
      reveals: 'Rough connection quality.',
      support: 'Only Chromium browsers expose this.',
    },
    {
      id: 'theme', label: 'Dark mode', group: 'settings',
      value: mq('(prefers-color-scheme: dark)') ? 'on' : 'off',
      api: 'matchMedia(prefers-color-scheme)',
      reveals: 'A personal preference. Small, but every bit narrows the crowd.',
    },
    {
      id: 'motion', label: 'Reduce motion setting', group: 'settings',
      value: mq('(prefers-reduced-motion: reduce)') ? 'on' : 'off',
      api: 'matchMedia(prefers-reduced-motion)',
      reveals: 'An accessibility setting. Accessibility settings can be sensitive.',
    },
    {
      id: 'touch', label: 'Touch points', group: 'device',
      value: String(navigator.maxTouchPoints ?? 0),
      api: 'navigator.maxTouchPoints',
      reveals: 'Whether you have a touchscreen.',
    },
    {
      id: 'dnt', label: '"Do Not Track" setting', group: 'settings',
      value: navigator.doNotTrack === '1' ? 'on' : navigator.doNotTrack === '0' ? 'off' : 'not set',
      api: 'navigator.doNotTrack',
      reveals: 'Ironically, turning this on makes you slightly more distinctive. Most sites ignore it.',
    },
  ];
  return s;
}

/** A combined code built from all exposed values: the kind of ID a tracker could compute. */
export function combinedId(signals: Signal[]): string {
  return fnv1a(signals.filter((s) => s.id !== 'clock').map((s) => `${s.id}=${s.value}`).join('|'));
}
