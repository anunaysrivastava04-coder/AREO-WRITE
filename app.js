(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const video = $('inputVideo');
  const canvas = $('drawCanvas');
  const ctx = canvas.getContext('2d');
  const stage = $('stage');
  const status = $('status');
  const statusText = $('statusText');
  const placeholder = $('placeholder');
  const startButton = $('startButton');
  const sensitivity = $('sensitivity');
  const stabilizer = $('stabilizer');
  const visualization = $('visualization');
  const settings = { sensitivity: 55, stabilizer: 65, visualization: true };
  let camera = null, hands = null, running = false, lastPoint = null, smoothPoint = null;
  let lastFrameTime = 0, fps = 0, currentGesture = '—';

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const old = document.createElement('canvas'); old.width = canvas.width; old.height = canvas.height;
    old.getContext('2d').drawImage(canvas, 0, 0);
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (old.width && old.height) ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, rect.width, rect.height);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }
  function setStatus(text, active = false) {
    statusText.textContent = text;
    status.classList.toggle('running', active);
  }
  function updateSettingsUI() {
    $('sensitivityOut').textContent = `${sensitivity.value}%`;
    $('stabilizerOut').textContent = `${stabilizer.value}%`;
    $('visualizationOut').textContent = visualization.checked ? 'ON' : 'OFF';
  }
  function loadConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem('aerowrite-config') || 'null');
      if (saved) {
        sensitivity.value = saved.sensitivity ?? settings.sensitivity;
        stabilizer.value = saved.stabilizer ?? settings.stabilizer;
        visualization.checked = saved.visualization ?? settings.visualization;
      }
    } catch (_) { /* Ignore malformed local settings. */ }
    updateSettingsUI();
  }
  function saveConfig() {
    const config = { sensitivity: Number(sensitivity.value), stabilizer: Number(stabilizer.value), visualization: visualization.checked };
    try { localStorage.setItem('aerowrite-config', JSON.stringify(config)); $('configNote').textContent = 'Configuration saved in this browser.'; }
    catch (_) { $('configNote').textContent = 'Browser storage is unavailable; settings were not saved.'; }
  }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function fingerUp(lm, tip, pip) { return lm[tip].y < lm[pip].y; }
  function detectGesture(lm) {
    const index = fingerUp(lm, 8, 6), middle = fingerUp(lm, 12, 10), ring = fingerUp(lm, 16, 14), pinky = fingerUp(lm, 20, 18);
    if (index && !middle && !ring && !pinky) return 'WRITE';
    if (index && middle && !ring && !pinky) return 'ERASE';
    if (index && middle && ring && pinky) return 'HOVER';
    return 'IDLE';
  }
  function drawLandmarks(lm, w, h) {
    if (!visualization.checked || !hands) return;
    ctx.save(); ctx.fillStyle = '#59e1d0';
    for (const p of lm) { ctx.beginPath(); ctx.arc((1 - p.x) * w, p.y * h, 2.3, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#59e1d088'; ctx.lineWidth = 1;
    const links = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
    for (const [a,b] of links) { ctx.beginPath(); ctx.moveTo((1-lm[a].x)*w,lm[a].y*h); ctx.lineTo((1-lm[b].x)*w,lm[b].y*h); ctx.stroke(); }
    ctx.restore();
  }
  function onResults(results) {
    if (!running) return;
    const now = performance.now(); if (lastFrameTime) fps = Math.round(1000 / (now - lastFrameTime)); lastFrameTime = now;
    const rect = stage.getBoundingClientRect(), w = rect.width, h = rect.height;
    if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) {
      lastPoint = null; smoothPoint = null; currentGesture = '—'; $('gestureLabel').textContent = 'GESTURE: —'; $('fpsLabel').textContent = `ENGINE ACTIVE · ${fps} FPS`; return;
    }
    const lm = results.multiHandLandmarks[0];
    const gesture = detectGesture(lm); currentGesture = gesture;
    const raw = { x: (1 - lm[8].x) * w, y: lm[8].y * h };
    const blend = Math.max(.08, 1 - Number(stabilizer.value) / 100);
    if (!smoothPoint) smoothPoint = raw;
    else { smoothPoint.x += (raw.x - smoothPoint.x) * blend; smoothPoint.y += (raw.y - smoothPoint.y) * blend; }
    const point = smoothPoint;
    const scale = Number(sensitivity.value) / 55;
    $('gestureLabel').textContent = `GESTURE: ${gesture}`;
    $('fpsLabel').textContent = `ENGINE ACTIVE · ${fps} FPS`;
    if (gesture === 'WRITE') {
      if (lastPoint) { ctx.strokeStyle = '#8b7cff'; ctx.lineWidth = 3.2 * scale; ctx.beginPath(); ctx.moveTo(lastPoint.x,lastPoint.y); ctx.lineTo(point.x,point.y); ctx.stroke(); }
      lastPoint = { ...point };
    } else if (gesture === 'ERASE') {
      lastPoint = null; ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(point.x,point.y,24,0,Math.PI*2); ctx.fill(); ctx.restore();
    } else { lastPoint = null; }
    drawLandmarks(lm, w, h);
  }
  async function startEngine() {
    if (running) { await stopEngine(); return; }
    if (!navigator.mediaDevices?.getUserMedia) { $('notice').textContent = 'This browser does not support camera access. Try a current version of Chrome, Edge, or Firefox over HTTPS or localhost.'; return; }
    if (typeof Hands === 'undefined' || typeof Camera === 'undefined') { $('notice').textContent = 'Hand-tracking libraries could not load. Check your internet connection and reload the page.'; return; }
    try {
      setStatus('Requesting camera…'); $('notice').textContent = 'Waiting for camera permission…';
      hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.55, minTrackingConfidence: 0.5 });
      hands.onResults(onResults);
      camera = new Camera(video, { onFrame: async () => { if (running && hands) await hands.send({ image: video }); }, width: 640, height: 480 });
      await camera.start(); running = true; placeholder.style.display = 'none'; video.style.opacity = '.32';
      startButton.textContent = '■ STOP ENGINE'; setStatus('Engine running', true); $('notice').textContent = 'Camera connected. Hold your hand in view and try the gestures.';
    } catch (err) {
      running = false; setStatus('Camera unavailable'); startButton.textContent = '▶ START ENGINE';
      $('notice').textContent = `Could not start camera: ${err?.message || 'permission denied or device unavailable'}. Check browser permissions and close other apps using the camera.`;
      try { if (camera) camera.stop(); } catch (_) {}
    }
  }
  async function stopEngine() {
    running = false;
    try { if (camera) camera.stop(); } catch (_) {}
    try { if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop()); } catch (_) {}
    video.srcObject = null; camera = null; lastPoint = null; smoothPoint = null;
    if (hands) { try { hands.close(); } catch (_) {} hands = null; }
    placeholder.style.display = 'flex'; video.style.opacity = '.27'; startButton.textContent = '▶ START ENGINE';
    setStatus('Camera disconnected'); $('gestureLabel').textContent = 'GESTURE: —'; $('fpsLabel').textContent = 'ENGINE IDLE'; $('notice').textContent = 'Engine stopped. Your canvas remains until you clear it.';
  }
  startButton.addEventListener('click', startEngine);
  $('clearButton').addEventListener('click', () => { ctx.clearRect(0,0,canvas.width,canvas.height); lastPoint = null; $('notice').textContent = 'Canvas cleared.'; });
  $('saveImageButton').addEventListener('click', () => {
    const link = document.createElement('a'); link.download = 'aerowrite-canvas.png'; link.href = canvas.toDataURL('image/png'); link.click();
  });
  $('saveConfigButton').addEventListener('click', saveConfig);
  [sensitivity, stabilizer, visualization].forEach(el => el.addEventListener('input', updateSettingsUI));
  window.addEventListener('resize', resizeCanvas);
  $('year').textContent = new Date().getFullYear();
  resizeCanvas(); loadConfig();
})();
