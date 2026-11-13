// Watches every network resource the page loads, using the browser's own
// Performance API. Nothing is reported anywhere: the numbers are only shown on screen.

export interface RequestEntry {
  url: string;
  sameOrigin: boolean;
  afterStartup: boolean;
  type: string;
}

const entries: RequestEntry[] = [];
const listeners = new Set<() => void>();
let startupDone = false;

function record(e: PerformanceResourceTiming) {
  let sameOrigin = false;
  try {
    sameOrigin = new URL(e.name, location.href).origin === location.origin;
  } catch {
    sameOrigin = e.name.startsWith('data:') || e.name.startsWith('blob:');
  }
  if (e.name.startsWith('data:') || e.name.startsWith('blob:')) return; // in-memory, not network
  entries.push({ url: e.name, sameOrigin, afterStartup: startupDone, type: e.initiatorType });
  listeners.forEach((l) => l());
}

export function startRequestWatch() {
  try {
    const po = new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => record(e as PerformanceResourceTiming));
    });
    po.observe({ type: 'resource', buffered: true });
  } catch {
    /* PerformanceObserver unavailable: counter will show "unknown" */
  }
  const finish = () => setTimeout(() => {
    startupDone = true;
    listeners.forEach((l) => l());
  }, 1500);
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });
}

export function getRequests() {
  return {
    startup: entries.filter((e) => !e.afterStartup),
    after: entries.filter((e) => e.afterStartup),
    thirdParty: entries.filter((e) => !e.sameOrigin),
    startupDone,
  };
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Deliberately try a request so visitors can see the security policy block it. */
export async function tryForbiddenRequest(): Promise<string> {
  try {
    await fetch('https://example.com/should-be-blocked', { mode: 'no-cors' });
    return 'The request was NOT blocked. (You are probably running the development server, which has no security policy.)';
  } catch {
    return 'Blocked. The page’s security policy (connect-src ‘none’) refused to send it.';
  }
}
