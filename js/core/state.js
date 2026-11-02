export function createState() {
  let _state = {};
  const subscribers = [];

  function notify() {
    for (const cb of subscribers) {
      try {
        cb(_state);
      } catch (e) {
        console.error('State: error en suscriptor', e);
      }
    }
  }

  function isPrimitive(value) {
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
  }

  return {
    get() {
      return JSON.parse(JSON.stringify(_state));
    },
    set(patch) {
      _state = { ..._state, ...patch };
      notify();
    },
    replace(newState) {
      _state = JSON.parse(JSON.stringify(newState));
      notify();
    },
    patch(path, value) {
      if (!Array.isArray(path)) {
        throw new TypeError('state.patch: path debe ser un array');
      }
      if (path.length === 0) {
        throw new Error('state.patch: path no puede estar vacío');
      }

      // Atomicidad: se trabaja sobre una copia y solo se publica si todo es válido.
      const next = JSON.parse(JSON.stringify(_state));
      let cursor = next;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (cursor[key] === undefined || cursor[key] === null) {
          cursor[key] = {};
        } else if (isPrimitive(cursor[key])) {
          throw new Error(`state.patch: no se puede atravesar un valor primitivo en "${key}"`);
        }
        cursor = cursor[key];
      }

      const lastKey = path[path.length - 1];
      cursor[lastKey] = value;

      _state = next;
      notify();
    },
    subscribe(callback) {
      subscribers.push(callback);
      return () => {
        const i = subscribers.indexOf(callback);
        if (i >= 0) subscribers.splice(i, 1);
      };
    },
  };
}

export const DEFAULT_VARIANT = 'sw_01';

const FAULT_ID_BY_VARIANT = {
  sw_01: 'interruptor-cocina-roto',
  cable_01: 'cable-cocina-roto',
  lamp_01: 'bombilla-cocina-rota',
};

export function resolveVariant(value) {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(FAULT_ID_BY_VARIANT, value)
    ? value
    : DEFAULT_VARIANT;
}

export function createInitialState({ variant = DEFAULT_VARIANT } = {}) {
  const variantKey = resolveVariant(variant);

  return {
    jugador: {
      x: 10,
      y: 13,
      orientacion: 'abajo',
      mapa: 'remanso-exterior',
    },
    flags: {
      diagnosticos: [],
    },
    systems: {},
    session: {
      faultId: FAULT_ID_BY_VARIANT[variantKey],
      finalizada: false,
      verificado: false,
      resuelto: false,
    },
  };
}
