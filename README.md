# AeroWrite Ultra — Precision Air Writing

**A browser-based air-writing experiment using webcam hand tracking.**

> Version 1.0 Beta · By Anunay Srivastava

AeroWrite Ultra explores touch-free drawing by translating visible hand gestures into strokes on a digital canvas. This repository provides a documented, standalone implementation inspired by the public-facing AeroWrite Ultra website: https://areowrite.netlify.app/.

**Repository note:** The original deployed website's full source code and package manifest were not available from the rendered page. This ZIP therefore contains a fresh implementation of the visible concept, not a verified source export of the original website. Dependency and language details below refer to the included code.

## Features

- Webcam-based hand tracking in the browser.
- Index-finger air writing on a canvas.
- Two-finger erase gesture.
- Open-palm hover mode.
- Adjustable pointer smoothing and stroke sensitivity.
- Optional hand-landmark visualization.
- Clear canvas and export drawings as PNG.
- Save interface preferences to browser local storage.
- Responsive dark interface for desktop and mobile layouts.
- No application backend or API key required by this package.

## Preview

Live site: **https://areowrite.netlify.app/**

To add a screenshot to this repository, save one as `assets/preview.png` and add the following Markdown here:

```md
![AeroWrite Ultra interface](assets/preview.png)
```

## Languages used

| Language | Usage |
|---|---|
| HTML5 | Page structure, controls, video, canvas, and metadata |
| CSS3 | Responsive design, theme, layout, and animation |
| JavaScript (ES6+) | Camera startup, tracking callbacks, gesture logic, canvas drawing, settings, and PNG export |

## Libraries and browser APIs

| Dependency / API | Purpose |
|---|---|
| MediaPipe Hands (`@mediapipe/hands`) | Detects hand landmarks in webcam frames |
| MediaPipe Camera Utils (`@mediapipe/camera_utils`) | Supplies camera frame capture helper |
| Google Fonts: Manrope, DM Mono | UI typography |
| Canvas 2D API | Renders strokes and hand landmark overlays |
| `getUserMedia` / browser camera support | Camera access, mediated by the camera helper |
| `localStorage` | Stores user preferences locally |

The MediaPipe scripts and fonts are loaded from CDNs. An internet connection is required for those assets unless you configure local copies. See [`docs/TECH_STACK.md`](docs/TECH_STACK.md) for more detail.

## Project structure

```text
aerowrite-ultra/
├── index.html             # App structure and UI controls
├── styles.css             # Responsive styles and visual design
├── app.js                 # Camera, gesture detection, canvas, settings
├── README.md              # Project overview and setup
├── LICENSE                # MIT license for this repository's original code
├── .gitignore             # Ignore local and generated files
└── docs/
    ├── INSTALLATION.md    # Run and troubleshoot the project
    └── TECH_STACK.md      # Languages, libraries, and APIs
```

## Requirements

- A modern browser with JavaScript enabled.
- A webcam.
- HTTPS or `localhost` for browser camera permissions.
- Internet access for the CDN-hosted MediaPipe assets and fonts.

## Run locally

### Option A — Python static server

Install Python if needed, open a terminal in the project folder, and run:

```bash
python -m http.server 8000
```

Open **http://localhost:8000** in your browser.

### Option B — VS Code Live Server

1. Open the folder in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click `index.html` and select **Open with Live Server**.
4. Allow camera access when prompted.

Avoid opening the file directly with `file://`, because browser camera access may be blocked.

## How to use

1. Press **START ENGINE**.
2. Approve webcam access.
3. Keep one hand clearly visible in the camera view.
4. Raise only your index finger to write.
5. Raise your index and middle fingers to erase as you move.
6. Open your palm to hover without drawing.
7. Use **CLEAR CANVAS** or **EXPORT PNG** as needed.
8. Adjust settings and press **SAVE CONFIG** to retain them in the same browser.

Gesture recognition is a simple landmark-based heuristic and can be affected by lighting, camera angle, and hand orientation.

## Configuration and privacy

- Camera frames are processed in the browser by the loaded MediaPipe runtime in this implementation.
- The app has no custom backend, database, login, or API key requirement.
- Settings are stored in the current browser's local storage.
- CDN-hosted scripts and fonts are requested from their respective providers.
- Do not assume zero network traffic: CDN requests occur, and browser behavior depends on configuration.
- Review third-party dependency licenses and pin or self-host assets for a production deployment.

## Deployment

This is a static website and can be deployed to Netlify, GitHub Pages, or another static hosting provider. Configure the published directory as the repository root. Camera access on the public site requires HTTPS.

## Known limitations

- The gesture classifier is intentionally lightweight and may misclassify poses.
- Camera performance depends on browser, device, and lighting.
- External CDN availability affects initial loading.
- The sensitivity control scales drawing width; it is not a calibrated computer-vision confidence threshold.
- This package is a concept implementation and is not represented as the original source code of the live deployment.

## Roadmap

- [ ] Add screenshot and short demo GIF.
- [ ] Add a clear calibration and camera preview flow.
- [ ] Improve gesture classification and low-light feedback.
- [ ] Add optional brush colors and adjustable eraser size.
- [ ] Add automated browser tests.
- [ ] Pin and document third-party dependency versions for production.

## Contributing

Issues and pull requests are welcome. Please describe the browser, operating system, camera setup, and steps to reproduce any bug. Do not commit private images, credentials, or large downloaded model assets.

## License

The included original project files are licensed under the MIT License. Third-party libraries, models, and hosted assets remain subject to their own license terms. Review those terms before redistribution.

## Credits

**Created by Anunay Srivastava**  
Live website: https://areowrite.netlify.app/
