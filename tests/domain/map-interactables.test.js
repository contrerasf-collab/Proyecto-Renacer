import { describe, it, expect } from 'vitest';
import { createMap } from '../../js/domain/world/map.js';
import { createElectricalSystem } from '../../js/domain/systems/electrical.js';
import { validateInteractableRefs } from '../../tools/validate-content.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';

const sistema = createElectricalSystem(sistemaCocina);

describe('Map — interactables', () => {
  it('getInteractablesResueltos resuelve ref a componente correcto', () => {
    const map = createMap({
      id: 'm',
      width: 10,
      height: 10,
      capas: { suelo: [], colision: [] },
      spawns: {},
      sistemas: ['sistema-cocina'],
      interactables: [{ ref: 'sw_01', x: 2, y: 2, tipo: 'interruptor' }],
    });
    const resueltos = map.getInteractablesResueltos(sistema);
    expect(resueltos).toHaveLength(1);
    expect(resueltos[0].componente).not.toBeNull();
    expect(resueltos[0].componente.id).toBe('sw_01');
    expect(resueltos[0].componente.tipo).toBe('interruptor');
  });

  it('ref huérfano produce componente null y el validador lo detecta', () => {
    const mapData = {
      id: 'm',
      width: 10,
      height: 10,
      capas: { suelo: [], colision: [] },
      spawns: {},
      sistemas: ['sistema-cocina'],
      interactables: [{ ref: 'no_existe', x: 2, y: 2, tipo: 'interruptor' }],
    };
    const map = createMap(mapData);
    const resueltos = map.getInteractablesResueltos(sistema);
    expect(resueltos[0].componente).toBeNull();

    const systemsById = new Map([[sistemaCocina.id, sistemaCocina]]);
    const errors = validateInteractableRefs(mapData, 'm', systemsById);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('no_existe');
  });
});
