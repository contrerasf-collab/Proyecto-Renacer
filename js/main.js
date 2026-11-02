import { createState, createInitialState } from './core/state.js';
import { createInput } from './core/input.js';
import { createLoop } from './core/loop.js';
import { createRenderer } from './core/render.js';
import { createMap } from './domain/world/map.js';
import { createActions } from './domain/actions.js';
import { createElectricalSystem } from './domain/systems/electrical.js';
import { applyFault } from './domain/systems/faults.js';
import { createTilemapRender } from './presentation/render/tilemap-render.js';
import { createSpriteRender } from './presentation/render/sprite-render.js';
import { createInteractableRender } from './presentation/render/interactable-render.js';
import { createSceneExploration } from './presentation/scenes/scene-exploration.js';
import { createSceneManager } from './presentation/scene-manager.js';
import { createMultimeter } from './presentation/ui/multimeter.js';
import { createHud } from './presentation/ui/hud.js';

import mapaRemansoJson from '../content/maps/remanso-exterior.json';
import mapaCocinaJson from '../content/maps/cocina.json';
import sistemaCocina from '../content/systems/sistema-cocina.json';
import faultCocina from '../content/faults/interruptor-cocina-roto.json';

const canvas = document.getElementById('game-canvas');
const hudRoot = document.getElementById('hud');
const renderer = createRenderer(canvas);

const variant = new URLSearchParams(window.location.search).get('variant');
const state = createState();
state.replace(createInitialState({ variant }));

// D1 aplicará la avería indicada por session.faultId.
// Hasta D1 se mantiene la avería base existente.
const estadoSistema = applyFault(sistemaCocina, faultCocina);
state.patch(['systems', 'sistema-cocina', 'components'], estadoSistema);

const input = createInput(window);
const sistema = createElectricalSystem(sistemaCocina);

const mapaExterior = createMap(mapaRemansoJson);
const mapaCocina = createMap(mapaCocinaJson);

let mapaActivo = mapaExterior;
const actions = createActions(state, {
  isSolid: (x, y) => mapaActivo.isSolid(x, y),
});

const multimeter = createMultimeter();
const hud = createHud({
  root: hudRoot,
  input,
  actions,
  sistemaId: 'sistema-cocina',
  componentes: sistemaCocina.componentes,
});

const tilemapRender = createTilemapRender(renderer);
const spriteRender = createSpriteRender(renderer);
const interactableRender = createInteractableRender(renderer);

function onTransition(destino) {
  actions.entrarMapa(destino.mapa, {
    x: destino.x,
    y: destino.y,
    orientacion: destino.orientacion,
  });
  mapaActivo = destino.mapa === 'cocina' ? mapaCocina : mapaExterior;
  sceneManager.changeTo(destino.mapa);
}

const sceneExterior = createSceneExploration({
  state,
  actions,
  input,
  map: mapaExterior,
  puertas: mapaRemansoJson.puertas || [],
  sistema,
  sistemaId: 'sistema-cocina',
  referencia: sistemaCocina.referencia,
  multimeter,
  hud,
  objetivo: 'Entra en la cocina: la luz no funciona.',
  tilemapRender,
  spriteRender,
  interactableRender,
  onTransition,
});

const sceneCocina = createSceneExploration({
  state,
  actions,
  input,
  map: mapaCocina,
  puertas: mapaCocinaJson.puertas || [],
  sistema,
  sistemaId: 'sistema-cocina',
  referencia: sistemaCocina.referencia,
  multimeter,
  hud,
  objetivo: 'Cocina sin luz: mide y diagnostica.',
  tilemapRender,
  spriteRender,
  interactableRender,
  onTransition,
});

const sceneManager = createSceneManager();
sceneManager.setScene('remanso-exterior', sceneExterior);
sceneManager.setScene('cocina', sceneCocina);
sceneManager.changeTo('remanso-exterior');

const loop = createLoop(
  (dtMs) => {
    sceneManager.update(dtMs);
    input.update();
  },
  () => {
    renderer.clear('#14181C');
    sceneManager.render();
  }
);

loop.start();
