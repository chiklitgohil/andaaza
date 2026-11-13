import { useStore } from '../store';

export default function Exit() {
  const reset = useStore((s) => s.reset);
  return (
    <div className="scroll-page">
      <div className="page-inner" style={{ maxWidth: 940 }}>
        <h1>What you can do</h1>
        <p style={{ maxWidth: 760 }}>
          You can&rsquo;t open the black boxes yourself, but you can shrink what goes into them, and use the rights
          and tools that exist to check what comes out.
        </p>

        <div className="exit-grid">
          <section className="panel">
            <h3>On your phone</h3>
            <ul>
              <li><strong>Review permissions.</strong> Android: Settings → Privacy → Permission manager. iPhone: Settings → Privacy &amp; Security. Remove location, contacts, microphone and photos from apps that don&rsquo;t need them.</li>
              <li><strong>Location &ldquo;only while using&rdquo;</strong>, and turn off precise location where approximate is enough.</li>
              <li><strong>Limit ad tracking.</strong> iPhone: refuse &ldquo;Allow apps to request to track&rdquo;. Android: Settings → Privacy → Ads → delete advertising ID.</li>
              <li><strong>iPhone App Privacy Report</strong> (Settings → Privacy &amp; Security) shows which apps used sensors and which domains they contacted.</li>
              <li><strong>Be wary of contact-list requests</strong>, especially from loan apps. In India, regulated lenders may not access your contacts at all.</li>
            </ul>
          </section>
          <section className="panel">
            <h3>In your browser</h3>
            <ul>
              <li>Block third-party cookies. Consider a browser with built-in tracker and fingerprint protection.</li>
              <li>&ldquo;Private&rdquo; or &ldquo;Incognito&rdquo; mode hides history from people using your computer, <em>not</em> from websites.</li>
              <li>Revisit the <a href="#/mirror">Mirror Room</a> in different browsers and compare what each exposes.</li>
            </ul>
          </section>
          <section className="panel">
            <h3>Use your rights</h3>
            <ul>
              <li><strong>India:</strong> the Digital Personal Data Protection Act 2023 and its Rules (notified November 2025) phase in rights to access, correct and erase your data; most company obligations apply from about May 2027. Dark patterns can be reported to the National Consumer Helpline (1915).</li>
              <li><strong>EU and UK:</strong> GDPR gives you the right to get a copy of your data (a &ldquo;subject access request&rdquo;). UK Uber drivers used exactly this to audit their pay.</li>
              <li><strong>US:</strong> several states, such as California, give rights to know and delete; the FTC takes complaints.</li>
            </ul>
          </section>
          <section className="panel">
            <h3>Before you share a scary claim</h3>
            <ol>
              <li>Is it a screenshot or a test? Who measured it, and how?</li>
              <li>Did they change only one thing, at the same moment, many times?</li>
              <li>What label fits: documented, reported, alleged, or contested?</li>
              <li>What did the company say?</li>
              <li>Is it collection, inference, or actual use? Capability is not proof of use.</li>
            </ol>
          </section>
        </div>

        <section className="panel" style={{ marginTop: 14 }}>
          <h3>Not all data use is bad</h3>
          <p className="small">
            The same machinery has legitimate and helpful uses: detecting card fraud, navigation and traffic
            estimates, accessibility features, spam filtering, safety alerts, and aggregated research on public
            health. The questions this exhibit asks are about <em>consent</em> (did you know?),
            <em> proportion</em> (was this much needed?), <em>purpose</em> (was it used for what you were told?), and
            <em> power</em> (could you see it, question it, or say no?).
          </p>
        </section>

        <div className="btn-row" style={{ marginTop: 18 }}>
          <a className="btn" href="#/library">Browse every case and source</a>
          <a className="btn ghost" href="#/about">About this project &amp; method</a>
          <button className="btn ghost" onClick={() => { reset(); window.location.hash = '#/'; }}>Start again (clears your visit, which was only ever in memory)</button>
        </div>
      </div>
    </div>
  );
}
