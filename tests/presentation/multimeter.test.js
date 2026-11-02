import { describe, it, expect } from 'vitest';
import { createMultimeter } from '../../js/presentation/ui/multimeter.js';
import { createElectricalSystem } from '../../js/domain/systems/electrical.js';
import { createEstadoSano, applyFault } from '../../js/domain/systems/faults.js';
import sistemaCocina from '../../content/systems/sistema-cocina.json';
import fault from '../../content/faults/interruptor-cocina-roto.json';

const sistema = createElectricalSystem(sistemaCocina);
const REF = sistemaCocina.referencia;
const estadoSano = createEstadoSano(sistemaCocina);
const estadoAveriado = applyFault(sistemaCocina, fault);

describe('Polímetro — modelo', () => {
  it('modo inicial voltaje y cambiarModo alterna V ↔ Ω', () => {
    const m = createMultimeter();
    expect(m.getModo()).toBe('voltaje');
    m.cambiarModo();
    expect(m.getModo()).toBe('continuidad');
    m.cambiarModo();
    expect(m.getModo()).toBe('voltaje');
  });

  it('colocarSonda asigna a la sonda activa y cambiarSondaActiva alterna', () => {
    const m = createMultimeter();
    expect(m.getSondaActiva()).toBe('roja');
    m.colocarSonda('sw_01.entrada');
    expect(m.getSondas().roja).toBe('sw_01.entrada');
    m.cambiarSondaActiva();
    expect(m.getSondaActiva()).toBe('negra');
    m.colocarSonda('sw_01.salida');
    expect(m.getSondas().negra).toBe('sw_01.salida');
  });

  it('leer en voltaje sin sonda roja devuelve null; con sonda mide contra tierra', () => {
    const m = createMultimeter();
    expect(m.leer(sistema, estadoSano, REF)).toBeNull();
    m.colocarSonda('sw_01.entrada');
    expect(m.leer(sistema, estadoSano, REF)).toMatchObject({
      valido: true,
      valor: 12,
      unidad: 'V',
    });
  });

  it('leer en continuidad con ambas sondas propaga medicion_imposible', () => {
    const m = createMultimeter();
    m.cambiarModo();
    m.colocarSonda('sw_01.entrada'); // roja
    m.cambiarSondaActiva();
    m.colocarSonda('sw_01.salida'); // negra
    const r = m.leer(sistema, estadoAveriado, REF);
    expect(r).toEqual({ valido: false, razon: 'medicion_imposible' });
  });
});
