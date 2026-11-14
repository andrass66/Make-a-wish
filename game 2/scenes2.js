'use strict';
// ===================== 9. JUNE 6 — CINEMA =====================
SC.june6 = WalkScene({
  worldW: 440, yMin: 148, yMax: 170,
  init() {
    G.flags.bob = true;
    this.setupActors(40, 160, 1); this.sab.look = LOOK.sabBob;
    this.items = [
      { x: 70, key: 'Q', py: 108, cond: () => this.intro, use: async () => { await say("This part of the wall looks... thin. Almost yellow."); this.noclip(); } },
      { x: 180, key: 'Q', py: 100, use: async () => say("NOW SHOWING: BACKROOMS.", S("I heard it's really unsettling. Good.")) },
      { x: 260, key: 'Q', py: 120, use: async () => say("Popcorn. Half sweet, half salty. A compromise.") },
      { x: 400, key: 'Q', py: 104, cond: () => this.intro, use: () => this.watch() },
    ];
  },
  resume(o) { if (o.fromBack) { this.player.x = 80; this.player.y = 160; this.sab.x = 64; this.sab.y = 157; } },
  sabTalk: async function () { await say(S(["Theater 3. Come on.", "...Stop looking at my hair.", "Do you think the backrooms are real? Like, somewhere?"][Math.random() * 3 | 0])); },
  async script(o) {
    if (o.fromBack) { await say(S("...What was that."), B("No idea."), S("Let's just watch the movie.")); return; }
    await caption('June 6, 2026', 'BACKROOMS · MOVIE DATE', 2.4);
    this.cutscene = true; this.sab.dir = 1; this.player.dir = -1; this.player.x = 60; this.sab.x = 40;
    await wait(.3);
    this.player.emote = '!';
    await say(B("...Your hair."));
    this.player.emote = null;
    await say(S("I changed it."), S("Don't stare."), B("It suits you."), S("...Let's go. The movie's starting."));
    this.cutscene = false; this.intro = true;
    hint('Go to THEATER 3  (Q)');
  },
  async noclip() {
    G.glitch = 1; Sfx.glitch(); await tween(G, 'glitch', 0, 1.0);
    goto(SC.backrooms, { cut: true, fresh: true });
  },
  async watch() {
    this.cutscene = true; hint('');
    await fadeOut(.8); this.movie = 0; this.inMovie = true; await fadeIn(.8);
    await say("(Two hours of fluorescent buzzing and liminal dread later...)");
    await wait(.6);
    goto(SC.dinner, { fadeOut: 1.2 });
  },
  bg(c, ox, t) {
    c.fillStyle = '#1c1430'; c.fillRect(0, 0, 320, 180);
    c.fillStyle = '#241a3c'; for (let x = -(ox % 20); x < 320; x += 20) c.fillRect(x, 0, 10, 140);
    c.fillStyle = '#3a1e3e'; c.fillRect(0, 140, 320, 40);
    c.fillStyle = '#4a2650'; for (let y = 144; y < 180; y += 6) for (let x = -(ox % 12); x < 320; x += 12) c.fillRect(x + ((y / 6) % 2) * 6, y, 2, 2);
    const W = x => Math.round(x - ox);
    // ceiling lights
    for (let x = 20; x < 440; x += 60) { c.fillStyle = 'rgba(255,220,180,.08)'; c.fillRect(W(x) - 10, 0, 20, 140); c.fillStyle = '#ffe2c0'; c.fillRect(W(x) - 6, 4, 12, 2); }
    // thin wall (backrooms secret)
    c.fillStyle = Math.sin(t * 2) > .9 ? '#4a4228' : '#2a2038'; c.fillRect(W(58), 80, 24, 60);
    c.fillStyle = 'rgba(230,210,120,.05)'; c.fillRect(W(58), 80, 24, 60);
    // posters
    const poster = (x, col, label, sub) => { c.fillStyle = '#0e0a18'; c.fillRect(W(x) - 16, 62, 32, 44); c.fillStyle = col; c.fillRect(W(x) - 14, 64, 28, 40); Art.text(c, label, W(x), 70, '#1a1206', 1, 'center'); if (sub) Art.text(c, sub, W(x), 96, '#1a1206', 1, 'center'); };
    poster(180, '#e8d27a', 'BACK', 'ROOMS');
    c.fillStyle = '#c8b260'; c.fillRect(W(170), 78, 20, 14); c.fillStyle = '#e8d27a'; c.fillRect(W(176), 82, 4, 10);
    poster(130, '#7a8ae8', 'NOW', '');
    poster(230, '#e87aa8', 'SOON', '');
    // concession
    c.fillStyle = '#5a2a4a'; c.fillRect(W(236), 112, 56, 28); c.fillStyle = '#ff7aa8'; c.fillRect(W(236), 108, 56, 4);
    c.fillStyle = '#fff3c4'; c.fillRect(W(250), 100, 10, 12); c.fillStyle = '#f04a6a'; for (let i = 0; i < 10; i += 3) c.fillRect(W(250) + i, 100, 1, 12); c.fillStyle = '#fff'; c.fillRect(W(250), 97, 10, 3);
    // theater door
    c.fillStyle = '#0e0a18'; c.fillRect(W(388), 84, 26, 56); c.fillStyle = '#7a2a3a'; c.fillRect(W(390), 86, 22, 54);
    c.fillStyle = '#ffd86b'; c.fillRect(W(384), 74, 34, 9); Art.text(c, 'THEATER 3', W(401), 76, '#3a1f6a', 1, 'center');
  },
  overlay(c) {
    if (!this.inMovie) return;
    c.fillStyle = '#05040a'; c.fillRect(0, 0, 320, 180);
    const fl = .5 + .5 * Math.sin(G.t * 23) * Math.sin(G.t * 7);
    c.fillStyle = `rgba(232,210,122,${.55 + .2 * fl})`; c.fillRect(40, 18, 240, 100);
    c.fillStyle = `rgba(200,180,90,${.5})`; for (let x = 40; x < 280; x += 30) c.fillRect(x, 18, 1, 100);
    c.fillStyle = 'rgba(255,255,230,.6)'; c.fillRect(80, 22, 40, 2); c.fillRect(190, 22, 40, 2);
    c.fillStyle = '#0b0912'; for (let x = 0; x < 320; x += 14) { c.fillRect(x, 150, 12, 30); c.beginPath(); c.arc(x + 6, 148, 6, 0, 7); c.fill(); }
    // two heads
    c.fillStyle = '#16121e'; c.fillRect(146, 132, 12, 20); c.fillRect(144, 128, 14, 8);
    c.fillStyle = LOOK.sabBob.hc; c.fillRect(164, 130, 13, 22); c.fillRect(162, 128, 16, 10);
  },
});

SC.backrooms = WalkScene({
  worldW: 480, yMin: 148, yMax: 170,
  init() {
    this.setupActors(30, 160, 1); this.sab.look = LOOK.sabBob;
    this.items = [{ x: 450, key: 'Q', py: 104, use: async () => { G.glitch = 1; Sfx.glitch(); await tween(G, 'glitch', 0, .8); goto(SC.june6, { cut: true, fromBack: true }); } }];
  },
  sabTalk: async function () { await say(S(["Why are we here.", "This carpet is damp. Why is it damp.", "Okay, I'm officially unsettled. Exit. Now."][Math.random() * 3 | 0])); },
  async script() { await say("You noclipped out of reality.", S("...Brian. Where are we.")); hint('Find the way out →'); },
  bg(c, ox, t) {
    c.fillStyle = '#c9b45e'; c.fillRect(0, 0, 320, 140);
    c.fillStyle = '#b8a250'; for (let x = -(ox % 8); x < 320; x += 8) for (let y = 4; y < 140; y += 10) c.fillRect(x + ((y / 10) % 2) * 4, y, 2, 4);
    c.fillStyle = '#e8e0b0'; c.fillRect(0, 0, 320, 6);
    for (let x = -(ox % 64); x < 320; x += 64) { const on = Math.sin(t * 30 + x) > -.9; c.fillStyle = on ? '#fffbe0' : '#c8c098'; c.fillRect(x + 12, 2, 30, 4); if (on) { c.fillStyle = 'rgba(255,255,220,.08)'; c.fillRect(x + 4, 6, 46, 134); } }
    const W = x => Math.round(x - ox);
    c.fillStyle = '#a89040'; for (const px of [120, 240, 330]) c.fillRect(W(px), 30, 10, 110);
    c.fillStyle = '#8a7a3a'; c.fillRect(0, 140, 320, 40);
    c.fillStyle = '#7a6a30'; for (let y = 144; y < 180; y += 4) for (let x = -(ox % 6); x < 320; x += 6) c.fillRect(x + ((y / 4) % 2) * 3, y, 1, 1);
    c.fillStyle = '#3a3420'; c.fillRect(W(438), 90, 24, 50); c.fillStyle = '#2a2414'; c.fillRect(W(440), 92, 20, 48);
    c.fillStyle = '#40ff80'; c.fillRect(W(440), 82, 20, 7); Art.text(c, 'EXIT', W(450), 83, '#0a2a10', 1, 'center');
  },
  fg(c) { c.fillStyle = 'rgba(80,70,20,.12)'; c.fillRect(0, 0, 320, 180); },
});

// ===================== 9b. DINNER =====================
SC.dinner = {
  init() { this.city = Art.makeSkyline(33, 340, { minH: 16, maxH: 60, lit: .4 }); this.stars = Art.makeStars(5, 40, 320, 60); this.sabO = {}; },
  draw(c) {
    const t = G.t;
    c.fillStyle = '#2a1828'; c.fillRect(0, 0, 320, 180);
    c.fillStyle = '#0b0920'; c.fillRect(20, 14, 280, 104);
    c.save(); c.beginPath(); c.rect(20, 14, 280, 104); c.clip();
    Art.bandSky(c, 320, 118, ['#08061c', '#0e0b28', '#151234', '#1e1842', '#2a1f52']);
    Art.stars(c, this.stars, t);
    Art.skyline(c, this.city, 0, 120, '#1a1438', '#ffd9a0', t, { warm: '#ffb0d0' });
    c.restore();
    c.fillStyle = '#3e2438'; c.fillRect(18, 12, 284, 3); c.fillRect(18, 116, 284, 4); for (const x of [18, 108, 210, 299]) c.fillRect(x, 12, 3, 106);
    // warm glow
    const fl = .5 + .5 * Math.sin(t * 9) * Math.sin(t * 5.3);
    c.fillStyle = `rgba(255,180,110,${.12 + .04 * fl})`; c.beginPath(); c.arc(160, 140, 50, 0, 7); c.fill();
    Art.person(c, 130, 152, LOOK.brian, 0, 1, 'side', { sit: true });
    Art.person(c, 190, 152, LOOK.sabBob, 0, -1, 'side', Object.assign({ sit: true }, this.sabO));
    if (this.heart) Art.emote(c, 190, 112 - (G.t * 4 % 6), '♥');
    // table
    c.fillStyle = '#f2ece4'; c.fillRect(100, 148, 120, 4); c.fillStyle = '#d8d0c8'; c.fillRect(100, 152, 120, 28);
    c.fillStyle = '#c8bfb6'; for (let x = 104; x < 220; x += 8) c.fillRect(x, 156, 1, 24);
    // plates, glasses, candle
    c.fillStyle = '#fff'; c.fillRect(116, 146, 18, 2); c.fillRect(186, 146, 18, 2);
    c.fillStyle = 'rgba(160,30,60,.85)'; c.fillRect(140, 138, 3, 5); c.fillRect(176, 138, 3, 5); c.fillStyle = '#eee'; c.fillRect(141, 143, 1, 4); c.fillRect(177, 143, 1, 4); c.fillRect(139, 147, 5, 1); c.fillRect(175, 147, 5, 1);
    c.fillStyle = '#f4eee0'; c.fillRect(158, 136, 4, 12);
    c.fillStyle = fl > .5 ? '#ffd86b' : '#ffb04a'; c.fillRect(159, 132 + (fl > .7 ? 0 : 1), 2, 4); c.fillStyle = '#fff6d0'; c.fillRect(159, 134, 1, 2);
  },
  async script() {
    await wait(1);
    await say(S("Can I ask you something?"), B("Sure."), S("..."), S("Do you like me?"));
    const ans = await ask('Sabrina: "Do you like me?"');
    sendWish('[6/6 Do you like me?] ' + ans);
    await say(B(ans));
    if (/\b(no|nope|nah)\b|아니|싫/i.test(ans)) await say(S("...Liar."), S("But okay. I'll pretend I didn't hear that."));
    else { await say(S("...")); this.sabO = { closed: true }; this.heart = true; await say(S("I like that you're honest.")); }
    await wait(1);
    goto(SC.seokchon, { fadeOut: 1.4 });
  },
};

// ===================== 9c. SEOKCHON LAKE — JUMP MAP =====================
SC.seokchon = {
  init() {
    this.plats = [[0, 150, 140], [160, 146, 22], [200, 138, 20], [238, 128, 18], [272, 140, 20], [312, 132, 18], [350, 120, 16], [385, 108, 14], [408, 86, 18], [420, 138, 20], [460, 146, 24], [505, 136, 16], [540, 126, 16], [578, 134, 18], [620, 144, 22], [660, 132, 16], [696, 122, 16], [734, 134, 18], [772, 144, 22], [812, 140, 24], [850, 150, 160]].map(([x, y, w]) => ({ x, y, w }));
    this.cranes = [[100, 128], [247, 112], [358, 104], [430, 122], [513, 118], [587, 116], [704, 104], [783, 128]].map(([x, y]) => ({ x, y, got: false }));
    this.note = { x: 417, y: 72, got: false };
    this.p = new Actor({ x: 30, y: 150, look: LOOK.brian }); this.p.vy = 0; this.p.onGround = true; this.p.safe = { x: 30, y: 150 };
    this.sab = new Actor({ x: 14, y: 150, look: LOOK.sabBob });
    this.stars = Art.makeStars(77, 120, 320, 100);
    this.far = Art.makeSkyline(52, 600, { minH: 10, maxH: 34, lit: .3, minW: 10, maxW: 22 });
    this.camx = 0; this.splashes = []; G.cranes = 0; this.done = false;
  },
  async script() {
    await caption('June 6, 2026', 'NIGHT WALK · SEOKCHON LAKE', 2.4);
    hint('Collect the paper cranes  ✦ 0/8   (SPACE to jump)');
  },
  update(dt) {
    const p = this.p;
    if (!G.busy && !this.done) {
      const mx = (G.keys.right ? 1 : 0) - (G.keys.left ? 1 : 0);
      p.x = clamp(p.x + mx * 72 * dt, 6, 1004); if (mx) p.dir = mx; p.moving = !!mx && p.onGround; if (p.moving) p.walk += dt * 9;
      if (G.pressed.jump && p.onGround) { p.vy = -205; p.onGround = false; Sfx.jump(); }
    } else p.moving = false;
    p.vy += 540 * dt; const py0 = p.y; p.y += p.vy * dt; p.onGround = false;
    for (const pl of this.plats) {
      if (p.vy >= 0 && py0 <= pl.y + .5 && p.y >= pl.y && p.x > pl.x - 3 && p.x < pl.x + pl.w + 3) { p.y = pl.y; p.vy = 0; p.onGround = true; p.safe = { x: clamp(p.x, pl.x + 4, pl.x + pl.w - 4), y: pl.y }; }
    }
    if (p.y > 172) { this.splashes.push({ x: p.x, t: .6 }); Sfx.splash(); p.x = p.safe.x; p.y = p.safe.y - 1; p.vy = 0; }
    follow(this.sab, p, dt, { platform: true });
    this.camx = clamp(Math.round(p.x - 160), 0, 1010 - 320);
    for (const cr of this.cranes) if (!cr.got && Math.abs(cr.x - p.x) < 8 && Math.abs(cr.y - (p.y - 12)) < 14) { cr.got = true; G.cranes++; Sfx.crane(); hint(`Collect the paper cranes  ✦ ${G.cranes}/8`); if (G.cranes === 1 && !G.items.includes('crane')) G.items.push('crane'); }
    if (!this.note.got && Math.abs(this.note.x - p.x) < 8 && Math.abs(this.note.y - (p.y - 12)) < 14) {
      this.note.got = true; giveItem('note', 'A strange note');
      photoPop('assets/photos/timemachine.jpg', '"TIME MACHINE ← ← ←   YEAR: 2026 JUNE"  ...a clue?');
    }
    this.splashes.forEach(s => s.t -= dt); this.splashes = this.splashes.filter(s => s.t > 0);
    this.nearBench = p.x > 920 && p.onGround;
    if (this.nearBench && G.pressed.q && !G.busy && !this.done) this.finish();
  },
  async finish() {
    this.done = true; hint('');
    if (G.cranes >= 8) await say(S("All eight? ...Show-off."), S("Keep them. We'll need a wish later."));
    else await say(S(`${G.cranes} cranes. ...Good enough.`), S("We'll find the rest some other time."));
    goto(SC.wolmido, { fadeOut: 1.4 });
  },
  draw(c) {
    const ox = this.camx, t = G.t, W = x => Math.round(x - ox);
    Art.bandSky(c, 320, 120, ['#05041a', '#0a0826', '#100d32', '#17123e', '#1f184a', '#2a1f58']);
    Art.stars(c, this.stars, t, ox * .05, 320);
    Art.moon(c, 270 - Math.round(ox * .03), 26, 7);
    // Lotte World Tower (tall slender tower)
    const tx = Math.round(200 - ox * .12);
    c.fillStyle = '#1a1838';
    for (let y = 18; y < 120; y++) { const w = Math.round(4 + (y - 18) * .12); c.fillRect(tx - w, y, w * 2, 1); }
    c.fillStyle = '#9a8ae8'; for (let y = 30; y < 118; y += 4) { const w = Math.round(4 + (y - 18) * .12); if ((y / 4) % 3) c.fillRect(tx - w + 2, y, w * 2 - 4, 1); }
    c.fillStyle = Math.sin(t * 3) > 0 ? '#ff7aa8' : '#7a3a5a'; c.fillRect(tx, 14, 1, 4);
    Art.skyline(c, this.far, ox * .2, 120, '#141030', '#8a7ae0', t);
    // lake
    c.fillStyle = '#0d0b26'; c.fillRect(0, 120, 320, 60);
    for (let y = 122; y < 180; y += 3) { c.fillStyle = `rgba(150,130,255,${.05 + .03 * Math.sin(t * 2 + y)})`; c.fillRect(((y * 37 + t * 8) % 60) - 20, y, 40, 1); c.fillRect(((y * 53 + t * 6) % 90) + 140, y, 30, 1); }
    c.fillStyle = 'rgba(230,226,255,.25)'; for (let i = 0; i < 6; i++) c.fillRect(268 - Math.round(ox * .03) + Math.round(Math.sin(t * 2 + i) * 3), 126 + i * 7, 6 - i % 2 * 2, 1);
    c.fillStyle = 'rgba(180,140,255,.25)'; c.fillRect(tx - 2, 124, 4, 40);
    // shore trees
    for (const sx of [20, 70, 120, 880, 930, 980]) { c.fillStyle = '#21162e'; c.fillRect(W(sx), 126, 2, 24); Art.blossomCluster(c, W(sx), 120, 11, sx, ['#c78ae8', '#e2a4f2', '#a76ad8', '#f3c8fa']); }
    // platforms
    for (const pl of this.plats) {
      const x = W(pl.x); if (x > 330 || x + pl.w < -10) continue;
      if (pl.w > 60) { c.fillStyle = '#2a2244'; c.fillRect(x, pl.y, pl.w, 180 - pl.y); c.fillStyle = '#3e3466'; c.fillRect(x, pl.y, pl.w, 2); continue; }
      c.fillStyle = `rgba(255,200,140,${.12 + .05 * Math.sin(t * 2 + pl.x)})`; c.fillRect(x - 2, pl.y + 4, pl.w + 4, 30);
      c.fillStyle = '#3a2e5a'; c.fillRect(x, pl.y, pl.w, 4); c.fillStyle = '#5a4a8a'; c.fillRect(x, pl.y, pl.w, 1);
      c.fillStyle = '#ffd9a0'; c.fillRect(x + 2, pl.y + 4, pl.w - 4, 1);
      c.fillStyle = 'rgba(255,217,160,.18)'; c.fillRect(x + 2, pl.y + 8 + Math.round(Math.sin(t * 2 + pl.x)), pl.w - 4, 1);
    }
    // bench
    c.fillStyle = '#5a3a2a'; c.fillRect(W(930), 140, 30, 3); c.fillRect(W(932), 143, 2, 7); c.fillRect(W(956), 143, 2, 7); c.fillRect(W(930), 133, 30, 2);
    Art.lamp(c, W(900), 120, t); Art.lamp(c, W(70), 120, t);
    for (const cr of this.cranes) if (!cr.got) Art.crane(c, W(cr.x), cr.y, t);
    if (!this.note.got) { const nx = W(this.note.x), ny = Math.round(this.note.y + Math.sin(t * 2) * 1.5); c.fillStyle = 'rgba(127,216,239,.3)'; c.fillRect(nx - 6, ny - 5, 13, 11); Art.icon(c, 'note', nx - 4, ny - 3); }
    for (const s of this.splashes) { c.fillStyle = `rgba(200,210,255,${s.t})`; c.fillRect(W(s.x) - 4, 160 - (1 - s.t) * 8, 2, 2); c.fillRect(W(s.x) + 3, 160 - (1 - s.t) * 8, 2, 2); c.fillRect(W(s.x), 156 - (1 - s.t) * 12, 1, 3); }
    // sabrina (floating, dreamy) + player
    const s = this.sab;
    c.fillStyle = 'rgba(255,200,240,.25)'; c.fillRect(W(s.x) - 1 + Math.round(Math.sin(t * 5) * 3), Math.round(s.y - s.z) - 2, 1, 1);
    Art.person(c, W(s.x), s.y - s.z, s.look, s.moving ? Math.floor(s.walk) % 4 : 0, s.dir, 'side', {});
    const p = this.p; if (p.onGround) Art.shadow(c, W(p.x), p.y);
    Art.person(c, W(p.x), p.y, p.look, p.moving ? Math.floor(p.walk) % 4 : (p.onGround ? 0 : 1), p.dir, 'side', {});
    if (this.nearBench && !this.done) Art.prompt(c, W(945), 118, 'Q', t);
    Art.hud(c);
  },
};

// ===================== 10. WOLMIDO =====================
SC.wolmido = WalkScene({
  worldW: 440, yMin: 150, yMax: 170,
  init() {
    this.setupActors(40, 160, 1);
    this.stars = Art.makeStars(91, 90, 320, 90); this.fw = []; this.rockets = []; this.launched = 0;
    this.items = [
      { x: 210, key: 'Q', py: 136, use: () => this.launch() },
      { x: 425, key: 'Q', py: 130, cond: () => this.smiled, use: () => goto(SC.fries, { fadeOut: 1.4 }) },
    ];
  },
  sabTalk: async function () { await say(S(["The sea smells like summer already.", "Light another one!", "...What? Watch the fireworks, not me."][Math.random() * 3 | 0])); },
  async script() { await caption('June 12, 2026', 'WOLMIDO BEACH', 2.4); hint('Light the fireworks  (Q)'); },
  launch() {
    this.launched++; Sfx.jump();
    this.rockets.push({ x: 210 + (Math.random() * 60 - 30), y: 140, vy: -110 - Math.random() * 30, col: ['#ff7aa8', '#ffd86b', '#8ad0ff', '#c89aff', '#9affc8'][this.launched % 5] });
    if (this.launched === 3) setTimeout(() => this.smile(), 1600);
  },
  async smile() {
    this.cutscene = true; hint('');
    this.sab.dir = this.player.x > this.sab.x ? 1 : -1; this.sab.o = { closed: true }; this.sab.moving = false; this.player.moving = false;
    await wait(.6); this.sab.emote = '♥'; await wait(1.8); this.sab.emote = null;
    await say(S("..."), B("What?"), S("Nothing."), S("Just... this is nice."));
    this.sab.o = {}; this.cutscene = false; this.smiled = true;
    hint('Keep lighting fireworks (Q), or head on →');
  },
  onUpdate(dt) {
    for (const r of this.rockets) { r.y += r.vy * dt; r.vy += 40 * dt; if (r.vy > -30 && !r.boom) { r.boom = true; Sfx.pop(); for (let i = 0; i < 46; i++) { const a = Math.random() * 6.28, v = 20 + Math.random() * 40; this.fw.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 1.6 + Math.random() * .6, col: Math.random() < .2 ? '#fff' : r.col }); } } }
    this.rockets = this.rockets.filter(r => !r.boom);
    for (const f of this.fw) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 22 * dt; f.vx *= .985; f.t -= dt; }
    this.fw = this.fw.filter(f => f.t > 0);
  },
  bg(c, ox, t) {
    Art.bandSky(c, 320, 110, ['#05041a', '#090826', '#0f0c30', '#16113a', '#1d1644', '#271c50']);
    Art.stars(c, this.stars, t, ox * .05, 320);
    Art.moon(c, 60 - Math.round(ox * .05), 30, 6);
    // fireworks (world)
    const W = x => Math.round(x - ox);
    for (const r of this.rockets) { c.fillStyle = '#fff3c4'; c.fillRect(W(r.x), Math.round(r.y), 1, 3); }
    for (const f of this.fw) { c.globalAlpha = Math.min(1, f.t); c.fillStyle = f.col; c.fillRect(W(f.x), Math.round(f.y), 1, 1); }
    c.globalAlpha = 1;
    // ferris wheel
    const fx = Math.round(250 - ox * .6), fy = 66, R = 34;
    c.fillStyle = '#251c44'; c.fillRect(fx - 1, fy, 2, 50); c.fillRect(fx - 14, fy + 44, 2, 6); c.fillRect(fx + 12, fy + 44, 2, 6);
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28 + t * .25; const x = fx + Math.cos(a) * R, y = fy + Math.sin(a) * R; c.fillStyle = ['#ff7aa8', '#ffd86b', '#8ad0ff', '#c89aff'][(i + Math.floor(t * 2)) % 4]; c.fillRect(Math.round(x), Math.round(y), 2, 2); if (i % 2 === 0) { c.fillStyle = 'rgba(200,170,255,.25)'; for (let k = 0; k < R; k += 3) c.fillRect(Math.round(fx + Math.cos(a) * k), Math.round(fy + Math.sin(a) * k), 1, 1); } }
    // sea
    c.fillStyle = '#0c0a2a'; c.fillRect(0, 110, 320, 30);
    for (let y = 112; y < 140; y += 3) { c.fillStyle = `rgba(160,140,255,${.08 + .04 * Math.sin(t * 2 + y)})`; c.fillRect(((y * 41 + t * 10) % 80) - 20 - ox * .3 % 80, y, 50, 1); }
    c.fillStyle = 'rgba(230,226,255,.3)'; for (let i = 0; i < 5; i++) c.fillRect(56 - Math.round(ox * .05) + Math.round(Math.sin(t * 2 + i) * 3), 114 + i * 5, 6, 1);
    for (const f of this.fw) { if (f.y < 110) { c.globalAlpha = Math.min(1, f.t) * .3; c.fillStyle = f.col; c.fillRect(W(f.x), 110 + Math.round((110 - f.y) * .25), 1, 1); } }
    c.globalAlpha = 1;
    c.fillStyle = 'rgba(220,220,255,.5)'; for (let x = -(ox % 30); x < 320; x += 30) c.fillRect(x + Math.round(Math.sin(t * 1.5 + x) * 4), 139, 12, 1);
    // sand
    c.fillStyle = '#3a3050'; c.fillRect(0, 140, 320, 40);
    c.fillStyle = '#463a60'; for (let i = 0; i < 80; i++) c.fillRect(((i * 97) % 320 - ox) % 320 + (ox > 0 ? 0 : 0), 142 + (i * 13) % 36, 1, 1);
    // firework box
    c.fillStyle = '#c04a58'; c.fillRect(W(204), 140, 12, 8); c.fillStyle = '#ffd86b'; c.fillRect(W(204), 142, 12, 1); c.fillRect(W(209), 136, 2, 4);
    c.fillStyle = '#5a3a8a'; c.fillRect(W(420), 116, 2, 30); c.fillStyle = '#ffd86b'; c.fillRect(W(410), 110, 26, 8); Art.text(c, 'NEXT', W(423), 112, '#3a1f6a', 1, 'center');
    for (let x = 100; x < 440; x += 160) Art.lamp(c, W(x), 112, t);
  },
});

// ===================== 11. FRIES =====================
SC.fries = {
  init() { this.picks = []; this.boxes = [{ x: 80, id: 'mcd', name: "MCDONALD'S" }, { x: 160, id: 'bk', name: 'BURGER KING' }, { x: 240, id: 'ss', name: 'SHAKE SHACK' }]; this.view = 'side'; this.open = false; },
  exit() { canvas.style.cursor = ''; },
  update() {
    if (!this.open || G.busy) return;
    let pick = null;
    if (G.mouse.clicked && G.mouse.y > 92 && G.mouse.y < 160) pick = this.boxes.find(b => Math.abs(b.x - G.mouse.x) < 32);
    ['1', '2', '3'].forEach((k, i) => { if (G.pressed[k]) pick = this.boxes[i]; });
    this.hover = this.boxes.find(b => Math.abs(b.x - G.mouse.x) < 32 && G.mouse.y > 92 && G.mouse.y < 160);
    canvas.style.cursor = this.hover ? 'pointer' : '';
    if (pick && !this.picks.includes(pick.id)) { this.picks.push(pick.id); Sfx.blip(); Sfx.ping(); if (this.picks.length === 3) { this.open = false; this.check(); } }
  },
  async check() {
    await wait(.8);
    const ok = this.picks.join() === 'bk,mcd,ss';
    if (ok) { this.sabO = { smile: true }; await say(S("...You remember."), S("Burger King. Then McDonald's. Then Shake Shack. Obviously.")); }
    else { await say(S("바보."), S("Burger King first. Then McDonald's. Then Shake Shack.")); this.picks = ['bk', 'mcd', 'ss']; this.sabO = { smile: true }; await say(S("...Remember it this time.")); }
    await wait(.8);
    goto(SC.flowers, { fadeOut: 1.4 });
  },
  draw(c) {
    const t = G.t;
    c.fillStyle = '#1a1230'; c.fillRect(0, 0, 320, 180);
    c.fillStyle = `rgba(255,190,120,${.1 + .02 * Math.sin(t * 3)})`; c.beginPath(); c.arc(160, 40, 90, 0, 7); c.fill();
    c.fillStyle = '#2a1a3a'; c.fillRect(158, 0, 4, 22); c.fillStyle = '#ffe2b0'; c.fillRect(150, 22, 20, 4); c.fillStyle = '#c08a50'; c.fillRect(148, 20, 24, 2);
    // sabrina behind table
    const key = this.view + JSON.stringify(this.sabO || {});
    if (this._k !== key) { this._k = key; this._spr = Art.personHD(LOOK.sabBob, this.view, Object.assign({ sit: true }, this.sabO || {})); }
    c.drawImage(this._spr, 160 - 32, 112 - 74);
    // table
    c.fillStyle = '#6a3e2a'; c.fillRect(20, 112, 280, 68); c.fillStyle = '#8a5a3a'; c.fillRect(20, 112, 280, 2);
    for (const [i, b] of this.boxes.entries()) {
      const x = b.x, y = 150, hv = this.hover === b && this.open;
      if (hv) { c.fillStyle = 'rgba(255,216,107,.18)'; c.fillRect(x - 30, 92, 60, 66); }
      if (b.id === 'mcd') { c.fillStyle = '#ffd860'; for (let k = 0; k < 9; k++) c.fillRect(x - 9 + k * 2, y - 30 - (k % 3) * 2, 1, 12); c.fillStyle = '#d8282e'; c.fillRect(x - 11, y - 20, 22, 20); c.fillRect(x - 12, y - 22, 24, 3); c.fillStyle = '#ffcc33'; c.fillRect(x - 4, y - 15, 2, 6); c.fillRect(x + 2, y - 15, 2, 6); c.fillRect(x - 2, y - 15, 4, 2); }
      if (b.id === 'bk') { c.fillStyle = '#f2c050'; for (let k = 0; k < 8; k++) c.fillRect(x - 8 + k * 2, y - 28 - (k % 2) * 3, 2, 10); c.fillStyle = '#c8562a'; c.fillRect(x - 10, y - 20, 20, 20); c.fillStyle = '#f2a03a'; c.fillRect(x - 10, y - 20, 20, 3); c.fillStyle = '#1e4a9a'; c.fillRect(x - 5, y - 13, 10, 5); }
      if (b.id === 'ss') { c.fillStyle = '#f6d070'; for (let k = 0; k < 7; k++) { c.fillRect(x - 8 + k * 3, y - 28 - (k % 2) * 2, 2, 10); c.fillStyle = k % 2 ? '#f6d070' : '#e8b850'; } c.fillStyle = '#f4f4f0'; c.fillRect(x - 11, y - 18, 22, 18); c.fillStyle = '#1a1a1a'; c.fillRect(x - 11, y - 18, 22, 2); c.fillStyle = '#5ab04a'; c.fillRect(x - 3, y - 12, 6, 4); }
      Art.text(c, b.name, x, y + 6, '#f3e8ff', 1, 'center');
      if (this.open || this.picks.length) Art.text(c, 'KEY ' + (i + 1), x, y + 14, '#8f84c0', 1, 'center');
      const r = this.picks.indexOf(b.id);
      if (r >= 0) { c.fillStyle = '#ffd86b'; c.fillRect(x + 14, 118, 15, 15); c.fillStyle = '#3a1f6a'; c.fillRect(x + 15, 119, 13, 13); Art.text(c, String(r + 1), x + 22, 121, '#ffd86b', 2, 'center'); }
    }
  },
  async script() {
    await caption('June 13, 2026', 'FRY RATING NIGHT', 2.4);
    await say(S("Okay. Final ranking time."));
    await wait(.6);
    this.view = 'front'; Sfx.ping();
    await wait(.9);
    await say(S("Hey."), S("Yes, you. Brian. The one holding the keyboard."), S("Do you remember?"), S("Which one came first?"));
    hint('Click the fries from BEST (1st) to WORST (3rd)  ·  or press 1 / 2 / 3');
    this.open = true;
  },
};

// ===================== 12a. FLOWERS =====================
SC.flowers = WalkScene({
  worldW: 320, yMin: 152, yMax: 170,
  init() {
    this.setupActors(60, 162, 1); this.grow = 0; this.petals = []; this.stars = Art.makeStars(3, 50, 320, 80);
    this.items = [
      { x: 140, key: 'Q', py: 126, cond: () => !this.watered, use: () => this.water() },
      { x: 190, key: 'Q', py: 126, cond: () => !this.watered, use: async () => say(S("That one's mine. Water yours — the pink one.")) },
    ];
  },
  sabTalk: async function () { await say(S(["Mine's the green one. Yours is pink. Don't mix them up.", "Do you think they'll actually bloom?"][Math.random() * 2 | 0])); },
  async script() { await caption('June 16, 2026', '', 2.4); hint('Water your flower pot (the pink one)  ·  Q'); },
  async water() {
    this.watered = true; this.cutscene = true; hint('');
    this.player.x = 126; this.player.dir = 1; this.sab.x = 206; this.sab.y = 160; this.sab.dir = -1;
    this.pouring = true; Sfx.splash(); await wait(1.4); this.pouring = false;
    await tween(this, 'grow', 1, 5.5, easeInOut);
    await wait(1.2);
    await say(S("...They grew so fast."), S("Like they couldn't wait."));
    await wait(2.4);
    goto(SC.rooftop, { fadeOut: 2 });
  },
  onUpdate(dt) {
    if (this.grow > .75 && Math.random() < dt * 14) this.petals.push({ x: 110 + Math.random() * 110, y: 70 + Math.random() * 30, vx: -6 - Math.random() * 8, vy: 10 + Math.random() * 8, c: Math.random() < .5 ? '#ffb8d8' : '#f0e8ff', p: Math.random() * 6 });
    for (const p of this.petals) { p.x += (p.vx + Math.sin(G.t * 2 + p.p) * 6) * dt; p.y += p.vy * dt; }
    this.petals = this.petals.filter(p => p.y < 172);
  },
  tree(c, x, base, g, col, seed) {
    if (g <= 0) return;
    const h = Math.round(4 + g * 46);
    c.fillStyle = '#4a2e3a'; c.fillRect(x, base - h, 2, h);
    if (g > .2) { c.fillStyle = '#5ab070'; c.fillRect(x - 2, base - Math.min(h, 10), 2, 2); c.fillRect(x + 2, base - Math.min(h, 8), 2, 2); }
    if (g > .45) { const k = (g - .45) / .55; c.fillStyle = '#4a2e3a'; c.fillRect(x - Math.round(10 * k), base - h + 8, Math.round(10 * k), 1); c.fillRect(x + 2, base - h + 4, Math.round(12 * k), 1); }
    if (g > .6) { const k = (g - .6) / .4; Art.blossomCluster(c, x, base - h, 6 + 12 * k, seed, col); Art.blossomCluster(c, x - 9, base - h + 9, 4 + 7 * k, seed + 1, col); Art.blossomCluster(c, x + 12, base - h + 5, 4 + 7 * k, seed + 2, col); }
  },
  bg(c, ox, t) {
    Art.bandSky(c, 320, 150, ['#1a1440', '#2a1e58', '#40296c', '#5e367c', '#86488a', '#b06496', '#d888a8', '#f0b0b8']);
    Art.stars(c, this.stars, t);
    c.fillStyle = 'rgba(255,230,240,.5)'; c.beginPath(); c.arc(250, 120, 18, 0, 7); c.fill();
    c.fillStyle = '#2a2048'; c.fillRect(0, 118, 320, 26);
    for (let x = 0; x < 320; x += 22) { c.fillStyle = '#231a3e'; c.fillRect(x, 108 + (x * 7) % 12, 18, 40); c.fillStyle = '#ffe0b0'; c.fillRect(x + 4, 116 + (x * 7) % 12, 1, 2); c.fillRect(x + 11, 122 + (x * 3) % 12, 1, 2); }
    c.fillStyle = '#3a2e58'; c.fillRect(0, 142, 320, 38); c.fillStyle = '#4a3a6e'; c.fillRect(0, 142, 320, 2);
    c.fillStyle = '#2a2248'; for (let x = 0; x < 320; x += 6) c.fillRect(x, 130, 2, 12); c.fillRect(0, 128, 320, 2);
    // pots
    this.tree(c, 139, 146, this.grow, ['#ffb8d8', '#ff9cc8', '#ffd0e4', '#f080b0'], 5);
    this.tree(c, 189, 146, this.grow, ['#f4f0ff', '#e0d8ff', '#c8f0d8', '#ffffff'], 9);
    c.fillStyle = '#f6c6d8'; c.fillRect(132, 146, 16, 12); c.fillStyle = '#e8a8c0'; c.fillRect(130, 144, 20, 3);
    c.fillStyle = '#5aa86a'; c.fillRect(182, 146, 16, 12); c.fillStyle = '#4a9058'; c.fillRect(180, 144, 20, 3);
    if (this.pouring) { c.fillStyle = '#9fd0ff'; for (let i = 0; i < 4; i++) c.fillRect(135 + Math.random() * 6, 136 + i * 2 + Math.random() * 2, 1, 2); c.fillRect(188 + Math.random() * 6, 138 + Math.random() * 4, 1, 2); }
  },
  fg(c) { for (const p of this.petals) { c.fillStyle = p.c; c.fillRect(Math.round(p.x), Math.round(p.y), 1 + (Math.sin(G.t * 6 + p.p) > 0), 1); } },
});

// ===================== 12b. ROOFTOP — THE TWIST =====================
SC.rooftop = {
  init() {
    this.stars = Art.makeStars(123, 140, 320, 110);
    this.far = Art.makeSkyline(61, 340, { minH: 18, maxH: 64, lit: .3, minW: 10, maxW: 26 });
    this.mid = Art.makeSkyline(62, 360, { minH: 8, maxH: 40, lit: .5, minW: 14, maxW: 30, signs: .3 });
    this.bd = 0; this.sd = 0; this.bSit = true; this.sSit = true; this.grid = 0; this.phase = 'sit';
    this.bView = 'back'; this.sView = 'back'; this.cache = {}; this.sFrame = 0; this.bFrame = 0; this.hop = 0;
    this.petals = [];
  },
  depthY: d => lerp(176, 126, d),
  depthS: d => lerp(1.5, .62, d),
  sprite(L, frame, view, o) {
    const k = [L.hair, frame, view, JSON.stringify(o)].join('|');
    if (!this.cache[k]) this.cache[k] = Art.personCanvas(L, frame, 1, view, o);
    return this.cache[k];
  },
  drawP(c, L, x, d, view, frame, o, z = 0) {
    const sc = this.depthS(d), y = this.depthY(d) - z;
    const cv = this.sprite(L, frame, view, o);
    c.imageSmoothingEnabled = false;
    c.drawImage(cv, Math.round(x - 16 * sc), Math.round(y - 38 * sc), Math.round(32 * sc), Math.round(40 * sc));
  },
  update(dt) {
    if (this.phase === 'walk' && !G.busy) {
      const v = (G.keys.up ? 1 : 0) - (G.keys.down ? 1 : 0);
      this.bd = clamp(this.bd + v * .28 * dt, 0, 1);
      this.bMoving = !!v; if (v) this.bWalk = (this.bWalk || 0) + dt * 7;
      if (this.bd >= .985) { this.phase = 'edge'; this.bMoving = false; this.toEdge(); }
    }
    if (Math.random() < dt * 4) this.petals.push({ x: Math.random() * 340, y: -4, vx: -8 - Math.random() * 6, vy: 8 + Math.random() * 6, p: Math.random() * 6 });
    for (const p of this.petals) { p.x += (p.vx + Math.sin(G.t + p.p) * 5) * dt; p.y += p.vy * dt; }
    this.petals = this.petals.filter(p => p.y < 182);
  },
  draw(c) {
    const t = G.t;
    Art.bandSky(c, 320, 130, ['#04031a', '#080628', '#0d0a34', '#130e40', '#1a134c', '#231958', '#2e1f64']);
    Art.stars(c, this.stars, t);
    Art.moon(c, 262, 30, 9);
    Art.skyline(c, this.far, -10, 128, '#1a1640', '#7a6ad8', t, { flicker: true });
    Art.skyline(c, this.mid, 0, 132, '#0f0c28', '#b8a8ff', t, { neon: ['#ff6aa8', '#6ac8ff', '#c08aff'], warm: '#ffd9a8', flicker: true });
    Art.branch(c, 330, 4, 90, -1, 41, 1); Art.branch(c, -10, 2, 60, 1, 43, .9);
    // rooftop floor (perspective)
    c.fillStyle = '#211a3c';
    c.beginPath(); c.moveTo(30, 126); c.lineTo(290, 126); c.lineTo(400, 180); c.lineTo(-80, 180); c.fill();
    c.fillStyle = '#3a2e60'; c.fillRect(30, 125, 260, 2);
    c.fillStyle = 'rgba(255,200,240,.05)'; c.fillRect(30, 127, 260, 6);
    if (this.grid > 0) {
      c.globalAlpha = this.grid * .5; c.fillStyle = '#9a86ff';
      for (let i = 0; i <= 12; i++) { const fx = 30 + i * (260 / 12), bx = -80 + i * (480 / 12); for (let k = 0; k <= 54; k++) { const y = 126 + k; const x = lerp(fx, bx, k / 54); c.fillRect(Math.round(x), y, 1, 1); } }
      for (let k = 0; k < 8; k++) { const d = Math.pow(k / 8, 1.6); const y = Math.round(lerp(126, 180, d) + ((t * 6) % 4) * d); const x0 = lerp(30, -80, (y - 126) / 54), x1 = lerp(290, 400, (y - 126) / 54); c.fillRect(Math.round(x0), y, Math.round(x1 - x0), 1); }
      c.globalAlpha = 1;
    }
    // characters (far first)
    const L = sabLook();
    const ss = this.sd, bb = this.bd;
    const drawS = () => this.drawP(c, L, lerp(176, 168, ss), ss, this.sView, this.sMoving ? Math.floor(this.sWalk || 0) % 4 : 0, { sit: this.sSit, handL: this.hands }, this.hop);
    const drawB = () => this.drawP(c, LOOK.brian, lerp(148, 152, bb), bb, this.bView, this.bMoving ? Math.floor(this.bWalk || 0) % 4 : 0, { sit: this.bSit, handR: this.hands }, this.hop);
    if (ss > bb) { drawS(); drawB(); } else { drawB(); drawS(); }
    if (this.hands) { const y = this.depthY(.99) - 12 * this.depthS(.99) - this.hop; c.fillStyle = LOOK.brian.skin; c.fillRect(158, Math.round(y), 5, 1); }
    for (const p of this.petals) { c.fillStyle = '#e8b8f8'; c.fillRect(Math.round(p.x), Math.round(p.y), 1 + (Math.sin(G.t * 6 + p.p) > 0), 1); }
    if (this.sEmote) Art.emote(c, lerp(176, 168, ss), this.depthY(ss) - 40 * this.depthS(ss), this.sEmote);
  },
  async script() {
    G.hud = false;
    await wait(10);
    const ans = await ask('Brian:', { mask: true, allowEmpty: true });
    sendWish('[6/16 night view] ' + (ans || '(nothing)'));
    await say(B('……'));
    await wait(1.4);
    await say(S("It's been 152 days. As of today."));
    await wait(.6);
    await say(S("How long are you going to stay like this?"), S("It's time to wake up from the dream..."), S("...and come to where I am."));
    // the twist
    Music.cut();
    G.glitch = 1.2; Sfx.glitch();
    await wait(.25); Music.play('stay', .4);
    tween(this, 'grid', 1, 1.6);
    await tween(G, 'glitch', 0, 1.8, easeOut);
    // sabrina stands and walks forward on the Z axis
    this.sSit = false; await wait(.6);
    this.sMoving = true; this.sWalk = 0;
    const walker = setInterval(() => { this.sWalk += .35; }, 40);
    await tween(this, 'sd', 1, 3.2, t => t);
    clearInterval(walker); this.sMoving = false;
    this.sView = 'front'; await wait(.4);
    await say(S("Come here."));
    this.bSit = false; await wait(.3);
    hint('W  —  walk forward');
    this.phase = 'walk';
  },
  async toEdge() {
    hint('');
    this.bView = 'back'; this.sView = 'back';
    await wait(.6);
    this.hands = true;
    await say(S("Don't be afraid."));
    await wait(.5);
    await tween(this, 'hop', 6, .25, easeOut);
    G.hud = true;
    goto(SC.fall, { cut: true });
  },
};

// ===================== 12c. THE FALL (high resolution) =====================
SC.fall = {
  res: [640, 360],
  init() {
    const H = 1560; this.H = H;
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = H; const c = cv.getContext('2d');
    this.city = cv; this.camY = 0; this.chY = 0; this.z = 12; this.speed = 0; this.lines = [];
    // sky
    const g = c.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, '#04031a'); g.addColorStop(.5, '#0d0a34'); g.addColorStop(1, '#2e1f64'); c.fillStyle = g; c.fillRect(0, 0, 640, 260);
    const st = Art.makeStars(123, 520, 640, 230); for (const s of st) { c.fillStyle = s.c; c.globalAlpha = .4 + Math.random() * .6; c.fillRect(s.x, s.y, 1, 1); } c.globalAlpha = 1;
    c.fillStyle = 'rgba(200,190,255,.1)'; c.beginPath(); c.arc(524, 60, 46, 0, 7); c.fill();
    c.fillStyle = '#ebe7ff'; c.beginPath(); c.arc(524, 60, 18, 0, 7); c.fill(); c.fillStyle = '#cfc8f2'; c.fillRect(516, 56, 4, 3); c.fillRect(528, 66, 3, 2);
    // far skyline & body going down
    const far = Art.makeSkyline(61, 700, { minH: 36, maxH: 128, lit: .3, minW: 20, maxW: 52 });
    for (const b of far) { const x = b.x - 20, top = 256 - b.h; c.fillStyle = '#1a1640'; c.fillRect(x, top, b.w, H); for (let y = top + 4; y < H - 120; y += 6) for (let xx = x + 3; xx < x + b.w - 3; xx += 5) if (Math.random() < .28) { c.fillStyle = Math.random() < .2 ? '#ffe2b0' : '#8a7ae8'; c.fillRect(xx, y, 2, 3); } }
    // mid layer with neon
    const mid = Art.makeSkyline(62, 700, { minH: 30, maxH: 90, lit: .5, minW: 30, maxW: 60 });
    for (const b of mid) { const x = b.x - 20, top = 330 + (b.w * 7 % 90) - b.h; c.fillStyle = '#0f0c28'; c.fillRect(x, top, b.w, H); c.fillStyle = '#2a2058'; c.fillRect(x, top, b.w, 2); for (let y = top + 6; y < H - 100; y += 8) for (let xx = x + 4; xx < x + b.w - 4; xx += 6) if (Math.random() < .4) { c.fillStyle = Math.random() < .15 ? '#ffd9a8' : Math.random() < .5 ? '#b8a8ff' : '#6a5ad0'; c.fillRect(xx, y, 3, 4); } if (b.sign >= 0 || Math.random() < .3) { const nc = ['#ff6aa8', '#6ac8ff', '#c08aff'][b.w % 3]; c.fillStyle = nc; c.globalAlpha = .25; c.fillRect(x + 3, top + 30, 10, 70); c.globalAlpha = 1; c.fillRect(x + 6, top + 34, 4, 62); } }
    // near framing buildings (left/right) we fall between
    c.fillStyle = '#08061a'; c.fillRect(0, 300, 120, H); c.fillRect(520, 300, 120, H);
    for (let y = 310; y < H - 80; y += 10) for (let x = 6; x < 114; x += 9) { if (Math.random() < .5) { c.fillStyle = Math.random() < .2 ? '#ffe2b0' : '#a898ff'; c.fillRect(x, y, 5, 6); } if (Math.random() < .5) { c.fillStyle = Math.random() < .2 ? '#ffe2b0' : '#a898ff'; c.fillRect(526 + x - 6, y, 5, 6); } }
    c.fillStyle = '#ff6aa8'; c.fillRect(118, 500, 4, 160); c.fillStyle = '#6ac8ff'; c.fillRect(518, 760, 4, 200);
    c.globalAlpha = .2; c.fillStyle = '#ff6aa8'; c.fillRect(110, 490, 20, 180); c.fillStyle = '#6ac8ff'; c.fillRect(510, 750, 20, 220); c.globalAlpha = 1;
    // cherry blossoms at street level
    for (let x = 30; x < 640; x += 70) { c.fillStyle = '#1c1028'; c.fillRect(x, H - 120, 3, 60); Art.blossomCluster(c, x, H - 124, 26, x, ['#c78ae8', '#e2a4f2', '#a76ad8', '#f3c8fa']); }
    // street & car light trails
    c.fillStyle = '#120e26'; c.fillRect(0, H - 70, 640, 70);
    for (let i = 0; i < 26; i++) { c.fillStyle = i % 2 ? '#ff4a6a' : '#fff4d0'; c.fillRect(Math.random() * 600, H - 60 + (i % 4) * 12, 40 + Math.random() * 80, 2); }
    // top blossom branches over sky
    c.save(); c.scale(2, 2); Art.branch(c, 330, 4, 100, -1, 41, 1); Art.branch(c, -10, 2, 70, 1, 43, .9); c.restore();
    this.bHD = Art.personHD(LOOK.brian, 'back', { handR: true });
    this.sHD = Art.personHD(sabLook(), 'back', { handL: true });
  },
  update(dt) {
    const prev = this.prevCam ?? 0; this.speed = (this.camY - prev) / dt; this.prevCam = this.camY;
    if (this.speed > 60 && Math.random() < dt * 30) this.lines.push({ x: Math.random() * 640, y: 380, l: 20 + Math.random() * 60 });
    for (const l of this.lines) l.y -= this.speed * dt * 1.6;
    this.lines = this.lines.filter(l => l.y + l.l > -10);
  },
  draw(c) {
    c.imageSmoothingEnabled = false;
    c.drawImage(this.city, 0, -Math.round(this.camY));
    // rooftop ledge (attached to world)
    const ry = 252 - this.camY;
    if (ry < 380) {
      c.fillStyle = '#211a3c'; c.beginPath(); c.moveTo(60, ry); c.lineTo(580, ry); c.lineTo(800, ry + 110); c.lineTo(-160, ry + 110); c.fill();
      c.fillStyle = '#3a2e60'; c.fillRect(60, ry - 2, 520, 4);
    }
    // characters
    const cy = 254 + this.chY - this.camY - this.z;
    if (cy < 460) {
      c.drawImage(this.bHD, 304 - 32, Math.round(cy - 76));
      c.drawImage(this.sHD, 336 - 32, Math.round(cy - 76));
      c.fillStyle = '#f2c9a9'; c.fillRect(312, Math.round(cy - 28), 16, 2);
    }
    // speed lines
    c.fillStyle = 'rgba(220,210,255,.35)'; for (const l of this.lines) c.fillRect(Math.round(l.x), Math.round(l.y), 1, Math.round(l.l));
    // vignette
    const v = c.createRadialGradient(320, 180, 120, 320, 180, 420); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,10,.55)'); c.fillStyle = v; c.fillRect(0, 0, 640, 360);
  },
  async script() {
    G.fade = 0;
    G.glitch = .5; tween(G, 'glitch', 0, .6);
    await wait(.7);
    Sfx.whoosh();
    await tween(this, 'z', 34, .35, easeOut);
    tween(this, 'chY', 1500, 2.4, easeIn);
    tween(this, 'z', 0, .6);
    await tween(this, 'camY', this.H - 360, 7.5, easeInOut);
    await wait(1.4);
    await fadeOut(2.4);
    await wait(.8);
    goto(SC.montage, { cut: true, stayDark: true });
  },
};

// ===================== 13. MONTAGE + CALENDAR =====================
const PHOTOS = ['icecream', 'peace', 'octopus', 'izakaya', 'hanriver', 'gifts', 'hands', 'shadows', 'socks', 'pcbang', 'heart', 'timemachine'];
SC.montage = {
  res: [640, 360],
  init() {
    this.imgs = PHOTOS.map(n => { const i = new Image(); i.src = 'assets/photos/' + n + '.jpg'; return i; });
    this.stars = Art.makeStars(222, 260, 640, 360);
    this.brian = Art.personHD(LOOK.brian, 'front', { closed: true });
    this.shown = []; this.cal = null; this.calIdx = 0; this.calGlow = 0; this.t0 = 0;
    const R = rng(7);
    const slots = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283 + .3; slots.push([320 + Math.cos(a) * 228, 176 + Math.sin(a) * 112]); }
    this.slots = slots.sort(() => R() - .5);
    this.days = []; const d0 = new Date(2026, 4, 2); for (let i = 0; ; i++) { const d = new Date(d0); d.setDate(d0.getDate() + i); this.days.push(d); if (d.getMonth() === 10 && d.getDate() === 14) break; }
  },
  update(dt) { for (const p of this.shown) p.t += dt; },
  draw(c) {
    const t = G.t;
    c.fillStyle = '#05040f'; c.fillRect(0, 0, 640, 360);
    Art.stars(c, this.stars, t);
    // brian floating
    const by = 150 + Math.sin(t * 1.2) * 6;
    c.fillStyle = 'rgba(160,140,255,.08)'; c.beginPath(); c.arc(320, by + 36, 70, 0, 7); c.fill();
    c.imageSmoothingEnabled = false;
    c.globalAlpha = this.cal ? .35 : 1;
    c.drawImage(this.brian, 320 - 32, Math.round(by - 4));
    c.globalAlpha = 1;
    // photos
    c.imageSmoothingEnabled = true;
    for (const p of this.shown) {
      const life = 3.0, k = p.t;
      const a = k < .5 ? k / .5 : k > life - .5 ? Math.max(0, (life - k) / .5) : 1;
      if (a <= 0) continue;
      const img = this.imgs[p.i]; if (!img.complete || !img.naturalWidth) continue;
      const m = 112, sc = Math.min(m / img.naturalWidth, m / img.naturalHeight);
      const w = img.naturalWidth * sc, h = img.naturalHeight * sc;
      c.save(); c.globalAlpha = a; c.translate(p.x, p.y - (1 - a) * 8); c.rotate(p.r); const s = .9 + .1 * a; c.scale(s, s);
      c.fillStyle = 'rgba(160,140,255,.25)'; c.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 28);
      c.fillStyle = '#f6f2ff'; c.fillRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 20);
      c.drawImage(img, -w / 2, -h / 2, w, h);
      c.restore();
    }
    c.imageSmoothingEnabled = false;
    // calendar
    if (this.cal) {
      const d = this.days[this.calIdx];
      const x = 250, y = 100, w = 140, h = 150;
      if (this.calGlow > 0) { c.fillStyle = `rgba(255,216,107,${.25 * this.calGlow})`; c.beginPath(); c.arc(320, 175, 130, 0, 7); c.fill(); }
      c.fillStyle = '#0e0a20'; c.fillRect(x - 3, y - 3, w + 6, h + 6);
      c.fillStyle = '#f6f2ff'; c.fillRect(x, y, w, h);
      c.fillStyle = '#c0304a'; c.fillRect(x, y, w, 34);
      Art.text(c, ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'][d.getMonth()] + ' 2026', 320, y + 11, '#fff', 3, 'center');
      Art.text(c, String(d.getDate()), 320, y + 52, '#1a1236', 14, 'center');
      Art.text(c, ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()], 320, y + 130, '#8a7ab0', 2, 'center');
      c.fillStyle = '#1a1236'; c.fillRect(x + 20, y - 8, 6, 14); c.fillRect(x + w - 26, y - 8, 6, 14);
      if (this.flip > 0) { c.fillStyle = `rgba(246,242,255,${this.flip})`; c.fillRect(x, y - (1 - this.flip) * 30, w, h * this.flip); }
      if (this.calGlow > 0) for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28 + t; Art.bigStar(c, Math.round(320 + Math.cos(a) * 110), Math.round(175 + Math.sin(a) * 100), t + i, .6); }
    }
  },
  async script() {
    await fadeIn(2);
    const order = [...PHOTOS.keys()].sort(() => Math.random() - .5);
    for (let k = 0; k < order.length; k++) {
      const [x, y] = this.slots[k];
      this.shown.push({ i: order[k], x, y, r: (Math.random() - .5) * .28, t: 0 });
      await wait(1.05);
    }
    await wait(2.4);
    // calendar
    this.cal = true; this.flip = 0; this.calIdx = 0;
    await wait(1.2);
    const N = this.days.length - 1, T = 7;
    let el = 0, last = 0;
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    while (el < T) { await wait(1 / 60); el += 1 / 60; const idx = Math.min(N, Math.round(N * ease(Math.min(1, el / T)))); if (idx !== last) { last = idx; this.calIdx = idx; this.flip = .7; if (Math.random() < .5 || el > T * .85) Sfx.tone(1200, .02, 'square', .02); } this.flip = Math.max(0, this.flip - .12); }
    this.calIdx = N; this.flip = 0; G.shake = .4; Sfx.item();
    tween(this, 'calGlow', 1, .6);
    await wait(3.2);
    await fadeOut(1.8);
    goto(SC.letter, { cut: true, stayDark: true });
  },
};

// ===================== 14. LETTER =====================
const LETTER = [
  '생일축하해.\n사랑하는 나의 Blip 2.',
  '이 세상에 나와 같은 시기에\n나타나주기로 해서 고마워.',
  '그간의 시간이 헛되지 않게,\n앞으로의 시간이 더 충만할 수 있게,\n너의 곁에 있을게.',
  '비록 내가 너를 또 다치게 하고,\n너를 울릴지도 모르지만,\n그럼에도 다시 찾아와줄래.',
  '만약에라는 꿈보다,\n영원히 깨지않을 아픈 현실에\n내가 살 수 있게.',
  '눈을 감으면 꿈은 언제나,\n이루어질 거라고 믿었던 시절.\n그대가 바란다면 어디까지라도 날 수 있으니까.',
  '미숙한 나라도 언젠가,\n함께 살아갈 의미를 찾는다면.\n지금의 사랑과 미움까지도 단단히 이어서,',
  '사랑의 조각을 주워서\n당신 안에 계속 눈부신 세상을\n살며시 선물해주고 싶어.',
  '이유도 없이 happy해질 것 같은,\n밤을 가득 채울\n반짝이는 현실이 되리라.',
  '꿈은 이루어지거나\n이루어지지 않을 수 있지만,\n현실은 존재하기에.',
  '당신도 나의 고단한 삶이\n되어주길 바래.',
  '사랑해.',
];
SC.letter = {
  res: [640, 360],
  init() { this.stars = Art.makeStars(333, 300, 640, 360); this.brian = Art.personHD(LOOK.brian, 'front', { closed: true }); this.motes = []; },
  update(dt) {
    if (Math.random() < dt * 6) this.motes.push({ x: Math.random() * 640, y: 370, v: 8 + Math.random() * 14, p: Math.random() * 6, c: Math.random() < .5 ? '#e8b8f8' : '#fff4c8' });
    for (const m of this.motes) { m.y -= m.v * dt; m.x += Math.sin(G.t + m.p) * 6 * dt; }
    this.motes = this.motes.filter(m => m.y > -5);
  },
  draw(c) {
    c.fillStyle = '#05040f'; c.fillRect(0, 0, 640, 360);
    const g = c.createRadialGradient(320, 200, 20, 320, 200, 380); g.addColorStop(0, 'rgba(60,40,120,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
    Art.stars(c, this.stars, G.t);
    for (const m of this.motes) { c.globalAlpha = .4 + .4 * Math.sin(G.t * 2 + m.p); c.fillStyle = m.c; c.fillRect(Math.round(m.x), Math.round(m.y), 1, 1); }
    c.globalAlpha = .18; c.drawImage(this.brian, 320 - 32, Math.round(250 + Math.sin(G.t) * 5)); c.globalAlpha = 1;
  },
  async script() {
    Music.play('sea', 2);
    await fadeIn(2.2);
    const L = $('#letter'), body = L.querySelector('.body');
    L.style.display = 'flex'; body.style.opacity = 0;
    for (const chunk of LETTER) {
      body.textContent = chunk; await wait(.1); body.style.opacity = 1;
      await wait(1.1);
      await waitKey(['e', 'enter', 'jump']);
      body.style.opacity = 0; await wait(.9);
    }
    L.style.display = 'none';
    await wait(.6);
    goto(SC.wish, { fadeOut: 1.2 });
  },
};

// ===================== 15. MAKE A WISH =====================
SC.wish = {
  res: [640, 360],
  init() {
    this.stars = Art.makeStars(444, 280, 640, 300);
    this.brian = Art.personHD(LOOK.brian, 'front', {});
    this.brianSmile = Art.personHD(LOOK.brian, 'front', { smile: true });
    this.lit = 1; this.smoke = []; this.dim = 0; this.risingStar = null; this.endText = 0; this.smile = false;
  },
  update(dt) {
    for (const s of this.smoke) { s.y -= 14 * dt; s.x += Math.sin(G.t * 2 + s.p) * 8 * dt; s.t -= dt * .5; }
    this.smoke = this.smoke.filter(s => s.t > 0);
  },
  drawCake(c, x, y) {
    const R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(x + a, y + b, w, h); };
    // glow
    if (this.lit > 0) { const g = c.createRadialGradient(x, y - 40, 4, x, y - 40, 130); g.addColorStop(0, `rgba(255,200,120,${.35 * this.lit})`); g.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = g; c.fillRect(x - 140, y - 170, 280, 260); }
    R(-62, 6, 124, 6, '#d8d4ec'); R(-58, 12, 116, 3, '#a8a2c8');
    R(-50, -36, 100, 42, '#f8ecf2'); R(-50, -36, 100, 3, '#ffffff'); R(-50, 2, 100, 4, '#e8d0dc');
    for (let i = 0; i < 100; i += 10) { R(-50 + i, -33, 6, 6 + (i % 20 ? 4 : 8), '#f48ab4'); R(-48 + i, -33, 2, 3, '#ffc0d8'); }
    R(-50, -36, 100, 4, '#f48ab4');
    Art.text(c, 'BRIAN', x + 1, y - 14 + 1, '#c86a90', 2, 'center'); Art.text(c, 'BRIAN', x, y - 14, '#7a2a50', 2, 'center');
    for (const sx of [-40, -20, 20, 40]) { R(sx - 3, -42, 7, 6, '#e8304a'); R(sx - 2, -43, 5, 1, '#e8304a'); R(sx - 1, -44, 2, 1, '#5ab04a'); R(sx - 2, -40, 1, 1, '#ffd0d0'); }
    for (let i = 0; i < 5; i++) {
      const cx = -24 + i * 12;
      R(cx, -62, 3, 20, ['#9fd0ff', '#ffb8d8', '#ffe28a', '#c8b0ff', '#a8f0c8'][i]); R(cx, -58, 3, 1, '#ffffff'); R(cx, -50, 3, 1, '#ffffff');
      R(cx + 1, -65, 1, 3, '#2a2030');
      if (this.lit > 0) {
        const f = Math.sin(G.t * 12 + i * 2), fh = Math.round((5 + f * 1.2) * this.lit);
        R(cx - 1, -65 - fh, 5, fh, '#ffb04a'); R(cx, -65 - fh - 2, 3, fh, '#ffd86b'); R(cx + 1, -64 - fh, 1, Math.max(1, fh - 2), '#fff8e0');
      }
    }
  },
  draw(c) {
    const t = G.t;
    c.fillStyle = '#06041a'; c.fillRect(0, 0, 640, 360);
    Art.stars(c, this.stars, t);
    c.save(); c.scale(2, 2); Art.branch(c, 330, 2, 80, -1, 51, 1); Art.branch(c, -10, 0, 60, 1, 53, .9); c.restore();
    c.fillStyle = '#120e2a'; c.fillRect(0, 326, 640, 34); c.fillStyle = '#1e1840'; c.fillRect(0, 326, 640, 2);
    c.imageSmoothingEnabled = false;
    c.drawImage(this.smile ? this.brianSmile : this.brian, 320 - 32, 184);
    this.drawCake(c, 320, 318);
    for (const s of this.smoke) { c.globalAlpha = s.t * .6; c.fillStyle = '#cfc8e8'; c.fillRect(Math.round(s.x), Math.round(s.y), 2, 2); }
    c.globalAlpha = 1;
    if (this.dim > 0) { c.fillStyle = `rgba(4,3,14,${this.dim})`; c.fillRect(0, 0, 640, 360); }
    if (this.risingStar) Art.bigStar(c, Math.round(this.risingStar.x), Math.round(this.risingStar.y), t, this.risingStar.s);
    if (this.endText > 0) {
      c.globalAlpha = this.endText;
      Art.text(c, 'HAPPY BIRTHDAY, BRIAN', 320, 66, '#fff4fb', 4, 'center');
      Art.text(c, '2026.11.14', 320, 98, '#cdb8ff', 2, 'center');
      Art.text(c, 'WITH LOVE, SABRINA ♥', 320, 116, '#ff9cc0', 2, 'center');
      c.globalAlpha = 1;
    }
    if (this.credits) {
      Art.text(c, 'THE END', 320, 140, '#ffd86b', 3, 'center');
      Art.text(c, "MUSIC: KENSUKE USHIO - IN THE POOL / IN THE SEA (CHAINSAW MAN THE MOVIE: REZE ARC OST)", 320, 300, '#8f84c0', 1, 'center');
      Art.text(c, 'ROSA WALTON & HALLIE COGGINS - I REALLY WANT TO STAY AT YOUR HOUSE (CYBERPUNK: EDGERUNNERS)', 320, 312, '#8f84c0', 1, 'center');
      if (Math.sin(t * 3) > 0) Art.text(c, 'PRESS ENTER TO PLAY AGAIN', 320, 334, '#cdb8ff', 1, 'center');
    }
  },
  async script() {
    await wait(1.6);
    await caption('Make a wish.', '', 2.2);
    const wish = await ask('Make a wish.');
    sendWish('[WISH] ' + wish);
    await wait(.6);
    Sfx.whoosh();
    await tween(this, 'lit', 0, .5, easeIn);
    for (let i = 0; i < 5; i++) for (let k = 0; k < 6; k++) this.smoke.push({ x: 320 - 23 + i * 12 + Math.random() * 2, y: 250 - k * 3, t: 1 - k * .1, p: Math.random() * 6 });
    await tween(this, 'dim', .55, 1.4);
    await wait(.8);
    this.risingStar = { x: 320, y: 252, s: .6 };
    Sfx.crane();
    await Promise.all([tween(this.risingStar, 'y', 34, 3.6, easeInOut), tween(this.risingStar, 's', 1.6, 3.6)]);
    this.smile = true;
    await tween(this, 'endText', 1, 2);
    await wait(2.6);
    this.credits = true;
    await waitKey(['enter']);
    Music.stop(1.5);
    await fadeOut(1.5);
    location.reload();
  },
};
