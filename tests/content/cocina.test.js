import { describe, it, expect } from 'vitest';
import { createMap } from '../../js/domain/world/map.js';
import { createElectricalSystem } from '../../js/domain/systems/electrical.js';
import { applyFault } from '../../js/domain/systems/faults.js';
import cocina from '../../content/maps/cocina.json';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import fault from '../../content/faults/interruptor-cocina-roto.json';

describe('Contenido — cocina', () => {
  it('todos los interactables resuelven a componente no nulo', () => {
    const sistema = createElectricalSystem(sistemaCocina);
    const map = createMap(cocina);
    const resueltos = map.getInteractablesResueltos(sistema);
    expect(resueltos.length).toBeGreaterThan(0);
    for (const it of resueltos) {
      expect(it.componente).not.toBeNull();
    }
  });

  it('la avería deja sw_01 roto y sin tensión en su salida', () => {
    const estado = applyFault(sistemaCocina, fault);
    expect(estado.sw_01.roto).toBe(true);
    const sistema = createElectricalSystem(sistemaCocina);
    const { voltajes } = sistema.calcularEstado(estado);
    expect(voltajes.get('sw_01.entrada')).toBe(12);
    expect(voltajes.get('sw_01.salida')).toBe(0);
  });
});
