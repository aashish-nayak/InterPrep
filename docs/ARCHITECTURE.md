# Architecture and development

## Stack
React 19 + Vite, React Router, Tailwind CSS v4, Lucide icons, PHP 8.3 WebAssembly, shadcn UI primitives, and Lightwind animated motion components. No external backend server or database; local persistence is managed via versioned browser storage, with optional Google AI Studio (Gemini) TTS integration.

## Run
```
npm ci
npm run dev
npm test
npm run build
npm run preview
```
Open the local URL printed by Vite. Serve `dist/` through an HTTP static host for production; do not open index.html with file://. The PHP worker and WASM files must remain beside the other built assets. The first PHP run fetches a roughly 18 MB runtime before executing; normal study does not load it. Modern browsers select JSPI when supported and use Asyncify otherwise.

## Files
- `src/main.jsx`: shell, study, local persistence, audio, progress and source library.
- `src/MockInterview.jsx`: randomized interview and self-assessment.
- `src/CodeLab.jsx`: editable examples, worker lifecycle and recorded execution playback.
- `src/php-worker.js`: isolated PHP execution; each run starts a fresh runtime.
- `src/model.js`: pure filter, sampling and storage-validation functions.
- `src/questions.json`: generated bilingual curriculum.
- `src/english.txt`: reviewed concise English adaptations in source question order.
- `scripts/import.mjs`: parses the numbered updated guide and applies documented corrections.
- `scripts/check.mjs`: content coverage and behavioral logic assertions.
- `public/sources/`: untouched copies of both user-provided documents.

## State and resilience
One versioned localStorage object stores preferences, question IDs, learned/review status and the latest 20 summary records. Mock draft answers live only during the session and are discarded on navigation/reload. No private answers are sent to an application server. Speech voices are managed by the browser/OS and may depend on its services. localStorage is not a backup; deleting browser data removes progress. Malformed stored values fall back to safe defaults.

PHP runs in a worker with an isolated in-memory filesystem. The application does not mount the user's disk or configure a networking proxy. A 20-second main-thread timeout terminates the worker, and navigation/unmount cancels it. Output is rendered as React text, never HTML. The runtime result is bounded for display to 100,000 characters; large allocations inside WASM can still exhaust its memory and report an error. Worker startup failures expose a retryable message.

## Design decisions
Warm cream surfaces, pink accents, Inter typography and monospace code follow the user-supplied CodeWithAnimation reference. Layout favors reading over decorative assets. DESIGN_VARIANCE 4 / MOTION_INTENSITY 2 / VISUAL_DENSITY 5. The UI UX search's child-oriented fonts and showcase layout were rejected for this adult interview-preparation workspace.

Motion purpose: state indication at occasional frequency. Trace highlights use a 180ms color transition; controls use 160ms color/opacity feedback. Loading uses a gentle opacity pulse. Reduced motion removes the pulse and reduces transitions. No content moves while being read, and no animation library is installed. Layer scale: normal content 0, mobile backdrop 19, mobile navigation 20, skip link 30.

## Runtime references and licensing
The PHP integration uses the public `PHP`, `loadPHPRuntime` and `getPHPLoaderModule` APIs documented in the installed WordPress Playground packages. PHP WASM packages are GPL-2.0-or-later; review redistribution obligations when publishing or packaging this app, and retain upstream notices. The package lock records exact dependencies.

- https://github.com/WordPress/wordpress-playground
- https://www.php.net/manual/en/language.operators.precedence.php

## Extension policy
Add content as data. A new content language needs localized title/answer fields; the surrounding interface stays English. Trace instrumentation in src/trace.js is restricted to 42 reviewed original snippets. It records actual line visits, visible variables and buffered output, with a 600-frame limit. Edited code runs without instrumentation. Extend the allowlist only after checking output parity. Run node scripts/check-trace.mjs with a local PHP CLI for developer-only trace parity checks; PHP is not needed to use the app. Full Laravel execution needs an application filesystem and database; do not fake it in the sandbox.
