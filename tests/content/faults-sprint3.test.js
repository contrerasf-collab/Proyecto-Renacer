import { describe, it, expect } from 'vitest';
import { createMap } from '../../js/domain/world/map.js';
import { createElectricalSystem } from '../../js/domain/systems/electrical.js';
import { applyFault } from '../../js/domain/systems/faults.js';
import index from '../../content/index.json';
import cocina from '../../content/maps/cocina.json';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import faultInterruptor from '../../content/faults/interruptor-cocina-roto.json';
import faultCable from '../../content/faults/cable-cocina-roto.json';
import faultBombilla from '../../content/faults/bombilla-cocina-rota.json';

const sistema = createElectricalSystem(sistemaCocina);

function voltajesCon(fault) {
  return sistema.calcularEstado(applyFault(sistemaCocina, fault)).voltajes;
}

describe('Contenido — variantes de Sprint 3', () => {
  it('el índice registra las tres averías del sprint', () => {
    expect(index.faults).toEqual([
      'interruptor-cocina-roto',
      'cable-cocina-roto',
      'bombilla-cocina-rota',
    ]);
  });

  it('la cocina expone el positivo de la batería y el punto de reparación del cable', () => {
    const map = createMap(cocina);
    const resueltos = map.getInteractablesResueltos(sistema);
    const en = (x, y) => resueltos.find((it) => it.x === x && it.y === y);

    expect(en(0, 2)).toMatchObject({
      ref: 'bat_01',
      tipo: 'medida',
      nodo: 'bat_01.positivo',
    });
    expect(en(1, 3)).toMatchObject({
      ref: 'cable_01',
      tipo: 'componente',
    });
    expect(en(1, 3).componente).not.toBeNull();
    expect(map.isSolid(1, 2)).toBe(false);
    expect(map.isSolid(2, 3)).toBe(false);
  });

  it('las tres averías producen firmas de tensión distintas', () => {
    const interruptor = voltajesCon(faultInterruptor);
    expect(interruptor.get('bat_01.positivo')).toBe(12);
    expect(interruptor.get('sw_01.entrada')).toBe(12);
    expect(interruptor.get('sw_01.salida')).toBe(0);
    expect(interruptor.get('lamp_01.entrada')).toBe(0);

    const cable = voltajesCon(faultCable);
    expect(cable.get('bat_01.positivo')).toBe(12);
    expect(cable.get('sw_01.entrada')).toBe(0);
    expect(cable.get('sw_01.salida')).toBe(0);
    expect(cable.get('lamp_01.entrada')).toBe(0);

    const bombilla = voltajesCon(faultBombilla);
    expect(bombilla.get('bat_01.positivo')).toBe(12);
    expect(bombilla.get('sw_01.entrada')).toBe(12);
    expect(bombilla.get('sw_01.salida')).toBe(12);
    expect(bombilla.get('lamp_01.entrada')).toBe(12);

    expect(applyFault(sistemaCocina, faultCable).cable_01.roto).toBe(true);
    expect(applyFault(sistemaCocina, faultBombilla).lamp_01.roto).toBe(true);
    expect(applyFault(sistemaCocina, faultInterruptor).sw_01.roto).toBe(true);
  });
});
