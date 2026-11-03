// Proyección esquemática de RENACER.
//
// Convierte el contenido de un sistema (componentes, bornes y conexiones) en un
// esquema nominal. El esquema se deriva del modelo: no existe una fuente de
// verdad independiente para la representación.
//
// El esquema es nominal: no muestra avería, estado, valores, flujo ni ruta
// correcta. Solo representa la topología del sistema.

import { nodoCanonico } from './electrical.js';

export const SIMBOLO_POR_TIPO = {
  fuente: 'fuente',
  conductor: 'conductor',
  interruptor: 'interruptor',
  carga: 'carga',
};

export function obtenerSimbolo(tipo) {
  if (typeof tipo !== 'string' || !Object.prototype.hasOwnProperty.call(SIMBOLO_POR_TIPO, tipo)) {
    throw new Error(`obtenerSimbolo: tipo de componente no soportado "${tipo}"`);
  }
  return SIMBOLO_POR_TIPO[tipo];
}

function calcularLayoutSerie(componentes, conexiones, referencia) {
  const compById = new Map(componentes.map((c) => [c.id, c]));
  const compIdByNode = new Map();
  for (const c of componentes) {
    for (const b of c.bornes) {
      compIdByNode.set(nodoCanonico(c.id, b.id), c.id);
    }
  }

  const adj = new Map();
  for (const con of conexiones) {
    if (!adj.has(con.desde)) adj.set(con.desde, []);
    if (!adj.has(con.hacia)) adj.set(con.hacia, []);
    adj.get(con.desde).push(con.hacia);
    adj.get(con.hacia).push(con.desde);
  }

  const fuente = componentes.find((c) => c.tipo === 'fuente');
  if (!fuente) {
    throw new Error('calcularLayoutSerie: no hay componente fuente');
  }
  const positivo = fuente.bornes.find((b) => b.polaridad === 'positivo');
  const negativo = fuente.bornes.find((b) => b.polaridad === 'negativo');
  if (!positivo || !negativo) {
    throw new Error('calcularLayoutSerie: fuente sin polaridad válida');
  }

  const inicio = nodoCanonico(fuente.id, positivo.id);
  const fin = nodoCanonico(fuente.id, negativo.id);

  const orden = [fuente.id];
  const visitados = new Set([inicio]);
  let actual = inicio;
  const maxPasos = componentes.length * 2 + 2;
  let pasos = 0;

  while (actual !== fin) {
    if (pasos++ > maxPasos) {
      throw new Error('calcularLayoutSerie: no es una serie simple');
    }
    const vecinos = adj.get(actual) || [];
    let siguiente = null;
    for (const n of vecinos) {
      if (!visitados.has(n)) {
        siguiente = n;
        break;
      }
    }
    if (siguiente === null) {
      throw new Error('calcularLayoutSerie: no es una serie simple');
    }
    visitados.add(siguiente);

    const compId = compIdByNode.get(siguiente);
    if (!compId) {
      throw new Error('calcularLayoutSerie: nodo sin componente');
    }
    if (compId === fuente.id) {
      actual = siguiente;
      continue;
    }

    if (!orden.includes(compId)) orden.push(compId);
    const comp = compById.get(compId);
    const salida = comp.bornes.find((b) => nodoCanonico(compId, b.id) !== siguiente);
    if (!salida) {
      throw new Error('calcularLayoutSerie: componente sin borne de salida');
    }
    actual = nodoCanonico(compId, salida.id);
    visitados.add(actual);
  }

  if (orden.length !== componentes.length) {
    throw new Error('calcularLayoutSerie: no es una serie simple');
  }

  const ESPACIO = 3;
  const posiciones = new Map();
  orden.forEach((id, i) => posiciones.set(id, { x: i * ESPACIO, y: 0 }));

  const terminales = [];
  for (const c of componentes) {
    const posicion = posiciones.get(c.id);
    c.bornes.forEach((b, idx) => {
      const nodo = nodoCanonico(c.id, b.id);
      const x = idx === 0 ? posicion.x - 1 : posicion.x + 1;
      terminales.push({ nodo, x, y: 0 });
    });
  }
  terminales.sort((a, b) => a.nodo.localeCompare(b.nodo));

  const refTerminal = terminales.find((t) => t.nodo === referencia);

  return {
    componentes: orden.map((id) => ({ id, ...posiciones.get(id) })),
    terminales,
    referencia: {
      nodo: referencia,
      x: refTerminal ? refTerminal.x : 0,
      y: -2,
    },
  };
}

export function crearEsquema(systemContent) {
  if (systemContent === null || systemContent === undefined) {
    throw new TypeError('crearEsquema: systemContent es obligatorio');
  }
  if (!Array.isArray(systemContent.componentes) || systemContent.componentes.length === 0) {
    throw new Error('crearEsquema: componentes debe ser un array no vacío');
  }

  const componentes = systemContent.componentes;
  const conexiones = Array.isArray(systemContent.conexiones) ? systemContent.conexiones : [];
  const referencia = systemContent.referencia || null;

  const idsVistos = new Set();
  const componentesProyeccion = [];
  const nodos = new Set();
  const simbolos = {};

  for (const comp of componentes) {
    if (typeof comp.id !== 'string' || comp.id.length === 0) {
      throw new Error('crearEsquema: componente sin id válido');
    }
    if (idsVistos.has(comp.id)) {
      throw new Error(`crearEsquema: id de componente duplicado "${comp.id}"`);
    }
    idsVistos.add(comp.id);

    if (!Array.isArray(comp.bornes) || comp.bornes.length === 0) {
      throw new Error(`crearEsquema: componente "${comp.id}" sin bornes`);
    }

    obtenerSimbolo(comp.tipo);

    const borneIds = [];
    const bornesVistos = new Set();
    for (const b of comp.bornes) {
      if (typeof b.id !== 'string' || b.id.length === 0) {
        throw new Error(`crearEsquema: componente "${comp.id}" tiene un borne sin id`);
      }
      if (bornesVistos.has(b.id)) {
        throw new Error(`crearEsquema: borne duplicado "${comp.id}.${b.id}"`);
      }
      bornesVistos.add(b.id);
      const nodo = nodoCanonico(comp.id, b.id);
      if (nodos.has(nodo)) {
        throw new Error(`crearEsquema: nodo duplicado "${nodo}"`);
      }
      nodos.add(nodo);
      borneIds.push(b.id);
    }

    componentesProyeccion.push({
      id: comp.id,
      tipo: comp.tipo,
      borneIds,
    });

    simbolos[comp.tipo] = obtenerSimbolo(comp.tipo);
  }

  const conexionesProyeccion = conexiones.map((c) => {
    const desde = c.desde;
    const hacia = c.hacia;
    if (typeof desde !== 'string' || !nodos.has(desde)) {
      throw new Error(`crearEsquema: conexión con nodo inexistente o inválido "${desde}"`);
    }
    if (typeof hacia !== 'string' || !nodos.has(hacia)) {
      throw new Error(`crearEsquema: conexión con nodo inexistente o inválido "${hacia}"`);
    }
    return { desde, hacia };
  });

  return {
    id: systemContent.id ?? null,
    tipo: systemContent.tipo ?? null,
    referencia,
    componentes: componentesProyeccion,
    conexiones: conexionesProyeccion,
    nodos: [...nodos].sort(),
    simbolos,
    layout: calcularLayoutSerie(componentes, conexiones, referencia),
  };
}
