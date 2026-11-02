import { describe, it, expect } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';
import { createActions } from '../../js/domain/actions.js';
import { createElectricalSystem } from '../../js/domain/systems/electrical.js';
import { applyFault } from '../../js/domain/systems/faults.js';
import { verificarSistema } from '../../js/domain/systems/verification.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import faultInterruptor from '../../content/faults/interruptor-cocina-roto.json';
import faultCable from '../../content/faults/cable-cocina-roto.json';
import faultBombilla from '../../content/faults/bombilla-cocina-rota.json';

const sistema = createElectricalSystem(sistemaCocina);
const referencia = sistemaCocina.referencia;

const casos = [
  { variante: 'sw_01', componente: 'sw_01', fault: faultInterruptor },
  { variante: 'cable_01', componente: 'cable_01', fault: faultCable },
  { variante: 'lamp_01', componente: 'lamp_01', fault: faultBombilla },
];

function setup(caso) {
  const state = createState();
  state.replace(createInitialState({ variant: caso.variante }));
  state.patch(
    ['systems', 'sistema-cocina', 'components'],
    applyFault(sistemaCocina, caso.fault)
  );
  const actions = createActions(state, { isSolid: () => false });
  actions.registrarDiagnostico('sistema-cocina', caso.componente);
  return { state, actions };
}

function estadoActual(state) {
  return state.get().systems['sistema-cocina'].components;
}

describe('Verificación y resolución', () => {
  it('las tres variantes se verifican y resuelven tras reparar', () => {
    for (const caso of casos) {
      const { state, actions } = setup(caso);

      expect(
        verificarSistema(sistema, estadoActual(state), referencia, caso.fault.verificacion)
      ).toBe(false);
      expect(
        actions.verificarYResolver({
          sistema,
          estado: estadoActual(state),
          referencia,
          verificacion: caso.fault.verificacion,
        })
      ).toEqual({ ok: false, razon: 'no_verificado' });

      expect(actions.repararComponente('sistema-cocina', caso.componente)).toEqual({
        ok: true,
      });
      expect(
        verificarSistema(sistema, estadoActual(state), referencia, caso.fault.verificacion)
      ).toBe(true);
      expect(
        actions.verificarYResolver({
          sistema,
          estado: estadoActual(state),
          referencia,
          verificacion: caso.fault.verificacion,
        })
      ).toEqual({ ok: true });

      expect(state.get().session).toMatchObject({
        verificado: true,
        resuelto: true,
      });
    }
  });

  it('no verifica con el interruptor apagado', () => {
    const caso = casos[0];
    const { state, actions } = setup(caso);
    actions.repararComponente('sistema-cocina', caso.componente);
    state.patch(['systems', 'sistema-cocina', 'components', 'sw_01', 'posicion'], 'off');

    expect(
      verificarSistema(sistema, estadoActual(state), referencia, caso.fault.verificacion)
    ).toBe(false);
  });

  it('resuelto no se alcanza sin reparación previa', () => {
    const caso = casos[1];
    const { state, actions } = setup(caso);

    expect(
      actions.verificarYResolver({
        sistema,
        estado: estadoActual(state),
        referencia,
        verificacion: caso.fault.verificacion,
      })
    ).toEqual({ ok: false, razon: 'no_verificado' });
    expect(state.get().session.resuelto).toBe(false);
  });
});
