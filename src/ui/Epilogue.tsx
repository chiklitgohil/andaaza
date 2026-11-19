import { useState } from 'react';
import { useStory } from '../story/store';
import { DEBRIEFS } from '../content/debriefs';
import { ACTS } from '../story/acts';
import { LABEL_COLOR, LABEL_MEANING, type Label } from '../content/types';
import { Chip } from './Debrief';
import { scoreOf, feelingsOf } from '../acts/guess';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="ep-line"><span>{k}</span><b>{v}</b></div>;
}
const skipped = <span className="muted">skipped</span>;

/** The end of the day: Arun's day as the apps saw it, from your own choices. */
export function Epilogue() {
  const journal = useStory((s) => s.journal) as J;
  const restart = useStory((s) => s.restart);
  const [panel, setPanel] = useState<'none' | 'about'>('none');
  const score = scoreOf(journal);
  const felt = feelingsOf(journal);
  const { verify, offer, wait, tip, strike, game, ride } = journal;
  const guess = journal['ride-guess'];
  const waitChoice = journal['wait-choice'];
  const GUESS: Record<string, string> = { same: 'Same price', stranger: 'He pays more', arun: 'Arun pays more', cant: 'Can’t tell from two screens' };
  const [stage, setStage] = useState<'quote' | 'day'>('quote');

  if (stage === 'quote') {
    return (
      <div className="epilogue twist" role="region" aria-label="A closing thought">
        <figure className="twist-q">
          <blockquote>Individuals have become &ldquo;dividuals,&rdquo; and masses, samples, data, markets, or &ldquo;banks.&rdquo;</blockquote>
          <figcaption>Gilles Deleuze, philosopher · &ldquo;Postscript on the Societies of Control&rdquo;, 1990</figcaption>
        </figure>
        <p className="twist-gloss">He wrote this in 1990, years before smartphones.</p>
        <p className="twist-gloss">Today you met three apps, and each kept its own piece of Arun: a face-match score, an acceptance rate, a battery level, minutes of play. Each made its <i>andaaza</i> from its piece. None of them was looking at the whole person.</p>
        {score.made > 0 && (
          <div className="andaaza-score" aria-label="Your Andaaza score">
            <b>{score.right}<small>/{score.made}</small></b>
            <p>You made {score.made} guesses about the apps today and got {score.right} right. The apps guessed about Arun all day, with far more data than you had.</p>
          </div>
        )}
        <button className="btn" autoFocus onClick={() => setStage('day')}>See Arun&rsquo;s day, the way the apps saw it →</button>
      </div>
    );
  }

  return (
    <div className="epilogue" role="region" aria-label="Your day">
      <figure className="twist-q small">
        <blockquote>Individuals have become &ldquo;dividuals,&rdquo; and masses, samples, data, markets, or &ldquo;banks.&rdquo;</blockquote>
        <figcaption>Gilles Deleuze, &ldquo;Postscript on the Societies of Control&rdquo; (1990). English translation in <i>October</i> 59, 1992. <i>Dividual</i>: something that can be divided, split into data points, scores and segments.</figcaption>
      </figure>
      <p className="kicker">00:10 · end of the day</p>
      <h2>One person. Three apps. Three different things he was.</h2>

      <div className="ep-grid">
        <section className="ep-card">
          <h3><span>Worker</span> managed</h3>
          {verify ? <Line k="Selfie attempts before you could work" v={verify.tries} /> : <Line k="Face check" v={skipped} />}
          {offer ? <Line k="Orders you turned down" v={`${offer.rejects}${offer.rejects > 1 ? ' · bonus lost' : ''}`} /> : <Line k="Offers" v={skipped} />}
          {wait ? <Line k="Minutes waited, unpaid" v={wait.mins} /> : <Line k="Waiting" v={skipped} />}
          {waitChoice && <Line k="At the red light you chose" v={waitChoice === 'fast' ? 'speed' : 'safety'} />}
          {tip ? <Line k="Customer tipped / you received above base" v={`₹${tip.tip} / ₹${Math.max(0, tip.extra ?? tip.payout - 60)}`} /> : <Line k="The tip" v={skipped} />}
          {strike ? <Line k="At 7 pm you" v={strike === 'stay' ? 'stayed online for ₹150' : journal['strike-expired'] ? 'let the offer run out' : 'logged off with the strike'} /> : <Line k="The strike" v={skipped} />}
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

      {felt.length > 0 && (
        <section className="ep-felt" aria-label="What you told yourself today">
          <h3>What you chose in Arun&rsquo;s shoes</h3>
          <ul>{felt.map((f) => <li key={f.k}><span>{f.k}</span><b>{f.a}</b></li>)}</ul>
          <p className="small">None of these had a right answer. Arun makes choices like them every day, with the rent due and an app keeping score.</p>
        </section>
      )}

      <div className="ep-q">
        <p>Questions to take with you:</p>
        <ul>
          <li>What should an app be required to show the person it is deciding about?</li>
          <li>When is it fair to price, pay or rank people differently, and who should get to check?</li>
          <li>What did your own phone decide about you today?</li>
        </ul>
      </div>

      <div className="row">
        <button className="btn" onClick={() => document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' })}>Evidence and sources ↓</button>
        <button className="btn ghost" onClick={() => setPanel('about')}>About this project</button>
        <button className="btn ghost" onClick={() => { restart(); scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}>Start the day again</button>
      </div>

      <section id="evidence" className="evidence" aria-label="Evidence and sources">
        <p className="kicker">Evidence and sources</p>
        <h2>Every claim in the story, and where it comes from</h2>
        <p className="small">During the story we kept the screens clear. Here is everything behind them: how strong each claim&rsquo;s evidence is, what the company said, the source, and what we invented.</p>
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
                {d.honesty && <li className="invented"><Chip label="FICTIONAL" /> {d.honesty}</li>}
              </ul>
            </section>
          );
        })}
      </section>

      {panel !== 'none' && (
        <div className="ep-modal" role="dialog" aria-label="About this project">
          <div className="debrief wide">
            <button className="btn ghost small close" onClick={() => setPanel('none')}>✕ Close</button>
            <>
                <p className="kicker">About this project</p>
                <h2>Andaaza</h2>
                <p className="small"><i>Andaaza</i> is Hindi for a guess or an estimate. Every app in this story was making one about Arun.</p>
                <p className="lede">An interactive story for a Science, Technology and Society class. You played one day as Arun, a delivery rider in Ahmedabad, to feel what is hard to see: how apps manage workers, price customers and harvest attention.</p>
                <h3>What is real and what is invented</h3>
                <p className="small">Arun, his city, the apps (Flopcart, Gaadi, Stack), every person and every price in the story are invented. Flopcart is a joke name: it is not Flipkart or any other real company, and nothing in the story describes what Flipkart does. The mechanisms they show are drawn from real cases. During the story the wording says how sure we are (&ldquo;riders say&rdquo;, &ldquo;the company denies it&rdquo;); the evidence list on this page gives every claim its label, the company&rsquo;s response and its source. Where we use a mechanism from another country, we say so.</p>
                <h3>Privacy</h3>
                <p className="small">This site collects nothing: no analytics, no cookies, no trackers, no accounts. It never uses your camera, microphone or location. The published version blocks every request to other websites. Your choices stay in this tab and vanish when you close it.</p>
                <h3>Credits</h3>
                <ul className="small">
                  <li>3D models: Kenney (kenney.nl), released under CC0.</li>
                  <li>Sound: synthesised live in your browser. There are no audio files and no recordings.</li>
                  <li>Closing quote: Gilles Deleuze, &ldquo;Postscript on the Societies of Control&rdquo;, first published in <i>L&rsquo;Autre journal</i> (May 1990); English translation in <i>October</i>, vol. 59 (Winter 1992), pp. 3&ndash;7.</li>
                  <li>The hidden rules in Stack re-create, in simplified form, what Ayo Omolewa reported finding in a popular puzzle game (<a href="https://ayoships.com/breakdowns/block-blast" target="_blank" rel="noreferrer noopener">ayoships.com/breakdowns/block-blast</a>). Credit for that analysis is his.</li>
                  <li>Research and code were developed with the help of an AI assistant (Claude) and checked against sources. Mistakes are possible; the sources are listed so you can check.</li>
                </ul>
                <p className="small muted">Facts as of November 2026.</p>
              </>
          </div>
        </div>
      )}
    </div>
  );
}
