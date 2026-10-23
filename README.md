# InterPrep

A frontend-only PHP & Laravel interview study app with 137 English/Hinglish questions, browser audio, mock interviews, bookmarks, local progress and real PHP code execution through WebAssembly.

## Start
```
npm ci
npm run dev
```
Use the URL printed in the terminal. No PHP installation or backend is needed.

## Check and build
```
npm test
npm run build
npm run preview
```
Deploy `dist/` to a static HTTP host. The WASM runtime loads only when running PHP. Laravel and SQL examples are reference-only; 42 reviewed PHP examples support recorded line-by-line replay. Mock interviews are self-assessed, not AI-graded. Audio quality depends on device voices.

See [PRD](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [content provenance](docs/CONTENT.md), and [verification](docs/VERIFICATION.md). Both original documents remain in `public/sources/`.
