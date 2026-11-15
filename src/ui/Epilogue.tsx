import { useState } from 'react';
import { useStory } from '../story/store';
import { DEBRIEFS } from '../content/debriefs';
import { ACTS } from '../story/acts';
import { LABEL_COLOR, LABEL_MEANING, type Label } from '../content/types';
import { Chip } from './Debrief';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="ep-line"><span>{k}</span><b>{v}</b></div>;
}
const skipped = <span className="muted">skipped</span>;

/** The end of the day: Arun's day as the apps saw it, from your own choices. */
export function Epilogue() {
  const journal = useStory((s) => s.journal) as J;
  const restart = useStory((s) => s.restart);
  const [panel, setPanel] = useState<'none' | 'evidence' | 'about'>('none');
  const { verify, offer, wait, tip, strike, game, ride } = journal;
  const guess = journal['ride-guess'];
  const waitChoice = journal['wait-choice'];
  const GUESS: Record<string, string> = { same: 'Same price', stranger: 'He pays more', arun: 'Arun pays more', cant: 'Can’t tell from two screens' };

  return (
    <div className="epilogue" role="region" aria-label="Your day">
      <p className="kicker">00:10 · end of the day</p>
      <h2>One person. Three apps. Three different things he was.</h2>

      <div className="ep-grid">
        <section className="ep-card">
          <h3><span>Worker</span> managed</h3>
          {verify ? <Line k="Selfie attempts before you could work" v={verify.tries} /> : <Line k="Face check" v={skipped} />}
          {offer ? <Line k="Orders you turned down" v={`${offer.rejects}${offer.rejects > 1 ? ' · bonus lost' : ''}`} /> : <Line k="Offers" v={skipped} />}
          {wait ? <Line k="Minutes waited, unpaid" v={wait.mins} /> : <Line k="Waiting" v={skipped} />}
          {waitChoice && <Line k="At the red light you chose" v={waitChoice === 'fast' ? 'speed' : 'safety'} />}
          {tip ? <Line k="Customer tipped / you received above base" v={`₹${tip.tip} / ₹${Math.max(0, tip.payout - 60)}`} /> : <Line k="The tip" v={skipped} />}
          {strike ? <Line k="At 7 pm you" v={strike === 'stay' ? 'stayed online for ₹150' : 'logged off with the strike'} /> : <Line k="The strike" v={skipped} />}
        </section>
        <section className="ep-card">
          <h3><span>Customer</span> priced</h3>
          {guess ? <Line k="You guessed" v={GUESS[guess]} /> : <Line k="Your guess" v={skipped} />}
          <Line k="What anyone can honestly say" v="Two screens can’t prove it" />
          {ride ? (
            <>
              <Line k="You paid" v={`₹${ride.paid}`} />
              <Line k="The driver received" v={`₹${ride.driver} (cut ${ride.cut}%)`} />
            </>
          ) : <Line k="The ride" v={skipped} />}
        </section>
        <section className="ep-card">
          <h3><span>Player</span> harvested</h3>
          {game ? (
            <>
              <Line k="Final score" v={game.score} />
              <Line k="Impossible hands dealt to you" v={game.lethal} />
              <Line k="Ads you watched to keep going" v={game.ads} />
            </>
          ) : <Line k="The game" v={skipped} />}
          <Line k="Arun’s price to advertisers" v="$14.83 per 1,000 ads" />
        </section>
      </div>

      <div className="ep-q">
        <p>Questions to take with you:</p>
        <ul>
          <li>What should an app be required to show the person it is deciding about?</li>
          <li>When is it fair to price, pay or rank people differently, and who should get to check?</li>
          <li>What did your own phone decide about you today?</li>
        </ul>
      </div>

      <div className="row">
        <button className="btn" onClick={() => setPanel('evidence')}>All the evidence</button>
        <button className="btn ghost" onClick={() => setPanel('about')}>About this project</button>
        <button className="btn ghost" onClick={() => { restart(); scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}>Start the day again</button>
      </div>

      {panel !== 'none' && (
        <div className="ep-modal" role="dialog" aria-label={panel === 'evidence' ? 'All the evidence' : 'About this project'}>
          <div className="debrief wide">
            <button className="btn ghost small close" onClick={() => setPanel('none')}>✕ Close</button>
            {panel === 'evidence' ? (
              <>
                <p className="kicker">All the evidence</p>
                <h2>Every claim in this story, with its label</h2>
                <div className="legend">
                  {(Object.keys(LABEL_COLOR) as Label[]).map((l) => <p key={l}><Chip label={l} /> {LABEL_MEANING[l]}</p>)}
                </div>
                {ACTS.map((a) => {
                  const d = DEBRIEFS[a.id];
                  if (!d) return null;
                  return (
                    <section key={a.id} className="ev-act">
                      <h3>{a.time} · {d.title}</h3>
                      <ul className="facts">
                        {d.facts.map((f, i) => (
                          <li key={i}>
                            <Chip label={f.label} /> {f.text}
                            {f.response && <span className="resp">Response: {f.response}</span>}
                            <span className="srcs">{f.sources.map((s) => (
                              <a key={s.url} href={s.url} target="_blank" rel="noreferrer noopener">{s.publisher}{s.opened ? '' : ' (snippet only)'}</a>
                            ))}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </>
            ) : (
              <>
                <p className="kicker">About this project</p>
                <h2>The Last Mile</h2>
                <p className="lede">An interactive story for a Science, Technology and Society class. You played one day as Arun, a delivery rider in Ahmedabad, to feel what is hard to see: how apps manage workers, price customers and harvest attention.</p>
                <h3>What is real and what is invented</h3>
                <p className="small">Arun, his city, the apps (Zipkart, Gaadi, Stack), every person and every price in the story are invented. The mechanisms they show are drawn from real cases, each labelled by how strong its evidence is. Allegations are shown with the company&rsquo;s response. Where we use a mechanism from another country, we say so.</p>
                <h3>Privacy</h3>
                <p className="small">This site collects nothing: no analytics, no cookies, no trackers, no accounts. It never uses your camera, microphone or location. The published version blocks every request to other websites, and the counter at the top right shows the count. Your choices stay in this tab and vanish when you close it.</p>
                <h3>Credits</h3>
                <ul className="small">
                  <li>3D models: Kenney (kenney.nl), released under CC0.</li>
                  <li>The hidden rules in Stack re-create, in simplified form, what Ayo Omolewa reported finding in a popular puzzle game (<a href="https://ayoships.com/breakdowns/block-blast" target="_blank" rel="noreferrer noopener">ayoships.com/breakdowns/block-blast</a>). Credit for that analysis is his.</li>
                  <li>Research and code were developed with the help of an AI assistant (Claude) and checked against sources. Mistakes are possible; the sources are listed so you can check.</li>
                </ul>
                <p className="small muted">Facts as of November 2026.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
