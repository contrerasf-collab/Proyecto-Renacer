// Transformación contenido + avería → vista `estadoComponentes`.
//
// El motor eléctrico NO conoce averías: solo ve el estado de los componentes.
// Este módulo construye el estado inicial aplicando una avería data-driven al
// contenido. En Sprint 3 la reparación mutará este mismo estado vía `actions`.

const ESTADO_BASE = {
  roto: false,
  reparado: false,
  operativo: true,
  conduce: true,
  encendida: false,
};

const POSICION_POR_TIPO = {
  fuente: null,
  conductor: null,
  interruptor: 'on',
  carga: null,
};

export function createEstadoSano(systemContent) {
  const estado = {};
  for (const comp of systemContent.componentes || []) {
    const posicion = POSICION_POR_TIPO[comp.tipo];
    estado[comp.id] = { ...ESTADO_BASE, posicion: posicion ?? null };
  }
  return estado;
}

export function applyFault(systemContent, faultContent) {
  const estado = createEstadoSano(systemContent);
  if (!faultContent) return estado;

  const compId = faultContent.componenteRef;
  if (!estado[compId]) {
    throw new Error(
      `Avería "${faultContent.id}" apunta a un componente inexistente: "${compId}"`
    );
  }

  if (faultContent.tipo === 'roto_por_dentro') {
    estado[compId].roto = true;
    estado[compId].conduce = false;
    estado[compId].operativo = false;
    // Un interruptor "roto por dentro" sigue haciendo clic (posicion on) pero no conduce.
    const objetivo = (systemContent.componentes || []).find((c) => c.id === compId);
    if (objetivo && objetivo.tipo === 'interruptor') {
      estado[compId].posicion = 'on';
    }
  }

  return estado;
}
