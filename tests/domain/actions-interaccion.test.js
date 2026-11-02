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

describe('Actions — interacción con componentes', () => {
  it('alternarInterruptor invierte posicion on → off → on', () => {
    const { state, actions } = setup();
    const get = () => state.get().systems['sistema-cocina'].components.sw_01.posicion;
    expect(get()).toBe('on');
    actions.alternarInterruptor('sistema-cocina', 'sw_01');
    expect(get()).toBe('off');
    actions.alternarInterruptor('sistema-cocina', 'sw_01');
    expect(get()).toBe('on');
  });

  it('alternarInterruptor sobre un componente sin posicion es no-op', () => {
    const { state, actions } = setup();
    const antes = JSON.stringify(state.get().systems['sistema-cocina'].components.lamp_01);
    actions.alternarInterruptor('sistema-cocina', 'lamp_01');
    const despues = JSON.stringify(state.get().systems['sistema-cocina'].components.lamp_01);
    expect(despues).toBe(antes);
  });

  it('alternarInterruptor no toca conduce (interruptor roto sigue conduce:false)', () => {
    const { state, actions } = setup();
    actions.alternarInterruptor('sistema-cocina', 'sw_01');
    actions.alternarInterruptor('sistema-cocina', 'sw_01');
    const sw = state.get().systems['sistema-cocina'].components.sw_01;
    expect(sw.conduce).toBe(false);
  });
});
