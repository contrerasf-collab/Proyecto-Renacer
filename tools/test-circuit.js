// tools/test-circuit.js — puerta de salida de Sprint 2a.
//
// Uso:
//   node tools/test-circuit.js [--topology 1|2]
//
// Carga el sistema correspondiente, aplica la avería data-driven, construye la
// vista `estadoComponentes`, ejecuta una secuencia de mediciones y reporta si el
// diagnóstico (componente roto) coincide con el componente realmente averiado.

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { createElectricalSystem } from '../js/domain/systems/electrical.js';
import { applyFault } from '../js/domain/systems/faults.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function parseArgs(argv) {
  let topology = 1;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--topology') {
      topology = Number(argv[i + 1] || '1');
      i++;
    }
  }
  if (topology !== 1 && topology !== 2) {
    console.error('--topology debe ser 1 o 2');
    process.exit(2);
  }
  return topology;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function diagnosticar(sistema, estado, referencia, componentes) {
  const rotos = [];
  for (const comp of componentes) {
    if (comp.tipo !== 'interruptor') continue;
    const bornes = (comp.bornes || []).map((b) => b.id);
    if (bornes.length < 2) continue;
    const a = `${comp.id}.${bornes[0]}`;
    const b = `${comp.id}.${bornes[1]}`;

    const continuidad = sistema.medirContinuidad(estado, a, b);
    const tensionA = sistema.medirTension(estado, referencia, a);
    const tensionB = sistema.medirTension(estado, referencia, b);

    const caeTension =
      (tensionA.valido && tensionB.valido) &&
      ((tensionA.valor !== 0 && tensionB.valor === 0) ||
        (tensionB.valor !== 0 && tensionA.valor === 0));

    // Interruptor que no conduce pero tiene tensión en un solo borne → roto por dentro.
    if (continuidad.valido === false && caeTension) {
      rotos.push(comp.id);
    }
  }
  return rotos;
}

function main() {
  const topology = parseArgs(process.argv.slice(2));

  const index = readJson(join(root, 'content', 'index.json'));
  const systemId = topology === 1 ? 'sistema-cocina' : 'sistema-cocina-derivacion';
  const faultId = index.faults[0] || 'interruptor-cocina-roto';

  const systemContent = readJson(join(root, 'content', 'systems', `${systemId}.json`));
  const faultContent = readJson(join(root, 'content', 'faults', `${faultId}.json`));

  const sistema = createElectricalSystem(systemContent);
  const estado = applyFault(systemContent, faultContent);

  console.log(`Sistema: ${systemContent.id} (${systemContent.nombre})`);
  console.log(`Avería:  ${faultContent.id} (${faultContent.componenteRef}, ${faultContent.tipo})`);
  console.log('');

  // Secuencia de mediciones sobre cada interruptor.
  const interruptores = systemContent.componentes.filter((c) => c.tipo === 'interruptor');
  for (const comp of interruptores) {
    const [a, b] = (comp.bornes || []).map((x) => x.id);
    const cont = sistema.medirContinuidad(estado, `${comp.id}.${a}`, `${comp.id}.${b}`);
    const tA = sistema.medirTension(estado, systemContent.referencia, `${comp.id}.${a}`);
    const tB = sistema.medirTension(estado, systemContent.referencia, `${comp.id}.${b}`);
    console.log(`  ${comp.id}: continuidad=${cont.valido ? 'sí' : 'NO'} | tensión ${a}=${tA.valido ? `${tA.valor}V` : tA.razon} ${b}=${tB.valido ? `${tB.valor}V` : tB.razon}`);
  }

  console.log('');
  const diagnostico = diagnosticar(sistema, estado, systemContent.referencia, systemContent.componentes);
  const componenteReal = faultContent.componenteRef;
  const correcto = diagnostico.length === 1 && diagnostico[0] === componenteReal;

  console.log(`Diagnóstico: ${diagnostico.length > 0 ? diagnostico.join(', ') : 'ninguno'}`);
  console.log(`Componente realmente averiado: ${componenteReal}`);
  console.log('');
  console.log(correcto ? '✓ Diagnóstico correcto' : '✗ Diagnóstico incorrecto');

  process.exit(correcto ? 0 : 1);
}

main();
