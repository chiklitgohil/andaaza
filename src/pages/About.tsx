import { CASES, MYTHS } from '../data';
import { LABELS } from '../data/types';
import { LABEL_INFO } from '../data/labels';
import { LabelChip, IllustrativeTag } from '../ui/LabelChip';

export default function About() {
  const all = CASES.flatMap((c) => c.sources);
  const opened = all.filter((s) => s.accessed === 'opened').length;
  const countries = new Set(CASES.flatMap((c) => c.countries));
  const india = CASES.filter((c) => c.countries.includes('India')).length;
  return (
    <div className="scroll-page">
      <div className="page-inner" style={{ maxWidth: 900 }}>
        <h1>About &amp; method</h1>
        <p>
          <strong>The Glass City</strong> is a student project for a Science, Technology and Society class. It asks
          what everyday apps collect, what they infer, and how those inferences can be used for or against us,
          and it tries to be strict about what is actually known.
        </p>

        <h2 style={{ fontSize: '1.3rem' }}>Privacy of this site</h2>
        <ul>
          <li>No analytics, trackers, cookies, accounts or external fonts. All code is served from this site.</li>
          <li>The published site carries a Content-Security-Policy with <code>connect-src &apos;none&apos;</code>: the page cannot send data anywhere. The counter at top right lists every request.</li>
          <li>The Mirror Room reads your browser&rsquo;s values locally, in memory. Your visit progress is kept in memory and disappears when you close the tab.</li>
          <li>The web host can see that the page was loaded, as with any website.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem' }}>Evidence labels</h2>
        <table className="simple">
          <tbody>
            {LABELS.map((l) => (
              <tr key={l}>
                <td style={{ width: 150 }}><LabelChip label={l} /></td>
                <td>{LABEL_INFO[l].long}</td>
                <td className="muted" style={{ width: 90 }}>{CASES.filter((c) => c.label === l).length} cases</td>
              </tr>
            ))}
            <tr><td><IllustrativeTag /></td><td>An invented number used to show how a mechanism works. Not a measurement.</td><td /></tr>
          </tbody>
        </table>
        <p className="small" style={{ marginTop: 10 }}>
          <strong>Settlements:</strong> when a government enforcer (FTC, DOJ, a state attorney general, a national
          regulator) obtains an order or settlement, we label the case DOCUMENTED for the order and its terms, and
          describe the underlying conduct as &ldquo;alleged&rdquo;, because most settlements include no admission of
          wrongdoing. Private class-action settlements are labelled ALLEGED. Every ALLEGED or CONTESTED case shows
          the company&rsquo;s response; a build-time check refuses to publish the site otherwise.
        </p>

        <h2 style={{ fontSize: '1.3rem' }}>Three rules we follow</h2>
        <ol>
          <li><strong>Collection is not proof of misuse.</strong> Every place in the city separates COLLECTED, INFERRED and DONE.</li>
          <li><strong>Capability is not proof of use.</strong> For example, the FTC found pricing tools <em>can</em> use your mouse movements; it did not show a named shop doing so.</li>
          <li><strong>Correlation is not intent.</strong> Patterns in prices (for example by ZIP code) do not prove anyone meant them.</li>
        </ol>

        <h2 style={{ fontSize: '1.3rem' }}>The research</h2>
        <ul>
          <li>{CASES.length} cases and {MYTHS.length} myths, across {countries.size} countries and regions; {india} involve India.</li>
          <li>{all.length} source links. Our researchers opened and read <strong>{opened}</strong>; the other <strong>{all.length - opened}</strong> were seen only as search-result snippets, often because of paywalls or blocked pages. Each source is marked READ or SNIPPET.</li>
          <li>Preference for primary sources: regulator orders and press releases, court records, peer-reviewed papers, company statements. Forums and social posts were treated as leads only.</li>
          <li>Facts are as of <strong>13 November 2026</strong>. Several cases (Flo damages, Clearview, Kochava, Texas lawsuits) were still moving.</li>
          <li>Research and writing were assisted by an AI model (Claude) and checked against sources. Mistakes are possible, so please check the sources yourself.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem' }}>What is invented</h2>
        <ul>
          <li>The city, the day, the shops (Basketly, Pricely, RideNow) and the people (Asha, Ravi) are <LabelChip label="FICTIONAL" compact />.</li>
          <li>The mini-games&rsquo; rules and numbers are <LabelChip label="WHAT-IF" compact /> illustrations of mechanisms described in the cases. They show how something <em>could</em> work, not how any named company&rsquo;s system works.</li>
          <li>Stack Shift is an original game. Its rigged dealer is modelled on rules that <a href="https://ayoships.com/breakdowns/block-blast" target="_blank" rel="noreferrer noopener">Ayo Omolewa reported</a> finding in a popular puzzle game. Credit for that analysis is his.</li>
        </ul>

        <h2 style={{ fontSize: '1.3rem' }}>Built with</h2>
        <p className="small">
          React, Three.js and React Three Fiber, bundled locally (no CDNs). All 3D shapes are generated in code; no
          external models, images or fonts are used. Every 3D interaction has a keyboard-accessible text
          equivalent, and the site respects your &ldquo;reduce motion&rdquo; setting.
        </p>
        <p className="small"><a href="#/library">Open the full Case Library →</a></p>
      </div>
    </div>
  );
}
