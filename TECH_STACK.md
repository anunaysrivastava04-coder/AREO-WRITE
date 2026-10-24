# Technology Stack and Dependencies

This repository is a clean, standalone implementation inspired by the publicly visible AeroWrite Ultra website. It is not a download of the original Netlify source repository. Confirmed source-code dependencies of the live website cannot be determined from the rendered page alone.

## Languages

- **HTML5** — semantic page structure, controls, canvas, and metadata.
- **CSS3** — responsive layout, dark visual theme, controls, and animations.
- **JavaScript (ES6+)** — camera lifecycle, canvas drawing, gesture classification, settings, and export.

## Runtime libraries

- **MediaPipe Hands** (`@mediapipe/hands`, loaded through jsDelivr CDN) — browser-side hand landmark estimation.
- **MediaPipe Camera Utils** (`@mediapipe/camera_utils`, loaded through jsDelivr CDN) — webcam frame capture helper.
- **Google Fonts** — Manrope and DM Mono for typography.

No npm build step is required by this implementation. CDN dependencies require an internet connection on first page load. For production use, review the dependency licenses and pin versions or self-host assets according to the projects' distribution terms.

## Browser APIs

- `navigator.mediaDevices.getUserMedia` through MediaPipe camera helper for camera input.
- `HTMLCanvasElement` / Canvas 2D for drawing and PNG export.
- `localStorage` for locally saved preferences.
- `requestAnimationFrame`/browser rendering and `performance.now()` for frame timing.

## Not used in this package

No React, Vue, Angular, TypeScript, Python, backend server, database, or API key is required by this starter implementation.
