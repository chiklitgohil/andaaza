import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ROOM_AT } from '../story/timeline';
import { ACTS, BEATS, clock } from '../story/acts';
import { useStory } from '../story/store';
import { jumpTo } from '../story/useScrollEngine';
import { DebriefPanel } from './Debrief';
import { getRequests, subscribe } from './requestWatch';
import { Epilogue } from './Epilogue';
import { setSound } from '../audio/sound';

function toggleSound(on?: boolean) {
  const next = on ?? !useStory.getState().sound;
  setSound(next);
  useStory.setState({ sound: next });
}

function SoundButton() {
  const sound = useStory((s) => s.sound);
  return (
    <button className={`sound-btn ${sound ? 'on' : ''}`} aria-pressed={sound} onClick={() => toggleSound()} title="Sound is made in your browser. Nothing is downloaded.">
      {sound ? '🔊 Sound on' : '🔇 Sound off'}
    </button>
  );
}


const END_AT = 0.985;

const ACT_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<{ onDone: () => void }>>> = {
  game: lazy(() => import('../acts/game/GameAct')),
  ride: lazy(() => import('../acts/ride/RideAct')),
  arrive: lazy(() => import('../acts/ride/ArriveAct')),
  verify: lazy(() => import('../acts/shift/VerifyAct')),
  offer: lazy(() => import('../acts/shift/OfferAct')),
  wait: lazy(() => import('../acts/shift/WaitAct')),
  tip: lazy(() => import('../acts/shift/TipAct')),
  strike: lazy(() => import('../acts/shift/StrikeAct')),
};

function Hud() {
  const progress = useStory((s) => s.progress);
  const done = useStory((s) => s.done);
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  const third = getRequests().thirdParty.length;
  return (
    <header className="hud">
      <div className="hud-clock" aria-live="off"><span className="hud-time">{clock(progress)}</span><span className="hud-place">Ahmedabad</span></div>
      <nav className="hud-acts" aria-label="Chapters">
        {ACTS.map((a, i) => (
          <button
            key={a.id}
            className={`dot ${done[a.id] ? 'done' : ''} ${a.ready ? '' : 'soon'}`}
            title={`${a.time} · ${a.title}${a.ready ? '' : ' (being built)'}`}
            aria-label={`Chapter ${i + 1}: ${a.title}${a.ready ? '' : ', being built'}`}
            onClick={() => jumpTo(Math.max(0, a.at - 0.012))}
          >{i + 1}</button>
        ))}
      </nav>
      <SoundButton />
      <div className={`privacy ${third ? 'warn' : ''}`} title="This page sends nothing. Every network request is counted here, locally.">
        <span className="pdot" />{third} requests to other sites
      </div>
    </header>
  );
}

function Narration() {
  const progress = useStory((s) => s.progress);
  const phase = useStory((s) => s.phase);
  if (phase !== 'ride' || progress >= END_AT) return null;
  const beat = BEATS.reduce((best, b) => (Math.abs(b.at - progress) < Math.abs(best.at - progress) ? b : best), BEATS[0]);
  const dist = Math.abs(beat.at - progress);
  const op = Math.max(0, 1 - dist / (beat.at < 0.05 ? 0.009 : 0.03));
  const soon = ACTS.find((a) => !a.ready && Math.abs(a.at - progress) < 0.02);
  return (
    <>
      {op > 0.02 && (
        <div className={`narration ${beat.at === 0 ? 'title' : ''}`} style={{ opacity: op }} aria-live="polite">
          {beat.lines.map((l, i) => <p key={i}>{l}</p>)}
        </div>
      )}
      {soon && (
        <div className="soon-card">
          <span className="soon-time">{soon.time}</span> <strong>{soon.title}</strong>
          <span className="muted"> · this chapter is being built. Keep scrolling.</span>
        </div>
      )}
      {progress < 0.01 && <SoundInvite />}
      {progress < 0.01 && <div className="scroll-hint" aria-hidden="true">scroll ↓</div>}
    </>
  );
}

function SoundInvite() {
  const sound = useStory((s) => s.sound);
  if (sound) return null;
  return (
    <div className="sound-invite">
      <span>🎧 Best with sound</span>
      <button className="btn small" onClick={() => toggleSound(true)}>Turn sound on</button>
    </div>
  );
}

/** A short fade from black when the camera cuts between the street and Arun's room. */
function RoomFade() {
  const inRoom = useStory((s) => s.progress >= ROOM_AT);
  const prev = useRef(inRoom);
  const [k, setK] = useState(0);
  useEffect(() => { if (prev.current !== inRoom) { prev.current = inRoom; setK((x) => x + 1); } }, [inRoom]);
  return k ? <div key={k} className="cut-fade" aria-hidden="true" /> : null;
}

function Buzz() {
  const phase = useStory((s) => s.phase);
  const actId = useStory((s) => s.actId);
  const dive = useStory((s) => s.dive);
  const finish = useStory((s) => s.finish);
  if (phase !== 'buzz' || !actId) return null;
  const act = ACTS.find((a) => a.id === actId)!;
  return (
    <div className="buzz" role="dialog" aria-label="Your phone buzzes">
      <div className="buzz-icon" aria-hidden="true">📳</div>
      <div>
        <div className="buzz-time">{act.time} · {act.title}</div>
        <div className="buzz-text">{act.prompt}</div>
      </div>
      <button className="btn" autoFocus onClick={dive}>Pick up the phone</button>
      <button className="btn ghost small" onClick={finish}>Skip</button>
    </div>
  );
}

function Stage() {
  const phase = useStory((s) => s.phase);
  const actId = useStory((s) => s.actId);
  const surface = useStory((s) => s.surface);
  const showDebrief = useStory((s) => s.showDebrief);
  const finish = useStory((s) => s.finish);
  if (!actId || !['phone', 'surface', 'debrief'].includes(phase)) return null;
  const Comp = ACT_COMPONENTS[actId];
  return (
    <div className={`stage st-${phase}`}>
      {phase === 'phone' && Comp && (
        <Suspense fallback={<div className="loading">…</div>}>
          <Comp onDone={surface} />
        </Suspense>
      )}
      {phase === 'surface' && (
        <div className="surface" role="dialog" aria-label="End of chapter">
          <p className="surface-q">What just happened?</p>
          <div className="row">
            <button className="btn" autoFocus onClick={showDebrief}>Show me</button>
            <button className="btn ghost" onClick={finish}>Keep going →</button>
          </div>
        </div>
      )}
      {phase === 'debrief' && <DebriefPanel actId={actId} onClose={finish} />}
    </div>
  );
}

function End() {
  const progress = useStory((s) => s.progress);
  const phase = useStory((s) => s.phase);
  if (phase !== 'ride' || progress < END_AT) return null;
  return <Epilogue />;
}

export function Overlay() {
  return (
    <>
      <RoomFade />
      <Hud />
      <End />
      <Narration />
      <Buzz />
      <Stage />
    </>
  );
}
