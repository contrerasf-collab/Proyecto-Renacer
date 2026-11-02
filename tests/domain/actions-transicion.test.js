import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';
import { applyFault } from '../../js/domain/systems/faults.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import fault from '../../content/faults/interruptor-cocina-roto.json';

function setup() {
  const state = createState();
  state.replace(createInitialState());
  state.patch(['systems', 'sistema-cocina', 'components'], applyFault(sistemaCocina, fault));
  const actions = createActions(state, { isSolid: () => false });
  return { state, actions };
}

describe('Actions — entrada de mapa', () => {
  it('entrarMapa actualiza mapa, x, y y orientación', () => {
    const { actions } = setup();
    actions.entrarMapa('cocina', { x: 10, y: 12, orientacion: 'arriba' });
    expect(actions.getJugador()).toMatchObject({
      mapa: 'cocina',
      x: 10,
      y: 12,
      orientacion: 'arriba',
    });
  });

  it('entrarMapa conserva state.systems y state.flags.diagnosticos', () => {
    const { state, actions } = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    const sistemasAntes = JSON.stringify(state.get().systems);
    const diagsAntes = JSON.stringify(state.get().flags.diagnosticos);
    actions.entrarMapa('cocina', { x: 10, y: 12, orientacion: 'arriba' });
    expect(JSON.stringify(state.get().systems)).toBe(sistemasAntes);
    expect(JSON.stringify(state.get().flags.diagnosticos)).toBe(diagsAntes);
  });

  it('entrarMapa no altera campos no indicados del jugador', () => {
    const { actions } = setup();
    actions.entrarMapa('cocina', { x: 3, y: 4 });
    const j = actions.getJugador();
    expect(j.mapa).toBe('cocina');
    expect(j.x).toBe(3);
    expect(j.y).toBe(4);
    expect(j.orientacion).toBe('abajo'); // conserva la previa si no se indica
  });
});
