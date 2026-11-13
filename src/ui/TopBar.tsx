import type { Route } from '../router';
import { RequestCounter } from './RequestCounter';

const ACTS: { path: string; name: Route['name']; label: string }[] = [
  { path: '#/mirror', name: 'mirror', label: '1 · Mirror' },
  { path: '#/city', name: 'city', label: '2 · City' },
  { path: '#/tower', name: 'tower', label: '3 · Broker Tower' },
  { path: '#/lab', name: 'lab', label: '4 · Auditor’s Lab' },
  { path: '#/myths', name: 'myths', label: 'Myths' },
  { path: '#/exit', name: 'exit', label: 'What you can do' },
  { path: '#/library', name: 'library', label: 'Case Library' },
];

export function TopBar({ route }: { route: Route }) {
  return (
    <header className="topbar">
      <a className="brand" href="#/">The <span>Glass</span> City</a>
      <nav className="acts" aria-label="Sections">
        {ACTS.map((a) => (
          <a key={a.name} href={a.path} aria-current={route.name === a.name ? 'page' : undefined}>
            {a.label}
          </a>
        ))}
      </nav>
      <div className="spacer" />
      <nav className="acts" aria-label="About">
        <a href="#/about" aria-current={route.name === 'about' ? 'page' : undefined}>About &amp; method</a>
      </nav>
      <RequestCounter />
    </header>
  );
}
