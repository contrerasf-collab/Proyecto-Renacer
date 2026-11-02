import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const VALID_COLISION = new Set(['0', '1']);
const ORIENTACIONES = new Set(['arriba', 'abajo', 'izquierda', 'derecha']);
const TIPOS_COMPONENTE = new Set(['fuente', 'conductor', 'interruptor', 'carga']);
const TIPOS_AVERIA = new Set(['roto_por_dentro', 'desconectado', 'valor_incorrecto', 'intermitente']);
const POLARIDADES = new Set(['positivo', 'negativo']);

export function validateMap(map, filename) {
  const errors = [];
  const where = filename;

  if (typeof map.id !== 'string' || map.id.length === 0) {
    errors.push(`${where}: id debe ser string no vacío`);
  }
  if (typeof map.nombre !== 'string') {
    errors.push(`${where}: nombre debe ser string`);
  }
  if (!Number.isInteger(map.width) || map.width <= 0) {
    errors.push(`${where}: width debe ser entero > 0`);
  }
  if (!Number.isInteger(map.height) || map.height <= 0) {
    errors.push(`${where}: height debe ser entero > 0`);
  }
  if (map.tileSize !== 16) {
    errors.push(`${where}: tileSize debe ser 16, es ${map.tileSize}`);
  }

  if (!map.capas || typeof map.capas !== 'object') {
    errors.push(`${where}: capas debe ser objeto`);
    return errors;
  }

  for (const capa of ['suelo', 'colision']) {
    const rows = map.capas[capa];
    if (!Array.isArray(rows)) {
      errors.push(`${where}: capas.${capa} debe ser array`);
      continue;
    }
    if (rows.length !== map.height) {
      errors.push(`${where}: capas.${capa} tiene ${rows.length} filas, se esperaban ${map.height}`);
    }
    for (let i = 0; i < rows.length; i++) {
      if (typeof rows[i] !== 'string') {
        errors.push(`${where}: capas.${capa}[${i}] no es string`);
        continue;
      }
      if (rows[i].length !== map.width) {
        errors.push(
          `${where}: capas.${capa}[${i}] tiene longitud ${rows[i].length}, se esperaba ${map.width}`
        );
      }
    }
  }

  if (Array.isArray(map.capas.colision)) {
    for (let y = 0; y < map.capas.colision.length; y++) {
      const row = map.capas.colision[y];
      if (typeof row !== 'string') continue;
      for (let x = 0; x < row.length; x++) {
        if (!VALID_COLISION.has(row[x])) {
          errors.push(`${where}: colision[${y}][${x}] = '${row[x]}' no válido (0 o 1)`);
        }
      }
    }
  }

  if (!map.spawns || !map.spawns.inicial) {
    errors.push(`${where}: falta spawns.inicial`);
  } else {
    const sp = map.spawns.inicial;
    if (!Number.isInteger(sp.x) || !Number.isInteger(sp.y)) {
      errors.push(`${where}: spawns.inicial.x/y deben ser enteros`);
    } else if (!ORIENTACIONES.has(sp.orientacion)) {
      errors.push(`${where}: spawns.inicial.orientacion debe ser ${[...ORIENTACIONES].join(', ')}`);
    } else if (sp.x < 0 || sp.x >= map.width || sp.y < 0 || sp.y >= map.height) {
      errors.push(`${where}: spawns.inicial fuera del mapa (${sp.x}, ${sp.y})`);
    } else if (map.capas.colision[sp.y] && map.capas.colision[sp.y][sp.x] === '1') {
      errors.push(`${where}: spawns.inicial (${sp.x}, ${sp.y}) está en casilla sólida`);
    }
  }

  if (map.sistemas !== undefined && !Array.isArray(map.sistemas)) {
    errors.push(`${where}: sistemas debe ser array`);
  }

  if (map.interactables !== undefined) {
    if (!Array.isArray(map.interactables)) {
      errors.push(`${where}: interactables debe ser array`);
    } else {
      map.interactables.forEach((it, i) => {
        const tag = `${where}: interactables[${i}]`;
        if (typeof it.ref !== 'string' || it.ref.length === 0) {
          errors.push(`${tag}: ref debe ser string no vacío`);
        }
        if (!Number.isInteger(it.x) || !Number.isInteger(it.y)) {
          errors.push(`${tag}: x/y deben ser enteros`);
        }
        if (typeof it.tipo !== 'string' || it.tipo.length === 0) {
          errors.push(`${tag}: tipo debe ser string no vacío`);
        }
        if (it.tipo === 'medida') {
          if (typeof it.nodo !== 'string' || it.nodo.indexOf('.') <= 0) {
            errors.push(`${tag}: nodo debe ser "<componente>.<borne>" en tipo "medida"`);
          }
        }
      });
    }
  }

  if (map.puertas !== undefined) {
    if (!Array.isArray(map.puertas)) {
      errors.push(`${where}: puertas debe ser array`);
    } else {
      map.puertas.forEach((p, i) => {
        const tag = `${where}: puertas[${i}]`;
        if (!Number.isInteger(p.x) || !Number.isInteger(p.y)) {
          errors.push(`${tag}: x/y deben ser enteros`);
        }
        const d = p.destino;
        if (!d || typeof d !== 'object') {
          errors.push(`${tag}: falta destino`);
          return;
        }
        if (typeof d.mapa !== 'string' || d.mapa.length === 0) {
          errors.push(`${tag}: destino.mapa debe ser string no vacío`);
        }
        if (!Number.isInteger(d.x) || !Number.isInteger(d.y)) {
          errors.push(`${tag}: destino.x/y deben ser enteros`);
        }
        if (!ORIENTACIONES.has(d.orientacion)) {
          errors.push(`${tag}: destino.orientacion no válida`);
        }
      });
    }
  }

  return errors;
}

export function validateSystem(system, filename) {
  const errors = [];
  const where = filename;

  if (typeof system.id !== 'string' || system.id.length === 0) {
    errors.push(`${where}: id debe ser string no vacío`);
  }
  if (system.tipo !== 'electrico') {
    errors.push(`${where}: tipo debe ser "electrico"`);
  }

  const componentes = system.componentes;
  if (!Array.isArray(componentes) || componentes.length === 0) {
    errors.push(`${where}: componentes debe ser array no vacío`);
    return errors;
  }

  const ids = new Set();
  const nodos = new Set();

  for (const comp of componentes) {
    const tag = `${where}: componente ${comp.id || '(sin id)'}`;
    if (typeof comp.id !== 'string' || comp.id.length === 0) {
      errors.push(`${where}: componente con id no string`);
    } else if (ids.has(comp.id)) {
      errors.push(`${tag}: id duplicado`);
    } else {
      ids.add(comp.id);
    }

    if (!TIPOS_COMPONENTE.has(comp.tipo)) {
      errors.push(`${tag}: tipo no válido "${comp.tipo}"`);
    }

    if (!Array.isArray(comp.bornes) || comp.bornes.length === 0) {
      errors.push(`${tag}: bornes debe ser array no vacío`);
    } else {
      const borneIds = new Set();
      for (const b of comp.bornes) {
        if (typeof b.id !== 'string' || b.id.length === 0) {
          errors.push(`${tag}: borne con id no string`);
        } else if (borneIds.has(b.id)) {
          errors.push(`${tag}: borne duplicado "${b.id}"`);
        } else {
          borneIds.add(b.id);
          nodos.add(`${comp.id}.${b.id}`);
        }
        if (!POLARIDADES.has(b.polaridad)) {
          errors.push(`${tag}: borne "${b.id}" polaridad no válida "${b.polaridad}"`);
        }
      }
    }
  }

  const conexiones = system.conexiones;
  if (!Array.isArray(conexiones)) {
    errors.push(`${where}: conexiones debe ser array`);
  } else {
    conexiones.forEach((c, i) => {
      const tag = `${where}: conexiones[${i}]`;
      for (const extremo of ['desde', 'hacia']) {
        const n = c[extremo];
        if (typeof n !== 'string') {
          errors.push(`${tag}: ${extremo} debe ser string`);
        } else if (!nodos.has(n)) {
          errors.push(`${tag}: ${extremo} "${n}" no es un nodo válido`);
        }
      }
    });
  }

  if (typeof system.referencia !== 'string' || system.referencia.length === 0) {
    errors.push(`${where}: referencia debe ser string no vacío`);
  } else if (!nodos.has(system.referencia)) {
    errors.push(`${where}: referencia "${system.referencia}" no es un nodo válido`);
  }

  return errors;
}

export function validateFault(fault, filename, systemsById) {
  const errors = [];
  const where = filename;

  if (typeof fault.id !== 'string' || fault.id.length === 0) {
    errors.push(`${where}: id debe ser string no vacío`);
  }
  if (!TIPOS_AVERIA.has(fault.tipo)) {
    errors.push(`${where}: tipo no válido "${fault.tipo}"`);
  }
  if (typeof fault.componenteRef !== 'string' || fault.componenteRef.length === 0) {
    errors.push(`${where}: componenteRef debe ser string no vacío`);
  } else {
    let existe = false;
    for (const sys of systemsById?.values?.() ?? []) {
      if ((sys.componentes || []).some((c) => c.id === fault.componenteRef)) {
        existe = true;
        break;
      }
    }
    if (!existe) {
      errors.push(`${where}: componenteRef "${fault.componenteRef}" no existe en ningún sistema`);
    }
  }

  return errors;
}

export function validateInteractableRefs(map, filename, systemsById) {
  const errors = [];
  const where = filename;
  const interactables = map.interactables || [];
  const sistemas = map.sistemas || [];

  for (const sid of sistemas) {
    if (typeof sid !== 'string' || !systemsById?.has?.(sid)) {
      errors.push(`${where}: sistemas referencia un sistema inexistente "${sid}"`);
    }
  }

  if (interactables.length > 0 && sistemas.length === 0) {
    errors.push(`${where}: interactables sin "sistemas" asociados`);
  }

  for (const it of interactables) {
    if (typeof it.ref !== 'string') continue;
    let existe = false;
    for (const sid of sistemas) {
      const sys = systemsById?.get?.(sid);
      if (sys && (sys.componentes || []).some((c) => c.id === it.ref)) {
        existe = true;
        break;
      }
    }
    if (!existe) {
      errors.push(`${where}: interactable.ref "${it.ref}" no existe en ningún sistema del mapa`);
    }

    if (typeof it.nodo === 'string') {
      const idx = it.nodo.indexOf('.');
      if (idx > 0) {
        const compId = it.nodo.slice(0, idx);
        const borneId = it.nodo.slice(idx + 1);
        let nodoValido = false;
        for (const sid of sistemas) {
          const sys = systemsById?.get?.(sid);
          if (!sys) continue;
          const comp = (sys.componentes || []).find((c) => c.id === compId);
          if (comp && (comp.bornes || []).some((b) => b.id === borneId)) {
            nodoValido = true;
            break;
          }
        }
        if (!nodoValido) {
          errors.push(`${where}: interactable.nodo "${it.nodo}" no es un nodo válido`);
        }
      }
    }
  }

  return errors;
}

export function validatePuertas(map, filename, mapsById) {
  const errors = [];
  const where = filename;
  const puertas = map.puertas || [];

  function esSolida(m, x, y) {
    return !!(m.capas && m.capas.colision && m.capas.colision[y] && m.capas.colision[y][x] === '1');
  }

  for (const p of puertas) {
    const d = p.destino;
    if (!d) continue;

    if (!Number.isInteger(p.x) || !Number.isInteger(p.y)) continue;
    if (p.x < 0 || p.x >= map.width || p.y < 0 || p.y >= map.height) {
      errors.push(`${where}: puerta (${p.x}, ${p.y}) fuera del mapa`);
    } else if (esSolida(map, p.x, p.y)) {
      errors.push(`${where}: puerta (${p.x}, ${p.y}) está en casilla sólida`);
    }

    const destino = mapsById?.get?.(d.mapa);
    if (!destino) {
      errors.push(`${where}: puerta destino.mapa "${d.mapa}" no existe en index.maps`);
      continue;
    }
    if (!Number.isInteger(d.x) || !Number.isInteger(d.y)) continue;
    if (d.x < 0 || d.x >= destino.width || d.y < 0 || d.y >= destino.height) {
      errors.push(`${where}: puerta destino (${d.x}, ${d.y}) fuera de "${d.mapa}"`);
    } else if (esSolida(destino, d.x, d.y)) {
      errors.push(`${where}: puerta destino (${d.x}, ${d.y}) es sólida en "${d.mapa}"`);
    }
  }

  return errors;
}

function loadJson(filePath) {
  try {
    return { data: JSON.parse(readFileSync(filePath, 'utf-8')) };
  } catch (e) {
    return { error: e.message };
  }
}

function reportErrors(errors, total) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  return total + errors.length;
}

function main() {
  const indexPath = join(root, 'content', 'index.json');
  const indexRes = loadJson(indexPath);
  if (indexRes.error) {
    console.error(`Error leyendo ${indexPath}: ${indexRes.error}`);
    process.exit(1);
  }
  const index = indexRes.data;

  if (!Array.isArray(index.maps)) {
    console.error('content/index.json no contiene "maps" como array');
    process.exit(1);
  }

  let totalErrors = 0;

  // Sistemas.
  const systemsById = new Map();
  const systems = Array.isArray(index.systems) ? index.systems : [];
  for (const sysId of systems) {
    const res = loadJson(join(root, 'content', 'systems', `${sysId}.json`));
    if (res.error) {
      console.error(`Error leyendo ${sysId}: ${res.error}`);
      totalErrors++;
      continue;
    }
    systemsById.set(sysId, res.data);
    const errors = validateSystem(res.data, sysId);
    if (errors.length > 0) {
      totalErrors = reportErrors(errors, totalErrors);
    } else {
      console.log(`  ✓ ${sysId}`);
    }
  }

  // Averías.
  const faults = Array.isArray(index.faults) ? index.faults : [];
  for (const faultId of faults) {
    const res = loadJson(join(root, 'content', 'faults', `${faultId}.json`));
    if (res.error) {
      console.error(`Error leyendo ${faultId}: ${res.error}`);
      totalErrors++;
      continue;
    }
    const errors = validateFault(res.data, faultId, systemsById);
    if (errors.length > 0) {
      totalErrors = reportErrors(errors, totalErrors);
    } else {
      console.log(`  ✓ ${faultId}`);
    }
  }

  // Mapas: carga en primera pasada (para validar puertas contra otros mapas).
  const mapsById = new Map();
  for (const mapId of index.maps) {
    const res = loadJson(join(root, 'content', 'maps', `${mapId}.json`));
    if (res.error) {
      console.error(`Error leyendo ${mapId}: ${res.error}`);
      totalErrors++;
      continue;
    }
    mapsById.set(mapId, res.data);
  }

  // Segunda pasada: validación.
  for (const [mapId, map] of mapsById) {
    const mapErrors = validateMap(map, mapId);
    const refErrors = validateInteractableRefs(map, mapId, systemsById);
    const puertaErrors = validatePuertas(map, mapId, mapsById);
    const all = [...mapErrors, ...refErrors, ...puertaErrors];
    if (all.length > 0) {
      totalErrors = reportErrors(all, totalErrors);
    } else {
      console.log(`  ✓ ${mapId}`);
    }
  }

  if (totalErrors > 0) {
    console.error(`\n${totalErrors} error(es) encontrados.`);
    process.exit(1);
  }
  console.log('\nOK');
  process.exit(0);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main();
}
