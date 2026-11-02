// HUD DOM de Sprint 2b: objetivo, polímetro, bitácora, controles táctiles y
// finalización de sesión. No decide errores de medición: solo formatea el
// resultado que devuelve el motor.

const NOMBRE_POR_TIPO = {
  fuente: 'Batería',
  interruptor: 'Interruptor',
  carga: 'Bombilla',
  conductor: 'Cable',
};

const TEXTO_RAZON = {
  medicion_imposible: 'SIN CONTINUIDAD',
  nodo_inexistente: 'Punto no válido',
  componente_inexistente: 'Componente no válido',
  estado_incompleto: 'Estado incompleto',
  sistema_inexistente: 'Sistema no disponible',
  sin_referencia: 'Sin referencia',
};

function construirNombres(componentes) {
  const bases = componentes.map((c) => NOMBRE_POR_TIPO[c.tipo] || c.id);
  const totales = {};
  for (const b of bases) totales[b] = (totales[b] || 0) + 1;
  const visto = {};
  return componentes.map((c, i) => {
    const b = bases[i];
    if (totales[b] > 1) {
      visto[b] = (visto[b] || 0) + 1;
      return { id: c.id, nombre: `${b} ${visto[b]}` };
    }
    return { id: c.id, nombre: b };
  });
}

function nombreDeNodo(nodo, nombres) {
  if (!nodo) return '—';
  const idx = nodo.indexOf('.');
  if (idx <= 0) return nodo;
  const compId = nodo.slice(0, idx);
  const borne = nodo.slice(idx + 1);
  const n = nombres.find((x) => x.id === compId);
  return `${n ? n.nombre : compId} · ${borne}`;
}

function textoResultado(resultado) {
  if (resultado === null || resultado === undefined) return 'Coloca las sondas';
  if (resultado.valido) {
    if (resultado.unidad === 'Ω') return 'CONTINUO';
    return `${resultado.valor} V`;
  }
  return TEXTO_RAZON[resultado.razon] || resultado.razon;
}

export function createHud({ root, input, actions, sistemaId, componentes }) {
  const nombres = construirNombres(componentes);
  const inicioMs = performance.now();

  let bitacoraAbierta = false;
  let seleccion = 0;
  let finalizada = false;
  let tiempoMs = null;
  let diagnosticoFinal = null;

  root.innerHTML = '';

  // Objetivo (arriba).
  const elObjetivo = document.createElement('div');
  elObjetivo.className = 'hud-objetivo';
  root.appendChild(elObjetivo);

  // Polímetro (arriba-derecha).
  const panel = document.createElement('div');
  panel.className = 'hud-panel';
  root.appendChild(panel);

  const elModo = document.createElement('div');
  elModo.className = 'hud-modo';
  panel.appendChild(elModo);

  const elSondas = document.createElement('div');
  elSondas.className = 'hud-sondas';
  panel.appendChild(elSondas);

  const filaRoja = document.createElement('div');
  filaRoja.className = 'hud-sonda';
  elSondas.appendChild(filaRoja);

  const filaNegra = document.createElement('div');
  filaNegra.className = 'hud-sonda';
  elSondas.appendChild(filaNegra);

  const elLectura = document.createElement('div');
  elLectura.className = 'hud-lectura';
  panel.appendChild(elLectura);

  // Controles táctiles (abajo).
  const touch = document.createElement('div');
  touch.className = 'hud-touch';
  root.appendChild(touch);

  function boton(texto, clase, onDown, onUp) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `hud-btn ${clase}`;
    b.textContent = texto;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (onDown) onDown();
    });
    if (onUp) {
      b.addEventListener('pointerup', (e) => {
        e.preventDefault();
        onUp();
      });
      b.addEventListener('pointerleave', () => onUp());
    }
    return b;
  }

  const pad = document.createElement('div');
  pad.className = 'hud-dpad';
  pad.appendChild(boton('▲', 'dpad-arriba', () => input.press('arriba'), () => input.release('arriba')));
  pad.appendChild(boton('◀', 'dpad-izquierda', () => input.press('izquierda'), () => input.release('izquierda')));
  pad.appendChild(boton('▶', 'dpad-derecha', () => input.press('derecha'), () => input.release('derecha')));
  pad.appendChild(boton('▼', 'dpad-abajo', () => input.press('abajo'), () => input.release('abajo')));
  touch.appendChild(pad);

  const acciones = document.createElement('div');
  acciones.className = 'hud-acciones';
  acciones.appendChild(boton('A', 'btn-accion', () => input.press('accion'), () => input.release('accion')));
  acciones.appendChild(boton('V/Ω', 'btn-modo', () => input.press('polimetro'), () => input.release('polimetro')));
  acciones.appendChild(boton('Sonda', 'btn-sonda', () => input.press('sonda'), () => input.release('sonda')));
  acciones.appendChild(boton('Bitácora', 'btn-bitacora', () => input.press('bitacora'), () => input.release('bitacora')));
  acciones.appendChild(boton('Finalizar', 'btn-finalizar', () => finalizar()));
  touch.appendChild(acciones);

  // Panel de bitácora.
  const panelBitacora = document.createElement('div');
  panelBitacora.className = 'hud-bitacora oculto';
  root.appendChild(panelBitacora);

  const titulo = document.createElement('div');
  titulo.className = 'hud-bitacora-titulo';
  titulo.textContent = 'Bitácora — ¿dónde está la avería?';
  panelBitacora.appendChild(titulo);

  const lista = document.createElement('div');
  lista.className = 'hud-bitacora-lista';
  panelBitacora.appendChild(lista);

  const filas = nombres.map((c, i) => {
    const fila = document.createElement('button');
    fila.type = 'button';
    fila.className = 'hud-bitacora-fila';
    fila.textContent = c.nombre;
    fila.addEventListener('click', () => {
      seleccion = i;
      actualizarBitacora();
    });
    lista.appendChild(fila);
    return fila;
  });

  const mensaje = document.createElement('div');
  mensaje.className = 'hud-bitacora-mensaje';
  panelBitacora.appendChild(mensaje);

  const registros = document.createElement('div');
  registros.className = 'hud-bitacora-registros';
  panelBitacora.appendChild(registros);

  const accionesBitacora = document.createElement('div');
  accionesBitacora.className = 'hud-bitacora-acciones';
  const bConfirmar = document.createElement('button');
  bConfirmar.type = 'button';
  bConfirmar.className = 'hud-btn btn-confirmar';
  bConfirmar.textContent = 'Confirmar';
  bConfirmar.addEventListener('click', () => confirmarSeleccion());
  const bCerrar = document.createElement('button');
  bCerrar.type = 'button';
  bCerrar.className = 'hud-btn btn-cerrar';
  bCerrar.textContent = 'Cerrar';
  bCerrar.addEventListener('click', () => closeBitacora());
  accionesBitacora.append(bConfirmar, bCerrar);
  panelBitacora.appendChild(accionesBitacora);

  // Overlay de fin de sesión.
  const overlayFinal = document.createElement('div');
  overlayFinal.className = 'hud-final oculto';
  root.appendChild(overlayFinal);

  function nombreDeComponente(id) {
    const n = nombres.find((x) => x.id === id);
    return n ? n.nombre : id;
  }

  function actualizarBitacora() {
    filas.forEach((f, i) => f.classList.toggle('seleccionada', i === seleccion));
    const diags = actions.getDiagnosticos();
    registros.textContent = diags.length
      ? `Registros: ${diags.map((d) => nombreDeComponente(d.componenteId)).join(' → ')}`
      : 'Sin registros';
  }

  function abrirBitacora() {
    bitacoraAbierta = true;
    panelBitacora.classList.remove('oculto');
    actualizarBitacora();
  }

  function closeBitacora() {
    bitacoraAbierta = false;
    panelBitacora.classList.add('oculto');
  }

  function toggleBitacora() {
    if (bitacoraAbierta) closeBitacora();
    else abrirBitacora();
  }

  function moverSeleccion(delta) {
    const n = nombres.length;
    if (n === 0) return;
    seleccion = (seleccion + delta + n) % n;
    actualizarBitacora();
  }

  function confirmarSeleccion() {
    if (!bitacoraAbierta || nombres.length === 0) return;
    actions.registrarDiagnostico(sistemaId, nombres[seleccion].id);
    mensaje.textContent = 'Diagnóstico registrado.';
    actualizarBitacora();
  }

  function finalizar() {
    if (finalizada) return;
    finalizada = true;
    tiempoMs = performance.now() - inicioMs;
    diagnosticoFinal = actions.ultimoDiagnostico();
    const nombre = diagnosticoFinal ? nombreDeComponente(diagnosticoFinal.componenteId) : 'ninguno';
    const segundos = Math.round(tiempoMs / 100) / 10;
    overlayFinal.textContent = `Sesión finalizada. Tiempo: ${segundos} s. Diagnóstico registrado: ${nombre}.`;
    overlayFinal.classList.remove('oculto');
  }

  return {
    isBitacoraOpen() {
      return bitacoraAbierta;
    },
    toggleBitacora,
    closeBitacora,
    moverSeleccion,
    confirmarSeleccion,
    finalizar,
    render({ multimeter, sistema, estado, referencia, objetivo }) {
      if (objetivo) elObjetivo.textContent = objetivo;

      const modo = multimeter.getModo();
      const activa = multimeter.getSondaActiva();
      const sondas = multimeter.getSondas();

      elModo.textContent = `Polímetro · ${modo === 'voltaje' ? 'Voltaje (V)' : 'Continuidad (Ω)'}`;
      elModo.classList.toggle('modo-continuidad', modo === 'continuidad');

      filaRoja.textContent = `Roja: ${sondas.roja ? nombreDeNodo(sondas.roja, nombres) : 'sin colocar'}`;
      filaRoja.classList.toggle('activa', activa === 'roja');
      filaNegra.textContent = `Negra: ${sondas.negra ? nombreDeNodo(sondas.negra, nombres) : 'tierra (por defecto)'}`;
      filaNegra.classList.toggle('activa', activa === 'negra');

      let resultado = null;
      try {
        resultado = multimeter.leer(sistema, estado, referencia);
      } catch (e) {
        resultado = { valido: false, razon: 'estado_incompleto' };
      }
      elLectura.textContent = textoResultado(resultado);

      // Límite de playtest: 10 minutos.
      if (!finalizada && performance.now() - inicioMs >= 600000) finalizar();
    },
  };
}
