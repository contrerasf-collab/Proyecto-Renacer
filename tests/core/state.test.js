import { describe, it, expect, vi } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';

describe('State', () => {
  it('createInitialState devuelve la estructura esperada', () => {
    const s = createInitialState();
    expect(s).toHaveProperty('jugador');
    expect(s).toHaveProperty('flags');
    expect(s).toHaveProperty('session');
    expect(s.jugador.x).toBe(10);
    expect(s.jugador.y).toBe(13);
  });

  it('get devuelve el estado actual', () => {
    const state = createState();
    state.replace(createInitialState());
    expect(state.get().jugador.x).toBe(10);
  });

  it('get devuelve una copia (no modificable desde fuera)', () => {
    const state = createState();
    state.replace(createInitialState());
    const s = state.get();
    s.jugador.x = 999;
    expect(state.get().jugador.x).toBe(10);
  });

  it('set actualiza solo la clave indicada', () => {
    const state = createState();
    state.replace(createInitialState());
    state.set({ flags: { test: true } });
    expect(state.get().flags).toEqual({ test: true });
    expect(state.get().jugador.x).toBe(10);
  });

  it('replace reemplaza el estado completo', () => {
    const state = createState();
    state.replace({ jugador: { x: 1, y: 2, orientacion: 'abajo', mapa: 'test' } });
    expect(state.get().jugador.x).toBe(1);
    expect(state.get().flags).toBeUndefined();
  });

  it('subscribe recibe notificaciones en cada cambio', () => {
    const state = createState();
    state.replace(createInitialState());
    const cb = vi.fn();
    state.subscribe(cb);
    state.set({ flags: {} });
    expect(cb).toHaveBeenCalledTimes(1);
    state.set({ flags: { a: 1 } });
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('desuscribirse detiene las notificaciones', () => {
    const state = createState();
    state.replace(createInitialState());
    const cb = vi.fn();
    const unsubscribe = state.subscribe(cb);
    state.set({ flags: {} });
    expect(cb).toHaveBeenCalledTimes(1);
    unsubscribe();
    state.set({ flags: {} });
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
