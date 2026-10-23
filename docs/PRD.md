# InterPrep product requirements

## Purpose
Turn long interview notes into a calm daily practice tool for a PHP/Laravel developer preparing for job interviews. The first release has one PHP & Laravel track. No accounts or backend are required.

## Implemented scope
- Study all 125 numbered questions from the updated guide and 12 adapted topics from the original README, grouped into PHP fundamentals, OOP, coding, Laravel, SQL, senior scenarios and patterns.
- Switch English/Hinglish in the top bar; only questions, answers and explanations update immediately. Page titles, navigation, controls, topic names and HTML document language stay English.
- Search both languages; filter topics and learning status; bookmark questions.
- Hide answers for active recall. Mark a question learned or needing review.
- Listen using high-fidelity Google AI Studio (Gemini) Text-to-Speech (`gemini-2.0-flash` with prebuilt voices like Kore, Aoede, Puck, Charon, Fenrir for Hindi and English) with user-provided API key stored securely in localStorage, with pause, resume, stop, speed multipliers (0.75×-1.5×), in-memory audio caching, and automatic fallback to browser speech synthesis when unconfigured or offline.
- Run editable standalone PHP snippets with a PHP 8.3 WebAssembly worker. Stop execution manually; timeout after 20 seconds. Output and failures are displayed as text.
- Replay recorded execution for 42 reviewed standalone PHP examples: active line, variable snapshots, conditional results and incremental output. Play, pause, step back/forward, restart, scrub and change speed. Recordings come from real instrumented PHP runs; they are replayed after execution, not a live debugger. Edited code runs without tracing until reset. Recordings stop at 600 steps.
- Take randomized 5, 10 or 15-question mock interviews, scoped to a topic or mixed, with Smart Adaptive format: interactive Multiple Choice Questions (MCQs with 4 choices, scoring, and instant rationale), live Code Challenge boxes with real-time PHP 8.3 WebAssembly execution and console output, and paragraph scenario notes. Timer measures elapsed session time. Save a summary at completion.
- Review topic progress and the last 20 completed interview summaries. Persist language, theme, saved questions and progress in browser localStorage.
- Open both original source documents from the source library.
- Responsive layout, keyboard focus states, reduced-motion behavior and light/dark modes.

## Acceptance criteria
1. Every numbered source question has nonempty English and Hinglish titles and explanations, with its available PHP/SQL snippets.
2. Search and combined filters do not show unrelated results; empty states explain recovery.
3. A bookmark and learned state survive reload; failed browser storage is reported without crashing.
4. A mock has unique questions, hides references initially, requires self-rating and saves one completion summary.
5. The PHP triangle example really produces four rows. Invalid code shows an error; stopping work leaves the UI usable.
6. Trace stepping can pause and reset; modified code cannot be mistaken for traced code.
7. Both themes remain readable at 375, 768, 1024 and 1440 pixel widths.
8. Build output can be hosted as static files without a server application.

## Deliberate boundaries
No AI grading, speech recognition, recording, cloud sync, login, arbitrary package installation, database server or full Laravel runtime. Laravel/SQL snippets are reference examples requiring their own environment. The source README is preserved in full; 12 additional topics are adapted into the bilingual curriculum. Its remaining extra questions are reference-only. No claims of exhaustive source fact-checking.

## Future tracks
When another track is requested, add a track ID to question records and provide a track selector. Keep the study and mock flows shared. Do not create a backend until synchronization or multi-device accounts are required.
