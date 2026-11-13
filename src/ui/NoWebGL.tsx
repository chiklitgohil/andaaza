export function NoWebGL() {
  return (
    <div className="scroll-page">
      <div className="page-inner panel" style={{ maxWidth: 680 }}>
        <h2>3D is not available in this browser</h2>
        <p>
          Your browser has WebGL turned off or unsupported, so the 3D scenes cannot run. Every case, label and
          source in the experience is also available as text.
        </p>
        <div className="btn-row">
          <a className="btn" href="#/library">Open the Case Library</a>
          <a className="btn ghost" href="#/lab">Auditor&rsquo;s Lab (no 3D needed)</a>
          <a className="btn ghost" href="#/myths">Myths</a>
        </div>
      </div>
    </div>
  );
}
