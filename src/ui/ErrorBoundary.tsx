import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="scroll-page">
        <div className="page-inner panel" style={{ maxWidth: 640 }}>
          <h2>This scene could not load</h2>
          <p className="small muted">{this.state.error.message}</p>
          <p>If the site was just updated, reloading usually fixes it. The text-only Case Library always works.</p>
          <div className="btn-row">
            <button className="btn" onClick={() => location.reload()}>Reload</button>
            <a className="btn ghost" href="#/library">Open the Case Library</a>
          </div>
        </div>
      </div>
    );
  }
}
