'use strict';
// ============ CORE ENGINE ============
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScEBWG-eNZtHLRsE3UGFzSHuftOSY8TWz5Wi_yBXUYC60spWw/formResponse';
const FORM_ENTRY = 'entry.285694448';

const $ = s => document.querySelector(s);
const canvas = $('#game');
const ctx = canvas.getContext('2d');
const G = {
  W: 320, H: 180, t: 0, dt: 0, keys: {}, pressed: {},
  mouse: { x: 0, y: 0, down: false, clicked: false },
  scene: null, busy: 0, fade: 1, fadeColor: '0,0,0', shake: 0,
  flags: {}, items: [], cranes: 0, hud: true, glitch: 0, dlgHandler: null, overlay: null,
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function setRes(w, h) { G.W = w; G.H = h; canvas.width = w; canvas.height = h; ctx.imageSmoothingEnabled = false; }
function fit() {
  const st = $('#stage');
  const w = Math.min(innerWidth, innerHeight * 16 / 9);
  st.style.width = w + 'px'; st.style.height = (w * 9 / 16) + 'px';
  st.style.setProperty('--u', (w / 100) + 'px');
}
addEventListener('resize', fit); fit();

// ---------- input ----------
const KEYMAP = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', Space: 'jump', KeyQ: 'q', KeyE: 'e', Enter: 'enter', NumpadEnter: 'enter', Digit1: '1', Digit2: '2', Digit3: '3', Escape: 'esc' };
addEventListener('keydown', e => {
  Sfx.unlock();
  if (document.activeElement && document.activeElement.id === 'askInput') return;
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault();
  if (!G.keys[k]) G.pressed[k] = true;
  G.keys[k] = true;
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) G.keys[k] = false; });
addEventListener('blur', () => { G.keys = {}; });
function canvasPos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * G.W, y: (e.clientY - r.top) / r.height * G.H }; }
canvas.addEventListener('mousemove', e => { const p = canvasPos(e); G.mouse.x = p.x; G.mouse.y = p.y; });
canvas.addEventListener('mousedown', e => { Sfx.unlock(); const p = canvasPos(e); G.mouse.x = p.x; G.mouse.y = p.y; G.mouse.down = true; G.mouse.clicked = true; });
addEventListener('mouseup', () => { G.mouse.down = false; });
$('#dlg').addEventListener('mousedown', () => { if (G.dlgHandler) G.dlgHandler(); });

// ---------- timers & tweens (game time) ----------
const timers = [], tweens = [];
const wait = s => new Promise(r => timers.push({ t: s, r }));
function tween(obj, key, to, dur, ease = easeInOut) {
  return new Promise(res => { tweens.push({ obj, key, from: obj[key], to, dur: Math.max(dur, 0.0001), t: 0, ease, res }); });
}
function updateTimers(dt) {
  for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= dt; if (timers[i].t <= 0) { const r = timers[i].r; timers.splice(i, 1); r(); } }
  for (let i = tweens.length - 1; i >= 0; i--) {
    const w = tweens[i]; w.t += dt; const k = Math.min(1, w.t / w.dur);
    w.obj[w.key] = w.from + (w.to - w.from) * w.ease(k);
    if (k >= 1) { tweens.splice(i, 1); w.res(); }
  }
}
const fadeOut = (d = .7, col = '0,0,0') => { G.fadeColor = col; return tween(G, 'fade', 1, d); };
const fadeIn = (d = .7) => tween(G, 'fade', 0, d);
function waitKey(keys = ['e', 'enter', 'jump', 'q']) {
  return new Promise(res => { G.keyWaiter = { keys, res }; });
}

// ---------- audio ----------
const Music = {
  cur: null, name: null, vol: .55,
  files: {
    pool: 'assets/audio/in_the_pool.mp3',
    stay: 'assets/audio/i_really_want_to_stay_at_your_house.mp3',
    sea: 'assets/audio/in_the_sea.mp3',
  },
  play(name, fade = 1.2) {
    if (this.name === name) return;
    this.stop(.6);
    this.name = name;
    const a = new Audio(this.files[name]); a.loop = true; a.volume = 0;
    a.play().catch(() => {});
    this.cur = a; this.fadeTo(a, this.vol, fade);
  },
  stop(fade = .4) {
    const a = this.cur; if (!a) return; this.cur = null; this.name = null;
    if (fade <= 0) { a.pause(); return; }
    this.fadeTo(a, 0, fade, () => a.pause());
  },
  cut() { if (this.cur) { this.cur.pause(); this.cur = null; this.name = null; } },
  fadeTo(a, v, d, done) {
    const v0 = a.volume, t0 = performance.now();
    const step = () => { const k = Math.min(1, (performance.now() - t0) / (d * 1000)); try { a.volume = clamp(v0 + (v - v0) * k, 0, 1); } catch (e) {} if (k < 1) requestAnimationFrame(step); else done && done(); };
    step();
  }
};
const Sfx = {
  ac: null,
  unlock() { if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ac && this.ac.state === 'suspended') this.ac.resume(); },
  tone(f = 440, d = .08, type = 'square', v = .04, slide = 0, delay = 0) {
    const ac = this.ac; if (!ac) return;
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .02);
  },
  noise(d = .3, v = .2, lp = 800, delay = 0) {
    const ac = this.ac; if (!ac) return;
    const len = Math.floor(ac.sampleRate * d), b = ac.createBuffer(1, len, ac.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ac.createBufferSource(); s.buffer = b; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp;
    const g = ac.createGain(); g.gain.value = v; s.connect(f).connect(g).connect(ac.destination); s.start(ac.currentTime + delay);
  },
  blip() { this.tone(660 + Math.random() * 80, .03, 'square', .015); },
  ding() { this.tone(1320, .15, 'sine', .08); this.tone(1760, .25, 'sine', .06, 0, .1); },
  boom() { this.tone(90, .8, 'sine', .35, -60); this.noise(.9, .35, 300); },
  shot() { this.noise(.08, .25, 3000); this.tone(300, .06, 'square', .05, -200); },
  ping() { this.tone(1800, .08, 'triangle', .05); },
  hit() { this.tone(520, .1, 'square', .06, 300); },
  item() { [880, 1100, 1320, 1760].forEach((f, i) => this.tone(f, .12, 'square', .04, 0, i * .07)); },
  jump() { this.tone(330, .12, 'square', .03, 300); },
  splash() { this.noise(.4, .2, 1200); },
  pop() { this.noise(.5, .25, 900); this.tone(200, .3, 'sine', .08, 400); },
  sneeze() { this.noise(.25, .18, 2500); },
  glitch() { for (let i = 0; i < 6; i++) this.tone(100 + Math.random() * 1400, .05, 'sawtooth', .03, 0, i * .05); this.noise(.4, .12, 5000); },
  whoosh() { this.noise(1.2, .2, 600); },
  crane() { this.tone(1046, .08, 'triangle', .05); this.tone(1568, .14, 'triangle', .05, 0, .07); },
};

// ---------- UI: dialogue, ask, hint, caption, toast ----------
const dlg = $('#dlg'), dlgName = dlg.querySelector('.name'), dlgText = dlg.querySelector('.text');
function showLine(l) {
  return new Promise(res => {
    let who = '', text = l;
    if (Array.isArray(l)) { who = l[0]; text = l[1]; }
    dlgName.textContent = who; dlgName.style.display = who ? '' : 'none';
    dlgName.className = 'name ' + (who || '').toLowerCase();
    dlg.style.display = 'block';
    let i = 0; dlgText.textContent = '';
    const typer = setInterval(() => {
      if (i >= text.length) { clearInterval(typer); return; }
      i++; dlgText.textContent = text.slice(0, i); if (i % 2) Sfx.blip();
    }, 26);
    G.dlgHandler = () => {
      if (i < text.length) { i = text.length; dlgText.textContent = text; clearInterval(typer); }
      else { clearInterval(typer); G.dlgHandler = null; res(); }
    };
  });
}
async function say(...lines) {
  // each arg: a string, a [who,text] pair, or an array of those
  lines = lines.flatMap(l => (Array.isArray(l) && (Array.isArray(l[0]) || l.length === 0)) ? l : [l]).filter(Boolean);
  G.busy++;
  try { for (const l of lines) await showLine(l); }
  finally { dlg.style.display = 'none'; G.busy--; }
}
const S = t => ['Sabrina', t], B = t => ['Brian', t];

const askBox = $('#ask'), askInput = $('#askInput'), askMask = askBox.querySelector('.mask');
function ask(label, opts = {}) {
  G.busy++; G.keys = {};
  return new Promise(res => {
    askBox.querySelector('.label').textContent = label;
    askBox.classList.toggle('masked', !!opts.mask);
    askInput.value = ''; askMask.textContent = '';
    askBox.style.display = 'block';
    setTimeout(() => askInput.focus(), 30);
    const onInput = () => { askMask.textContent = '…'.repeat(Math.min(40, Math.ceil(askInput.value.length / 2))); };
    const onKey = e => {
      e.stopPropagation();
      if (e.key === 'Enter' && !e.isComposing) {
        const v = askInput.value.trim();
        if (!v && !opts.allowEmpty) return;
        askInput.removeEventListener('keydown', onKey); askInput.removeEventListener('input', onInput);
        askBox.style.display = 'none'; askInput.blur(); G.busy--; G.keys = {};
        res(v);
      }
    };
    askInput.addEventListener('keydown', onKey); askInput.addEventListener('input', onInput);
    G._askSubmit = (v) => { askInput.value = v; onKey({ key: 'Enter', stopPropagation() {} }); };
  });
}
// keep focus on the input while it is open
document.addEventListener('mousedown', () => { if (askBox.style.display === 'block') setTimeout(() => askInput.focus(), 0); });

function hint(t) { const h = $('#hint'); if (!t) { h.style.display = 'none'; return; } h.textContent = t; h.style.display = 'block'; }
async function caption(c1, c2 = '', dur = 2.6) {
  const c = $('#caption'); c.querySelector('.c1').textContent = c1; c.querySelector('.c2').textContent = c2;
  c.style.opacity = 1; await wait(dur); c.style.opacity = 0; await wait(.9);
}
let toastT = null;
function toast(t) { const el = $('#toast'); el.textContent = t; el.style.opacity = 1; clearTimeout(toastT); toastT = setTimeout(() => el.style.opacity = 0, 2600); }
function giveItem(id, name) { if (!G.items.includes(id)) G.items.push(id); Sfx.item(); toast('✦ Got: ' + name); }

function photoPop(src, cap) {
  G.busy++;
  return new Promise(res => {
    const p = $('#photoPop'); p.querySelector('img').src = src; p.querySelector('.cap').textContent = cap; p.style.display = 'flex';
    setTimeout(() => { G.keyWaiter = { keys: ['q', 'e', 'enter', 'esc'], res: () => { p.style.display = 'none'; G.busy--; res(); } }; }, 250);
  });
}

function sendWish(text) {
  try {
    const log = JSON.parse(localStorage.getItem('brian_answers') || '[]'); log.push({ text, at: new Date().toISOString() });
    localStorage.setItem('brian_answers', JSON.stringify(log));
  } catch (e) {}
  try {
    const body = new URLSearchParams(); body.append(FORM_ENTRY, text);
    fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
  } catch (e) {}
}

// ---------- scenes ----------
async function goto(sc, opts = {}) {
  if (G.scene && !opts.cut) await fadeOut(opts.fadeOut ?? .8);
  if (G.scene && G.scene.exit) G.scene.exit();
  hint(''); G.keys = {};
  G.scene = sc;
  const r = sc.res || [320, 180]; setRes(r[0], r[1]);
  if (!sc.inited || opts.fresh) { sc.inited = true; sc.init && sc.init(opts); }
  else sc.resume && sc.resume(opts);
  if (!opts.stayDark) fadeIn(opts.fadeIn ?? .8);
  if (sc.script) sc.script(opts);
}

// ---------- main loop ----------
function step(dt) {
  G.dt = dt; G.t += dt;
  updateTimers(dt);
  if (G.dlgHandler && (G.pressed.e || G.pressed.enter || G.pressed.jump || G.pressed.q)) { const h = G.dlgHandler; G.pressed = {}; h(); }
  if (G.keyWaiter && G.keyWaiter.keys.some(k => G.pressed[k])) { const w = G.keyWaiter; G.keyWaiter = null; G.pressed = {}; w.res(); }
  if (G.scene && G.scene.update) G.scene.update(dt);
  // draw
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H);
  if (G.shake > 0) { G.shake = Math.max(0, G.shake - dt * 2); ctx.translate(Math.round((Math.random() - .5) * G.shake * 10), Math.round((Math.random() - .5) * G.shake * 10)); }
  if (G.scene && G.scene.draw) G.scene.draw(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (G.glitch > 0) Art.glitch(ctx, G.glitch);
  if (G.fade > 0.001) { ctx.fillStyle = `rgba(${G.fadeColor},${G.fade})`; ctx.fillRect(0, 0, G.W, G.H); }
  G.pressed = {}; G.mouse.clicked = false;
}
let lastT = performance.now();
function frame(now) { const dt = Math.min(.05, (now - lastT) / 1000); lastT = now; if (!G.manual) step(dt); requestAnimationFrame(frame); }
