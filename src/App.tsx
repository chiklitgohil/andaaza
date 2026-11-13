import { lazy, Suspense, useEffect } from 'react';
import { useRoute } from './router';
import { TopBar } from './ui/TopBar';
import { Intro } from './ui/Intro';
import { hasWebGL } from './ui/webgl';
import { NoWebGL } from './ui/NoWebGL';
import { ErrorBoundary } from './ui/ErrorBoundary';

const MirrorRoom = lazy(() => import('./scenes/mirror/MirrorRoom'));
const City = lazy(() => import('./scenes/city/City'));
const Tower = lazy(() => import('./scenes/tower/Tower'));
const Lab = lazy(() => import('./scenes/lab/Lab'));
const Myths = lazy(() => import('./pages/Myths'));
const Exit = lazy(() => import('./pages/Exit'));
const Library = lazy(() => import('./pages/Library'));
const About = lazy(() => import('./pages/About'));

const TITLES: Record<string, string> = {
  intro: 'The Glass City',
  mirror: 'Mirror Room · The Glass City',
  city: 'The City · The Glass City',
  tower: 'Broker Tower · The Glass City',
  lab: 'Auditor’s Lab · The Glass City',
  myths: 'Myths · The Glass City',
  exit: 'What you can do · The Glass City',
  library: 'Case Library · The Glass City',
  about: 'About & method · The Glass City',
};

export default function App() {
  const route = useRoute();
  const webgl = hasWebGL();
  const needs3D = ['mirror', 'city', 'tower'].includes(route.name);

  useEffect(() => {
    document.title = TITLES[route.name] ?? 'The Glass City';
  }, [route.name]);

  return (
    <div className="app">
      <TopBar route={route} />
      <main id="main">
        <ErrorBoundary resetKey={route.name}>
        <Suspense fallback={<div className="loading">Loading…</div>}>
          {route.name === 'intro' && <Intro />}
          {needs3D && !webgl && <NoWebGL />}
          {route.name === 'mirror' && webgl && <MirrorRoom />}
          {route.name === 'city' && webgl && <City stop={route.stop} />}
          {route.name === 'tower' && webgl && <Tower />}
          {route.name === 'lab' && <Lab />}
          {route.name === 'myths' && <Myths />}
          {route.name === 'exit' && <Exit />}
          {route.name === 'library' && <Library caseId={route.caseId} />}
          {route.name === 'about' && <About />}
        </Suspense>
        </ErrorBoundary>
      </main>
      <div className="notice-small-screen panel small" role="note">
        The Glass City is designed for a laptop or desktop screen. On a small screen, the{' '}
        <a href="#/library">Case Library</a> works best.
      </div>
    </div>
  );
}
