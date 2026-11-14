'use strict';
const SC = {};

// ===================== TITLE =====================
SC.title = {
  init() { this.stars = Art.makeStars(11, 120, 320, 140); this.sky = Art.makeSkyline(5, 340, { minH: 14, maxH: 46, lit: .25 }); },
  draw(c) {
    Art.bandSky(c, 320, 180, ['#07061a', '#0d0b28', '#151236', '#1f1946', '#2c2158', '#3d2a6a', '#553479']);
    Art.stars(c, this.stars, G.t);
    Art.bigStar(c, 160, 34, G.t, 1.3);
    Art.skyline(c, this.sky, 0, 182, '#120d26', '#7a6ad0', G.t);
    Art.branch(c, -2, 4, 70, 1, 3, .8); Art.branch(c, 322, 10, 60, -1, 9, .8);
    Art.text(c, 'MAKE A WISH', 160 + 1, 68 + 1, '#3a1f6a', 3, 'center');
    Art.text(c, 'MAKE A WISH', 160, 68, '#fff4fb', 3, 'center');
    Art.text(c, 'A LITTLE GAME FOR BRIAN', 160, 92, '#cdb8ff', 1, 'center');
    if (Math.sin(G.t * 4) > -.3) Art.text(c, 'PRESS ENTER', 160, 118, '#ffd86b', 1, 'center');
    Art.text(c, 'WASD MOVE  SPACE JUMP  Q INTERACT  E TALK', 160, 166, '#8f84c0', 1, 'center');
  },
  async script() {
    await waitKey(['enter']);
    Sfx.unlock(); Sfx.ding();
    Music.play('pool');
    goto(SC.prologue);
  },
};

// ===================== 1. PROLOGUE =====================
SC.prologue = {
  init() {
    this.stars = Art.makeStars(21, 160, 320, 150); this.phase = 'sky';
    this.star = { x: 228, y: 38 }; this.trail = []; this.flash = 0;
    this.city = Art.makeSkyline(8, 360, { minH: 8, maxH: 30, lit: .3, minW: 8, maxW: 20 });
    this.plane = { x: -60, y: 40, on: false };
    this.sab = new Actor({ x: 92, y: 164, look: LOOK.sabLong, dir: 1 }); this.sab.visible = false;
  },
  update(dt) {
    if (this.phase === 'fall') { this.trail.push({ x: this.star.x, y: this.star.y, a: 1 }); }
    this.trail.forEach(p => p.a -= dt * 1.5); this.trail = this.trail.filter(p => p.a > 0);
    this.flash = Math.max(0, this.flash - dt * 1.2);
    if (this.sab.moving) this.sab.walk += dt * 8;
  },
  draw(c) {
    if (this.phase === 'sky' || this.phase === 'fall' || this.phase === 'impact') {
      Art.bandSky(c, 320, 180, ['#05040f', '#0a0820', '#120e30', '#1a1440', '#251a52', '#2f1f5c']);
      Art.stars(c, this.stars, G.t);
      for (const p of this.trail) { c.globalAlpha = p.a * .8; c.fillStyle = '#fff2c0'; c.fillRect(p.x | 0, p.y | 0, 2, 2); }
      c.globalAlpha = 1;
      if (this.phase !== 'impact') Art.bigStar(c, Math.round(this.star.x), Math.round(this.star.y), G.t, this.phase === 'fall' ? 1.4 : 1.1);
      c.fillStyle = '#0c0a1c'; c.fillRect(0, 164, 320, 16);
      Art.skyline(c, this.city, 0, 166, '#0c0a1c', '#4a3f80', G.t);
      if (this.flash > 0) { c.fillStyle = `rgba(255,250,230,${this.flash})`; c.fillRect(0, 0, 320, 180); }
      return;
    }
    if (this.phase === 'airport') this.drawAirport(c);
  },
  drawAirport(c) {
    Art.bandSky(c, 320, 120, ['#141038', '#1f1850', '#2e2064', '#47307a', '#6a428a', '#9a5a96', '#c87ba0']);
    Art.stars(c, this.stars.slice(0, 50), G.t);
    Art.skyline(c, this.city, 0, 104, '#2a1e4a', '#ffd9a8', G.t);
    // runway
    c.fillStyle = '#1b1530'; c.fillRect(0, 104, 320, 14);
    for (let x = 0; x < 320; x += 12) { c.fillStyle = (Math.floor(G.t * 4 + x / 12) % 6 === 0) ? '#fff6c0' : '#8a7a50'; c.fillRect(x, 110, 2, 1); }
    // plane
    if (this.plane.on) this.drawPlane(c, this.plane.x, this.plane.y);
    // terminal
    c.fillStyle = '#2b2448'; c.fillRect(0, 116, 320, 50);
    c.fillStyle = '#ffe6b8'; c.globalAlpha = .9;
    for (let x = 6; x < 314; x += 14) c.fillRect(x, 122, 11, 30);
    c.globalAlpha = 1; c.fillStyle = '#e8c890'; for (let x = 6; x < 314; x += 14) c.fillRect(x, 140, 11, 1);
    c.fillStyle = '#3b3260'; c.fillRect(0, 114, 320, 4);
    c.fillStyle = '#1b1530'; c.fillRect(70, 120, 40, 4); Art.text(c, 'ARRIVALS', 90, 120, '#ffd86b', 1, 'center');
    // door
    c.fillStyle = '#fff3d6'; c.fillRect(80, 132, 24, 34); c.fillStyle = '#c8b090'; c.fillRect(91, 132, 2, 34);
    // floor
    c.fillStyle = '#3e3468'; c.fillRect(0, 166, 320, 14); c.fillStyle = '#4c4080'; for (let x = 0; x < 320; x += 16) c.fillRect(x, 166, 8, 1);
    // sabrina + suitcase
    if (this.sab.visible) {
      const s = this.sab, x = Math.round(s.x), y = Math.round(s.y);
      Art.shadow(c, x, y); Art.shadow(c, x - 10, y, 7);
      c.fillStyle = '#e5e2f0'; c.fillRect(x - 12, y - 9, 6, 8); c.fillStyle = '#b9b4d0'; c.fillRect(x - 12, y - 6, 6, 1);
      c.fillStyle = '#2a2638'; c.fillRect(x - 12, y - 1, 1, 1); c.fillRect(x - 7, y - 1, 1, 1);
      c.fillStyle = '#9a96b0'; c.fillRect(x - 7, y - 13, 1, 4); c.fillRect(x - 7, y - 13, 6, 1);
      Art.person(c, x, y, s.look, s.moving ? Math.floor(s.walk) % 4 : 0, 1, 'side', s.o || {});
      if (s.phone) { c.fillStyle = '#222'; c.fillRect(x + 2, y - 15, 2, 3); c.fillStyle = '#9fd0ff'; c.fillRect(x + 2, y - 15, 1, 2); }
    }
  },
  drawPlane(c, x, y) {
    x = Math.round(x); y = Math.round(y);
    c.fillStyle = '#e8e6f4'; c.fillRect(x, y, 34, 5); c.fillRect(x + 34, y + 1, 3, 3); c.fillRect(x - 3, y - 6, 5, 7);
    c.fillStyle = '#b8b4d8'; c.fillRect(x + 12, y + 3, 10, 2); c.fillRect(x + 14, y + 5, 6, 2);
    c.fillStyle = '#4a6ad8'; for (let i = 6; i < 30; i += 3) c.fillRect(x + i, y + 1, 1, 1);
    c.fillStyle = (Math.sin(G.t * 10) > 0) ? '#ff5a7a' : '#5aff9a'; c.fillRect(x - 3, y - 7, 1, 1);
  },
  async script() {
    await wait(2.4);
    this.phase = 'fall'; Sfx.whoosh();
    await Promise.all([tween(this.star, 'x', 150, 1.3, easeIn), tween(this.star, 'y', 168, 1.3, easeIn)]);
    this.phase = 'impact'; this.flash = 1; G.shake = 1.4; Sfx.boom();
    await wait(1.0);
    await fadeOut(1.2);
    await wait(1.2);
    this.phase = 'airport'; this.plane.on = true;
    caption('May 2, 2026', 'INCHEON AIRPORT', 2.2);
    await wait(.4);
    fadeIn(1.4);
    this.plane.x = -50; this.plane.y = 52;
    await Promise.all([tween(this.plane, 'x', 300, 4.5, easeOut), tween(this.plane, 'y', 100, 4.5, easeOut)]);
    this.plane.on = false;
    this.sab.visible = true; this.sab.moving = true;
    await tween(this.sab, 'x', 170, 2.6, t => t);
    this.sab.moving = false; Sfx.ding(); this.sab.phone = true;
    await wait(.5);
    const ph = $('#phone'), m = ph.querySelector('.msgs'); m.innerHTML = ''; ph.classList.add('on');
    const add = (cls, t) => { const d = document.createElement('div'); d.className = 'm ' + cls; d.textContent = t; m.appendChild(d); };
    await wait(.6); add('in', 'Sabrina!! you landed??'); Sfx.blip();
    await wait(1.0); add('in', 'Lotte World on May 6 with friends? 🎢'); Sfx.ding();
    await wait(1.4); add('out', 'Yes, sounds good!'); Sfx.blip();
    await wait(1.8);
    ph.classList.remove('on'); this.sab.phone = false;
    await wait(.4);
    this.sab.moving = true;
    tween(this.sab, 'x', 340, 2.8, t => t);
    await wait(1.6);
    goto(SC.lotte, { fadeOut: 1.2 });
  },
};

// ===================== 2–3. LOTTE WORLD =====================
SC.lotte = WalkScene({
  worldW: 720, yMin: 146, yMax: 170,
  init() {
    this.setupActors(30, 160, 1);
    this.sab.x = 74; this.sab.y = 152; this.sab.dir = -1;
    this.follower = false; this.st = 0;
    this.stars = Art.makeStars(31, 60, 720, 60);
    this.coaster = []; for (let x = 0; x < 900; x += 2) this.coaster.push([x, 46 + Math.sin(x / 38) * 16 + Math.sin(x / 13) * 4]);
    this.balloons = [{ x: 600, y: 120, c: '#ff8ab8' }, { x: 604, y: 116, c: '#8ac8ff' }, { x: 597, y: 113, c: '#ffd86b' }, { x: 608, y: 112, c: '#b88aff' }];
    this.freeB = null;
    const d = lines(["Bro, the line for Atlantis is like 90 minutes.", "Churros after this? I'm starving.", "Celine says she's not scared. She's scared.", "Sabrina's chill. I like her."]);
    const ce = lines(["Sabrina landed from Singapore just a few days ago!", "Brian, you've been here before, right? Guide us~", "Group photo later! Everyone!", "Isn't this place so pretty when the lights come on?"]);
    this.npcs = [
      new Actor({ x: 104, y: 150, look: LOOK.daniel, dir: -1, talk: async () => { await say(['Daniel', d()]); } }),
      new Actor({ x: 120, y: 160, look: LOOK.celine, dir: -1, talk: async () => { await say(['Celine', this.st === 0 ? "Brian! Come say hi to Sabrina!" : ce()]); } }),
    ];
    this.items = [
      { x: 250, key: 'Q', py: 112, use: async () => say("Magic Island. It looks like a castle from a dream.") },
      { x: 160, key: 'Q', py: 118, use: () => this.coasterUse() },
      { x: 372, key: 'Q', py: 128, use: async () => { if (!this.churro) { this.churro = 1; await say("You bought churros.", S("...You got sugar on your face."), B("Where?"), S("Everywhere.")); } else await say("Sugar. Everywhere."); } },
      { x: 480, key: 'Q', py: 112, use: () => this.shootUse() },
      { x: 600, key: 'Q', py: 120, use: async () => { if (!this.freeB) { this.freeB = { x: 600, y: 112 }; Sfx.ping(); await say("A balloon slips out of your hand...", "It floats up and up, toward the brightest star."); } else await say("Bye, balloon."); } },
      { x: 700, key: 'Q', py: 120, use: () => this.exitUse() },
    ];
  },
  resume(o) {
    if (o.fromShoot) { this.player.x = 480; this.player.y = 160; this.sab.x = 464; this.sab.y = 157; this.sab.o = { hold: 'octopus' }; this.st = 4; this.afterShoot = true; }
  },
  async script(o) {
    if (o.fromShoot && this.afterShoot) {
      this.afterShoot = false;
      await wait(.8);
      this.sab.view = 'front'; this.sab.o = { hold: 'octopus', smile: true };
      await say(S("Haha— look!"), S("I won him. He's mine now."), B("...Fair and square."));
      this.sab.view = 'side'; this.sab.o = { hold: 'octopus' };
      giveItem('octopus', "Pink Octopus Doll (Sabrina's)");
      hint("It's getting dark... head to the EXIT →");
      return;
    }
    await caption('May 6, 2026', 'LOTTE WORLD', 2.4);
    hint('Say hi to everyone  (E to talk)');
  },
  sabTalk: async function () {
    const s = SC.lotte;
    if (s.st === 0) {
      s.sab.dir = s.player.x > s.sab.x ? 1 : -1;
      await say(S("Hello."), B("Hi."), S("I'm Sabrina."), B("I'm Brian."), S("I study business at SMU, in Singapore. Finance major."), B("Oh, nice."), S("..."), S("Anyway. Let's ride the roller coaster."));
      s.st = 1; s.follower = true;
      hint('Go to the roller coaster  (Q)');
    } else if (s.st === 1) await say(S(["Roller coaster. Come on.", "What? I'm not scared.", "Seoul is so loud. I like it."][Math.random() * 3 | 0]));
    else if (s.st === 2) {
      await say(B("So... what kind of movies do you like?"), S("Hmm."), S("Have you seen 'The Act of Killing'?"), B("No. What is it?"), S("A documentary. It's... hard to explain."), S("Just watch it. It'll stay with you for a while."));
      giveItem('ticket', "Movie rec: The Act of Killing");
      s.st = 3; hint('Try the shooting gallery  (Q)');
    } else if (s.st === 3) await say(S("Shooting gallery. I'm good at this, just so you know."));
    else await say(S(["Look at him. He's so cute.", "It's getting dark. Izakaya?", "Today was fun. Don't tell Daniel I said that."][Math.random() * 3 | 0]));
  },
  async coasterUse() {
    if (this.st < 1) return say("You should say hi to everyone first.");
    if (this.rode) return say(S("Again? ...Maybe later."));
    this.rode = true; this.cutscene = true; hint('');
    await fadeOut(.5); this.ride = 0; this.riding = true; await fadeIn(.4);
    await tween(this, 'ride', 1, 4.6, t => t);
    await fadeOut(.4); this.riding = false; this.cutscene = false; await fadeIn(.4);
    await say(['Daniel', "I'm never doing that again."], S("...That was fun."), ['Celine', "Sabrina didn't even scream!!"]);
    this.st = 2; hint('Talk to Sabrina  (E)');
  },
  async shootUse() {
    if (this.st < 3) return say(this.st < 1 ? "A shooting gallery. Maybe later." : S("Shooting? Later. Let's do the ride first."));
    if (this.st >= 4) return say("The booth guy refuses to let Sabrina play again.");
    goto(SC.shoot, { fresh: true });
  },
  async exitUse() {
    if (this.st < 4) return say("Not yet. The day isn't over.");
    goto(SC.izakaya, { fadeOut: 1.2 });
  },
  preUpdate(dt) {
    if (this.freeB) this.freeB.y -= dt * 14;
  },
  bg(c, ox, t) {
    Art.bandSky(c, 320, 150, ['#1d1748', '#2a2060', '#3d2a72', '#58367e', '#7a4a8c', '#a66296', '#d189a6', '#eeb0b8']);
    Art.stars(c, this.stars, t, ox * .2, 320);
    // coaster (far)
    const px = ox * .45;
    c.fillStyle = '#4a3a7a';
    for (const [x, y] of this.coaster) { const sx = Math.round(x - px); if (sx < -2 || sx > 322) continue; c.fillRect(sx, Math.round(y) + 30, 2, 1); if (x % 20 === 0) c.fillRect(sx, Math.round(y) + 31, 1, 120); }
    // castle
    const cx = Math.round(250 - ox * .7);
    c.fillStyle = '#b48ad0'; c.fillRect(cx - 30, 70, 60, 60);
    c.fillStyle = '#c9a2e2'; c.fillRect(cx - 40, 84, 12, 46); c.fillRect(cx + 28, 84, 12, 46); c.fillRect(cx - 8, 46, 16, 30);
    c.fillStyle = '#6a8ae8';
    for (const [tx, ty, w] of [[cx - 40, 84, 12], [cx + 28, 84, 12], [cx - 8, 46, 16]]) for (let i = 0; i < w / 2 + 3; i++) c.fillRect(tx + i, ty - (w / 2 + 3) + i, w - 2 * i, 1);
    c.fillStyle = '#fff3c4'; for (let i = 0; i < 5; i++) c.fillRect(cx - 24 + i * 11, 92, 4, 6); c.fillRect(cx - 2, 56, 4, 6);
    c.fillStyle = '#ff8ab8'; c.fillRect(cx, 22, 1, 10); c.fillRect(cx + 1, 22, 4, 2);
    // mid trees
    for (let x = -20; x < 760; x += 46) { const tx = Math.round(x - ox * .85); Art.blossomCluster(c, tx, 120, 10, x + 3, ['#d895d8', '#f0b6e6', '#b878d0', '#fad0f0']); c.fillStyle = '#3a2440'; c.fillRect(tx, 124, 2, 16); }
    // ground
    c.fillStyle = '#3a2f5c'; c.fillRect(0, 138, 320, 42);
    c.fillStyle = '#463a6e'; for (let y = 142; y < 180; y += 6) for (let x = -((ox) % 12); x < 320; x += 12) c.fillRect(x + ((y / 6) % 2) * 6, y, 6, 1);
    c.fillStyle = '#2c2448'; c.fillRect(0, 138, 320, 2);
    // props (world space)
    const W = x => Math.round(x - ox);
    // coaster gate
    c.fillStyle = '#5a3a8a'; c.fillRect(W(146), 112, 3, 34); c.fillRect(W(172), 112, 3, 34); c.fillStyle = '#ff7aa8'; c.fillRect(W(140), 106, 40, 9); Art.text(c, 'COASTER', W(160), 108, '#fff', 1, 'center');
    // churros cart
    c.fillStyle = '#e8a050'; c.fillRect(W(360), 132, 24, 12); c.fillStyle = '#fff3c4'; c.fillRect(W(358), 122, 28, 3); c.fillStyle = '#c0603a'; for (let i = 0; i < 28; i += 4) c.fillRect(W(358) + i, 122, 2, 3); c.fillStyle = '#3a2440'; c.fillRect(W(362), 144, 3, 3); c.fillRect(W(379), 144, 3, 3);
    // shooting booth
    c.fillStyle = '#2a1a3a'; c.fillRect(W(456), 108, 50, 38); c.fillStyle = '#4a2a5a'; c.fillRect(W(460), 116, 42, 20);
    for (let i = 0; i < 50; i += 6) { c.fillStyle = '#f04a6a'; c.fillRect(W(456) + i, 102, 3, 7); c.fillStyle = '#fff'; c.fillRect(W(456) + i + 3, 102, 3, 7); }
    Art.text(c, 'SHOOTING', W(481), 94, '#ffd86b', 1, 'center');
    for (let i = 0; i < 4; i++) { c.fillStyle = ['#c08a5a', '#fff', '#f07aa0', '#f2d062'][i]; c.fillRect(W(464) + i * 10, 124, 5, 5); }
    c.fillStyle = '#7a4a2a'; c.fillRect(W(456), 138, 50, 4);
    // balloons
    for (const b of this.balloons) { if (this.freeB && b === this.balloons[0]) continue; c.fillStyle = '#ddd'; c.fillRect(W(600), b.y + 4, 1, 120 - b.y + 8); c.fillStyle = b.c; c.fillRect(W(b.x) - 2, b.y - 3, 5, 6); c.fillRect(W(b.x) - 1, b.y - 4, 3, 8); }
    if (this.freeB) { c.fillStyle = '#ff8ab8'; c.fillRect(W(this.freeB.x) - 2, Math.round(this.freeB.y) - 3, 5, 6); c.fillStyle = '#ddd'; c.fillRect(W(this.freeB.x), Math.round(this.freeB.y) + 3, 1, 5); }
    // exit
    c.fillStyle = '#5a3a8a'; c.fillRect(W(688), 110, 3, 36); c.fillRect(W(712), 110, 3, 36); c.fillStyle = '#ffd86b'; c.fillRect(W(684), 104, 34, 9); Art.text(c, 'EXIT', W(701), 106, '#3a1f6a', 1, 'center');
    // lamps
    for (let x = 60; x < 720; x += 110) Art.lamp(c, W(x), 110, t);
  },
  overlay(c) {
    if (!this.riding) return;
    const k = this.ride;
    Art.bandSky(c, 320, 180, ['#1d1748', '#2a2060', '#3d2a72', '#58367e', '#7a4a8c', '#a66296', '#d189a6']);
    Art.stars(c, this.stars, G.t, k * 300, 320);
    const off = k * 700;
    const ty = x => 100 + Math.sin((x + off) / 30) * 40 + Math.sin((x + off) / 11) * 6;
    c.fillStyle = '#2a1f4a'; for (let x = 0; x < 320; x += 10) c.fillRect(x, ty(x), 2, 200);
    c.fillStyle = '#ffd0e8'; for (let x = 0; x < 320; x++) { c.fillRect(x, Math.round(ty(x)), 1, 2); }
    const cx = 150, cy = ty(cx);
    c.fillStyle = '#ff5a8a'; c.fillRect(cx - 18, cy - 8, 40, 8);
    const looks = [LOOK.daniel, LOOK.celine, sabLook(), LOOK.brian];
    looks.forEach((L, i) => { const hx = cx - 14 + i * 10; c.fillStyle = L.skin; c.fillRect(hx, cy - 14, 6, 6); c.fillStyle = L.hc; c.fillRect(hx, cy - 15 - (i === 2 ? 0 : Math.round(Math.abs(Math.sin(G.t * 20)) * 1)), 6, 3); if (L.hl) { c.fillStyle = L.hl; c.fillRect(hx, cy - 13, 1, 4); } });
    if (Math.sin(G.t * 2) > 0) Art.text(c, 'WOOOOOO!!', cx - 30, cy - 34, '#fff', 1);
    Art.text(c, '...', cx + 12, cy - 26, '#ffb0d0', 1);
  },
});

// ===================== 3. SHOOTING GALLERY =====================
SC.shoot = {
  init() {
    this.phase = 'brian'; this.shots = 6; this.hitsB = 0; this.hitsS = 0; this.fx = []; this.msg = ''; this.msgT = 0;
    this.aim = { x: 160, y: 90 }; this.done = false;
    const types = ['bear', 'bunny', 'octo', 'star', 'duck'];
    this.dolls = [];
    [[58, 22, 1], [96, -18, 2], [134, 28, 3]].forEach(([y, sp, r]) => { for (let i = 0; i < 5; i++) this.dolls.push({ x: i * 68 + r * 17, y, sp, t: types[(i + r) % 5], down: false, vy: 0, dy: 0, wob: 0 }); });
  },
  exit() { canvas.classList.remove('aim'); },
  update(dt) {
    for (const d of this.dolls) {
      d.x += d.sp * dt; if (d.x > 330) d.x -= 345; if (d.x < -15) d.x += 345;
      if (d.down) { d.vy += 300 * dt; d.dy += d.vy * dt; }
      d.wob = Math.max(0, d.wob - dt * 3);
    }
    this.fx.forEach(f => f.t -= dt); this.fx = this.fx.filter(f => f.t > 0);
    this.msgT -= dt;
    if (this.phase === 'brian') {
      this.aim.x = G.mouse.x; this.aim.y = G.mouse.y;
      if (G.mouse.clicked && this.shots > 0 && !this.busy) this.fire(true);
    }
  },
  dollAt(x, y) { let best = null, bd = 9; for (const d of this.dolls) { if (d.down) continue; const dd = Math.hypot(d.x - x, d.y - 5 - y); if (dd < bd) { bd = dd; best = d; } } return best; },
  async fire(isBrian, forceDoll, forceHit) {
    this.shots--; Sfx.shot(); this.fx.push({ x: this.aim.x, y: this.aim.y, t: .2, k: 'flash' });
    const d = forceDoll || this.dollAt(this.aim.x, this.aim.y);
    if (isBrian) {
      if (d && this.hitsB < 1) { d.down = true; this.hitsB = 1; Sfx.hit(); this.say('HIT!'); }
      else if (d) { d.wob = 1; Sfx.ping(); this.say('PING! BOUNCED OFF?!'); }
      else this.say('MISS');
      if (this.shots === 0) {
        this.busy = true;
        if (this.hitsB === 0) { await wait(.6); const t = this.dolls.find(x => !x.down && x.x > 40 && x.x < 280); if (t) { t.down = true; this.hitsB = 1; Sfx.hit(); this.say('...LUCKY!'); } }
        await wait(1.4); this.sabTurn();
      }
    } else {
      if (forceHit && d) { d.down = true; this.hitsS++; Sfx.hit(); this.say('HIT!'); }
      else if (d) { d.wob = 1; Sfx.ping(); this.say('PING'); } else this.say('MISS');
    }
  },
  say(m) { this.msg = m; this.msgT = 1; },
  async sabTurn() {
    this.phase = 'sab'; this.shots = 5; canvas.classList.remove('aim');
    this.banner = "SABRINA'S TURN"; await wait(1.4); this.banner = '';
    const plan = [false, true, false, true, false];
    for (const hit of plan) {
      const cand = this.dolls.filter(x => !x.down && x.x > 60 && x.x < 260);
      const tgt = cand[Math.random() * cand.length | 0];
      const lead = tgt.sp * .7;
      const tx = tgt.x + lead + (hit ? 0 : 14), ty = tgt.y - 5 + (hit ? 0 : -10);
      await Promise.all([tween(this.aim, 'x', tx, .7), tween(this.aim, 'y', ty, .7)]);
      await this.fire(false, hit ? tgt : null, hit);
      await wait(.5);
    }
    await wait(.8);
    this.phase = 'result'; Sfx.item();
    await wait(1.2);
    await waitKey();
    goto(SC.lotte, { fromShoot: true });
  },
  async script() { canvas.classList.add('aim'); this.banner = "BRIAN'S TURN - CLICK TO SHOOT"; await wait(1.8); this.banner = ''; },
  drawDoll(c, d) {
    const x = Math.round(d.x + Math.sin(G.t * 40) * d.wob * 2), y = Math.round(d.y + d.dy);
    const R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(x + a, y + b, w, h); };
    if (d.t === 'bear') { R(-4, -9, 9, 9, '#b07a4a'); R(-5, -11, 3, 3, '#b07a4a'); R(3, -11, 3, 3, '#b07a4a'); R(-2, -6, 1, 1, '#2a1a10'); R(2, -6, 1, 1, '#2a1a10'); R(-1, -4, 3, 2, '#e0b080'); }
    if (d.t === 'bunny') { R(-4, -8, 9, 8, '#f4f0f8'); R(-3, -14, 2, 6, '#f4f0f8'); R(2, -14, 2, 6, '#f4f0f8'); R(-2, -5, 1, 1, '#333'); R(2, -5, 1, 1, '#333'); R(-3, -3, 1, 1, '#f9a'); R(3, -3, 1, 1, '#f9a'); }
    if (d.t === 'octo') { R(-4, -10, 9, 7, '#f07aa0'); for (let i = 0; i < 4; i++) R(-4 + i * 2 + (i > 1), -3, 1, 3, '#f07aa0'); R(-2, -7, 1, 1, '#2a1020'); R(2, -7, 1, 1, '#2a1020'); }
    if (d.t === 'star') { R(-1, -11, 3, 11, '#f2d062'); R(-5, -7, 11, 3, '#f2d062'); R(-3, -9, 7, 7, '#f2d062'); R(-1, -6, 1, 1, '#6a4a10'); R(1, -6, 1, 1, '#6a4a10'); }
    if (d.t === 'duck') { R(-4, -8, 8, 8, '#ffe066'); R(3, -5, 3, 2, '#ff9a3a'); R(1, -6, 1, 1, '#333'); }
  },
  draw(c) {
    c.fillStyle = '#1e1430'; c.fillRect(0, 0, 320, 180);
    c.fillStyle = '#2a1c42'; for (let x = 0; x < 320; x += 8) c.fillRect(x, 20, 1, 160);
    for (let i = 0; i < 320; i += 16) { c.fillStyle = '#e84a6a'; c.fillRect(i, 0, 8, 16); c.fillStyle = '#fff0f4'; c.fillRect(i + 8, 0, 8, 16); }
    c.fillStyle = '#e84a6a'; for (let i = 0; i < 320; i += 16) { c.fillRect(i, 16, 8, 3); }
    for (let i = 6; i < 320; i += 20) { c.fillStyle = Math.sin(G.t * 5 + i) > 0 ? '#ffe9a0' : '#c0a060'; c.fillRect(i, 20, 3, 3); }
    for (const y of [58, 96, 134]) { c.fillStyle = '#7a4a2a'; c.fillRect(0, y, 320, 4); c.fillStyle = '#5a321a'; c.fillRect(0, y + 4, 320, 2); }
    for (const d of this.dolls) this.drawDoll(c, d);
    c.fillStyle = '#5a2a3a'; c.fillRect(0, 150, 320, 30); c.fillStyle = '#7a3a4a'; c.fillRect(0, 150, 320, 3);
    // gun
    const gx = 160 + (this.aim.x - 160) * .15, gy = 170;
    c.fillStyle = '#2a2a3a'; c.fillRect(gx - 4, gy - 10, 8, 20); c.fillStyle = '#4a4a62'; c.fillRect(gx - 2, gy - 16, 4, 8);
    for (const f of this.fx) { c.fillStyle = '#fff6c0'; c.globalAlpha = f.t * 5; c.fillRect(f.x - 3, f.y - 3, 7, 7); c.globalAlpha = 1; }
    // crosshair
    const ax = Math.round(this.aim.x), ay = Math.round(this.aim.y);
    if (this.phase !== 'result') { c.fillStyle = this.phase === 'sab' ? '#ff9cc0' : '#9fe0ff'; c.fillRect(ax - 6, ay, 4, 1); c.fillRect(ax + 3, ay, 4, 1); c.fillRect(ax, ay - 6, 1, 4); c.fillRect(ax, ay + 3, 1, 4); c.fillRect(ax, ay, 1, 1); }
    // hud
    c.fillStyle = 'rgba(14,10,32,.85)'; c.fillRect(4, 156, 312, 20);
    Art.text(c, 'BRIAN ' + this.hitsB, 10, 163, '#9fc0ff');
    Art.text(c, this.hitsS + ' SABRINA', 310, 163, '#ff9cc0', 1, 'right');
    if (this.phase !== 'result') { for (let i = 0; i < this.shots; i++) { c.fillStyle = '#ffd86b'; c.fillRect(140 + i * 7, 162, 4, 7); } }
    if (this.msgT > 0) Art.text(c, this.msg, 160, 38, '#fff', 2, 'center');
    if (this.banner) { c.fillStyle = 'rgba(14,10,32,.85)'; c.fillRect(0, 80, 320, 20); Art.text(c, this.banner, 160, 87, '#ffd86b', 1, 'center'); }
    if (this.phase === 'result') {
      c.fillStyle = 'rgba(14,10,32,.9)'; c.fillRect(40, 30, 240, 120);
      Art.text(c, 'BRIAN 1  :  2 SABRINA', 160, 42, '#fff', 1, 'center');
      Art.text(c, 'SABRINA WINS!', 160, 56, '#ff9cc0', 2, 'center');
      // big octopus
      const ox = 160, oy = 108 + Math.round(Math.sin(G.t * 3) * 2);
      c.fillStyle = 'rgba(255,200,230,.15)'; c.beginPath(); c.arc(ox, oy - 8, 26, 0, 7); c.fill();
      c.fillStyle = '#f07aa0'; c.fillRect(ox - 12, oy - 26, 24, 20); c.fillRect(ox - 14, oy - 22, 28, 14);
      for (let i = 0; i < 5; i++) { c.fillRect(ox - 14 + i * 6, oy - 8, 4, 8 + (i % 2) * 2); }
      c.fillStyle = '#fff'; c.fillRect(ox - 7, oy - 19, 4, 4); c.fillRect(ox + 3, oy - 19, 4, 4);
      c.fillStyle = '#2a1020'; c.fillRect(ox - 6, oy - 18, 2, 3); c.fillRect(ox + 4, oy - 18, 2, 3);
      c.fillStyle = '#ffb0c8'; c.fillRect(ox - 10, oy - 13, 2, 1); c.fillRect(ox + 8, oy - 13, 2, 1);
      Art.text(c, 'PRIZE: OCTOPUS', 160, 124, '#ffd86b', 1, 'center');
      if (Math.sin(G.t * 4) > 0) Art.text(c, 'PRESS E', 160, 138, '#cdb8ff', 1, 'center');
    }
  },
};

// ===================== 4. IZAKAYA =====================
SC.izakaya = {
  init() {
    this.people = [
      new Actor({ x: 96, y: 150, look: LOOK.celine, dir: 1, o: { sit: true } }),
      new Actor({ x: 126, y: 150, look: LOOK.daniel, dir: 1, o: { sit: true } }),
      new Actor({ x: 196, y: 150, look: LOOK.sabLong, dir: -1, o: { sit: true } }),
      new Actor({ x: 226, y: 150, look: LOOK.brian, dir: -1, o: { sit: true } }),
    ];
    this.street = Art.makeSkyline(4, 80, { minH: 20, maxH: 50, lit: .4, minW: 10, maxW: 18 });
  },
  draw(c) {
    const t = G.t;
    c.fillStyle = '#4a2a1a'; c.fillRect(0, 0, 320, 180);
    for (let x = 0; x < 320; x += 4) { c.fillStyle = x % 8 ? '#5a3420' : '#3e2214'; c.fillRect(x, 0, 2, 180); }
    // window to street
    c.fillStyle = '#120e2a'; c.fillRect(250, 34, 60, 70);
    Art.skyline(c, this.street, -250, 104, '#1e1840', '#ffd9a0', t);
    c.fillStyle = '#ff5a8a'; c.globalAlpha = .6 + .3 * Math.sin(t * 4); c.fillRect(262, 60, 2, 20); c.globalAlpha = 1;
    c.fillStyle = '#2a160c'; c.fillRect(248, 32, 64, 3); c.fillRect(248, 103, 64, 3); c.fillRect(248, 32, 3, 74); c.fillRect(309, 32, 3, 74); c.fillRect(279, 32, 2, 74);
    // header & plaques
    c.fillStyle = '#2a160c'; c.fillRect(0, 8, 240, 5);
    for (let i = 0; i < 7; i++) { const px = 18 + i * 30; c.fillStyle = '#8a5a34'; c.fillRect(px, 14, 12, 32); c.fillStyle = '#f4ead8'; for (let k = 0; k < 4; k++) c.fillRect(px + 4 + (k % 2), 18 + k * 7, 4, 4); }
    // lanterns
    for (const lx of [60, 180]) {
      const sw = Math.round(Math.sin(t * 1.5 + lx) * 1);
      c.fillStyle = `rgba(255,120,90,${.16 + .04 * Math.sin(t * 3 + lx)})`; c.beginPath(); c.arc(lx + sw, 70, 24, 0, 7); c.fill();
      c.fillStyle = '#2a160c'; c.fillRect(lx + sw, 46, 1, 14);
      c.fillStyle = '#e8483a'; c.fillRect(lx - 6 + sw, 60, 13, 18); c.fillRect(lx - 7 + sw, 63, 15, 12);
      c.fillStyle = '#ff8a60'; c.fillRect(lx - 3 + sw, 62, 2, 14);
      c.fillStyle = '#2a160c'; c.fillRect(lx - 5 + sw, 59, 11, 1); c.fillRect(lx - 5 + sw, 78, 11, 1);
    }
    // people
    for (const p of this.people) Art.person(c, p.x, p.y, p.look, 0, p.dir, p.view || 'side', p.o);
    for (const p of this.people) if (p.emote) Art.emote(c, p.x, p.y - 32, p.emote);
    // table
    c.fillStyle = '#7a4424'; c.fillRect(70, 147, 180, 5); c.fillStyle = '#5a3018'; c.fillRect(70, 152, 180, 28); c.fillStyle = '#9a5a30'; c.fillRect(70, 147, 180, 1);
    // food & drinks
    c.fillStyle = '#f2f0e8'; c.fillRect(140, 144, 30, 3); c.fillStyle = '#e88a5a'; c.fillRect(144, 142, 8, 2); c.fillStyle = '#f0d0a0'; c.fillRect(154, 142, 10, 2);
    for (const gx of [108, 136, 180, 210]) { c.fillStyle = 'rgba(255,220,120,.85)'; c.fillRect(gx, 140, 4, 7); c.fillStyle = '#fff'; c.fillRect(gx, 139, 4, 1); }
    for (let i = 0; i < 3; i++) { c.fillStyle = `rgba(255,255,255,${.25 - i * .07})`; c.fillRect(150 + Math.round(Math.sin(t * 2 + i) * 2), 132 - i * 4 - ((t * 6) % 4), 2, 2); }
  },
  async script() {
    await caption('May 6, 2026', 'EVENING · IZAKAYA', 2.4);
    await wait(.4);
    await say(['Celine', "Okay okay. Ideal types. Go."], ['Celine', "Me first — I like someone dependable. Someone I can lean on."], ['Daniel', "I just like someone kind. That's it."], ['Celine', "Sabrina?"]);
    await wait(.5);
    await say(S("Hmm."), S("I'm not planning to date anyone."), S("I know I'm not yet the kind of person who can have the love I want."), S("So I want to focus on becoming someone who fits my own ideal."), S("I won't date while I'm in university."));
    this.people[3].emote = '...';
    await wait(1.6);
    this.people[3].emote = null;
    await fadeOut(1.6);
    await wait(1.8); // 5. blackout
    goto(SC.may9, { cut: true });
  },
};

// ===================== 6. MAY 9 =====================
SC.may9 = WalkScene({
  worldW: 320, yMin: 156, yMax: 170, follower: 'hide',
  init() {
    this.setupActors(24, 164, 1);
    this.stars = Art.makeStars(41, 70, 200, 70);
    this.city = Art.makeSkyline(12, 220, { minH: 10, maxH: 34, lit: .35, minW: 8, maxW: 16 });
    const mk = (x, y, L, dir, name, arr) => { const f = lines(arr); return new Actor({ x, y, look: L, dir, o: { sit: true }, noShadow: true, talk: async () => say([name, f()]) }); };
    this.npcs = [
      mk(116, 150, LOOK.daniel, 1, 'Daniel', ["One more round?", "Doyun is already gone, look at him.", "To May! Cheers!"]),
      mk(140, 150, LOOK.doyun, 1, 'Doyun', ["Who ordered the somaek tower?!", "I'm not drunk. You're drunk.", "Brian! Where did you go? Sit!"]),
      mk(164, 150, LOOK.heeji, 1, 'Heeji', ["Sabrina is so cool.", "Brian, why are you so quiet today?", "Look outside, the stars are so clear tonight."]),
      mk(196, 150, LOOK.celine, -1, 'Celine', ["Six of us! This is the best group.", "Sabrina, try this one, it's sweet."]),
      mk(220, 150, LOOK.sabLong, -1, 'Sabrina', ["Cheers.", "Doyun is gone already, lol.", "...Don't get any ideas. I just like this table."]),
    ];
    this.items = [
      { x: 70, key: 'Q', py: 120, use: async () => { this.starBoost = 1; Sfx.crane(); await say("Outside the window, one star is shining much brighter than the rest.", "...It feels like it's watching over this table."); } },
      { x: 250, key: 'Q', py: 134, use: async () => { this.player.x = 246; this.player.visible = false; this.seat = true; await say(['Doyun', "BRIAN'S BACK! Cheers!!"], ['Everyone', "Cheers!"]); await wait(1.2); goto(SC.festival, { fadeOut: 1.4 }); } },
    ];
    this.starBoost = 0;
  },
  async script() { await caption('May 9, 2026', 'SIX OF US', 2.2); hint('Say hi (E) · look outside (Q) · take your seat (Q)'); },
  onUpdate(dt) { this.starBoost = Math.max(0, this.starBoost - dt * .2); },
  bg(c, ox, t) {
    c.fillStyle = '#231a3a'; c.fillRect(0, 0, 320, 180);
    c.fillStyle = '#2b2048'; for (let x = 0; x < 320; x += 10) c.fillRect(x, 0, 1, 130);
    // window
    c.fillStyle = '#0b0920'; c.fillRect(40, 20, 240, 96);
    c.save(); c.beginPath(); c.rect(40, 20, 240, 96); c.clip();
    Art.bandSky(c, 320, 116, ['#06051a', '#0b0926', '#110e32', '#18133e', '#21194a', '#2c1f58']);
    Art.stars(c, this.stars.map(s => ({ ...s, x: s.x + 50, y: s.y + 20 })), t);
    Art.bigStar(c, 214, 42, t, 1 + this.starBoost * 1.2);
    Art.skyline(c, this.city, -45, 118, '#151030', '#9a86e8', t, { warm: '#ffd9a0' });
    c.restore();
    c.fillStyle = '#3a2c58'; c.fillRect(38, 18, 244, 3); c.fillRect(38, 114, 244, 4); c.fillRect(38, 18, 3, 100); c.fillRect(279, 18, 3, 100); c.fillRect(158, 18, 3, 100);
    c.fillStyle = '#1a1430'; c.fillRect(0, 130, 320, 50);
    c.fillStyle = '#211a3c'; for (let x = 0; x < 320; x += 16) c.fillRect(x, 130, 8, 50);
    // hanging bulbs
    for (let x = 30; x < 320; x += 50) { c.fillStyle = '#120e24'; c.fillRect(x, 0, 1, 12); c.fillStyle = `rgba(255,210,150,${.15 + .05 * Math.sin(t * 2 + x)})`; c.beginPath(); c.arc(x, 14, 10, 0, 7); c.fill(); c.fillStyle = '#ffe2b0'; c.fillRect(x - 1, 12, 3, 3); }
  },
  fg(c, ox, t) {
    c.fillStyle = '#5a3a5a'; c.fillRect(100, 147, 160, 4); c.fillStyle = '#3e2840'; c.fillRect(104, 151, 4, 20); c.fillRect(252, 151, 4, 20);
    for (const gx of [122, 146, 168, 190, 214]) { c.fillStyle = 'rgba(255,230,140,.9)'; c.fillRect(gx, 141, 3, 6); c.fillStyle = '#fff'; c.fillRect(gx, 140, 3, 1); }
    c.fillStyle = '#7ad07a'; c.fillRect(176, 138, 3, 9); c.fillRect(177, 135, 1, 3);
    // empty seat marker
    if (!this.seat) { c.fillStyle = '#4a3050'; c.fillRect(242, 152, 12, 3); }
    else { Art.person(c, 246, 150, LOOK.brian, 0, -1, 'side', { sit: true }); c.fillStyle = '#5a3a5a'; c.fillRect(100, 147, 160, 4); }
  },
});

// ===================== 7. FESTIVAL (RAIN) =====================
SC.festival = WalkScene({
  worldW: 640, yMin: 148, yMax: 170,
  init() {
    this.setupActors(30, 160, 1);
    this.drops = []; for (let i = 0; i < 260; i++) this.drops.push({ x: Math.random() * 340, y: Math.random() * 180, v: 220 + Math.random() * 120 });
    this.splash = [];
    this.campus = Art.makeSkyline(17, 700, { minW: 30, maxW: 60, minH: 30, maxH: 60, lit: .45 });
    this.items = [
      { x: 120, key: 'Q', py: 112, use: async () => { if (G.items.includes('umbrella')) return say("Free umbrellas! ...You already have one."); giveItem('umbrella', 'Umbrella (free!)'); this.player.o = { umbrella: true }; await say("Free umbrella booth. Lucky."); if (this.sneezed) hint('Bring it to Sabrina  (E)'); } },
      { x: 430, key: 'Q', py: 104, use: async () => say("A band is playing on stage, totally soaked, still going.", "Respect.") },
      { x: 620, key: 'Q', py: 120, use: () => goto(SC.june6, { fadeOut: 1.4 }) },
    ];
  },
  sabTalk: async function () {
    const s = SC.festival;
    if (s.player.o.umbrella && !s.shared) { s.shared = true; s.sab.o = {}; await say(B("Here. Come under."), S("...Thanks."), S("I'm fine though. It's just—"), S("Achoo!"), S("...Okay. Maybe not fine.")); Sfx.sneeze(); hint('Leave the festival →  (Q)'); return; }
    await say(S(["It's pouring. Who planned a festival in May rain?", "Achoo! ...Ugh.", "The band is still playing. That's commitment."][Math.random() * 3 | 0]));
  },
  async script() { await caption('May 20, 2026', 'UNIVERSITY FESTIVAL · HEAVY RAIN', 2.4); hint('Walk around the festival →'); },
  onUpdate(dt) {
    for (const d of this.drops) { d.y += d.v * dt; d.x -= d.v * .25 * dt; if (d.y > 180) { if (Math.random() < .3) this.splash.push({ x: d.x, y: 140 + Math.random() * 38, t: .2 }); d.y = -5; d.x = Math.random() * 360; } }
    this.splash.forEach(s => s.t -= dt); this.splash = this.splash.filter(s => s.t > 0);
    if (!this.sneezed && this.player.x > 190 && !G.busy) {
      this.sneezed = true;
      (async () => { this.sab.emote = '!'; Sfx.sneeze(); await say(S("Achoo!")); this.sab.emote = null; await say(S("...I'm fine. It's just the rain.")); if (!G.items.includes('umbrella')) hint('Maybe find an umbrella? (Q)'); else hint('Bring the umbrella to Sabrina  (E)'); })();
    }
  },
  bg(c, ox, t) {
    Art.bandSky(c, 320, 140, ['#0c0b1e', '#121028', '#191532', '#211a3e', '#2a2048', '#33264f']);
    c.fillStyle = '#1e1a34'; for (let i = 0; i < 6; i++) { const x = ((i * 70 - ox * .1) % 380) - 30; c.fillRect(x, 20 + (i % 3) * 8, 60, 10); c.fillRect(x + 10, 15 + (i % 3) * 8, 40, 6); }
    Art.skyline(c, this.campus, ox * .4, 118, '#171330', '#ffe0a0', t, { warm: '#ffd09a' });
    // string lights
    for (let x = -(ox % 24); x < 320; x += 24) { const y = 64 + Math.sin((x + ox) / 40) * 4; c.fillStyle = ['#ff7aa8', '#ffd86b', '#7ad0ff', '#b88aff'][Math.abs(Math.floor((x + ox) / 24)) % 4]; c.globalAlpha = .6 + .4 * Math.sin(t * 3 + x); c.fillRect(x, Math.round(y), 2, 2); }
    c.globalAlpha = 1;
    c.fillStyle = '#2a2240'; c.fillRect(0, 138, 320, 42);
    // puddle reflections
    c.fillStyle = 'rgba(160,140,255,.12)'; for (let x = -(ox % 40); x < 320; x += 40) c.fillRect(x + 6, 150 + ((x + ox) % 3) * 6, 18, 1);
    const W = x => Math.round(x - ox);
    // booths
    const booth = (x, col, label) => { c.fillStyle = '#3a2e58'; c.fillRect(W(x) - 22, 112, 44, 30); for (let i = 0; i < 44; i += 8) { c.fillStyle = col; c.fillRect(W(x) - 22 + i, 104, 4, 9); c.fillStyle = '#f4eefc'; c.fillRect(W(x) - 18 + i, 104, 4, 9); } c.fillStyle = '#fff3c4'; c.fillRect(W(x) - 18, 118, 36, 10); Art.text(c, label, W(x), 121, '#3a1f6a', 1, 'center'); };
    booth(120, '#6a8ae8', 'UMBRELLA');
    // stage
    c.fillStyle = '#1a1430'; c.fillRect(W(380), 80, 100, 62); c.fillStyle = '#2a2248'; c.fillRect(W(376), 76, 108, 6);
    for (let i = 0; i < 4; i++) { c.fillStyle = ['rgba(255,90,140,.18)', 'rgba(90,200,255,.18)', 'rgba(180,120,255,.18)', 'rgba(255,220,120,.15)'][i]; c.beginPath(); const sx = W(392 + i * 26); c.moveTo(sx, 82); c.lineTo(sx - 14 + Math.sin(t + i) * 10, 140); c.lineTo(sx + 14 + Math.sin(t + i) * 10, 140); c.fill(); }
    for (let i = 0; i < 3; i++) { const bx = W(404 + i * 26); c.fillStyle = '#0c0a18'; c.fillRect(bx, 118 - (i === 1 ? 2 : 0) + Math.round(Math.abs(Math.sin(t * 6 + i))), 6, 20); c.fillRect(bx + 1, 112 + Math.round(Math.abs(Math.sin(t * 6 + i))), 4, 5); }
    c.fillStyle = '#3a2e58'; c.fillRect(W(380), 138, 100, 4);
    // exit sign
    c.fillStyle = '#5a3a8a'; c.fillRect(W(616), 112, 2, 30); c.fillStyle = '#ffd86b'; c.fillRect(W(604), 106, 30, 8); Art.text(c, 'HOME', W(619), 108, '#3a1f6a', 1, 'center');
    for (let x = 60; x < 640; x += 140) Art.lamp(c, W(x), 110, t);
  },
  fg(c, ox, t) {
    c.fillStyle = 'rgba(190,200,255,.45)';
    for (const d of this.drops) c.fillRect(Math.round(d.x), Math.round(d.y), 1, 4);
    c.fillStyle = 'rgba(200,210,255,.6)'; for (const s of this.splash) { c.fillRect(Math.round(s.x) - 1, Math.round(s.y), 1, 1); c.fillRect(Math.round(s.x) + 1, Math.round(s.y), 1, 1); }
    c.fillStyle = 'rgba(30,30,80,.12)'; c.fillRect(0, 0, 320, 180);
  },
});
