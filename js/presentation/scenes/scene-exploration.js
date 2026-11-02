import { MOVE_COOLDOWN_MS } from '../../core/constants.js';

export function createSceneExploration({
  state,
  actions,
  input,
  map,
  puertas,
  sistema,
  sistemaId,
  referencia,
  multimeter,
  hud,
  objetivo,
  tilemapRender,
  spriteRender,
  interactableRender,
  onTransition,
}) {
  let elapsed = 0;
  let lastMoveTime = -MOVE_COOLDOWN_MS;

  function estadoComponentes() {
    const sistemas = state.get().systems;
    return (sistemas && sistemas[sistemaId] && sistemas[sistemaId].components) || {};
  }

  function interactuar() {
    const front = actions.getCeldaFrontal();
    const resueltos = map.getInteractablesResueltos(sistema);
    const it = resueltos.find((i) => i.x === front.x && i.y === front.y);
    if (!it) return;

    if (it.tipo === 'medida') {
      if (it.nodo) multimeter.colocarSonda(it.nodo);
      return;
    }

    if (it.componente && it.componente.tipo === 'interruptor') {
      actions.alternarInterruptor(sistemaId, it.ref);
    }
  }

  function comprobarPuerta(jugador) {
    const p = (puertas || []).find((puerta) => puerta.x === jugador.x && puerta.y === jugador.y);
    if (p) onTransition(p.destino);
  }

  return {
    update(dtMs) {
      elapsed += dtMs;

      // Bitácora abierta: navegación de la lista (sin mover al jugador).
      if (hud.isBitacoraOpen()) {
        if (input.consume('arriba')) hud.moverSeleccion(-1);
        else if (input.consume('abajo')) hud.moverSeleccion(1);
        else if (input.consume('accion')) hud.confirmarSeleccion();
        else if (input.consume('menu') || input.consume('bitacora')) hud.closeBitacora();
        return;
      }

      if (input.consume('bitacora')) {
        hud.toggleBitacora();
        return;
      }
      if (input.consume('polimetro')) multimeter.cambiarModo();
      if (input.consume('sonda')) multimeter.cambiarSondaActiva();
      if (input.consume('accion')) interactuar();

      if (elapsed - lastMoveTime < MOVE_COOLDOWN_MS) return;

      let dx = 0;
      let dy = 0;
      if (input.isHeld('arriba')) dy = -1;
      else if (input.isHeld('abajo')) dy = 1;
      else if (input.isHeld('izquierda')) dx = -1;
      else if (input.isHeld('derecha')) dx = 1;

      if (dx !== 0 || dy !== 0) {
        const antes = actions.getJugador();
        actions.moverJugador(dx, dy);
        const despues = actions.getJugador();
        lastMoveTime = elapsed;
        if (despues.x !== antes.x || despues.y !== antes.y) {
          comprobarPuerta(despues);
        }
      }
    },
    render() {
      tilemapRender.render(map);
      const jugador = actions.getJugador();
      const estado = estadoComponentes();

      let voltajes = new Map();
      try {
        voltajes = sistema.calcularEstado(estado).voltajes;
      } catch (e) {
        voltajes = new Map();
      }

      interactableRender.render({
        interactables: map.getInteractablesResueltos(sistema),
        celdaFrontal: actions.getCeldaFrontal(),
        estado,
        voltajes,
      });

      spriteRender.renderPlayer(jugador.x, jugador.y, jugador.orientacion);

      hud.render({ multimeter, sistema, estado, referencia, objetivo });
    },
    enter() {},
    exit() {},
  };
}
