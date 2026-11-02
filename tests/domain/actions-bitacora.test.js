import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';

function setup() {
  const state = createState();
  state.replace(createInitialState());
  const map = { isSolid: () => false };
  return createActions(state, map);
}

describe('Actions — bitácora de diagnóstico', () => {
  it('registrarDiagnostico añade entrada a state.flags.diagnosticos', () => {
    const actions = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    const diags = actions.getDiagnosticos();
    expect(diags).toHaveLength(1);
    expect(diags[0]).toMatchObject({ systemId: 'sistema-cocina', componenteId: 'sw_01' });
  });

  it('getDiagnosticos devuelve una copia (mutarla no afecta al estado)', () => {
    const actions = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    const copia = actions.getDiagnosticos();
    copia.push({ systemId: 'x', componenteId: 'y', ts: 0 });
    expect(actions.getDiagnosticos()).toHaveLength(1);
  });

  it('múltiples entradas preservan el orden de inserción', () => {
    const actions = setup();
    actions.registrarDiagnostico('s', 'a');
    actions.registrarDiagnostico('s', 'b');
    actions.registrarDiagnostico('s', 'c');
    const diags = actions.getDiagnosticos();
    expect(diags.map((d) => d.componenteId)).toEqual(['a', 'b', 'c']);
  });
});
