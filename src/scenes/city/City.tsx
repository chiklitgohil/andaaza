import { useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { STOPS, STOP_BY_ID } from '../../data/stops';
import { useStore } from '../../store';
import { go } from '../../router';
import { Building, Filler } from './Buildings';
import { CameraRig, Packets, TowerSilhouette } from './Flows';
import { StopDrawer } from './StopDrawer';
import { LabelChip } from '../../ui/LabelChip';

/** Sky and light colours through the day, keyed by hour. */
function skyFor(hour: number) {
  if (hour < 8) return { bg: '#1b2440', light: '#ffd9b0', amb: 0.45 };
  if (hour < 17) return { bg: '#16304f', light: '#ffffff', amb: 0.6 };
  if (hour < 20) return { bg: '#2a1d3d', light: '#ffb38a', amb: 0.45 };
  return { bg: '#070b16', light: '#9fb8ff', amb: 0.3 };
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#0a1222" />
      </mesh>
      <gridHelper args={[72, 18, '#22385e', '#142440']} position={[0, 0.005, 0]} />
      {/* main roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.2, 72]} />
        <meshBasicMaterial color="#1a2a48" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.2, 72]} />
        <meshBasicMaterial color="#1a2a48" />
      </mesh>
    </group>
  );
}

export default function City({ stop }: { stop?: string }) {
  const visited = useStore((s) => s.visited);
  const markVisited = useStore((s) => s.markVisited);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const active = stop ? STOP_BY_ID[stop] ?? null : null;

  const open = useCallback((id: string) => {
    markVisited(id);
    go(`city/${id}`);
  }, [markVisited]);
  const close = useCallback(() => go('city'), []);

  const hour = active ? parseInt(active.time, 10) : 11;
  const sky = skyFor(hour);
  const avoid = useMemo(() => STOPS.map((s) => s.pos), []);
  const nextUnvisited = STOPS.find((s) => !visited.includes(s.id));

  return (
    <div className="stage">
      <Canvas camera={{ position: [0, 34, 40], fov: 45, near: 0.5, far: 200 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <color attach="background" args={[sky.bg]} />
        <fog attach="fog" args={[sky.bg, 45, 110]} />
        <ambientLight intensity={sky.amb} />
        <directionalLight position={[20, 30, 10]} intensity={1.1} color={sky.light} />
        <hemisphereLight args={['#7fa8ff', '#0a1222', 0.35]} />
        <Ground />
        <Filler avoid={avoid} />
        {STOPS.map((s) => (
          <Building key={s.id} s={s} active={active?.id === s.id} visited={visited.includes(s.id)} onOpen={open} showLabel={!active || active.id === s.id} />
        ))}
        <TowerSilhouette glow={visited.length} />
        <Packets stops={STOPS} visited={visited} reducedMotion={reducedMotion} />
        <CameraRig target={active} reducedMotion={reducedMotion} />
      </Canvas>

      {!active && (
        <nav className="panel city-ui-left" aria-label="Places in the city">
          <p className="muted small" style={{ margin: 0 }}>Act 2</p>
          <h2 style={{ fontSize: '1.4rem' }}>The Glass City</h2>
          <p className="small">
            One ordinary day, eleven places. Open a building to see what it collects, what can be inferred and
            what is done. <LabelChip label="FICTIONAL" compact /> marks story elements; the cases inside are real.
          </p>
          <div className="time-of-day"><span>Visited {visited.length} / {STOPS.length}</span><span>Click a building or choose below</span></div>
          <ul className="stop-list">
            {STOPS.map((s) => (
              <li key={s.id}>
                <button className="stop-btn" onClick={() => open(s.id)}>
                  <span className="stop-icon" style={{ background: `${s.color}22`, color: s.color }} aria-hidden="true">{s.icon}</span>
                  <span>
                    <span className="stop-name">{s.time} · {s.name}</span>
                    <span className="stop-sub">{s.subtitle}</span>
                  </span>
                  {visited.includes(s.id) && <span className="visited" aria-label="visited">✓</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="panel" style={{ marginTop: 12, padding: 12, background: 'rgba(201,167,255,0.07)' }}>
            <p className="small" style={{ marginBottom: 8 }}>
              Every place you open sends <span style={{ color: 'var(--collected)' }}>● signals</span> to the Broker
              Tower and gets <span style={{ color: 'var(--done)' }}>◆ decisions</span> back.
            </p>
            <a className={`btn ${visited.length >= 3 ? '' : 'ghost'} small`} href="#/tower">
              {visited.length >= 3 ? 'Enter the Broker Tower →' : `Broker Tower (visit ${3 - visited.length} more first, or go anyway)`}
            </a>
          </div>
        </nav>
      )}

      {active && (
        <>
          <StopDrawer stop={active} onClose={close} />
          <div className="city-hint" role="note">
            <button className="btn ghost small" onClick={close}>← Back to map</button>{' '}
            {nextUnvisited && nextUnvisited.id !== active.id && (
              <button className="btn small" onClick={() => open(nextUnvisited.id)}>Next: {nextUnvisited.name} →</button>
            )}
          </div>
        </>
      )}
      {!active && (
        <div className="city-hint">Drag-free view · click a building · <span className="kbd">Tab</span> through the list on the left</div>
      )}
    </div>
  );
}
