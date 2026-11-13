import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Content-Security-Policy injected ONLY into the production build.
// connect-src 'none' means the page cannot fetch, XHR, WebSocket or beacon anywhere.
// (The dev server needs a WebSocket for hot reload, so dev is exempt.)
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'none'",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "form-action 'none'",
  "base-uri 'self'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<!--CSP-->',
        `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
      );
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), cspPlugin()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
  },
});
