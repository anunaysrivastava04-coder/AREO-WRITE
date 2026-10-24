# AeroWrite Ultra — Testing Guide

This file is the separate testing document for the AeroWrite Ultra repository. It defines repeatable checks for the included implementation and links to the deployed website.

- **Live website:** https://areowrite.netlify.app/
- **Local application:** run the steps in [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- **Application entry point:** `index.html`
- **Application logic:** `app.js`

> Testing status: **Not yet verified in a real browser in this document.** The checklist below is a test plan, not a claim that every test has passed. Record the actual browser, device, date, and outcome when you execute it.

## 1. Test environment

Record the environment before testing:

| Field | Value to record |
|---|---|
| Test date | YYYY-MM-DD |
| Operating system | Windows / macOS / Linux / mobile OS |
| Browser and version | Chrome / Edge / Firefox / Safari + version |
| Device | Desktop / laptop / tablet / phone |
| Camera | Built-in / USB / unavailable |
| App version or commit | Git commit hash or release tag |
| Test target | Live URL or local URL |

## 2. Smoke tests

Run these first to confirm the page and its assets load.

| ID | Test | Steps | Expected result | Status |
|---|---|---|---|---|
| SM-01 | Live site opens | Visit https://areowrite.netlify.app/ | Page loads over HTTPS without a browser error | Not run |
| SM-02 | Local site opens | Follow `docs/INSTALLATION.md` and open the local URL | Application UI appears | Not run |
| SM-03 | Assets load | Open browser Developer Tools → Network and reload | `styles.css`, `app.js`, and required CDN scripts load or show actionable errors | Not run |
| SM-04 | No startup crash | Open Developer Tools → Console and reload | No uncaught application error blocks startup | Not run |
| SM-05 | Responsive layout | Test desktop and a narrow/mobile viewport | Controls remain readable and usable without unintended horizontal overflow | Not run |

## 3. Camera and hand-tracking tests

Perform these tests on HTTPS or `localhost`, with a working camera and permission granted.

| ID | Test | Steps | Expected result | Status |
|---|---|---|---|---|
| CAM-01 | Start camera | Press **START ENGINE** and allow camera permission | Camera preview or active-camera state appears | Not run |
| CAM-02 | Deny camera permission | Reset the site's camera permission, press start, and deny access | App handles denial without an unhandled crash and gives understandable feedback | Not run |
| CAM-03 | No camera available | Disable or disconnect the camera and start the app | Failure is handled with useful feedback | Not run |
| CAM-04 | Hand visible | Place one hand clearly in frame with reasonable lighting | Hand landmarks or tracking response appears when enabled | Not run |
| CAM-05 | Hand leaves frame | Move the hand out of view | Tracking stops responding to the missing hand; app remains usable | Not run |
| CAM-06 | Lighting variation | Test normal and dim lighting | Behavior degrades gracefully; limitations are observable rather than crashing | Not run |

## 4. Gesture and canvas tests

Gesture detection is heuristic, so compare the observed behavior with the expected intent rather than assuming perfect classification.

| ID | Test | Steps | Expected result | Status |
|---|---|---|---|---|
| GES-01 | Write gesture | Show only the index finger as described in the README and move it | A stroke is drawn on the canvas | Not run |
| GES-02 | Erase gesture | Raise index and middle fingers and move as described | The configured erase behavior is activated | Not run |
| GES-03 | Hover gesture | Present an open palm | Pointer/hover behavior occurs without an unintended stroke | Not run |
| GES-04 | Tracking visualization | Toggle hand-landmark visualization, if available | Landmark display changes according to the control | Not run |
| CAN-01 | Clear canvas | Draw a visible stroke, then choose **CLEAR CANVAS** | Canvas is cleared | Not run |
| CAN-02 | Export PNG | Draw a visible stroke and choose **EXPORT PNG** | A PNG download is produced and contains the visible drawing | Not run |
| CAN-03 | Stabilization/sensitivity | Change the available sensitivity or smoothing controls and draw again | Drawing behavior changes in the intended direction | Not run |

## 5. Settings and persistence tests

| ID | Test | Steps | Expected result | Status |
|---|---|---|---|---|
| CFG-01 | Save configuration | Change a setting and press **SAVE CONFIG** | App reports or performs a save without an error | Not run |
| CFG-02 | Reload persistence | Save settings, reload the page, and inspect the settings | Saved values are restored if the implementation persists them | Not run |
| CFG-03 | Fresh browser storage | Clear the site's local storage and reload | App starts with safe defaults and no crash | Not run |
| CFG-04 | Storage unavailable | If practical, simulate blocked storage in browser settings or DevTools | Failure is handled gracefully where storage access is attempted | Not run |

## 6. Accessibility and usability checks

- [ ] All interactive controls have clear labels.
- [ ] Controls can be reached and activated using a keyboard where applicable.
- [ ] Focus indicators are visible.
- [ ] Text and controls remain readable at browser zoom levels of 200%.
- [ ] Camera permission denial and loading failures are understandable.
- [ ] Color is not the only way important states are communicated.
- [ ] Motion and animation do not prevent interaction.

## 7. Security and privacy checks

- [ ] Confirm the page is served over HTTPS when deployed.
- [ ] Confirm camera access is requested only when the user starts the camera flow.
- [ ] Inspect Network requests to understand CDN and third-party requests.
- [ ] Confirm no secrets, API keys, or private user data are committed.
- [ ] Verify that any exported image is generated as expected and is not unexpectedly uploaded.
- [ ] Review third-party dependency and asset licenses before redistribution.

Camera frames and preferences should be evaluated against the actual source code and observed network behavior. Do not claim that all processing is offline solely because the project has no custom backend.

## 8. Browser compatibility matrix

Fill in the result after executing tests on each browser/device. Do not mark a browser as supported without testing it.

| Browser/device | Smoke tests | Camera | Gestures | Export | Responsive | Notes |
|---|---|---|---|---|---|---|
| Chrome desktop | Not run | Not run | Not run | Not run | Not run | |
| Edge desktop | Not run | Not run | Not run | Not run | Not run | |
| Firefox desktop | Not run | Not run | Not run | Not run | Not run | |
| Safari macOS/iOS | Not run | Not run | Not run | Not run | Not run | |
| Android browser | Not run | Not run | Not run | Not run | Not run | |

## 9. Recording a bug

For every failure, record:

1. Test ID and test date.
2. Browser, browser version, operating system, and device.
3. Whether the failure occurred on the live site or local version.
4. Exact reproduction steps.
5. Expected result and actual result.
6. Relevant Console errors, with personal data removed.
7. A screenshot or short recording, if safe to share.

## 10. Release sign-off

Before calling a release tested:

- [ ] All smoke tests have been run.
- [ ] Camera permission grant and denial paths have been checked.
- [ ] Write, erase, hover, clear, and export have been checked.
- [ ] Settings persistence has been checked.
- [ ] At least one desktop browser has been tested end to end.
- [ ] Any known failures and limitations are documented.
- [ ] README statements match observed behavior.

**Final status:** Not run. Update this status only after tests have actually been executed.
