import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';

function setup() {
  const state = createState();
  state.replace(createInitialState());
  const map = { isSolid: () => false };
  return createActions(state, map);
}

describe('Actions — movimiento y celda frontal', () => {
  it('moverJugador actualiza orientacion junto con x, y', () => {
    const actions = setup();
    actions.moverJugador(0, -1);
    let j = actions.getJugador();
    expect(j).toMatchObject({ x: 10, y: 12, orientacion: 'arriba' });

    actions.moverJugador(-1, 0);
    j = actions.getJugador();
    expect(j).toMatchObject({ x: 9, y: 12, orientacion: 'izquierda' });
  });

  it('moverJugador gira hacia una pared sin desplazarse', () => {
    const state = createState();
    state.replace(createInitialState());
    const actions = createActions(state, {
      isSolid: (x, y) => x === 10 && y === 12,
    });

    actions.moverJugador(0, -1);

    expect(actions.getJugador()).toMatchObject({
      x: 10,
      y: 13,
      orientacion: 'arriba',
    });
    expect(actions.getCeldaFrontal()).toEqual({ x: 10, y: 12 });
  });

  it('getCeldaFrontal devuelve la celda correcta según orientación', () => {
    const actions = setup();
    // Orientación inicial: abajo.
    expect(actions.getCeldaFrontal()).toEqual({ x: 10, y: 14 });
    actions.moverJugador(0, -1); // arriba
    expect(actions.getCeldaFrontal()).toEqual({ x: 10, y: 11 });
    actions.moverJugador(1, 0); // derecha
    expect(actions.getCeldaFrontal()).toEqual({ x: 12, y: 12 });
  });
});
