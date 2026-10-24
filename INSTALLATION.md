# Installation and Usage

## Quick start

1. Download or clone the repository.
2. Serve the directory from `localhost` (recommended) or deploy it to an HTTPS static host such as Netlify or GitHub Pages.
3. Open `index.html` in the browser through that local server or HTTPS site.
4. Press **START ENGINE** and grant camera permission.
5. Hold one hand clearly in view.

Camera access may be blocked when the page is opened from a `file://` URL. Use a local static server, for example with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Gestures in this implementation

- **Write:** index finger raised while the other three fingers are down.
- **Erase:** index and middle fingers raised while ring and little fingers are down; move the fingertip over strokes to erase.
- **Hover:** all four fingers raised; pointer movement does not draw.
- **Other poses:** stop drawing.

Gesture detection is heuristic and may vary with camera angle, lighting, hand orientation, and tracking quality. This is a starter implementation, not a medical or accessibility-certified input system.

## Controls

- **Acquisition sensitivity:** changes the drawing stroke width scale.
- **Motion stabilizer:** smooths pointer movement.
- **Hand visualization:** toggles hand landmarks.
- **Save config:** stores preferences in this browser's local storage.
- **Clear canvas:** clears the drawing.
- **Export PNG:** downloads the canvas as an image.

## Troubleshooting

- **Camera is denied:** check the browser's site permissions and ensure no other application is exclusively using the camera.
- **Libraries fail to load:** verify internet access and CDN availability, then reload.
- **Camera API is unavailable:** use HTTPS or `localhost` in a modern browser.
- **Tracking is unreliable:** improve lighting, keep the full hand in frame, and avoid busy backgrounds.
