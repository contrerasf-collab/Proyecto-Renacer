const KEY_MAP = {
  ArrowUp: 'arriba',
  KeyW: 'arriba',
  ArrowDown: 'abajo',
  KeyS: 'abajo',
  ArrowLeft: 'izquierda',
  KeyA: 'izquierda',
  ArrowRight: 'derecha',
  KeyD: 'derecha',
  Enter: 'accion',
  Space: 'accion',
  KeyZ: 'accion',
  Escape: 'menu',
  KeyM: 'menu',
  KeyP: 'polimetro',
  Tab: 'sonda',
  KeyB: 'bitacora',
  KeyF: 'finalizar',
};

export function createInput(target) {
  const held = new Set();
  const justPressed = new Set();

  function keydown(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    if (!held.has(action)) {
      held.add(action);
      justPressed.add(action);
    }
    if (e.preventDefault) e.preventDefault();
  }

  function keyup(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    held.delete(action);
  }

  target.addEventListener('keydown', keydown);
  target.addEventListener('keyup', keyup);

  return {
    isHeld(action) {
      return held.has(action);
    },
    consume(action) {
      if (justPressed.has(action)) {
        justPressed.delete(action);
        return true;
      }
      return false;
    },
    // Inyección de pulsaciones (botones táctiles): misma abstracción que el teclado.
    press(action) {
      if (!held.has(action)) {
        held.add(action);
        justPressed.add(action);
      }
    },
    release(action) {
      held.delete(action);
    },
    update() {
      justPressed.clear();
    },
    destroy() {
      target.removeEventListener('keydown', keydown);
      target.removeEventListener('keyup', keyup);
      held.clear();
      justPressed.clear();
    },
  };
}
