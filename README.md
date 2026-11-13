# The Glass City

An interactive 3D walk through the hidden machinery of everyday apps: what they **collect**, what they **infer**, and what is **done** with it. Every claim carries an evidence label (DOCUMENTED, REPORTED, ALLEGED, CONTESTED, STATEMENT, WHAT-IF, FICTIONAL). An STS class project.

## Acts
1. **Mirror Room**: a live, local-only reveal of what any website can read from your browser.
2. **Glass City**: eleven places in one day, with real cases and three mini-games (Puppet Theatre, Stack Shift, Dispatcher).
3. **Broker Tower**: real, documented segment names assembled into a profile, followed by an illustrative auction.
4. **Auditor's Lab**: design fair tests against a shop with a hidden rule.
Plus the Myths Room, What you can do, the Case Library and About & method.

## Privacy
No analytics, trackers, cookies or third-party requests. The production build injects a Content-Security-Policy with `connect-src 'none'`, and an on-page counter lists every network request.

## Data
- `data/cases/*.json`: the case library (source of truth), one file per city stop.
- `data/myths.json`: weak or debunked claims.
- `SOURCES.md`: generated, human-readable list of every case and source (`npm run sources`).
- `npm run validate`: the honesty audit. The build fails if a case lacks a label, sources, outcome or limits, or if an ALLEGED/CONTESTED case lacks the company's response.
- `npm run check-links`: a dev-time link checker (it runs on your machine, never in the site).

## Run
```
npm install
npm run dev        # development
npm run build      # validate + generate SOURCES.md + type-check + build to dist/
npm run preview    # serve the production build
```
The site is static: `npm run build` produces a `dist/` folder that any static host (for example Netlify or Vercel) can serve as-is. It is not deployed anywhere at the moment.

## Credits
The Stack Shift rigged dealer is a simplified, original illustration of rules reported by Ayo Omolewa (https://ayoships.com/breakdowns/block-blast). All 3D geometry is procedural. Facts are as of 13 November 2026.
