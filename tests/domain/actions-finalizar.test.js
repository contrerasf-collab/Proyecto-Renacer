import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';
import { applyFault } from '../../js/domain/systems/faults.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import faultInterruptor from '../../content/faults/interruptor-cocina-roto.json';

function setup() {
  const state = createState();
  state.replace(createInitialState({ variant: 'sw_01' }));
  state.patch(
    ['systems', 'sistema-cocina', 'components'],
    applyFault(sistemaCocina, faultInterruptor)
  );
  const actions = createActions(state, { isSolid: () => false });
  actions.registrarDiagnostico('sistema-cocina', 'sw_01');
  return { state, actions };
}

describe('Finalizar sesión', () => {
  it('marca finalizada sin resolver ni recompensar', () => {
    const { state, actions } = setup();

    expect(actions.finalizarSesion()).toEqual({ ok: true });
    expect(state.get().session).toMatchObject({
      finalizada: true,
      verificado: false,
      resuelto: false,
    });
  });

  it('bloquea la reparación tras finalizar', () => {
    const { state, actions } = setup();
    actions.finalizarSesion();

    expect(actions.repararComponente('sistema-cocina', 'sw_01')).toEqual({
      ok: false,
      razon: 'finalizada',
    });
    expect(state.get().systems['sistema-cocina'].components.sw_01.roto).toBe(true);
  });
});
