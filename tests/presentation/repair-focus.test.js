import { describe, it, expect } from 'vitest';
import { puedeRepararFoco } from '../../js/presentation/scenes/scene-exploration.js';

const sesion = { finalizada: false, resuelto: false };
const hipotesis = { systemId: 'sistema-cocina', componenteId: 'sw_01' };
const componente = {
  tipo: 'componente',
  ref: 'sw_01',
  componente: { tipo: 'interruptor' },
};
const medida = {
  tipo: 'medida',
  ref: 'sw_01',
  nodo: 'sw_01.entrada',
  componente: { tipo: 'interruptor' },
};

describe('Reparación — foco válido', () => {
  it('permite reparar sobre un componente registrado', () => {
    expect(puedeRepararFoco(componente, sesion, hipotesis, 'sistema-cocina')).toBe(true);
  });

  it('no permite reparar desde un punto de medida', () => {
    expect(puedeRepararFoco(medida, sesion, hipotesis, 'sistema-cocina')).toBe(false);
  });

  it('no permite reparar sin hipótesis', () => {
    expect(puedeRepararFoco(componente, sesion, null, 'sistema-cocina')).toBe(false);
  });

  it('no permite reparar con la sesión finalizada o resuelta', () => {
    expect(
      puedeRepararFoco(componente, { ...sesion, finalizada: true }, hipotesis, 'sistema-cocina')
    ).toBe(false);
    expect(
      puedeRepararFoco(componente, { ...sesion, resuelto: true }, hipotesis, 'sistema-cocina')
    ).toBe(false);
  });
});
