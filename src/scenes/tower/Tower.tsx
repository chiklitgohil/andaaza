import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';
import { STOPS, STOP_BY_ID } from '../../data/stops';
import { casesForStop } from '../../data';
import { LabelChip, IllustrativeTag } from '../../ui/LabelChip';
import { CaseCard } from '../../ui/CaseCard';
import { BIDDERS, FRAGMENTS, type Fragment } from './fragments';

function Shell() {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.6, 8, 6]} />
          <meshBasicMaterial color="#c9a7ff" transparent opacity={0.25 - i * 0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[8, 8, 14, 6, 1, true]} />
        <meshBasicMaterial color="#c9a7ff" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 6]} />
        <meshStandardMaterial color="#0d0f22" />
      </mesh>
    </group>
  );
}

/** A translucent figure made of the fragments that have arrived. */
function Figure({ frags, assembled, reducedMotion }: { frags: Fragment[]; assembled: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (group.current && !reducedMotion) group.current.rotation.y += dt * 0.15; });
  const slots = useMemo(() => frags.map((_, i) => {
    // place shards on a body-like silhouette
    const t = i / Math.max(1, frags.length);
    const y = 0.8 + t * 3.6;
    const r = y > 3.6 ? 0.45 : y > 2.4 ? 0.85 : 0.55;
    const a = i * 2.39996;
    return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  }), [frags]);
  const fill = Math.min(1, assembled / Math.max(1, frags.length));
  return (
    <group ref={group}>
      {/* body silhouette */}
      <mesh position={[0, 4.1, 0]}><sphereGeometry args={[0.55, 16, 12]} /><meshStandardMaterial color="#c9a7ff" transparent opacity={0.08 + fill * 0.25} emissive="#c9a7ff" emissiveIntensity={fill * 0.6} /></mesh>
      <mesh position={[0, 2.4, 0]}><capsuleGeometry args={[0.8, 1.8, 6, 12]} /><meshStandardMaterial color="#c9a7ff" transparent opacity={0.06 + fill * 0.2} emissive="#c9a7ff" emissiveIntensity={fill * 0.5} /></mesh>
      {frags.map((f, i) => (
        <Shard key={`${f.stop}-${i}`} target={slots[i]} on={i < assembled} color={STOP_BY_ID[f.stop]?.color ?? '#fff'} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

function Shard({ target, on, color, reducedMotion }: { target: THREE.Vector3; on: boolean; color: string; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 14, -4, (Math.random() - 0.5) * 14), []);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const goal = on ? target : start;
    m.position.lerp(goal, reducedMotion ? 1 : 1 - Math.pow(0.05, dt));
    if (!reducedMotion) m.rotation.y += dt;
  });
  return (
    <mesh ref={ref} position={start.toArray()}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} flatShading />
    </mesh>
  );
}

function BidderPads({ bids, active }: { bids: Record<string, number>; active: boolean }) {
  return (
    <group>
      {BIDDERS.map((b, i) => {
        const a = (i / BIDDERS.length) * Math.PI * 2 + 0.3;
        const x = Math.cos(a) * 5.6, z = Math.sin(a) * 5.6;
        const bid = bids[b.id] ?? 0;
        return (
          <group key={b.id} position={[x, 0, z]}>
            <mesh position={[0, 0.3 + bid / 400, 0]}>
              <cylinderGeometry args={[0.6, 0.7, 0.6 + bid / 200, 6]} />
              <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={active ? 0.7 : 0.2} transparent opacity={0.8} flatShading />
            </mesh>
            <Html position={[0, 1.8 + bid / 200, 0]} center distanceFactor={14} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
              <div className="bldg-label" style={{ borderColor: b.color }}>{b.name}{active ? ` · ${bid} pts` : ''}</div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function Tower() {
  const visited = useStore((s) => s.visited);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const usingDefault = visited.length === 0;
  const stopsUsed = usingDefault ? STOPS.map((s) => s.id) : visited;
  const frags = useMemo(() => FRAGMENTS.filter((f) => stopsUsed.includes(f.stop)), [stopsUsed]);
  const [assembled, setAssembled] = useState(0);
  const [assembling, setAssembling] = useState(false);
  const [bids, setBids] = useState<Record<string, number>>({});
  const [auction, setAuction] = useState(false);
  const [showFloors, setShowFloors] = useState(false);

  useEffect(() => {
    if (!assembling) return;
    if (assembled >= frags.length) { setAssembling(false); return; }
    const t = setTimeout(() => setAssembled((n) => n + 1), reducedMotion ? 0 : 350);
    return () => clearTimeout(t);
  }, [assembling, assembled, frags.length, reducedMotion]);

  // ILLUSTRATIVE auction: each bidder values fragments from the stops it "wants".
  useEffect(() => {
    if (!auction) return;
    const target: Record<string, number> = {};
    BIDDERS.forEach((b) => {
      const n = frags.filter((f) => b.wants.includes(f.stop)).length;
      target[b.id] = 10 + n * 35;
    });
    let step = 0;
    const id = setInterval(() => {
      step++;
      setBids(Object.fromEntries(BIDDERS.map((b) => [b.id, Math.round((target[b.id] * Math.min(step, 12)) / 12)])));
      if (step >= 12) clearInterval(id);
    }, reducedMotion ? 1 : 120);
    return () => clearInterval(id);
  }, [auction, frags, reducedMotion]);

  const winner = auction ? BIDDERS.reduce((a, b) => ((bids[b.id] ?? 0) > (bids[a.id] ?? 0) ? b : a), BIDDERS[0]) : null;
  const towerCases = casesForStop('tower');

  return (
    <div className="stage">
      <Canvas camera={{ position: [0, 9, 18], fov: 50 }} dpr={[1, 1.75]}>
        <color attach="background" args={['#07061a']} />
        <fog attach="fog" args={['#07061a', 14, 30]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 9, 0]} intensity={60} color="#c9a7ff" />
        <pointLight position={[6, 2, 6]} intensity={20} color="#7fe3ff" />
        <Shell />
        <Figure frags={frags} assembled={assembled} reducedMotion={reducedMotion} />
        <BidderPads bids={bids} active={auction} />
        <OrbitControls target={[0, 2.6, 0]} enablePan={false} minDistance={7} maxDistance={18} maxPolarAngle={Math.PI / 2.05} />
      </Canvas>

      <div className="mirror-ui" style={{ width: 460 }}>
        <section className="panel">
          <p className="muted small" style={{ margin: 0 }}>Act 3</p>
          <h2 style={{ fontSize: '1.5rem' }}>The Broker Tower</h2>
          <p className="small">
            Data brokers buy and combine scraps from many sources into a profile, then sell it. Here, the scraps
            come from {usingDefault ? <>every place in the city (you have not opened any yet, so we use a <em>typical</em> day)</> : <>the {visited.length} places you opened</>}.
          </p>
          <div className="btn-row">
            <button className="btn" onClick={() => { setAssembled(0); setAssembling(true); setAuction(false); setBids({}); }} disabled={assembling}>
              {assembled ? 'Rebuild my profile' : 'Assemble my profile'}
            </button>
            <button className="btn ghost" disabled={assembled < frags.length || assembling} onClick={() => setAuction(true)}>Put it up for auction</button>
          </div>
        </section>

        <section className="panel list-panel" aria-live="polite">
          <h3>Your profile <span className="muted small">({Math.min(assembled, frags.length)} / {frags.length} fragments)</span></h3>
          <p className="small muted">
            Each line is something that, in a real case, was collected or inferred and sold or shared. No single
            company holds all of these. That is the point: brokers stitch them together.
          </p>
          <ul className="signal-list">
            {frags.slice(0, assembled).map((f, i) => (
              <li key={i} className="signal" style={{ cursor: 'default' }}>
                <span className="s-label"><span>{STOP_BY_ID[f.stop]?.icon} {STOP_BY_ID[f.stop]?.name}</span><LabelChip label={f.label} compact /></span>
                <span className="s-value" style={{ color: STOP_BY_ID[f.stop]?.color }}>{f.text}</span>
                <span className="signal-detail">{f.note} {f.caseId && <a href={`#/library/${f.caseId}`}>Case</a>}</span>
              </li>
            ))}
          </ul>
        </section>

        {auction && (
          <section className="panel" role="status">
            <h3>The auction <IllustrativeTag /></h3>
            <p className="small">
              The bidders are <LabelChip label="FICTIONAL" compact /> types of buyer, not real companies, and the
              points are invented. Highest interest here: <strong style={{ color: winner?.color }}>{winner?.name}</strong>.
            </p>
            <p className="small">
              <LabelChip label="DOCUMENTED" compact /> Real price points: a researcher was quoted <strong>$275 for
              5,000 aggregated records</strong> of mental-health data, and subscriptions of <strong>$75,000 to
              $100,000 a year</strong> (Duke, 2023). In ad auctions, a firm can collect bidding data even when it
              doesn&rsquo;t win: the FTC alleged Mobilewalla did exactly this.
            </p>
            <p className="small muted">
              Most real profiles are bought for advertising. The FTC cases show other buyers too, including
              government contractors (X-Mode) and firms that supply insurers (GM).
            </p>
          </section>
        )}

        <section className="panel">
          <button className="btn ghost small" onClick={() => setShowFloors((s) => !s)} aria-expanded={showFloors}>
            {showFloors ? '▾' : '▸'} Upper floors: faces, browsing and pricing algorithms ({towerCases.length} cases)
          </button>
          {showFloors && <div style={{ marginTop: 10 }}>{towerCases.map((c) => <CaseCard key={c.id} c={c} compact />)}</div>}
          <div className="btn-row" style={{ marginTop: 10 }}>
            <a className="btn" href="#/lab">Next: can you prove any of this? →</a>
            <a className="btn ghost small" href="#/city">Back to the city</a>
          </div>
        </section>
      </div>
    </div>
  );
}
