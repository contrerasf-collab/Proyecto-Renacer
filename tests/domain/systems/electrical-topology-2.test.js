import { describe, it, expect } from 'vitest';
import { createElectricalSystem } from '../../../js/domain/systems/electrical.js';
import { createEstadoSano } from '../../../js/domain/systems/faults.js';
import sistemaDerivacion from '../../../content/systems/sistema-cocina-derivacion.json';

const sistema = createElectricalSystem(sistemaDerivacion);
const REF = sistemaDerivacion.referencia;

function estadoSano() {
  return createEstadoSano(sistemaDerivacion);
}

describe('Motor eléctrico — Topología 2 (serie con derivación)', () => {
  it('estado inicial sin avería: ambas bombillas reciben voltaje', () => {
    const { voltajes } = sistema.calcularEstado(estadoSano());
    expect(voltajes.get('lamp_01.entrada')).toBe(12);
    expect(voltajes.get('lamp_02.entrada')).toBe(12);
  });

  it('avería en una bombilla: la otra sigue funcionando', () => {
    const e = estadoSano();
    e.lamp_01.roto = true;
    e.lamp_01.operativo = false;

    const { voltajes } = sistema.calcularEstado(e);
    expect(voltajes.get('lamp_02.entrada')).toBe(12); // la otra sigue recibiendo voltaje
    // La bombilla sana sigue conduciendo por su propio filamento (la rota no ofrece
    // camino alternativo, así que esta continuidad solo puede venir de lamp_02).
    expect(sistema.medirContinuidad(e, 'lamp_02.entrada', 'lamp_02.salida').valido).toBe(true);
  });

  it('medición de continuidad en ramas paralelas', () => {
    const e = estadoSano();
    expect(sistema.medirContinuidad(e, 'sw_01.salida', 'lamp_01.entrada').valido).toBe(true);
    expect(sistema.medirContinuidad(e, 'sw_01.salida', 'lamp_02.entrada').valido).toBe(true);
    expect(sistema.medirContinuidad(e, 'lamp_01.entrada', 'lamp_02.entrada').valido).toBe(true);
  });

  it('medición válida en nodos de la segunda rama', () => {
    const e = estadoSano();
    expect(sistema.medirTension(e, REF, 'lamp_02.entrada')).toEqual({
      valido: true,
      valor: 12,
      unidad: 'V',
    });
    expect(sistema.medirTension(e, REF, 'lamp_02.salida')).toEqual({
      valido: true,
      valor: 0,
      unidad: 'V',
    });
  });

  it('medición inválida por estado_incompleto', () => {
    const e = estadoSano();
    delete e.lamp_02;
    const r = sistema.medirTension(e, REF, 'lamp_01.entrada');
    expect(r).toEqual({ valido: false, razon: 'estado_incompleto' });
  });
});
