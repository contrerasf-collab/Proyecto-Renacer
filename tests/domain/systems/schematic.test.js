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

describe('crearEsquema — layout determinista', () => {
  it('es determinista entre ejecuciones', () => {
    const a = crearEsquema(sistemaCocina).layout;
    const b = crearEsquema(sistemaCocina).layout;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('cubre todos los componentes', () => {
    const layout = crearEsquema(sistemaCocina).layout;
    const idsLayout = layout.componentes.map((c) => c.id).sort();
    const idsModelo = sistemaCocina.componentes.map((c) => c.id).sort();
    expect(idsLayout).toEqual(idsModelo);
  });

  it('cubre todos los nodos como terminales', () => {
    const esquema = crearEsquema(sistemaCocina);
    const nodosTerminales = esquema.layout.terminales.map((t) => t.nodo).sort();
    expect(nodosTerminales).toEqual([...esquema.nodos].sort());
  });

  it('las posiciones de componentes son únicas', () => {
    const layout = crearEsquema(sistemaCocina).layout;
    const claves = layout.componentes.map((c) => `${c.x},${c.y}`);
    expect(new Set(claves).size).toBe(claves.length);
  });

  it('las posiciones de terminales son únicas', () => {
    const layout = crearEsquema(sistemaCocina).layout;
    const claves = layout.terminales.map((t) => `${t.x},${t.y}`);
    expect(new Set(claves).size).toBe(claves.length);
  });

  it('las componentes siguen un orden de x no decreciente', () => {
    const layout = crearEsquema(sistemaCocina).layout;
    for (let i = 1; i < layout.componentes.length; i++) {
      expect(layout.componentes[i].x).toBeGreaterThanOrEqual(layout.componentes[i - 1].x);
    }
  });

  it('cada conexión une dos terminales existentes', () => {
    const esquema = crearEsquema(sistemaCocina);
    const nodosTerminales = new Set(esquema.layout.terminales.map((t) => t.nodo));
    for (const con of esquema.conexiones) {
      expect(nodosTerminales.has(con.desde)).toBe(true);
      expect(nodosTerminales.has(con.hacia)).toBe(true);
    }
  });

  it('la referencia tiene posición', () => {
    const layout = crearEsquema(sistemaCocina).layout;
    expect(layout.referencia).toMatchObject({ nodo: sistemaCocina.referencia });
    expect(typeof layout.referencia.x).toBe('number');
    expect(typeof layout.referencia.y).toBe('number');
  });

  it('no modifica el contenido de entrada al calcular layout', () => {
    const original = JSON.parse(JSON.stringify(sistemaCocina));
    crearEsquema(sistemaCocina);
    expect(sistemaCocina).toEqual(original);
  });
});
