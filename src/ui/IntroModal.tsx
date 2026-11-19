// The front door: a welcome card over the blurred city, shown on every load. It explains what is about to happen,
// hides the 3D loading while the visitor reads, and its one button is the first gesture that starts the sound.
import { useEffect, useRef, useState } from 'react';
import { useStory } from '../story/store';

const CASES = [
  { t: 'Food delivery riders', d: 'Face checks, 12-second orders, bonus targets that move, unpaid waiting, vanishing tips and an app that outbids a strike.' },
  { t: 'Cab booking', d: 'Claims that the same ride costs more on some phones or a low battery, and how little of the fare reaches the driver.' },
  { t: 'Games like Block Blast', d: 'A puzzle game reported to pick your pieces to keep you playing, losing and watching ads.' },
];

export function IntroModal() {
  const intro = useStory((s) => s.intro);
  const reduced = useStory((s) => s.reducedMotion);
  const [closing, setClosing] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // while it is open the story cannot start behind it
  useEffect(() => {
    if (!intro) return;
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    // focus the button for keyboard users without scrolling the card away from its heading
    btn.current?.focus({ preventScroll: true });
    if (card.current) card.current.scrollTop = 0;
    return () => { if (useStory.getState().phase === 'ride') html.style.overflow = ''; };
  }, [intro]);

  if (!intro) return null;
  const begin = () => {
    if (closing) return;
    if (reduced) { useStory.setState({ intro: false }); return; }
    setClosing(true);
    setTimeout(() => useStory.setState({ intro: false }), 400);
  };

  return (
    <div className={`intro-backdrop ${closing ? 'closing' : ''}`}>
      <div className="intro-card" ref={card} role="dialog" aria-modal="true" aria-labelledby="intro-title">
        <p className="intro-k i1">andaaza (n.): a guess, an estimate</p>
        <h1 id="intro-title" className="i2">The guesses your apps make about you</h1>
        <p className="i3">
          Every day we use apps that feel simple: they verify a face, set a price, assign a job, suggest one more game before bed.{' '}
          <mark>Behind each screen, algorithms are quietly collecting data about us, inferring who we are and what we will put up with</mark>,
          {' '}and using those guesses in ways that often work against the people they are about.
        </p>
        <p className="i4">
          Andaaza pulls back the curtain. <mark>You will live one day as Arun, a food delivery rider in Ahmedabad</mark>, and see how the apps on his phone
          push his pay down, raise his prices and keep him hooked, and how few of those rules anyone outside the company can see.
        </p>
        <p className="intro-k i5">The cases you will see</p>
        <ol className="intro-cases">
          {CASES.map((c, i) => (
            <li key={c.t} style={{ animationDelay: `${0.26 + i * 0.07}s` }}><b>{c.t}</b><span>{c.d}</span></li>
          ))}
        </ol>
        <ul className="intro-how i6">
          <li>Scroll to move through Arun&rsquo;s day.</li>
          <li>When his phone buzzes, pick it up and try the hands-on labs.</li>
          <li>After each stop, see what just happened. Every source is listed at the very end.</li>
        </ul>
        <p className="intro-note i7">Arun, his city and the apps are invented; the tactics they use are drawn from real, sourced cases. This site collects nothing and sends nothing. It is an STS (Science, Technology and Society) class project.</p>
        <div className="intro-foot i8"><button className="intro-btn" ref={btn} onClick={begin}>Begin Arun&rsquo;s day →</button></div>
      </div>
    </div>
  );
}
