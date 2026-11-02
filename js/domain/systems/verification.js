// Contrato de verificación de Sprint 3.
//
// La variante declara qué resultado observable debe cumplirse. Sprint 3 solo
// implementa `luz_encendida`; Sprint 7 podrá añadir otros tipos sin reescribir
// el motor eléctrico.

export function verificarSistema(sistema, estadoComponentes, referencia, verificacion) {
  if (!verificacion || verificacion.tipo !== 'luz_encendida') return false;

  const componenteId = verificacion.componenteRef;
  if (!componenteId) return false;

  const componente = sistema.findComponente(componenteId);
  if (!componente || componente.tipo !== 'carga') return false;

  const estado = estadoComponentes && estadoComponentes[componenteId];
  if (!estado || estado.roto === true) return false;

  let voltajes;
  try {
    voltajes = sistema.calcularEstado(estadoComponentes).voltajes;
  } catch (e) {
    return false;
  }

  const entrada = voltajes.get(`${componenteId}.entrada`) ?? 0;
  if (entrada <= 0) return false;

  const continuidad = sistema.medirContinuidad(
    estadoComponentes,
    `${componenteId}.salida`,
    referencia
  );

  return continuidad.valido === true;
}
