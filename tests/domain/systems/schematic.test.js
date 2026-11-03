import { describe, it, expect } from 'vitest';
import { nodoCanonico } from '../../../js/domain/systems/electrical.js';
import {
  crearEsquema,
  obtenerSimbolo,
  SIMBOLO_POR_TIPO,
} from '../../../js/domain/systems/schematic.js';
import sistemaCocina from '../../../content/systems/sistema-cocina.json';

describe('nodoCanonico', () => {
  it('construye el identificador canónico con el formato correcto', () => {
    expect(nodoCanonico('bat_01', 'positivo')).toBe('bat_01.positivo');
  });

  it('es determinista', () => {
    expect(nodoCanonico('sw_01', 'entrada')).toBe(nodoCanonico('sw_01', 'entrada'));
  });

  it('rechaza entradas inválidas', () => {
    expect(() => nodoCanonico('', 'positivo')).toThrow();
    expect(() => nodoCanonico('bat_01', '')).toThrow();
    expect(() => nodoCanonico(null, 'positivo')).toThrow();
    expect(() => nodoCanonico('bat_01', undefined)).toThrow();
  });
});

describe('obtenerSimbolo', () => {
  it('cubre todos los tipos del sistema actual', () => {
    const tipos = new Set(sistemaCocina.componentes.map((c) => c.tipo));
    for (const tipo of tipos) {
      expect(obtenerSimbolo(tipo)).toBe(SIMBOLO_POR_TIPO[tipo]);
    }
  });

  it('rechaza tipos desconocidos', () => {
    expect(() => obtenerSimbolo('desconocido')).toThrow();
  });
});

describe('crearEsquema', () => {
  it('proyecta los mismos componentes que el modelo', () => {
    const esquema = crearEsquema(sistemaCocina);

    expect(esquema.componentes).toHaveLength(sistemaCocina.componentes.length);
    const idsEsquema = esquema.componentes.map((c) => c.id).sort();
    const idsModelo = sistemaCocina.componentes.map((c) => c.id).sort();
    expect(idsEsquema).toEqual(idsModelo);
  });

  it('proyecta los mismos bornes que el modelo', () => {
    const esquema = crearEsquema(sistemaCocina);

    const bornesEsquema = esquema.componentes.flatMap((c) =>
      c.borneIds.map((b) => `${c.id}.${b}`)
    );
    const bornesModelo = sistemaCocina.componentes.flatMap((c) =>
      c.bornes.map((b) => `${c.id}.${b.id}`)
    );
    expect(bornesEsquema.sort()).toEqual(bornesModelo.sort());
  });

  it('proyecta las mismas conexiones que el modelo', () => {
    const esquema = crearEsquema(sistemaCocina);
    expect(esquema.conexiones).toEqual(sistemaCocina.conexiones);
  });

  it('conserva la referencia del modelo', () => {
    const esquema = crearEsquema(sistemaCocina);
    expect(esquema.referencia).toBe(sistemaCocina.referencia);
  });

  it('todos los nodos son únicos', () => {
    const esquema = crearEsquema(sistemaCocina);
    expect(new Set(esquema.nodos).size).toBe(esquema.nodos.length);
  });

  it('es determinista entre ejecuciones', () => {
    const a = crearEsquema(sistemaCocina);
    const b = crearEsquema(sistemaCocina);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('no modifica el contenido de entrada', () => {
    const original = JSON.parse(JSON.stringify(sistemaCocina));
    crearEsquema(sistemaCocina);
    expect(sistemaCocina).toEqual(original);
  });

  it('rechaza contenido nulo o sin componentes', () => {
    expect(() => crearEsquema(null)).toThrow();
    expect(() => crearEsquema(undefined)).toThrow();
    expect(() => crearEsquema({})).toThrow();
  });

  it('rechaza componentes con id duplicado', () => {
    const invalido = JSON.parse(JSON.stringify(sistemaCocina));
    invalido.componentes[1].id = invalido.componentes[0].id;
    expect(() => crearEsquema(invalido)).toThrow();
  });

  it('rechaza bornes duplicados dentro de un componente', () => {
    const invalido = JSON.parse(JSON.stringify(sistemaCocina));
    invalido.componentes[0].bornes[1].id = invalido.componentes[0].bornes[0].id;
    expect(() => crearEsquema(invalido)).toThrow();
  });

  it('rechaza conexiones entre componentes en lugar de nodos', () => {
    const invalido = JSON.parse(JSON.stringify(sistemaCocina));
    invalido.conexiones[0] = { desde: 'bat_01', hacia: 'cable_01' };
    expect(() => crearEsquema(invalido)).toThrow();
  });

  it('rechaza conexiones a nodos inexistentes', () => {
    const invalido = JSON.parse(JSON.stringify(sistemaCocina));
    invalido.conexiones[0] = { desde: 'bat_01.positivo', hacia: 'noexiste.a' };
    expect(() => crearEsquema(invalido)).toThrow();
  });
});
