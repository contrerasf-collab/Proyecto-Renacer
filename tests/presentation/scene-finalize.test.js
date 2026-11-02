import { describe, it, expect, vi } from 'vitest';
import { createSceneExploration } from '../../js/presentation/scenes/scene-exploration.js';

function crearEscena({ session, consumirFinalizar = false, bitacoraAbierta = false }) {
  const state = {
    get: () => ({
      session,
      systems: {},
      jugador: { x: 10, y: 13, orientacion: 'abajo' },
    }),
  };
  const input = {
    consume: vi.fn((accion) => accion === 'finalizar' && consumirFinalizar),
    isHeld: vi.fn(() => false),
    press: vi.fn(),
    release: vi.fn(),
  };
  const hud = {
    finalizar: vi.fn(),
    isBitacoraOpen: vi.fn(() => bitacoraAbierta),
    mostrarAviso: vi.fn(),
    render: vi.fn(),
  };

  const scene = createSceneExploration({
    state,
    actions: {},
    input,
    map: {},
    puertas: [],
    sistema: {},
    sistemaId: 'sistema-cocina',
    referencia: 'bat_01.negativo',
    verificacion: null,
    multimeter: {},
    hud,
    objetivo: '',
    tilemapRender: {},
    spriteRender: {},
    interactableRender: {},
    onTransition: () => {},
  });

  return { scene, input, hud };
}

describe('Escena — cierre de sesión', () => {
  it('no procesa ninguna interacción si la sesión está finalizada', () => {
    const { scene, input } = crearEscena({
      session: { finalizada: true, verificado: false, resuelto: false },
    });

    scene.update(16);

    expect(input.consume).not.toHaveBeenCalled();
    expect(input.isHeld).not.toHaveBeenCalled();
  });

  it('finaliza aunque la bitácora esté abierta', () => {
    const { scene, input, hud } = crearEscena({
      session: { finalizada: false, verificado: false, resuelto: false },
      consumirFinalizar: true,
      bitacoraAbierta: true,
    });

    scene.update(16);

    expect(hud.finalizar).toHaveBeenCalledTimes(1);
    expect(input.consume).toHaveBeenCalledWith('finalizar');
  });
});
