# Andaaza

*andaaza (n.): a guess, an estimate.*

An interactive 3D story about what apps **collect**, what they **infer**, and how those guesses can be used against the people they are about. You play one day as Arun, a delivery rider in Ahmedabad, from 06:15 to midnight. Over the day his phone checks his face, sets his pay, prices his taxi ride home and keeps him playing a game in bed. An STS (Science, Technology and Society) class project.

## How it works
- **Scroll** to move through the day. At each stop the camera dives into Arun's phone.
- **Hands-on labs** at every stop: move the sliders, or pick a preset, and see the result and the reasons behind it.
- **Behind the screen** panels after each stop say what is real. Every claim carries an evidence label: DOCUMENTED, REPORTED, ALLEGED, CONTESTED, STATEMENT, WHAT-IF or FICTIONAL. Allegations are shown with the company's response.

Arun, his city, every person and price, and the apps (Flopcart, Gaadi, Stack) are invented. Flopcart is a joke name, not Flipkart. The mechanisms they show are drawn from real, sourced cases.

## Privacy
No analytics, trackers, cookies or third-party requests. The production build injects a Content-Security-Policy with `connect-src 'self'` (the page can load only its own files; nothing can be sent to any other site). The site never uses the camera, microphone or location. Sound is on by default (it starts at the first click; the button at the top right turns it off) and is synthesised in the browser.

## Run
```
npm install
npm run dev        # development
npm run build      # type-check + build to dist/
npm run preview    # serve the production build
```
The site is static: `npm run build` produces a `dist/` folder that any static host (for example Netlify) can serve as-is.

## Credits
- 3D models: Kenney (kenney.nl), CC0.
- Stack's hidden rules are a simplified re-creation of what Ayo Omolewa reported finding in a popular puzzle game (https://ayoships.com/breakdowns/block-blast).
- Built with React, three.js and react-three-fiber.
