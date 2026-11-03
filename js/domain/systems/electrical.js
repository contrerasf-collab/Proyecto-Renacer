// Motor eléctrico de RENACER (Sprint 2a).
//
// Stateless: cada cálculo o medición recibe la vista `estadoComponentes` como
// primer parámetro explícito. No hay caché, no hay estado interno, no hay
// inicialización diferida y no se muta el input. La instancia devuelta por
// `createElectricalSystem(systemContent)` es inmutable respecto al estado y solo
// contiene la topología (componentes, bornes, conexiones, referencia) extraída
// del contenido.
//
// Este módulo no importa nada del resto del proyecto (hoja del grafo de dominio).

// Identificador canónico de nodo. Único, reproducible y estable.
// Formato: "<componenteId>.<borneId>".
export function nodoCanonico(componenteId, borneId) {
  if (typeof componenteId !== 'string' || componenteId.length === 0) {
    throw new TypeError('nodoCanonico: componenteId debe ser una cadena no vacía');
  }
  if (typeof borneId !== 'string' || borneId.length === 0) {
    throw new TypeError('nodoCanonico: borneId debe ser una cadena no vacía');
  }
  return `${componenteId}.${borneId}`;
}

export function createElectricalSystem(systemContent) {
  if (systemContent === null || systemContent === undefined) {
    return createNullSystem();
  }

  const componentes = systemContent.componentes || [];
  const conexiones = (systemContent.conexiones || []).map((c) => ({
    desde: c.desde,
    hacia: c.hacia,
  }));
  const referencia = systemContent.referencia || null;

  const componentesMap = new Map();
  const bornesDe = new Map();
  for (const comp of componentes) {
    componentesMap.set(comp.id, comp);
    bornesDe.set(comp.id, new Set((comp.bornes || []).map((b) => b.id)));
  }

  function componenteFalta(estadoComponentes) {
    for (const compId of componentesMap.keys()) {
      if (
        !estadoComponentes ||
        !Object.prototype.hasOwnProperty.call(estadoComponentes, compId)
      ) {
        return compId;
      }
    }
    return null;
  }

  function resolverNodo(nodo) {
    if (typeof nodo !== 'string') return { error: 'nodo_inexistente' };
    const idx = nodo.indexOf('.');
    if (idx <= 0 || idx === nodo.length - 1) return { error: 'nodo_inexistente' };
    const compId = nodo.slice(0, idx);
    const borneId = nodo.slice(idx + 1);
    if (!componentesMap.has(compId)) return { error: 'componente_inexistente' };
    if (!bornesDe.get(compId).has(borneId)) return { error: 'nodo_inexistente' };
    return { componente: compId, borne: borneId, nodo };
  }

  // Grafo de propagación. `cargasConducen` controla si una carga une sus dos
  // bornes: falso para voltaje (caída de tensión a través de la carga) y
  // verdadero para continuidad (filamento íntegro conduce).
  function construirGrafo(estadoComponentes, cargasConducen) {
    const adj = new Map();
    const add = (u, v) => {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u).push(v);
    };

    for (const c of conexiones) {
      add(c.desde, c.hacia);
      add(c.hacia, c.desde);
    }

    for (const comp of componentes) {
      const est = estadoComponentes[comp.id] || {};
      const bornes = (comp.bornes || []).map((b) => b.id);
      if (bornes.length < 2) continue;
      const a = `${comp.id}.${bornes[0]}`;
      const b = `${comp.id}.${bornes[1]}`;

      let conduce = false;
      if (comp.tipo === 'conductor') {
        conduce = est.roto !== true;
      } else if (comp.tipo === 'interruptor') {
        conduce = est.posicion === 'on' && est.conduce === true;
      } else if (comp.tipo === 'carga') {
        conduce = cargasConducen && est.roto !== true;
      }
      // fuente: nunca une sus bornes (no hay cortocircuito interno).

      if (conduce) {
        add(a, b);
        add(b, a);
      }
    }

    return adj;
  }

  function calcularEstado(estadoComponentes) {
    const falta = componenteFalta(estadoComponentes);
    if (falta !== null) {
      throw new Error(`estado_incompleto: falta el componente "${falta}"`);
    }

    const adj = construirGrafo(estadoComponentes, false);
    const voltajes = new Map();
    const conectados = new Set();
    const seeds = [];

    for (const comp of componentes) {
      if (comp.tipo !== 'fuente') continue;
      const voltaje =
        comp.propiedades && typeof comp.propiedades.voltaje === 'number'
          ? comp.propiedades.voltaje
          : 12;
      for (const b of comp.bornes || []) {
        const nodo = `${comp.id}.${b.id}`;
        if (b.polaridad === 'positivo') {
          voltajes.set(nodo, voltaje);
          seeds.push(nodo);
        } else {
          voltajes.set(nodo, 0);
        }
      }
    }

    const cola = [...seeds];
    for (const s of seeds) conectados.add(s);

    while (cola.length > 0) {
      const cur = cola.shift();
      const v = voltajes.get(cur);
      for (const n of adj.get(cur) || []) {
        if (!conectados.has(n)) {
          conectados.add(n);
          voltajes.set(n, v);
          cola.push(n);
        }
      }
    }

    for (const comp of componentes) {
      for (const b of comp.bornes || []) {
        const nodo = `${comp.id}.${b.id}`;
        if (!voltajes.has(nodo)) voltajes.set(nodo, 0);
      }
    }

    return { voltajes, conectados };
  }

  function medirTension(estadoComponentes, nodoRef, nodoMedida) {
    const falta = componenteFalta(estadoComponentes);
    if (falta !== null) return { valido: false, razon: 'estado_incompleto' };
    if (!referencia) return { valido: false, razon: 'sin_referencia' };

    const rRef = resolverNodo(nodoRef);
    if (rRef.error) return { valido: false, razon: rRef.error };
    const rMed = resolverNodo(nodoMedida);
    if (rMed.error) return { valido: false, razon: rMed.error };

    const { voltajes } = calcularEstado(estadoComponentes);
    const valor = (voltajes.get(nodoMedida) ?? 0) - (voltajes.get(nodoRef) ?? 0);
    return { valido: true, valor, unidad: 'V' };
  }

  function medirContinuidad(estadoComponentes, nodoA, nodoB) {
    const falta = componenteFalta(estadoComponentes);
    if (falta !== null) return { valido: false, razon: 'estado_incompleto' };

    const rA = resolverNodo(nodoA);
    if (rA.error) return { valido: false, razon: rA.error };
    const rB = resolverNodo(nodoB);
    if (rB.error) return { valido: false, razon: rB.error };

    const adj = construirGrafo(estadoComponentes, true);
    const visitados = new Set();
    const cola = [nodoA];
    visitados.add(nodoA);

    while (cola.length > 0) {
      const cur = cola.shift();
      if (cur === nodoB) return { valido: true, valor: 0, unidad: 'Ω' };
      for (const n of adj.get(cur) || []) {
        if (!visitados.has(n)) {
          visitados.add(n);
          cola.push(n);
        }
      }
    }

    return { valido: false, razon: 'medicion_imposible' };
  }

  function findComponente(componentId) {
    const comp = componentesMap.get(componentId);
    if (!comp) return null;
    return {
      id: comp.id,
      tipo: comp.tipo,
      subtipo: comp.subtipo ?? null,
      propiedades: { ...(comp.propiedades || {}) },
      bornes: (comp.bornes || []).map((b) => ({ id: b.id, polaridad: b.polaridad })),
    };
  }

  return {
    id: systemContent.id,
    tipo: systemContent.tipo,
    findComponente,
    calcularEstado,
    medirTension,
    medirContinuidad,
  };
}

function createNullSystem() {
  const invalido = (razon) => ({ valido: false, razon });
  return {
    id: null,
    tipo: null,
    findComponente: () => null,
    calcularEstado: () => ({ voltajes: new Map(), conectados: new Set() }),
    medirTension: () => invalido('sistema_inexistente'),
    medirContinuidad: () => invalido('sistema_inexistente'),
  };
}
