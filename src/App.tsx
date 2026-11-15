import { lazy, Suspense } from 'react';
import { Overlay } from './ui/Overlay';
import { useScrollEngine, SCREENS } from './story/useScrollEngine';
import { hasWebGL } from './ui/webgl';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { useStory } from './story/store';

const World = lazy(() => import('./world/World'));

export default function App() {
  useScrollEngine();
  const phase = useStory((s) => s.phase);
  return (
    <>
      <div className={`world-wrap ${phase === 'phone' || phase === 'surface' || phase === 'debrief' ? 'dim' : ''}`}>
        {hasWebGL() ? (
          <ErrorBoundary resetKey="world">
            <Suspense fallback={null}><World /></Suspense>
          </ErrorBoundary>
        ) : (
          <div className="no3d">3D is not available in this browser. The story still works; the city just won&rsquo;t be drawn.</div>
        )}
      </div>
      <Overlay />
      {/* the scroll track: its height is the length of Arun's day */}
      <div className="track" style={{ height: `${SCREENS * 100}vh` }} aria-hidden="true" />
    </>
  );
}
