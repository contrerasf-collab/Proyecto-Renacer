import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';

function setup() {
  const state = createState();
  state.replace(createInitialState());
  return createActions(state, { isSolid: () => false });
}

describe('Bitácora — diagnóstico final (Adenda C9)', () => {
  it('ultimoDiagnostico devuelve la última entrada registrada', () => {
    const actions = setup();
    actions.registrarDiagnostico('sistema-cocina', 'lamp_01');
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    expect(actions.ultimoDiagnostico()).toMatchObject({
      systemId: 'sistema-cocina',
      componenteId: 'sw_01',
    });
  });

  it('la regla C9 identifica sw_01 como correcto tras registrarlo', () => {
    const actions = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    const ultimo = actions.ultimoDiagnostico();
    const correcto =
      ultimo !== null &&
      ultimo.systemId === 'sistema-cocina' &&
      ultimo.componenteId === 'sw_01';
    expect(correcto).toBe(true);
  });

  it('registrar dos diagnósticos: solo cuenta el último', () => {
    const actions = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    actions.registrarDiagnostico('sistema-cocina', 'lamp_01');
    const ultimo = actions.ultimoDiagnostico();
    const correcto = ultimo !== null && ultimo.componenteId === 'sw_01';
    expect(correcto).toBe(false);
  });
});
