import { useEffect, useState } from 'react';

export type Route =
  | { name: 'intro' }
  | { name: 'mirror' }
  | { name: 'city'; stop?: string }
  | { name: 'tower' }
  | { name: 'lab' }
  | { name: 'myths' }
  | { name: 'exit' }
  | { name: 'library'; caseId?: string }
  | { name: 'about' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [head, arg] = parts;
  switch (head) {
    case 'mirror': return { name: 'mirror' };
    case 'city': return { name: 'city', stop: arg };
    case 'tower': return { name: 'tower' };
    case 'lab': return { name: 'lab' };
    case 'myths': return { name: 'myths' };
    case 'exit': return { name: 'exit' };
    case 'library': return { name: 'library', caseId: arg };
    case 'about': return { name: 'about' };
    default: return { name: 'intro' };
  }
}

export function go(path: string) {
  window.location.hash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
