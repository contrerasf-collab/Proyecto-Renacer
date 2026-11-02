import { describe, it, expect } from 'vitest';
import { applyFaultById } from '../../js/domain/systems/faults.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import faultInterruptor from '../../content/faults/interruptor-cocina-roto.json';
import faultCable from '../../content/faults/cable-cocina-roto.json';
import faultBombilla from '../../content/faults/bombilla-cocina-rota.json';

const FAULTS = {
  'interruptor-cocina-roto': faultInterruptor,
  'cable-cocina-roto': faultCable,
  'bombilla-cocina-rota': faultBombilla,
};

describe('Selección de avería por faultId', () => {
  it('aplica la variante indicada', () => {
    const cable = applyFaultById(sistemaCocina, 'cable-cocina-roto', FAULTS);
    expect(cable.cable_01.roto).toBe(true);
    expect(cable.sw_01.roto).toBe(false);

    const bombilla = applyFaultById(sistemaCocina, 'bombilla-cocina-rota', FAULTS);
    expect(bombilla.lamp_01.roto).toBe(true);
    expect(bombilla.sw_01.roto).toBe(false);
  });

  it('cae a la variante por defecto ante un faultId inválido', () => {
    const estado = applyFaultById(sistemaCocina, 'no-existe', FAULTS);
    expect(estado.sw_01.roto).toBe(true);
  });
});
