# Gates: InterPrep

Scope: Frontend interview study app with bilingual content, mock practice, audio and code execution.

- [x] G1: Curriculum preserves all numbered updated-guide questions and both source documents
  CHECK: node scripts/check.mjs
  EXPECT: CONTENT_AND_LOGIC_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=1e6f4e885e3b847d316b5efe85ccb6eed49c232a27c4974cd58ed1341de83f2e; exit=0; EXPECT=matched; output-sha256=44a0091580191fba042c3f17e0190edbc7a45b173c22f44aa87083528d552358; output-bytes=21; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Aashish\Videos\Projects\InterPrep; path=80fc3c0b7b4c/52 entries

- [x] G2: Production assets build successfully
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=915139963ee5ce08677c36a9314ed98f437f65165f03ac6b21b1745ed79a0210; output-bytes=3079; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Aashish\Videos\Projects\InterPrep; path=80fc3c0b7b4c/52 entries

- [x] G3: Browser study, search, language, saved progress and mock interview flows work
  EVIDENCE: Browser checks: bilingual search, saved/learned persistence across reload, recall and five-question self-rated mock completion; see docs/VERIFICATION.md.

- [x] G4: PHP execution, trace controls and audio controls work with honest fallback states
  EVIDENCE: Browser PHP triangle produced four rows; edited PHP returned 42; syntax error and stop recover; speech controls pause/resume/stop verified.

- [x] G5: Responsive light and dark views remain readable and keyboard accessible
  EVIDENCE: 375px mobile study/code and dark-theme captures, 1440px desktop; no horizontal document overflow. Earlier 768/1024 checks and mobile keyboard Escape passed.

- [x] G6: PRD, architecture, content policy and run instructions describe the implemented app
  EVIDENCE: README, docs/PRD.md, docs/ARCHITECTURE.md, docs/CONTENT.md and docs/VERIFICATION.md describe scope and limitations.

- [x] G7: The language toggle changes learning content but leaves page titles and controls in English
  EVIDENCE: Browser Hinglish switch changed triangle question, explanation and step text; h1, navigation, buttons and labels stayed English.

- [x] G8: Recorded PHP execution replays actual line visits, variables and output with play, pause, back, step, reset and speed controls
  EVIDENCE: Actual browser triangle recorded 48 steps; pause, previous, next, restart, speed and slider verified. Local PHP parity script passed all 42 allowed examples.
