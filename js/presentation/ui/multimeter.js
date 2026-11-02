// Modelo puro del polímetro. No toca DOM ni canvas.
//
// - Modos: 'voltaje' | 'continuidad'.
// - Sondas: 'roja' (medición) y 'negra' (referencia). En voltaje, si la negra no se
//   ha colocado, se usa la tierra del sistema.
// - Semántica única de "medición incompleta": si falta una sonda requerida, `leer`
//   devuelve `null` y la UI muestra un único mensaje ("Coloca las sondas").

export function createMultimeter() {
  let modo = 'voltaje';
  let sondaActiva = 'roja';
  let sondaRoja = null;
  let sondaNegra = null;

  return {
    getModo() {
      return modo;
    },
    cambiarModo() {
      modo = modo === 'voltaje' ? 'continuidad' : 'voltaje';
      return modo;
    },
    getSondaActiva() {
      return sondaActiva;
    },
    cambiarSondaActiva() {
      sondaActiva = sondaActiva === 'roja' ? 'negra' : 'roja';
      return sondaActiva;
    },
    colocarSonda(nodo) {
      if (sondaActiva === 'roja') sondaRoja = nodo;
      else sondaNegra = nodo;
      return { sonda: sondaActiva, nodo };
    },
    getSondas() {
      return { roja: sondaRoja, negra: sondaNegra };
    },
    limpiarSondas() {
      sondaRoja = null;
      sondaNegra = null;
    },
    leer(sistema, estadoComponentes, referencia) {
      if (modo === 'voltaje') {
        if (!sondaRoja) return null;
        return sistema.medirTension(estadoComponentes, sondaNegra ?? referencia, sondaRoja);
      }
      // Continuidad: exige ambas sondas.
      if (!sondaRoja || !sondaNegra) return null;
      return sistema.medirContinuidad(estadoComponentes, sondaNegra, sondaRoja);
    },
  };
}
