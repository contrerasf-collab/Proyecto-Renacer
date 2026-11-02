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
  verificacion = null,
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

  function resolverFoco() {
    const front = actions.getCeldaFrontal();
    const resueltos = map.getInteractablesResueltos(sistema);
    const foco = resueltos.find((i) => i.x === front.x && i.y === front.y) || null;
    return { front, resueltos, foco };
  }

  function interactuar() {
    const { foco } = resolverFoco();
    if (!foco) return;

    if (foco.tipo === 'medida') {
      if (foco.nodo) multimeter.colocarSonda(foco.nodo);
      return;
    }

    if (foco.componente && foco.componente.tipo === 'interruptor') {
      actions.alternarInterruptor(sistemaId, foco.ref);
    }
  }

  function puedeRepararFoco(foco) {
    const session = state.get().session || {};
    if (session.finalizada || session.resuelto) return false;
    if (!foco || !foco.componente) return false;

    const hipotesis = actions.ultimoDiagnostico();
    return (
      hipotesis !== null &&
      hipotesis.systemId === sistemaId &&
      hipotesis.componenteId === foco.ref
    );
  }

  function intentarReparar() {
    const { foco } = resolverFoco();
    if (!foco || !foco.componente) return;

    const session = state.get().session || {};
    if (session.finalizada || session.resuelto) return;

    const hipotesis = actions.ultimoDiagnostico();
    if (!hipotesis) {
      hud.mostrarAviso('Antes de reparar, registra qué componente crees que falla.');
      return;
    }
    if (hipotesis.systemId !== sistemaId || hipotesis.componenteId !== foco.ref) {
      hud.mostrarAviso('Acércate al componente que has registrado.');
      return;
    }

    actions.repararComponente(sistemaId, foco.ref);
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
      if (input.consume('finalizar')) {
        hud.finalizar();
        return;
      }
      if (input.consume('polimetro')) multimeter.cambiarModo();
      if (input.consume('sonda')) multimeter.cambiarSondaActiva();
      if (input.consume('reparar')) intentarReparar();
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
      const { front, resueltos, foco } = resolverFoco();
      const sondas = multimeter.getSondas();

      const session = state.get().session || {};
      if (verificacion && !session.verificado && !session.resuelto && !session.finalizada) {
        const verificacionResultado = actions.verificarYResolver({
          sistema,
          estado,
          referencia,
          verificacion,
        });
        if (verificacionResultado.ok) {
          hud.mostrarAviso('La luz vuelve a funcionar.');
        }
      }

      const puedeReparar = puedeRepararFoco(foco);

      let voltajes = new Map();
      try {
        voltajes = sistema.calcularEstado(estado).voltajes;
      } catch (e) {
        voltajes = new Map();
      }

      interactableRender.render({
        interactables: resueltos,
        celdaFrontal: front,
        estado,
        voltajes,
        sondas,
        referencia,
      });

      spriteRender.renderPlayer(jugador.x, jugador.y, jugador.orientacion);

      hud.render({
        multimeter,
        sistema,
        estado,
        referencia,
        objetivo,
        foco,
        puedeReparar,
      });
    },
    enter() {},
    exit() {},
  };
}
