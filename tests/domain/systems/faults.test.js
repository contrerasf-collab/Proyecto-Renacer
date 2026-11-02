import { describe, it, expect } from 'vitest';
import { applyFault } from '../../../js/domain/systems/faults.js';
import { validateFault } from '../../../tools/validate-content.js';
import sistemaCocina from '../../../content/systems/sistema-cocina.json';
import faultJson from '../../../content/faults/interruptor-cocina-roto.json';

describe('Averías data-driven', () => {
  it('carga de avería produce estado inicial coherente', () => {
    const estado = applyFault(sistemaCocina, faultJson);
    const ids = sistemaCocina.componentes.map((c) => c.id).sort();
    expect(Object.keys(estado).sort()).toEqual(ids);
    expect(estado.sw_01).toMatchObject({ roto: true, conduce: false, posicion: 'on' });
  });

  it('aplicación de avería deja el componente en estado esperado', () => {
    const estado = applyFault(sistemaCocina, faultJson);
    expect(estado.sw_01.roto).toBe(true);
    expect(estado.sw_01.conduce).toBe(false);
    expect(estado.sw_01.posicion).toBe('on');
    expect(estado.sw_01.operativo).toBe(false);
  });

  it('avería sin componente existente es rechazada por el validador', () => {
    const systemsById = new Map([[sistemaCocina.id, sistemaCocina]]);
    const mala = { id: 'averia-huerfana', componenteRef: 'no_existe', tipo: 'roto_por_dentro' };
    const errors = validateFault(mala, 'averia-huerfana', systemsById);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('no_existe');
  });
});
