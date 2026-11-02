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
  return { state, actions };
}

describe('Actions — reparación ligada a la hipótesis', () => {
  it('repara el componente de la última hipótesis', () => {
    const { state, actions } = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');

    const resultado = actions.repararComponente('sistema-cocina', 'sw_01');

    const sw = state.get().systems['sistema-cocina'].components.sw_01;
    expect(resultado).toEqual({ ok: true });
    expect(sw).toMatchObject({
      roto: false,
      reparado: true,
      operativo: true,
      conduce: true,
      posicion: 'on',
    });
  });

  it('no repara sin hipótesis registrada', () => {
    const { state, actions } = setup();

    expect(actions.repararComponente('sistema-cocina', 'sw_01')).toEqual({
      ok: false,
      razon: 'sin_hipotesis',
    });
    expect(state.get().systems['sistema-cocina'].components.sw_01.roto).toBe(true);
  });

  it('no repara un componente distinto al registrado', () => {
    const { state, actions } = setup();
    actions.registrarDiagnostico('sistema-cocina', 'lamp_01');

    expect(actions.repararComponente('sistema-cocina', 'sw_01')).toEqual({
      ok: false,
      razon: 'componente_distinto',
    });
    expect(state.get().systems['sistema-cocina'].components.sw_01.roto).toBe(true);
  });

  it('no repara un componente sano', () => {
    const { state, actions } = setup();
    actions.registrarDiagnostico('sistema-cocina', 'lamp_01');

    expect(actions.repararComponente('sistema-cocina', 'lamp_01')).toEqual({
      ok: false,
      razon: 'no_averiado',
    });
    expect(state.get().systems['sistema-cocina'].components.lamp_01.reparado).toBe(false);
  });

  it('no repara tras finalizar o resolver', () => {
    const { state, actions } = setup();
    actions.registrarDiagnostico('sistema-cocina', 'sw_01');
    state.patch(['session', 'finalizada'], true);

    expect(actions.repararComponente('sistema-cocina', 'sw_01')).toEqual({
      ok: false,
      razon: 'finalizada',
    });
  });
});
