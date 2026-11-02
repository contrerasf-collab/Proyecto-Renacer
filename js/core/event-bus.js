import { MAX_EVENTS_PER_TICK } from './constants.js';

export function createEventBus() {
  const subs = new Map();
  let queue = [];

  return {
    on(event, callback) {
      if (!subs.has(event)) subs.set(event, []);
      subs.get(event).push(callback);
    },
    off(event, callback) {
      const list = subs.get(event);
      if (!list) return;
      const i = list.indexOf(callback);
      if (i >= 0) list.splice(i, 1);
    },
    emit(event, payload) {
      queue.push({ event, payload });
    },
    flush() {
      let count = 0;
      while (queue.length > 0 && count < MAX_EVENTS_PER_TICK) {
        const { event, payload } = queue.shift();
        const list = subs.get(event);
        if (list) {
          for (const cb of [...list]) {
            try {
              cb(payload);
            } catch (e) {
              console.error(`EventBus: error en callback del evento "${event}"`, e);
            }
          }
        }
        count++;
      }
      if (queue.length > 0) {
        console.warn(
          `EventBus: límite de ${MAX_EVENTS_PER_TICK} eventos por tick superado, descartando ${queue.length} eventos`
        );
        queue = [];
      }
    },
    clear() {
      subs.clear();
      queue = [];
    },
  };
}
