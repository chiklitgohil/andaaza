import { LABELS } from '../data/types';
import { LABEL_INFO } from '../data/labels';
import { LabelChip } from './LabelChip';

export function Intro() {
  return (
    <div className="intro">
      <div className="intro-card">
        <p className="muted" style={{ letterSpacing: '0.18em', fontSize: '0.78rem', textTransform: 'uppercase' }}>
          An STS project on the hidden machinery of everyday apps
        </p>
        <h1>The Glass City</h1>
        <p className="lede">
          Every app you use is a black box. In this city, the walls are glass. Walk through an ordinary day and
          watch what leaves your phone, what gets <em>guessed</em> about you, and what is <em>done</em> with
          the guess. Then check the evidence yourself.
        </p>

        <div className="pledge">
          <div>
            <strong>Nothing leaves this page.</strong>
            <span className="muted small">No analytics, no trackers, no cookies, no requests to any other site. The counter at top right proves it.</span>
          </div>
          <div>
            <strong>Every claim is labelled.</strong>
            <span className="muted small">You will always know whether something is documented, reported, alleged, or our own illustration.</span>
          </div>
          <div>
            <strong>Capability is not proof of use.</strong>
            <span className="muted small">We separate what is collected, what is inferred, and what is actually done.</span>
          </div>
        </div>

        <h3>Three layers, everywhere in the city</h3>
        <div className="layers-demo">
          <span className="layer-tag layer-collected">COLLECTED</span> what is gathered
          <span aria-hidden="true">→</span>
          <span className="layer-tag layer-inferred">INFERRED</span> what is guessed from it
          <span aria-hidden="true">→</span>
          <span className="layer-tag layer-done">DONE</span> what is done with the guess
        </div>

        <h3>Evidence labels</h3>
        <div className="legend">
          {LABELS.map((l) => (
            <div key={l} className="legend-item">
              <LabelChip label={l} />
              <div>{LABEL_INFO[l].long}</div>
            </div>
          ))}
        </div>

        <div className="btn-row">
          <a className="btn" href="#/mirror">Begin: look in the mirror →</a>
          <a className="btn ghost" href="#/city">Skip to the city</a>
          <a className="btn ghost" href="#/library">Browse all cases</a>
        </div>
        <p className="muted small" style={{ marginTop: 18 }}>
          Best on a laptop or desktop. Works with a keyboard: <span className="kbd">Tab</span> to move,{' '}
          <span className="kbd">Enter</span> to open, <span className="kbd">Esc</span> to close.
        </p>
      </div>
    </div>
  );
}
