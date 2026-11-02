import { FIXED_DT_MS } from './constants.js';

export function createLoop(updateFn, renderFn) {
  let running = false;
  let lastTime = 0;
  let accumulator = 0;
  let rafId = null;

  function tick(now) {
    if (!running) return;
    const delta = Math.min(now - lastTime, 1000);
    lastTime = now;
    accumulator += delta;

    while (accumulator >= FIXED_DT_MS) {
      updateFn(FIXED_DT_MS);
      accumulator -= FIXED_DT_MS;
    }

    renderFn();
    rafId = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      accumulator = 0;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    isRunning() {
      return running;
    },
  };
}
