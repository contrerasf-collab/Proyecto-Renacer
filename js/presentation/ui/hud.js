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

  // Objetivo (arriba). Compacto y descartable: el texto completo queda en title.
  const elObjetivo = document.createElement('div');
  elObjetivo.className = 'hud-objetivo';
  root.appendChild(elObjetivo);

  const elObjetivoTexto = document.createElement('span');
  elObjetivoTexto.className = 'hud-objetivo-texto';
  elObjetivo.appendChild(elObjetivoTexto);

  const bCerrarObjetivo = document.createElement('button');
  bCerrarObjetivo.type = 'button';
  bCerrarObjetivo.className = 'hud-objetivo-cerrar';
  bCerrarObjetivo.textContent = '×';
  bCerrarObjetivo.setAttribute('aria-label', 'Cerrar objetivo');
  bCerrarObjetivo.title = 'Cerrar objetivo';
  elObjetivo.appendChild(bCerrarObjetivo);

  const bAbrirObjetivo = document.createElement('button');
  bAbrirObjetivo.type = 'button';
  bAbrirObjetivo.className = 'hud-objetivo-abrir oculto';
  bAbrirObjetivo.textContent = 'Objetivo';
  bAbrirObjetivo.setAttribute('aria-label', 'Mostrar objetivo');
  bAbrirObjetivo.title = 'Mostrar objetivo';
  root.appendChild(bAbrirObjetivo);

  // Polímetro (arriba-derecha).
  const panel = document.createElement('div');
  panel.className = 'hud-panel';
  root.appendChild(panel);

  const panelHeader = document.createElement('div');
  panelHeader.className = 'hud-panel-header';
  panel.appendChild(panelHeader);

  const elModo = document.createElement('div');
  elModo.className = 'hud-modo';
  panelHeader.appendChild(elModo);

  const bAyuda = document.createElement('button');
  bAyuda.type = 'button';
  bAyuda.className = 'hud-ayuda-btn';
  bAyuda.textContent = '?';
  bAyuda.setAttribute('aria-label', 'Ayuda del polímetro');
  bAyuda.title = 'Ayuda del polímetro (F1)';
  panelHeader.appendChild(bAyuda);

  const elSondas = document.createElement('div');
  elSondas.className = 'hud-sondas';
  panel.appendChild(elSondas);

  const filaRoja = document.createElement('div');
  filaRoja.className = 'hud-sonda sonda-roja';
  elSondas.appendChild(filaRoja);

  const filaNegra = document.createElement('div');
  filaNegra.className = 'hud-sonda sonda-negra';
  elSondas.appendChild(filaNegra);

  const elResultadoEtiqueta = document.createElement('div');
  elResultadoEtiqueta.className = 'hud-resultado-label';
  elResultadoEtiqueta.textContent = 'Lectura';
  panel.appendChild(elResultadoEtiqueta);

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

  // Banda de foco: qué hay delante y qué acción se puede hacer.
  const elFoco = document.createElement('div');
  elFoco.className = 'hud-foco oculto';
  root.appendChild(elFoco);

  const elFocoTexto = document.createElement('span');
  elFocoTexto.className = 'hud-foco-texto';
  elFoco.appendChild(elFocoTexto);

  const elFocoAccion = document.createElement('span');
  elFocoAccion.className = 'hud-foco-accion oculto';
  elFoco.appendChild(elFocoAccion);

  const bReparar = document.createElement('button');
  bReparar.type = 'button';
  bReparar.className = 'hud-foco-reparar oculto';
  bReparar.textContent = 'R Reparar';
  bReparar.setAttribute('aria-label', 'Reparar el componente registrado');
  bReparar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    input.press('reparar');
  });
  bReparar.addEventListener('pointerup', (e) => {
    e.preventDefault();
    input.release('reparar');
  });
  bReparar.addEventListener('pointerleave', () => input.release('reparar'));
  elFoco.appendChild(bReparar);

  const elAviso = document.createElement('div');
  elAviso.className = 'hud-aviso oculto';
  root.appendChild(elAviso);

  let avisoTimer = null;

  function mostrarAviso(texto) {
    elAviso.textContent = texto;
    elAviso.classList.remove('oculto');
    if (avisoTimer !== null) clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => {
      elAviso.classList.add('oculto');
      avisoTimer = null;
    }, 2500);
  }

  // Ayuda contextual mínima del polímetro. No decide nada del diagnóstico.
  const panelAyuda = document.createElement('div');
  panelAyuda.className = 'hud-ayuda oculto';
  panelAyuda.setAttribute('role', 'dialog');
  panelAyuda.setAttribute('aria-modal', 'false');
  panelAyuda.setAttribute('aria-label', 'Ayuda del polímetro');
  panelAyuda.setAttribute('aria-hidden', 'true');
  panelAyuda.innerHTML = `
    <div class="hud-ayuda-titulo">Cómo usar el polímetro</div>
    <ol class="hud-ayuda-lista">
      <li><b>V/Ω</b> cambia entre voltaje y continuidad.</li>
      <li><b>Sonda</b> alterna roja/negra.</li>
      <li>Ponte delante de un punto y pulsa <b>A</b> / <b>Enter</b>.</li>
      <li>La roja mide; la negra es la referencia (tierra si no la colocas).</li>
      <li>La lectura aparece aquí. <b>B</b> abre la bitácora.</li>
      <li><b>R</b> / <b>Reparar</b>: repara el componente que has registrado.</li>
    </ol>
    <p class="hud-ayuda-nota">La bitácora registra tu hipótesis; no la valida.</p>
    <div class="hud-leyenda">
      <div class="hud-leyenda-item"><span class="hud-leyenda-chip chip-fuente"></span>Batería</div>
      <div class="hud-leyenda-item"><span class="hud-leyenda-chip chip-interruptor"></span>Interruptor</div>
      <div class="hud-leyenda-item"><span class="hud-leyenda-chip chip-carga"></span>Bombilla</div>
      <div class="hud-leyenda-item"><span class="hud-leyenda-chip chip-medida"></span>Punto de medida</div>
    </div>
    <button type="button" class="hud-btn hud-ayuda-cerrar">Cerrar</button>
  `;
  root.appendChild(panelAyuda);

  const bCerrarAyuda = panelAyuda.querySelector('.hud-ayuda-cerrar');

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

  function cerrarObjetivo() {
    elObjetivo.classList.add('cerrado');
    bAbrirObjetivo.classList.remove('oculto');
  }

  function abrirObjetivo() {
    elObjetivo.classList.remove('cerrado');
    bAbrirObjetivo.classList.add('oculto');
  }

  function cerrarAyuda() {
    panelAyuda.classList.add('oculto');
    panelAyuda.setAttribute('aria-hidden', 'true');
  }

  function abrirAyuda() {
    if (bitacoraAbierta) return;
    panelAyuda.classList.remove('oculto');
    panelAyuda.setAttribute('aria-hidden', 'false');
  }

  function toggleAyuda() {
    if (bitacoraAbierta) return;
    if (panelAyuda.classList.contains('oculto')) abrirAyuda();
    else cerrarAyuda();
  }

  function textoFoco(foco) {
    if (!foco) return null;
    if (foco.tipo === 'medida' && foco.nodo) {
      return {
        texto: `Punto de medida: ${nombreDeNodo(foco.nodo, nombres)}`,
        accion: 'A / Enter para medir',
      };
    }
    if (foco.componente) {
      return {
        texto: `Componente: ${nombreDeComponente(foco.ref)}`,
        accion: foco.componente.tipo === 'interruptor' ? 'A / Enter para accionar' : '',
      };
    }
    return null;
  }

  function actualizarFoco(foco, puedeReparar = false) {
    const info = textoFoco(foco);
    if (!info) {
      elFoco.classList.add('oculto');
      elFocoTexto.textContent = '';
      elFocoAccion.textContent = '';
      elFocoAccion.classList.add('oculto');
      bReparar.classList.add('oculto');
      return;
    }
    elFoco.classList.remove('oculto');
    if (elFocoTexto.textContent !== info.texto) elFocoTexto.textContent = info.texto;
    elFocoAccion.textContent = info.accion;
    elFocoAccion.classList.toggle('oculto', !info.accion);
    bReparar.classList.toggle('oculto', !puedeReparar);
  }

  bCerrarObjetivo.addEventListener('click', cerrarObjetivo);
  bAbrirObjetivo.addEventListener('click', abrirObjetivo);
  bAyuda.addEventListener('click', toggleAyuda);
  bCerrarAyuda.addEventListener('click', cerrarAyuda);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F1' || e.key === '?') {
      e.preventDefault();
      toggleAyuda();
    } else if (e.key === 'Escape' && !panelAyuda.classList.contains('oculto')) {
      cerrarAyuda();
    }
  });

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
    actions.finalizarSesion();
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
    mostrarAviso,
    render({ multimeter, sistema, estado, referencia, objetivo, foco = null, puedeReparar = false }) {
      // La ayuda nunca debe quedar superpuesta a la bitácora.
      if (bitacoraAbierta && !panelAyuda.classList.contains('oculto')) cerrarAyuda();

      if (objetivo && elObjetivoTexto.textContent !== objetivo) {
        elObjetivoTexto.textContent = objetivo;
        elObjetivoTexto.title = objetivo;
        elObjetivo.title = objetivo;
      }

      const modo = multimeter.getModo();
      const activa = multimeter.getSondaActiva();
      const sondas = multimeter.getSondas();

      elModo.textContent = `Polímetro · ${modo === 'voltaje' ? 'Voltaje (V)' : 'Continuidad (Ω)'}`;
      elModo.classList.toggle('modo-continuidad', modo === 'continuidad');

      const textoRoja = `R → ${sondas.roja ? nombreDeNodo(sondas.roja, nombres) : 'sin colocar'}`;
      const refTexto = sondas.negra
        ? nombreDeNodo(sondas.negra, nombres)
        : referencia
          ? `tierra (${nombreDeNodo(referencia, nombres)})`
          : 'tierra';
      const textoNegra = `N → ${refTexto}`;

      filaRoja.textContent = textoRoja;
      filaRoja.title = textoRoja;
      filaRoja.classList.toggle('activa', activa === 'roja');
      filaNegra.textContent = textoNegra;
      filaNegra.title = textoNegra;
      filaNegra.classList.toggle('activa', activa === 'negra');

      let resultado = null;
      try {
        resultado = multimeter.leer(sistema, estado, referencia);
      } catch (e) {
        resultado = { valido: false, razon: 'estado_incompleto' };
      }
      const textoLectura = textoResultado(resultado);
      elLectura.textContent = textoLectura;
      elLectura.title = textoLectura;
      elLectura.classList.remove('lectura-valida', 'lectura-invalida', 'lectura-pendiente');
      if (resultado === null) elLectura.classList.add('lectura-pendiente');
      else if (resultado.valido) elLectura.classList.add('lectura-valida');
      else elLectura.classList.add('lectura-invalida');

      actualizarFoco(foco, puedeReparar);
    },
  };
}
