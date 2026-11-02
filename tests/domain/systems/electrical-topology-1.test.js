import { describe, it, expect } from 'vitest';
import { createElectricalSystem } from '../../../js/domain/systems/electrical.js';
import { createEstadoSano } from '../../../js/domain/systems/faults.js';
import sistemaCocina from '../../../content/systems/sistema-cocina.json';

const sistema = createElectricalSystem(sistemaCocina);
const REF = sistemaCocina.referencia;

function estadoSano() {
  return createEstadoSano(sistemaCocina);
}

function estadoAveriaInterruptor() {
  const e = estadoSano();
  e.sw_01.roto = true;
  e.sw_01.conduce = false;
  e.sw_01.operativo = false;
  e.sw_01.posicion = 'on';
  return e;
}

describe('Motor eléctrico — Topología 1 (serie simple)', () => {
  it('estado inicial sin avería: voltajes coherentes en los nodos', () => {
    const { voltajes, conectados } = sistema.calcularEstado(estadoSano());
    expect(voltajes.get('bat_01.positivo')).toBe(12);
    expect(voltajes.get('sw_01.entrada')).toBe(12);
    expect(voltajes.get('sw_01.salida')).toBe(12);
    expect(voltajes.get('lamp_01.entrada')).toBe(12);
    expect(voltajes.get('lamp_01.salida')).toBe(0);
    expect(voltajes.get('bat_01.negativo')).toBe(0);
    expect(conectados.has('sw_01.entrada')).toBe(true);
    expect(conectados.has('lamp_01.entrada')).toBe(true);
    expect(conectados.has('lamp_01.salida')).toBe(false);
  });

  it('estado con avería en el interruptor: voltajes correctos arriba y abajo', () => {
    const { voltajes } = sistema.calcularEstado(estadoAveriaInterruptor());
    expect(voltajes.get('sw_01.entrada')).toBe(12); // arriba del interruptor
    expect(voltajes.get('sw_01.salida')).toBe(0); // abajo del interruptor
    expect(voltajes.get('lamp_01.entrada')).toBe(0);
  });

  it('medición de tensión válida por nodo', () => {
    const r = sistema.medirTension(estadoSano(), REF, 'sw_01.entrada');
    expect(r).toEqual({ valido: true, valor: 12, unidad: 'V' });
    const r2 = sistema.medirTension(estadoSano(), REF, 'lamp_01.salida');
    expect(r2).toEqual({ valido: true, valor: 0, unidad: 'V' });
  });

  it('medición de continuidad válida por par', () => {
    const r = sistema.medirContinuidad(estadoSano(), 'sw_01.entrada', 'sw_01.salida');
    expect(r.valido).toBe(true);
    expect(r.unidad).toBe('Ω');
  });

  it('medición inválida por nodo inexistente', () => {
    const r = sistema.medirTension(estadoSano(), REF, 'sw_01.noexiste');
    expect(r).toEqual({ valido: false, razon: 'nodo_inexistente' });
  });

  it('medición inválida por sistema inexistente', () => {
    const nulo = createElectricalSystem(null);
    const r = nulo.medirTension({}, REF, 'sw_01.entrada');
    expect(r).toEqual({ valido: false, razon: 'sistema_inexistente' });
  });
});
