'use strict';
// ============ PIXEL ART ============
const LOOK = {
  brian: { hair: 'short', hc: '#17141f', hh: '#3d3560', skin: '#f2c9a9', shirt: '#6d8ed8', stripe: '#c9d6f6', pants: '#1b1a26', shoe: '#f2f0ea', eye: '#16121e' },
  sabLong: { hair: 'long', hc: '#120f19', hh: '#2e2840', hl: '#f2d062', skin: '#f7d4bb', shirt: '#4b3c4a', skirt: '#1c1a24', sock: '#f3f1ee', shoe: '#17151d', eye: '#1c1220', blush: '#f29ab2' },
  sabBob: { hair: 'bob', hc: '#5c1430', hh: '#93305a', skin: '#f7d4bb', shirt: '#4b3c4a', skirt: '#1c1a24', sock: '#f3f1ee', shoe: '#17151d', eye: '#1c1220', blush: '#f29ab2' },
  daniel: { hair: 'short', hc: '#4c3426', hh: '#6e4d38', skin: '#efc3a0', shirt: '#4d8a6a', pants: '#3d4f7a', shoe: '#e6e2da', eye: '#1a1418' },
  celine: { hair: 'long', hc: '#5a3826', hh: '#7a5238', skin: '#f6d0b4', shirt: '#f0a8c0', pants: '#ece4f2', shoe: '#ffffff', eye: '#1a1418', blush: '#f29ab2' },
  doyun: { hair: 'cap', hc: '#17141f', cap: '#c04a58', skin: '#ecc19e', shirt: '#8b8ba0', pants: '#2a2a3a', shoe: '#ddd', eye: '#1a1418' },
  heeji: { hair: 'pony', hc: '#7a3a22', hh: '#a0553a', skin: '#f6d2b6', shirt: '#f0d070', skirt: '#6a5a8a', sock: '#f3f1ee', shoe: '#2a2030', eye: '#1a1418', blush: '#f29ab2' },
};
const sabLook = () => G.flags.bob ? LOOK.sabBob : LOOK.sabLong;

const FONT = (() => {
  const d = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
    '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001110',
    ' ': '000000000000000', '.': '000000000000010', ':': '000010000010000', '-': '000000111000000', '!': '010010010000010', '?': '110001010000010',
    "'": '010010000000000', '/': '001001010100100', '&': '010101010101011', '♥': '101111111010000', ',': '000000000010100', '+': '000010111010000', '*': '101010101000000',
  };
  return d;
})();

const Art = {
  // text with 3x5 bitmap font
  text(c, s, x, y, col = '#fff', sc = 1, align = 'left') {
    s = String(s).toUpperCase();
    const w = s.length * 4 * sc - sc;
    if (align === 'center') x -= w / 2; else if (align === 'right') x -= w;
    x = Math.round(x); y = Math.round(y);
    c.fillStyle = col;
    for (let i = 0; i < s.length; i++) {
      const g = FONT[s[i]] || FONT['?'];
      for (let k = 0; k < 15; k++) if (g[k] === '1') c.fillRect(x + i * 4 * sc + (k % 3) * sc, y + Math.floor(k / 3) * sc, sc, sc);
    }
    return w;
  },
  sky(c, w, h, stops) {
    const g = c.createLinearGradient(0, 0, 0, h);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  },
  // banded pixel sky (dithered look)
  bandSky(c, w, h, cols) {
    const n = cols.length;
    for (let i = 0; i < n; i++) {
      const y0 = Math.floor(i * h / n), y1 = Math.floor((i + 1) * h / n);
      c.fillStyle = cols[i]; c.fillRect(0, y0, w, y1 - y0);
      if (i < n - 1) { c.fillStyle = cols[i + 1]; for (let x = (i % 2); x < w; x += 2) c.fillRect(x, y1 - 1, 1, 1); for (let x = 0; x < w; x += 4) c.fillRect(x + (i % 2) * 2, y1 - 2, 1, 1); }
    }
  },
  makeStars(seed, n, w, h) { const r = rng(seed); const a = []; for (let i = 0; i < n; i++) a.push({ x: r() * w | 0, y: r() * h | 0, p: r() * 6.28, s: r() < .12 ? 2 : 1, c: r() < .3 ? '#ffe8f6' : r() < .5 ? '#cfd8ff' : '#ffffff' }); return a; },
  stars(c, st, t, ox = 0, wrap = 0) {
    for (const s of st) {
      const a = .45 + .55 * Math.sin(t * 1.6 + s.p);
      if (a < .15) continue;
      c.globalAlpha = a; c.fillStyle = s.c;
      let x = s.x - ox; if (wrap) x = ((x % wrap) + wrap) % wrap;
      c.fillRect(x | 0, s.y, 1, 1);
      if (s.s === 2 && a > .7) { c.globalAlpha = a * .5; c.fillRect((x | 0) - 1, s.y, 3, 1); c.fillRect(x | 0, s.y - 1, 1, 3); }
    }
    c.globalAlpha = 1;
  },
  bigStar(c, x, y, t, sc = 1) {
    const a = .75 + .25 * Math.sin(t * 3);
    c.globalAlpha = .25 * a; c.fillStyle = '#fff4c8';
    c.beginPath(); c.arc(x, y, 7 * sc * a, 0, 7); c.fill();
    c.globalAlpha = 1; c.fillStyle = '#fffbe8';
    const L = Math.round((4 + 2 * a) * sc);
    c.fillRect(x - L, y, L * 2 + 1, 1); c.fillRect(x, y - L, 1, L * 2 + 1);
    c.fillRect(x - 1, y - 1, 3, 3);
    c.fillStyle = '#ffe9a8'; c.fillRect(x - 2 * sc, y - 2 * sc, 1, 1); c.fillRect(x + 2 * sc, y + 2 * sc, 1, 1); c.fillRect(x + 2 * sc, y - 2 * sc, 1, 1); c.fillRect(x - 2 * sc, y + 2 * sc, 1, 1);
  },
  moon(c, x, y, r) {
    c.fillStyle = 'rgba(200,190,255,.12)'; c.beginPath(); c.arc(x, y, r * 2.2, 0, 7); c.fill();
    c.fillStyle = '#e6e2ff'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    c.fillStyle = '#c9c2f0'; c.fillRect(x - r * .4 | 0, y - r * .2 | 0, 2, 2); c.fillRect(x + r * .3 | 0, y + r * .3 | 0, 2, 1);
  },
  makeSkyline(seed, width, o = {}) {
    const r = rng(seed); const b = []; let x = -10;
    while (x < width + 20) {
      const w = (o.minW ?? 14) + (r() * ((o.maxW ?? 30) - (o.minW ?? 14)) | 0);
      const h = (o.minH ?? 30) + (r() * ((o.maxH ?? 80) - (o.minH ?? 30)) | 0);
      const win = []; const cols = Math.floor((w - 4) / 3), rows = Math.floor((h - 4) / 4);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (r() < (o.lit ?? .35)) win.push([2 + i * 3, 3 + j * 4, r() < .15]);
      b.push({ x, w, h, win, ant: r() < .2, roof: r() < .3 ? 1 + (r() * 3 | 0) : 0, sign: r() < (o.signs ?? .12) ? (r() * 3 | 0) : -1 });
      x += w + (o.gap ?? 0) + (r() * 3 | 0);
    }
    return b;
  },
  skyline(c, bl, ox, baseY, col, winCol, t = 0, o = {}) {
    for (const b of bl) {
      const x = Math.round(b.x - ox); if (x > G.W + 2 || x + b.w < -2) continue;
      const top = baseY - b.h;
      c.fillStyle = col; c.fillRect(x, top, b.w, b.h + 400);
      if (b.roof) { c.fillRect(x + 2, top - b.roof * 2, b.w - 4, b.roof * 2); }
      if (b.ant) { c.fillRect(x + (b.w >> 1), top - 8, 1, 8); c.fillStyle = (Math.sin(t * 3 + b.x) > 0) ? '#ff5a7a' : '#7a2a4a'; c.fillRect(x + (b.w >> 1), top - 9, 1, 1); }
      if (o.edge) { c.fillStyle = o.edge; c.fillRect(x, top, 1, b.h); }
      for (const w of b.win) {
        c.fillStyle = w[2] ? (o.warm || '#ffe7a8') : winCol;
        if (o.flicker && Math.sin(t * .7 + w[0] * 13 + w[1] * 7 + b.x) > .97) continue;
        c.fillRect(x + w[0], top + w[1], o.ww || 1, 2);
      }
      if (b.sign >= 0 && o.neon) {
        const nc = o.neon[b.sign % o.neon.length]; c.fillStyle = nc; const sy = top + 6;
        c.globalAlpha = .25; c.fillRect(x + 1, sy - 1, 4, 14); c.globalAlpha = 1;
        c.fillRect(x + 2, sy, 2, 12);
      }
    }
  },
  blossomCluster(c, x, y, r, seed, cols = ['#c78ae8', '#e2a4f2', '#a76ad8', '#f3c8fa']) {
    const R = rng(seed);
    for (let i = 0; i < r * r * 1.4; i++) {
      const a = R() * 6.28, d = Math.sqrt(R()) * r;
      c.fillStyle = cols[(R() * cols.length) | 0];
      c.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d * .75), 1 + (R() < .3), 1);
    }
  },
  branch(c, x, y, len, dir, seed, scale = 1) {
    const R = rng(seed);
    c.fillStyle = '#1c1028';
    let px = x, py = y;
    for (let i = 0; i < len; i++) { px += dir; py += (R() < .35 ? 1 : 0) - (R() < .15 ? 1 : 0); c.fillRect(px, py, 1, 2); if (R() < .12) { let qx = px, qy = py; for (let k = 0; k < 8; k++) { qx += dir; qy += R() < .6 ? 1 : 0; c.fillRect(qx, qy, 1, 1); } this.blossomCluster(c, qx, qy, 5 * scale, seed + i); } }
    for (let i = 0; i < len; i += 6) this.blossomCluster(c, x + dir * i, y + 1 + (R() * 4 | 0), (4 + R() * 4) * scale, seed * 7 + i);
  },
  lamp(c, x, y, t, col = '#ffd9a0') {
    c.fillStyle = '#231a33'; c.fillRect(x, y, 1, 30); c.fillRect(x - 2, y - 1, 5, 1);
    const a = .18 + .04 * Math.sin(t * 2 + x);
    c.fillStyle = `rgba(255,220,160,${a})`; c.beginPath(); c.arc(x, y - 3, 9, 0, 7); c.fill();
    c.fillStyle = col; c.fillRect(x - 1, y - 4, 3, 3);
  },
  prompt(c, x, y, key, t) {
    const bob = Math.round(Math.sin(t * 5) * 1);
    x = Math.round(x); y = Math.round(y + bob);
    c.fillStyle = '#1a1236'; c.fillRect(x - 4, y - 4, 9, 9);
    c.fillStyle = key === 'Q' ? '#ffd86b' : '#9fd0ff'; c.fillRect(x - 3, y - 3, 7, 7);
    c.fillStyle = '#1a1236'; this.text(c, key, x - 1, y - 2, '#1a1236');
    c.fillStyle = key === 'Q' ? '#ffd86b' : '#9fd0ff'; c.fillRect(x, y + 5, 1, 1);
  },
  shadow(c, x, y, w = 9) { c.fillStyle = 'rgba(10,0,30,.3)'; c.fillRect(Math.round(x - w / 2), Math.round(y), w, 1); c.fillRect(Math.round(x - w / 2 + 1), Math.round(y + 1), w - 2, 1); },

  // ---------- characters ----------
  person(c, x, y, L, frame = 0, dir = 1, view = 'side', o = {}) {
    x = Math.round(x); y = Math.round(y);
    const flip = view === 'side' && dir < 0;
    const R = (dx, dy, w, h, col) => { if (!col) return; c.fillStyle = col; c.fillRect(flip ? x - dx - w + 1 : x + dx, y + dy, w, h); };
    const sit = !!o.sit, oy = sit ? 6 : 0;
    const side = view === 'side';
    // legs
    if (!sit) {
      let a = 0, b = 0, la = 0, lb = 0;
      if (frame === 1) { a = 1; b = -1; lb = -1; } else if (frame === 3) { a = -1; b = 1; la = -1; }
      const leg = (dx, lift, back) => {
        const top = L.skirt ? -6 : -7;
        const base = L.skirt ? L.skin : L.pants;
        R(dx, top + lift, 2, -top - 1, back ? shade(base, -.18) : base);
        if (L.sock) R(dx, -4 + lift, 2, 3, back ? shade(L.sock, -.15) : L.sock);
        R(dx, -1 + lift, side ? 3 : 2, 1, L.shoe);
      };
      if (side) { leg(-2 + b, lb, true); leg(0 + a, la, false); }
      else { leg(-3, 0); leg(1, 0); }
    }
    // torso
    const tw = side ? 6 : 8, tx = side ? -3 : -4;
    const tTop = -15 + oy, tH = L.skirt ? 5 : 8;
    R(tx, tTop, tw, tH, L.shirt);
    if (L.stripe) for (let i = 1; i < tw; i += 2) R(tx + i, tTop, 1, tH, L.stripe);
    if (L.skirt) { R(tx - 1, tTop + 5, tw + 2, 4, L.skirt); R(tx - 1, tTop + 8, tw + 2, 1, shade(L.skirt, .15)); }
    if (!L.skirt && sit) R(tx, tTop + 8, tw, 2, L.pants);
    // neck + head
    R(-1, -16 + oy, 2, 1, shade(L.skin, -.12));
    R(-3, -23 + oy, 7, 7, L.skin);
    // face
    if (view !== 'back') {
      if (side) {
        if (o.closed) R(2, -19 + oy, 1, 1, L.eye); else R(2, -20 + oy, 1, 2, L.eye);
        if (L.blush) R(1, -18 + oy, 1, 1, L.blush);
      } else {
        if (o.smile || o.closed) { R(-2, -19 + oy, 2, 1, L.eye); R(1, -19 + oy, 2, 1, L.eye); }
        else { R(-2, -20 + oy, 1, 2, L.eye); R(2, -20 + oy, 1, 2, L.eye); }
        if (L.blush || o.smile) { R(-3, -18 + oy, 1, 1, L.blush || '#f29ab2'); R(3, -18 + oy, 1, 1, L.blush || '#f29ab2'); }
        if (o.smile) R(0, -17 + oy, 1, 1, '#c35a72');
      }
    }
    // hair
    const hc = L.hc, hh = L.hh || shade(hc, .2);
    const st = L.hair;
    if (side) {
      if (st === 'cap') { R(-4, -25 + oy, 8, 3, L.cap); R(3, -23 + oy, 3, 1, L.cap); R(-4, -22 + oy, 2, 3, hc); }
      else {
        R(-4, -25 + oy, 8, 3, hc); R(-2, -25 + oy, 4, 1, hh);
        const len = st === 'long' ? 13 : st === 'bob' ? 8 : 4;
        R(-4, -22 + oy, 3, len, hc); if (st === 'long' || st === 'bob') R(-5, -22 + oy, 1, len - 1, hc);
        R(1, -22 + oy, st === 'short' ? 3 : 3, 1, hc); if (st !== 'short') R(-1, -22 + oy, 2, 2, hc);
        if (st === 'bob') { R(-5, -15 + oy, 4, 1, hh); R(-1, -21 + oy, 1, 4, hc); }
        if (st === 'pony') { R(-6, -23 + oy, 2, 2, hc); R(-7, -21 + oy, 2, 6, hc); }
        if (L.hl) { R(-5, -20 + oy, 1, 8, L.hl); R(-3, -16 + oy, 1, 6, L.hl); }
      }
    } else if (view === 'front') {
      if (st === 'cap') { R(-4, -25 + oy, 9, 3, L.cap); R(-4, -22 + oy, 9, 1, shade(L.cap, -.2)); }
      else {
        R(-4, -25 + oy, 9, 3, hc); R(-2, -25 + oy, 4, 1, hh);
        const len = st === 'long' ? 13 : st === 'bob' ? 8 : 3;
        R(-4, -22 + oy, 1, len, hc); R(4, -22 + oy, 1, len, hc);
        R(-3, -22 + oy, 7, 1, hc); if (st !== 'short') { R(-3, -21 + oy, 2, 1, hc); R(2, -21 + oy, 2, 1, hc); }
        if (st === 'long' || st === 'bob') { R(-5, -21 + oy, 1, len - 2, hc); R(5, -21 + oy, 1, len - 2, hc); }
        if (st === 'bob') { R(-5, -15 + oy, 2, 1, hh); R(4, -15 + oy, 2, 1, hh); }
        if (L.hl) { R(-5, -19 + oy, 1, 7, L.hl); R(5, -17 + oy, 1, 6, L.hl); }
      }
    } else { // back
      if (st === 'cap') { R(-4, -25 + oy, 9, 3, L.cap); R(-4, -22 + oy, 9, 6, hc); }
      else {
        const len = st === 'long' ? 16 : st === 'bob' ? 11 : 9;
        R(-4, -25 + oy, 9, len, hc); R(-2, -25 + oy, 5, 1, hh);
        if (st === 'long' || st === 'bob') { R(-5, -22 + oy, 1, len - 4, hc); R(5, -22 + oy, 1, len - 4, hc); }
        if (st === 'bob') R(-5, -15 + oy, 11, 1, hh);
        if (st === 'pony') R(0, -16 + oy, 2, 6, hc);
        if (L.hl) { R(-3, -20 + oy, 1, 10, L.hl); R(2, -18 + oy, 1, 9, L.hl); }
      }
    }
    // arms
    if (side) {
      const sw = frame === 1 ? 1 : frame === 3 ? -1 : 0;
      if (!o.armUp) { R(-1 + sw, -14 + oy, 2, 6, shade(L.shirt, -.08)); R(-1 + sw, -8 + oy, 2, 1, L.skin); }
      else { R(1, -15 + oy, 4, 2, shade(L.shirt, -.08)); R(5, -15 + oy, 1, 2, L.skin); }
    } else {
      const lo = o.handL ? -2 : 0, ro = o.handR ? -2 : 0;
      R(-5, -14 + oy, 1, 6 + lo, shade(L.shirt, -.08)); R(4, -14 + oy, 1, 6 + ro, shade(L.shirt, -.08));
      R(-5, -8 + oy + lo, 1, 1, L.skin); R(4, -8 + oy + ro, 1, 1, L.skin);
    }
    if (o.hold === 'octopus') { const hx = side ? 1 : -2, hy = -11 + oy; R(hx, hy, 4, 3, '#f07aa0'); R(hx, hy + 3, 1, 1, '#f07aa0'); R(hx + 2, hy + 3, 1, 1, '#f07aa0'); R(hx + 1, hy + 1, 1, 1, '#2a1020'); R(hx + 3, hy + 1, 1, 1, '#2a1020'); }
    if (o.umbrella) { R(-7, -32 + oy, 15, 2, '#7a9cff'); R(-5, -34 + oy, 11, 2, '#7a9cff'); R(-2, -35 + oy, 5, 1, '#9db6ff'); R(0, -30 + oy, 1, 16, '#d8d8e8'); }
  },
  drawActor(c, a, ox = 0, oy = 0) {
    if (a.visible === false) return;
    const fr = a.moving ? (Math.floor(a.walk) % 4) : 0;
    if (!a.noShadow) this.shadow(c, a.x - ox, a.y - oy, 8);
    this.person(c, a.x - ox, a.y - oy - (a.z || 0), a.look, fr, a.dir, a.view || 'side', a.o || {});
    if (a.emote) this.emote(c, a.x - ox, a.y - oy - (a.z || 0) - 30, a.emote);
  },
  emote(c, x, y, e) {
    x = Math.round(x); y = Math.round(y);
    if (e === '!') { c.fillStyle = '#fff'; c.fillRect(x - 2, y - 2, 5, 7); c.fillStyle = '#e04a6a'; c.fillRect(x, y - 1, 1, 3); c.fillRect(x, y + 3, 1, 1); }
    if (e === '♥') { c.fillStyle = '#ff7aa8'; c.fillRect(x - 2, y, 2, 2); c.fillRect(x + 1, y, 2, 2); c.fillRect(x - 2, y + 1, 5, 2); c.fillRect(x - 1, y + 3, 3, 1); c.fillRect(x, y + 4, 1, 1); }
    if (e === '...') { c.fillStyle = '#fff'; c.fillRect(x - 5, y - 1, 11, 5); c.fillStyle = '#333'; c.fillRect(x - 3, y + 1, 1, 1); c.fillRect(x, y + 1, 1, 1); c.fillRect(x + 3, y + 1, 1, 1); }
    if (e === '♪') { c.fillStyle = '#ffd86b'; c.fillRect(x, y - 2, 1, 5); c.fillRect(x - 2, y + 2, 2, 2); c.fillRect(x + 1, y - 2, 2, 1); }
  },
  // sprite to offscreen (for scaling)
  personCanvas(L, frame, dir, view, o, sc = 1) {
    const cv = document.createElement('canvas'); cv.width = 32 * sc; cv.height = 40 * sc;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.scale(sc, sc);
    this.person(c, 16, 38, L, frame, dir, view, o);
    return cv;
  },
  // "high resolution" character: 2x + outline + rim light + strands
  personHD(L, view, o = {}, frame = 0, dir = 1) {
    const cv = this.personCanvas(L, frame, dir, view, o, 2);
    const c = cv.getContext('2d'); const W = cv.width, H = cv.height;
    const im = c.getImageData(0, 0, W, H), d = im.data;
    const A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : d[(y * W + x) * 4 + 3];
    const out = new Uint8ClampedArray(d);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (d[i + 3] === 0) {
        if (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1)) { out[i] = 14; out[i + 1] = 10; out[i + 2] = 30; out[i + 3] = 255; }
      } else {
        let k = 0;
        if (!A(x - 1, y) || !A(x, y - 1)) k = .22; // rim light (top-left)
        else if (!A(x + 1, y) || !A(x, y + 1)) k = -.22; // shadow
        if (k) for (let j = 0; j < 3; j++) out[i + j] = clamp(d[i + j] + (k > 0 ? (255 - d[i + j]) * k : d[i + j] * k), 0, 255);
      }
    }
    im.data.set(out); c.putImageData(im, 0, 0);
    c.setTransform(1, 0, 0, 1, 0, 0);
    // hair strands / shine
    const hc = L.hh || shade(L.hc, .25);
    c.fillStyle = hc;
    const cx = 32, top = 76 - 50 + (o.sit ? 12 : 0);
    if (view === 'back') { for (let i = -6; i <= 6; i += 3) c.fillRect(cx + i, top + 4, 1, (L.hair === 'long' ? 26 : L.hair === 'bob' ? 16 : 10)); }
    else { c.fillRect(cx - 5, top + 1, 6, 1); c.fillRect(cx - 3, top + 2, 3, 1); }
    if (view === 'front' && !o.closed && !o.smile) { c.fillStyle = '#fff'; c.fillRect(cx - 4, top + 12, 1, 1); c.fillRect(cx + 4, top + 12, 1, 1); }
    return cv;
  },
  glitch(c, amt) {
    const W = G.W, H = G.H;
    const n = Math.floor(4 + amt * 14);
    for (let i = 0; i < n; i++) {
      const y = Math.random() * H | 0, h = 1 + Math.random() * 8 * amt | 0, dx = ((Math.random() - .5) * 40 * amt) | 0;
      try { const im = c.getImageData(0, y, W, h); c.putImageData(im, dx, y); } catch (e) {}
    }
    c.globalAlpha = .12 * amt; c.fillStyle = Math.random() < .5 ? '#ff2a6a' : '#2affe0'; c.fillRect(0, 0, W, H);
    c.globalAlpha = 1;
    for (let i = 0; i < 120 * amt; i++) { c.fillStyle = Math.random() < .5 ? '#fff' : '#000'; c.fillRect(Math.random() * W | 0, Math.random() * H | 0, 1 + (Math.random() * 3 | 0), 1); }
    c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < H; y += 2) c.fillRect(0, y, W, 1);
  },
  icon(c, id, x, y) {
    const R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(x + a, y + b, w, h); };
    if (id === 'ticket') { R(0, 1, 8, 6, '#f2d062'); R(3, 1, 1, 6, '#a07a20'); R(5, 3, 2, 2, '#a07a20'); }
    if (id === 'octopus') { R(1, 0, 6, 5, '#f07aa0'); R(0, 5, 2, 2, '#f07aa0'); R(3, 5, 2, 2, '#f07aa0'); R(6, 5, 2, 2, '#f07aa0'); R(2, 2, 1, 1, '#2a1020'); R(5, 2, 1, 1, '#2a1020'); }
    if (id === 'umbrella') { R(0, 1, 8, 2, '#7a9cff'); R(2, 0, 4, 1, '#9db6ff'); R(4, 3, 1, 4, '#ddd'); R(3, 6, 1, 1, '#ddd'); }
    if (id === 'crane') { R(0, 3, 8, 1, '#f3f1ff'); R(2, 2, 4, 1, '#f3f1ff'); R(3, 1, 2, 1, '#d8d0ff'); R(6, 1, 1, 2, '#f3f1ff'); R(1, 4, 2, 1, '#cfc4ff'); }
    if (id === 'note') { R(0, 0, 8, 7, '#7fd8ef'); R(1, 2, 6, 1, '#2a4a60'); R(1, 4, 4, 1, '#2a4a60'); }
    if (id === 'can') { R(2, 0, 4, 8, '#5aa0ff'); R(2, 0, 4, 1, '#ccc'); }
  },
  hud(c) {
    if (!G.hud) return;
    let x = G.W - 12;
    const items = [...G.items];
    for (const it of items.reverse()) { c.fillStyle = 'rgba(14,10,32,.7)'; c.fillRect(x - 2, 3, 12, 11); this.icon(c, it, x, 5); x -= 13; }
  },
  crane(c, x, y, t) {
    x = Math.round(x); y = Math.round(y + Math.sin(t * 3 + x) * 1.5);
    c.fillStyle = 'rgba(220,210,255,.25)'; c.fillRect(x - 4, y - 3, 9, 7);
    const fl = Math.sin(t * 8 + x) > 0;
    c.fillStyle = '#f6f3ff'; c.fillRect(x - 3, y, 7, 1); c.fillRect(x - 1, y - 1, 3, 1);
    c.fillStyle = '#d8ceff'; if (fl) { c.fillRect(x - 2, y - 2, 2, 1); c.fillRect(x + 1, y - 2, 2, 1); } else { c.fillRect(x - 2, y + 1, 2, 1); c.fillRect(x + 1, y + 1, 2, 1); }
    c.fillStyle = '#f6f3ff'; c.fillRect(x + 3, y - 2, 1, 2); c.fillRect(x - 4, y - 1, 1, 1);
  },
};
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
  return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}

// ============ ACTORS / WORLD HELPERS ============
class Actor {
  constructor(o) { Object.assign(this, { x: 0, y: 0, z: 0, vz: 0, vx: 0, vy: 0, dir: 1, walk: 0, moving: false, view: 'side', o: {}, look: LOOK.brian }, o); }
}
function movePlayerBand(p, dt, sc) {
  p.moving = false;
  if (G.busy || sc.lock) { p.vz -= 420 * dt; p.z = Math.max(0, p.z + p.vz * dt); if (p.z === 0) p.vz = 0; return; }
  const mx = (G.keys.right ? 1 : 0) - (G.keys.left ? 1 : 0);
  const my = sc.noVertical ? 0 : (G.keys.down ? 1 : 0) - (G.keys.up ? 1 : 0);
  p.x = clamp(p.x + mx * 64 * dt, sc.xMin ?? 8, (sc.worldW ?? 320) - 8);
  p.y = clamp(p.y + my * 32 * dt, sc.yMin ?? 140, sc.yMax ?? 168);
  if (mx) p.dir = mx;
  p.moving = !!(mx || my); if (p.moving) p.walk += dt * 9;
  if (G.pressed.jump && p.z === 0) { p.vz = 115; Sfx.jump(); }
  p.vz -= 420 * dt; p.z = Math.max(0, p.z + p.vz * dt); if (p.z === 0) p.vz = 0;
}
function follow(f, p, dt, opts = {}) {
  const tx = p.x - p.dir * 15, ty = opts.platform ? p.y : p.y - 3;
  const dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy);
  if (d > 130) { f.x = tx; f.y = ty; }
  else if (d > 4) {
    const sp = Math.min(95, 25 + d * 3);
    const k = Math.min(1, sp * dt / d);
    f.x += dx * k; f.y += dy * k; f.moving = Math.abs(dx) > 2; if (f.moving) { f.walk += dt * 9; f.dir = dx > 0 ? 1 : -1; }
  } else { f.moving = false; f.dir = p.x > f.x ? 1 : -1; }
  if (opts.platform) f.z = 3 + Math.sin(G.t * 3) * 2; else f.z = Math.max(0, (f.z || 0) - 60 * dt);
}
function nearestInteract(list, p) {
  let best = null, bd = 1e9;
  for (const it of list) {
    if (it.cond && !it.cond()) continue;
    const dx = Math.abs(it.x - p.x), dy = Math.abs((it.y ?? p.y) - p.y);
    if (dx < (it.r ?? 14) && dy < (it.ry ?? 22) && dx < bd) { best = it; bd = dx; }
  }
  return best;
}
// generic walkable scene builder
function WalkScene(o) {
  const s = Object.assign({ res: [320, 180], worldW: 320, yMin: 140, yMax: 168, follower: true, items: [], npcs: [], camx: 0 }, o);
  s.setupActors = function (px = 30, py = 155, dir = 1) {
    s.player = new Actor({ x: px, y: py, dir, look: LOOK.brian });
    s.sab = new Actor({ x: px - 16 * dir, y: py - 3, dir, look: sabLook() });
  };
  s.update = function (dt) {
    if (s.preUpdate) s.preUpdate(dt);
    if (s.player && !s.cutscene) movePlayerBand(s.player, dt, s);
    if (s.sab) s.sab.look = sabLook();
    if (s.follower && s.sab && s.player && !s.cutscene) follow(s.sab, s.player, dt);
    if (s.player) s.camx = clamp(Math.round(s.player.x - G.W / 2), 0, Math.max(0, s.worldW - G.W));
    const all = (!G.busy && s.player && !s.cutscene) ? s.allInteracts() : [];
    s.nearQ = nearestInteract(all.filter(i => i.key === 'q'), s.player || {});
    s.nearE = nearestInteract(all.filter(i => i.key === 'e'), s.player || {});
    for (const it of [s.nearE, s.nearQ]) if (it && G.pressed[it.key]) { G.pressed = {}; s.nearQ = s.nearE = null; it.use(); break; }
    if (s.onUpdate) s.onUpdate(dt);
  };
  s.allInteracts = function () {
    const list = [...s.items];
    for (const n of s.npcs) if (n.talk) list.push({ x: n.x, y: n.y, key: 'E', r: 16, use: n.talk, cond: n.cond, npc: n });
    if (s.sab && s.sabTalk && s.follower !== 'hide') list.push({ x: s.sab.x, y: s.sab.y, key: 'E', r: 32, ry: 30, use: s.sabTalk, npc: s.sab, cond: s.sabCond });
    return list.map(i => ({ ...i, key: (i.key || 'Q').toLowerCase(), label: i.key || 'Q' }));
  };
  s.draw = function (c) {
    const ox = s.camx;
    if (s.bg) s.bg(c, ox, G.t);
    const list = [...s.npcs]; if (s.sab && s.follower !== 'hide') list.push(s.sab); if (s.player) list.push(s.player);
    if (s.extraActors) list.push(...s.extraActors());
    list.sort((a, b) => a.y - b.y);
    for (const a of list) a.drawFn ? a.drawFn(c, ox) : Art.drawActor(c, a, ox);
    if (s.fg) s.fg(c, ox, G.t);
    for (const n of [s.nearQ, s.nearE]) if (n) { const py = n.npc ? n.npc.y - 34 : (n.py ?? (n.y ?? s.player.y) - 30); Art.prompt(c, n.x - ox, py, n.label, G.t); }
    Art.hud(c);
    if (s.overlay) s.overlay(c);
  };
  return s;
}
// random line picker
function lines(arr) { let i = Math.random() * arr.length | 0; return () => { const l = arr[i % arr.length]; i++; return l; }; }
