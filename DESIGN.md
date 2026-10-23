---
name: InterPrep
description: Code with Animation inspired warm reading surface with rich code blocks and pink actions.
colors:
  bg: "#fff7e6"
  surface: "#ffffff"
  surface-2: "#fffbef"
  ink: "#1b1a17"
  ink-soft: "#4f4c44"
  ink-mute: "#6b6757"
  hairline: "#efe7d3"
  hairline-2: "#e7dec8"
  pink: "#ff477e"
  pink-press: "#e22e66"
  warning: "#f2994a"
  warning-soft: "#fcefe0"
  teal: "#16b8a6"
  teal-soft: "#e2f6f3"
  sun: "#ffd23f"
  shadow-raised: "0 2px 4px rgba(27, 26, 23, 0.05), 0 14px 34px rgba(27, 26, 23, 0.08)"
typography:
  display:
    fontFamily: "'Geist', 'Inter', system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.03em"
  headline:
    fontFamily: "'Geist', 'Inter', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-.025em"
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  code:
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.85
rounded:
  pill: "9999px"
  input: "12px"
  button: "10px"
  card: "16px"
  code-window: "16px"
spacing:
  control-gap: "8px"
  panel-inset: "22px"
  study-gap: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-label}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.input}"
    padding: "12px"
  navigation-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.button}"
    padding: "12px"
  chip-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.chip}"
    padding: "7px 10px"
  reading-tip:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.panel}"
    padding: "22px"
  execution-stage:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.stage}"
---

## Overview

**Creative North Star: "Read clearly. Watch the code."**

Warm cream surfaces and pink actions support a calm, reading-first interview workspace inspired by codewithanimation.in's documentation reading experience. Inter carries explanations and controls; JetBrains Mono with Consolas fallback renders code. Page edges carry a subtle blue-violet gradient glow that creates depth without distraction.

This records the implemented cascade: `src/style.css` supplies base controls and layouts; `src/reference.css`, imported afterward, supplies the current visual identity. `src/CodeLab.jsx` supplies playback behavior. `index.html` loads JetBrains Mono from Google Fonts.

**Key Characteristics:**
- Cream paper (#fdf6e3) with restrained pink state highlights and subtle page-edge gradient glow.
- Generous explanation text (17px/1.95) and compact supporting controls.
- Visible source, variables and output linked by the current execution step.
- Teal-accented interview tip callouts, warm-toned inline code badges.
- JetBrains Mono for all code rendering.

## Colors

Primary pink identifies actions, selection, active lines and changed variables. Primary-soft is the supporting wash; primary-text supplies darker text on that wash. Paper, surface, soft and code distinguish layers with warm neutrals. Line provides quiet separation; muted carries secondary labels.

**The Semantic Color Rule.** Use the CSS semantic variables so both themes preserve the same state relationships.

The dark theme replaces the same roles with warm charcoal surfaces and light pink actions. Exact dark overrides and syntax colors are recorded in the sidecar; the frontmatter represents the default light theme.

## Typography

Inter with a sans-serif fallback is the interface and reading face. Source, line numbers, variable values, console output and execution counts use JetBrains Mono with Consolas and monospace fallback. Loaded Inter weights are 400, 500, 600 and 700; CSS requests 700 for headings. JetBrains Mono is loaded from Google Fonts at weights 400 and 500.

Main page headings use display (40px/700), answer headings use headline (32px/700), and explanation paragraphs use body (17px/1.95), with a maximum reading measure of 70ch. Inline code uses a distinct warm badge style with code-inline-bg background and code-inline-text color. Supporting lesson text is 15px with 1.85 leading. Navigation and action labels remain compact; secondary execution labels range from 9px to 11px. Console output is 14px with 1.8 leading.

**The Content Language Rule.** English/Hinglish changes questions, answers and explanations. Navigation, page titles, buttons and labels remain English.

## Layout

Desktop uses a 205px navigation rail and a fluid main area capped at 1400px, with 45px vertical and 40px horizontal padding. The study view pairs a 265px question browser with flexible reading content and a 36px gap. The browser is sticky at 20px and internally scrollable. Reading content is open on the paper surface.

The code lab is capped at 1100px. Source and execution state share a bordered stage in a 1.12:1 grid. Variables sit above output on the right. Source and output scroll independently; active source lines are kept visible without animated scrolling.

At 1200px and below, spacing and type tighten. At 1023px and below, the rail is 180px and code source moves above a two-column variables/output region. At 767px and below, navigation becomes a 240px drawer, study panels stack, the question browser is capped at 295px, and source, variables and output stack vertically. Mobile main padding is 29px 20px; explanation text retains 16px/1.9 leading. Playback controls wrap. Compact embedded labs also stack source above state.

## Elevation & Depth

Depth comes primarily from tonal surfaces and thin borders. The selected question uses an inset pink outline. The active language button retains a subtle shadow (`0 1px 3px #1733230a`). No floating-card shadow system is used.

## Shapes

Controls have gently rounded corners; larger teaching containers use the panel and stage radii. Source rows stay rectangular to preserve line continuity. One-pixel borders separate panes and table rows. Small circular status dots mark runtime state.

## Components

- **Buttons:** Pink primary, bordered surface secondary and transparent quiet variants. General controls have a 42px minimum height; compact playback buttons use 36px. Hover changes color on fine pointers, active reduces opacity, disabled uses 0.45 opacity. Keyboard focus is a 3px accent outline offset by 3px.
- **Inputs:** Surface fill, line border and input radius. The search field places an unbordered input inside its shared bordered shell. Use native selects and range controls with visible labels.
- **Navigation and chips:** Active navigation receives a pink wash; selected topic chips use the same state family. The topic strip scrolls horizontally when needed.
- **Reading containers:** The question browser is bounded and scrollable; explanation text remains on the page. Tips use a soft filled panel. Resource and mock interview cards retain bordered surface fills.
- **Execution stage:** Numbered syntax-highlighted source pairs with variables and actual output. The active line has an arrow and wash; changed variables receive the wash. Run records execution, playback offers previous/play/next/restart, speed, reset and a timeline. Errors occupy a bordered pink wash alert. Explanations update in a polite live region.

**The Observable Step Rule.** Keep the current source line, variable changes and cumulative output tied to the same recorded frame.

Button color transitions last 160ms; source and variable highlights last 180ms with ease. Runtime status breathes over 1.2s only when reduced motion is not requested. Reduced motion removes highlight transitions and runtime animation, and recorded execution starts paused. Manual playback remains available at 0.5x, 1x, 1.5x and 2x; normal playback advances one step per second at 1x.

## Do's and Don'ts

- **Do** preserve warm semantic surfaces across light and dark themes.
- **Do** keep long explanations readable and code independently scrollable.
- **Do** retain explicit playback controls and reduced-motion behavior.
- **Don't** translate interface controls when changing the content language.
- **Don't** use autonomous decorative motion in the reading workspace.
- **Don't** separate a highlighted source line from its corresponding recorded state.
