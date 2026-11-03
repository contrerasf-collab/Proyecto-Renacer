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
  };
}
