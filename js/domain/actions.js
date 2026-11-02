import { verificarSistema } from './systems/verification.js';

const DELTA_POR_ORIENTACION = {
  arriba: { dx: 0, dy: -1 },
  abajo: { dx: 0, dy: 1 },
  izquierda: { dx: -1, dy: 0 },
  derecha: { dx: 1, dy: 0 },
};

export function createActions(state, map) {
  return {
    moverJugador(dx, dy) {
      const jugador = state.get().jugador;
      const newX = jugador.x + dx;
      const newY = jugador.y + dy;

      // Orientación: la previa persiste si dx === 0 && dy === 0.
      let orientacion = jugador.orientacion;
      if (dy === -1) orientacion = 'arriba';
      else if (dy === 1) orientacion = 'abajo';
      else if (dx === -1) orientacion = 'izquierda';
      else if (dx === 1) orientacion = 'derecha';

      // Empujar contra una pared no mueve, pero sí gira al jugador.
      if (map.isSolid(newX, newY)) {
        if (orientacion !== jugador.orientacion) {
          state.set({ jugador: { ...jugador, orientacion } });
        }
        return;
      }

      state.set({ jugador: { ...jugador, x: newX, y: newY, orientacion } });
    },
    getCeldaFrontal() {
      const { x, y, orientacion } = state.get().jugador;
      const delta = DELTA_POR_ORIENTACION[orientacion] || { dx: 0, dy: 0 };
      return { x: x + delta.dx, y: y + delta.dy };
    },
    getJugador() {
      return state.get().jugador;
    },
    registrarDiagnostico(systemId, componenteId) {
      const diagnosticos = state.get().flags.diagnosticos || [];
      const entrada = { systemId, componenteId, ts: Date.now() };
      state.patch(['flags', 'diagnosticos'], [...diagnosticos, entrada]);
    },
    getDiagnosticos() {
      return (state.get().flags.diagnosticos || []).slice();
    },
    ultimoDiagnostico() {
      const diagnosticos = state.get().flags.diagnosticos || [];
      return diagnosticos.length > 0 ? diagnosticos[diagnosticos.length - 1] : null;
    },
    alternarInterruptor(sistemaId, componenteId) {
      const sistemas = state.get().systems;
      const componentes = sistemas && sistemas[sistemaId] && sistemas[sistemaId].components;
      if (!componentes) return;
      const comp = componentes[componenteId];
      if (!comp) return;
      // Solo los interruptores tienen posicion 'on'/'off'.
      if (comp.posicion !== 'on' && comp.posicion !== 'off') return;
      const nueva = comp.posicion === 'on' ? 'off' : 'on';
      state.patch(['systems', sistemaId, 'components', componenteId, 'posicion'], nueva);
    },
    repararComponente(sistemaId, componenteId) {
      const actual = state.get();
      const session = actual.session || {};

      if (session.finalizada) return { ok: false, razon: 'finalizada' };
      if (session.resuelto) return { ok: false, razon: 'resuelto' };

      const diagnosticos = actual.flags.diagnosticos || [];
      const hipotesis = diagnosticos[diagnosticos.length - 1];
      if (!hipotesis) return { ok: false, razon: 'sin_hipotesis' };
      if (hipotesis.systemId !== sistemaId || hipotesis.componenteId !== componenteId) {
        return { ok: false, razon: 'componente_distinto' };
      }

      const componentes = actual.systems?.[sistemaId]?.components;
      const comp = componentes?.[componenteId];
      if (!comp) return { ok: false, razon: 'componente_inexistente' };
      if (comp.roto !== true) return { ok: false, razon: 'no_averiado' };

      state.patch(['systems', sistemaId, 'components', componenteId], {
        ...comp,
        roto: false,
        reparado: true,
        operativo: true,
        conduce: true,
      });

      return { ok: true };
    },
    verificarYResolver({ sistema, estado, referencia, verificacion }) {
      const actual = state.get();
      const session = actual.session || {};

      if (session.finalizada) return { ok: false, razon: 'finalizada' };
      if (session.resuelto) return { ok: false, razon: 'resuelto' };

      const verificado = verificarSistema(sistema, estado, referencia, verificacion);
      if (!verificado) return { ok: false, razon: 'no_verificado' };

      state.patch(['session'], {
        ...session,
        verificado: true,
        resuelto: true,
      });

      return { ok: true };
    },
    entrarMapa(mapaId, posicion) {
      const jugador = state.get().jugador;
      state.patch(['jugador'], {
        ...jugador,
        mapa: mapaId,
        x: posicion.x,
        y: posicion.y,
        orientacion: posicion.orientacion ?? jugador.orientacion,
      });
    },
  };
}
