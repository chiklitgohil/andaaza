import { useEffect, useState } from 'react';
import { getRequests, subscribe, tryForbiddenRequest } from './requestWatch';

export function RequestCounter() {
  const [, force] = useState(0);
  const [open, setOpen] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  const r = getRequests();
  const after = r.after.filter((e) => !e.url.includes('/@vite') && !e.url.includes('/node_modules/'));
  const third = r.thirdParty.length;
  const ok = third === 0;
  return (
    <div className="reqcounter">
      <button
        className={`req-pill ${ok ? 'ok' : 'warn'}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="req-panel"
      >
        <span className="req-dot" aria-hidden="true" />
        {third} requests to other sites
        <span className="req-sub">· nothing sent</span>
      </button>
      {open && (
        <div id="req-panel" className="panel req-panel" role="dialog" aria-label="Network requests made by this page">
          <h3>What this page sends</h3>
          <p>
            This counter uses your browser&rsquo;s own <code>PerformanceObserver</code> to list every network
            request the page makes. It runs locally; nothing is reported.
          </p>
          <ul className="req-stats">
            <li><strong>{r.startup.length}</strong> files loaded at startup (this site&rsquo;s own code)</li>
            <li><strong>{after.length}</strong> files loaded later, all from this site (code for the next scene)</li>
            <li><strong>{third}</strong> requests to any other website</li>
          </ul>
          <p>
            The published site also carries a security policy with <code>connect-src &apos;none&apos;</code>,
            which forbids the page from sending data anywhere. Try it:
          </p>
          <button className="btn" onClick={async () => setTestResult(await tryForbiddenRequest())}>
            Try to send a request to example.com
          </button>
          {testResult && <p className="req-test" role="status">{testResult}</p>}
          <p className="muted small">
            Honest caveat: the web host that serves these files can see that someone loaded the page (as
            every web host can). The page itself sends nothing about you.
          </p>
          <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
