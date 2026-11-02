import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEventBus } from '../../js/core/event-bus.js';

describe('EventBus', () => {
  let bus;
  beforeEach(() => {
    bus = createEventBus();
  });

  it('on + emit + flush invoca el callback una vez con el payload', () => {
    const cb = vi.fn();
    bus.on('test', cb);
    bus.emit('test', { value: 42 });
    bus.flush();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({ value: 42 });
  });

  it('off detiene las notificaciones', () => {
    const cb = vi.fn();
    bus.on('test', cb);
    bus.off('test', cb);
    bus.emit('test', {});
    bus.flush();
    expect(cb).not.toHaveBeenCalled();
  });

  it('múltiples suscriptores al mismo evento son invocados', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    bus.on('test', cb1);
    bus.on('test', cb2);
    bus.emit('test', {});
    bus.flush();
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  it('emit sin suscriptores no lanza error', () => {
    expect(() => {
      bus.emit('nadie', {});
      bus.flush();
    }).not.toThrow();
  });

  it('eventos encolados se entregan en orden', () => {
    const order = [];
    bus.on('a', () => order.push('a'));
    bus.on('b', () => order.push('b'));
    bus.on('c', () => order.push('c'));
    bus.emit('a', {});
    bus.emit('b', {});
    bus.emit('c', {});
    bus.flush();
    expect(order).toEqual(['a', 'b', 'c']);
  });

  it('un callback que lanza no impide a los demás', () => {
    const cb1 = vi.fn(() => {
      throw new Error('boom');
    });
    const cb2 = vi.fn();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    bus.on('test', cb1);
    bus.on('test', cb2);
    bus.emit('test', {});
    bus.flush();
    expect(cb2).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('límite de 200 eventos por flush', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const cb = vi.fn();
    bus.on('test', cb);
    for (let i = 0; i < 300; i++) {
      bus.emit('test', { i });
    }
    bus.flush();
    expect(cb).toHaveBeenCalledTimes(200);
    spy.mockRestore();
  });
});
