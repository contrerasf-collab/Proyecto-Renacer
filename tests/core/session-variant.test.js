import { describe, it, expect } from 'vitest';
import { createInitialState, DEFAULT_VARIANT } from '../../js/core/state.js';

describe('State — sesión de Sprint 3', () => {
  it('usa sw_01 y su avería por defecto', () => {
    const state = createInitialState();

    expect(DEFAULT_VARIANT).toBe('sw_01');
    expect(state.session).toEqual({
      faultId: 'interruptor-cocina-roto',
      finalizada: false,
      verificado: false,
      resuelto: false,
    });
  });

  it('resuelve cable_01 a su avería de contenido', () => {
    const state = createInitialState({ variant: 'cable_01' });
    expect(state.session.faultId).toBe('cable-cocina-roto');
  });

  it('resuelve lamp_01 a su avería de contenido', () => {
    const state = createInitialState({ variant: 'lamp_01' });
    expect(state.session.faultId).toBe('bombilla-cocina-rota');
  });

  it('cae a sw_01 ante una variante ausente o inválida', () => {
    expect(createInitialState({ variant: null }).session.faultId).toBe(
      'interruptor-cocina-roto'
    );
    expect(createInitialState({ variant: 'no-existe' }).session.faultId).toBe(
      'interruptor-cocina-roto'
    );
  });
});
