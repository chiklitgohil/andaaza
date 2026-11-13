import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { collectSignals, combinedId, type Signal } from '../../fingerprint/collect';
import { Sculpture } from './Sculpture';
import { ReplayOverlay, useSessionRecorder } from './SessionReplay';
import { LabelChip } from '../../ui/LabelChip';
import { useStore } from '../../store';

const UNIQUENESS = [
  { study: 'Eckersley (EFF Panopticlick), 2010: 470,161 browsers', pct: 83.6, note: 'Volunteers who chose to visit a privacy test site.', url: 'https://coveryourtracks.eff.org/static/browser-uniqueness.pdf' },
  { study: 'Laperdrix et al. (AmIUnique), IEEE S&P 2016: 118,934 fingerprints', pct: 89.4, note: 'Also volunteers on a privacy test site.', url: 'https://hal.science/hal-01285470' },
  { study: 'Gómez-Boix et al., The Web Conference 2018: 2,067,942 fingerprints', pct: 33.6, note: 'Ordinary visitors to a large general French website.', url: 'https://hal.science/hal-01718234' },
];

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#0a1120" roughness={0.35} metalness={0.6} />
      </mesh>
      <gridHelper args={[18, 36, '#1c2b47', '#121c30']} position={[0, 0.005, 0]} />
      {/* the mirror */}
      <group position={[0, 1.9, -2.6]}>
        <mesh>
          <boxGeometry args={[3.3, 3.9, 0.12]} />
          <meshStandardMaterial color="#1a2337" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.0, 3.6]} />
          <meshStandardMaterial color="#0d1626" metalness={1} roughness={0.05} emissive="#0a1830" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {/* pedestal */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.9, 6]} />
        <meshStandardMaterial color="#121b2d" flatShading metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 6]} />
        <meshBasicMaterial color="#7fe3ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function MirrorRoom() {
  const reducedMotion = useStore((s) => s.reducedMotion);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [visible, setVisible] = useState(0);
  const [crystallised, setCrystallised] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [replaying, setReplaying] = useState(false);
  const [replayStats, setReplayStats] = useState<{ moves: number; clicks: number; seconds: number } | null>(null);
  const rec = useSessionRecorder(30000);

  useEffect(() => {
    let cancelled = false;
    collectSignals().then((s) => { if (!cancelled) setSignals(s); });
    return () => { cancelled = true; };
  }, []);

  // reveal one signal at a time, like a scan
  useEffect(() => {
    if (!signals.length || visible >= signals.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), reducedMotion ? 0 : 220);
    return () => clearTimeout(t);
  }, [signals, visible, reducedMotion]);

  const idCode = useMemo(() => (signals.length ? combinedId(signals) : ''), [signals]);
  const exposed = signals.filter((s) => s.value !== null).length;
  const scanDone = signals.length > 0 && visible >= signals.length;
  const activeSignal = signals.find((s) => s.id === active) ?? null;

  return (
    <div className="stage">
      <Canvas camera={{ position: [0, 2.2, 6.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#060a13']} />
        <fog attach="fog" args={['#060a13', 8, 18]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 4, 2]} intensity={30} color="#9fd8ff" />
        <pointLight position={[-3, 1, -1]} intensity={12} color="#c9a7ff" />
        <Room />
        <Sculpture
          signals={signals}
          visibleCount={visible}
          crystallised={crystallised}
          activeId={active}
          onSelect={(id) => setActive((a) => (a === id ? null : id))}
          reducedMotion={reducedMotion}
          idCode={idCode}
        />
        <OrbitControls
          target={[0, 1.6, 0]}
          enablePan={false}
          minDistance={3.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={crystallised && !reducedMotion}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      <div className="mirror-ui">
        <section className="panel mirror-head" aria-labelledby="mirror-title">
          <p className="muted small" style={{ margin: 0 }}>Act 1</p>
          <h2 id="mirror-title">The Mirror Room</h2>
          <p className="small">
            Before you even log in, any website can quietly read these values from your browser, without asking
            permission. This page is reading them <strong>right now</strong>, on your machine only.{' '}
            <LabelChip label="DOCUMENTED" compact />
          </p>
          <p className="small muted" style={{ marginBottom: 0 }}>
            {scanDone ? `${exposed} of ${signals.length} values exposed by this browser.` : `Scanning… ${visible}/${signals.length || '…'}`}
            {' '}Nothing is saved or sent. Drag to look around; click a crystal.
          </p>
        </section>

        <section className="panel list-panel" aria-label="What your browser exposes">
          <ul className="signal-list">
            {signals.slice(0, visible).map((s) => (
              <li key={s.id}>
                <button
                  className={`signal ${active === s.id ? 'active' : ''}`}
                  onClick={() => setActive((a) => (a === s.id ? null : s.id))}
                  aria-expanded={active === s.id}
                >
                  <span className="s-label"><span>{s.label}</span><code>{s.api}</code></span>
                  <span className={`s-value ${s.value === null ? 'none' : ''}`}>
                    {s.value ?? 'Not exposed by this browser'}
                  </span>
                  {active === s.id && (
                    <span className="signal-detail">
                      <span className="layer-tag layer-inferred" style={{ marginRight: 6 }}>COULD REVEAL</span>
                      {s.reveals}
                      {s.support && <span className="muted">{s.support}</span>}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {scanDone && !crystallised && (
          <section className="panel">
            <p className="small">
              Each value alone is ordinary. Combined, they can act like a name tag that follows you from site to
              site, even with cookies cleared. This is called <strong>browser fingerprinting</strong>.
            </p>
            <button className="btn" onClick={() => setCrystallised(true)}>Combine them into a fingerprint</button>
          </section>
        )}

        {crystallised && (
          <>
            <section className="panel id-card" aria-live="polite">
              <p className="small muted" style={{ marginBottom: 4 }}>Your browser&rsquo;s combined code (computed locally)</p>
              <div className="id-code">{idCode.toUpperCase()}</div>
              <p className="small muted" style={{ margin: '6px 0 0' }}>
                Change one setting and it changes. The sculpture&rsquo;s shape is built from these exact values.
              </p>
            </section>

            <section className="panel twist" aria-labelledby="twist-title">
              <h3 id="twist-title">
                The twist: are you really &ldquo;unique&rdquo;? <LabelChip label="DOCUMENTED" compact />
              </h3>
              <p className="small">
                You often hear that 90% of browsers are unique. That number came from people who visited a
                privacy test site. In a big ordinary crowd, far fewer were unique:
              </p>
              <div className="uniq-bars">
                {UNIQUENESS.map((u) => (
                  <div key={u.study}>
                    <div className="uniq-row">
                      <span><a href={u.url} target="_blank" rel="noreferrer noopener">{u.study}</a></span>
                      <strong>{u.pct}%</strong>
                    </div>
                    <div className="uniq-bar" aria-hidden="true"><div style={{ width: `${u.pct}%` }} /></div>
                    <div className="muted" style={{ fontSize: '0.74rem' }}>{u.note}</div>
                  </div>
                ))}
              </div>
              <p className="small" style={{ marginBottom: 0 }}>
                Honest takeaway: fingerprinting is real and widely deployed (canvas fingerprinting was found on
                14,371 of the top 1 million sites in a 2016 Princeton crawl), but how identifying it is depends on
                the crowd. We cannot tell you how unique <em>you</em> are without collecting other people&rsquo;s
                data, so we don&rsquo;t.
              </p>
            </section>

            <section className="panel" aria-labelledby="replay-title">
              <h3 id="replay-title">And it&rsquo;s not just your device. <LabelChip label="DOCUMENTED" compact /></h3>
              <p className="small">
                &ldquo;Session replay&rdquo; scripts record your mouse movements, clicks and typing so a company
                can watch your visit like a video. In 2017, Princeton researchers found them on 482 of the top
                50,000 websites, and saw some capture card numbers and a prescription name.
              </p>
              {replayStats ? (
                <p className="small" role="status">
                  That was you: {replayStats.moves} movements and {replayStats.clicks} clicks from the last{' '}
                  {replayStats.seconds} seconds, kept only in this tab&rsquo;s memory. A real replay script would
                  send this to a server.
                </p>
              ) : null}
              <div className="btn-row">
                <button className="btn ghost" onClick={() => { setReplayStats(null); setReplaying(true); }} disabled={replaying}>
                  Replay my last 30 seconds
                </button>
                <a className="small" href="https://blog.citp.princeton.edu/2017/11/15/no-boundaries-exfiltration-of-personal-data-by-session-replay-scripts/" target="_blank" rel="noreferrer noopener">
                  Source: Princeton CITP, 2017
                </a>
              </div>
            </section>

            <section className="panel">
              <p className="small">
                A website sees your device. An app on your phone sees far more: your location, your contacts, what
                you buy and when. Let&rsquo;s walk through a day.
              </p>
              <a className="btn" href="#/city">Enter the Glass City →</a>
            </section>
          </>
        )}
      </div>

      {activeSignal && <span className="sr-only" aria-live="polite">{activeSignal.label}: {activeSignal.value ?? 'not exposed'}</span>}
      {replaying && (
        <ReplayOverlay
          points={rec.current}
          onDone={(s) => { setReplaying(false); setReplayStats(s); }}
        />
      )}
    </div>
  );
}
