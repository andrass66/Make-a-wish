'use strict';
// ============ BOOT ============
(function boot() {
  const q = new URLSearchParams(location.search);
  const start = q.get('scene');
  window.__G = G; window.__SC = SC; window.__step = step;
  if (start && SC[start]) {
    const order = ['title', 'prologue', 'lotte', 'shoot', 'izakaya', 'may9', 'festival', 'june6', 'backrooms', 'dinner', 'seokchon', 'wolmido', 'fries', 'flowers', 'rooftop', 'fall', 'montage', 'letter', 'wish'];
    if (order.indexOf(start) >= order.indexOf('june6')) G.flags.bob = true;
    if (order.indexOf(start) >= order.indexOf('rooftop')) Music.play('stay'); else if (order.indexOf(start) < order.indexOf('letter')) Music.play('pool');
    goto(SC[start]);
  } else goto(SC.title);
  requestAnimationFrame(frame);
})();
