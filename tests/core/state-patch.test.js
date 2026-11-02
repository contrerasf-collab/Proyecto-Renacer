import { describe, it, expect, vi } from 'vitest';
import { createState, createInitialState } from '../../js/core/state.js';

describe('State.patch', () => {
  it('patch de un nivel (valor array)', () => {
    const state = createState();
    state.replace(createInitialState());
    state.patch(['flags', 'diagnosticos'], [{ systemId: 's', componenteId: 'c', ts: 1 }]);
    expect(state.get().flags.diagnosticos).toEqual([
      { systemId: 's', componenteId: 'c', ts: 1 },
    ]);
  });

  it('patch anidado de tres niveles', () => {
    const state = createState();
    state.replace({ a: { b: {} } });
    state.patch(['a', 'b', 'c'], 7);
    expect(state.get().a.b.c).toBe(7);
  });

  it('patch crea intermedios y soporta índices de array', () => {
    const state = createState();
    state.replace({});
    state.patch(['a', 'b', 'c'], 1);
    expect(state.get().a).toEqual({ b: { c: 1 } });
    state.patch(['lista'], [10, 20]);
    state.patch(['lista', 1], 99);
    expect(state.get().lista).toEqual([10, 99]);
  });

  it('patch con path vacío lanza', () => {
    const state = createState();
    state.replace({});
    expect(() => state.patch([], 1)).toThrow();
  });

  it('patch sobre un primitivo intermedio lanza y es atómico', () => {
    const state = createState();
    state.replace({ a: 5 });
    expect(() => state.patch(['a', 'b'], 1)).toThrow();
    expect(state.get().a).toBe(5);
  });

  it('patch notifica a los suscriptores', () => {
    const state = createState();
    state.replace({});
    const cb = vi.fn();
    state.subscribe(cb);
    state.patch(['a'], 1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('patch con path no-array lanza', () => {
    const state = createState();
    state.replace({});
    expect(() => state.patch('a', 1)).toThrow();
    expect(() => state.patch(123, 1)).toThrow();
  });
});
