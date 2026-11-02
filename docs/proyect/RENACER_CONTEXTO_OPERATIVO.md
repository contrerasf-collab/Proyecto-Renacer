# RENACER — CONTEXTO OPERATIVO

**Uso:** abrir nueva sesión DSH con workspace `Proyecto Renacer 2.B/renacer`.
**Fecha de referencia:** 2 de noviembre de 2026, tras el UX Pass post-Sprint 2B.
**Árbol canónico:** `Proyecto Renacer 2.B/renacer`.

---

## 1. Estado actual del proyecto

| Sprint / hito | Estado | Validación | Resultado |
|---|---|---|---|
| Sprint 1 | Cerrado | `npm install`, `test`, `validate`, `dev`, `build` | Motor mínimo, movimiento, render, colisiones. 14 tests. |
| Sprint 2A | Cerrado | `test`, `validate`, `build` | Motor eléctrico stateless + API congelada + topologías 1/2 + avería data-driven. 42 tests acumulados. |
| Sprint 2B | **Completado en implementación y UX** | `test` (58/58), `validate`, `build`, QA manual | Cocina jugable, transiciones, polímetro V/Ω, sondas, bitácora, HUD y controles teclado/táctil. |
| UX Pass post-2B | **Completado** | `test` (58/58), `validate`, `build`, QA manual | A1 banner compacto, A2 foco, A3 sondas/lectura, A4 ayuda; B1 colores y B4 lectura inválida. Bugfix de orientación contra pared. |
| Playtest formal 2B | **Pendiente** | 5 personas, ≥4/5, ≤10 min | Puerta de cierre definitivo del Sprint 2B. |
| Sprint 3 | **No iniciado** | — | Depende del cierre formal de 2B. |

**Cierre formal de 2B:** pendiente de ejecutar y registrar el playtest. No se considera cerrado hasta superar esa puerta.

---

## 2. Estado técnico actual

- **Repositorio Git:** inicializado en el árbol canónico, rama `main`, árbol limpio.
- **Baseline registrado:** commit `a13ccac` (`chore: baseline Sprint 2B`).
- **Historial del UX Pass:**
  - `83635a0` — UX Pass post Sprint 2B.
  - `2ec2f2d` — cierre de la ayuda al abrir la bitácora.
  - `f7f81ab` — orientación al empujar contra una pared.
- **Tests:** **58/58** en 14 ficheros (57 previos + 1 test de regresión de orientación).
- **`npm run validate`:** OK (2 sistemas, 1 avería, 2 mapas: `remanso-exterior` y `cocina`; puertas e interactables válidos).
- **`npm run build`:** OK; single-file `dist/index.html` de **34.494 bytes** (~34,44 kB; gzip ~11,37 kB).
- **`node tools/test-circuit.js`:** correcto en topología 1 y topología 2.
- **`dist/`:** artefacto generado e ignorado por Git; no se commitea.
- **Bundle:** no se ha regenerado en el UX Pass. Se generará únicamente al cerrar el hito o preparar una entrega.
- **Repositorio histórico `Proyecto Renacer 2.0/renacer`:** queda como referencia histórica; no es fuente de verdad.

### Cambios de UX Pass incluidos

- **A1:** objetivo compacto, una línea, descartable y reabrible.
- **A2:** banda de foco con nombre de componente o punto de medida y acción disponible.
- **A3:** flujo `R → punto`, `N → referencia`, `Lectura → valor`; marcas R/N/T sobre el mapa.
- **A4:** ayuda contextual mínima del polímetro con botón `?`, panel de 5 pasos y cierre.
- **B1:** color/forma por tipo de componente y leyenda.
- **B4:** estado visual de lectura válida, inválida y pendiente, usando la razón devuelta por el motor.

### Bugfix funcional incluido

- **Orientación contra pared:** al empujar contra una celda sólida, el jugador ahora gira sin desplazarse. Corrige la imposibilidad de mirar puntos de medida situados en paredes desde una posición lateral.
- Cambio limitado a `js/domain/actions.js` y su test; no altera API, lógica eléctrica, contenido, bitácora ni diagnóstico.

---

## 3. Decisiones congeladas (no reabrir sin razón de peso)

- Motor eléctrico **stateless**: el estado se pasa como parámetro en cada llamada; sin caché ni estado interno.
- **Contenido inmutable / estado mutable** separados: estado en `state.systems[systemId].components`.
- **API pública de Sprint 2A congelada**. Sprint 2B y siguientes la consumen; solo pueden **añadir**.
- **Bitácora:** registra hipótesis, **no valida** (Adenda C6). Solo cuenta la última entrada (C9).
- **Diagnóstico = hipótesis**; su validación llega con reparación + verificación (Sprint 3).
- Representación: **componentes interactivos + puntos de medida** (`interactable.ref` → componente; `nodo` para medida).
- **Averías data-driven**; el motor de medición no conoce averías, solo estado.
- **Cambios UX/HUD/CSS** no tocan motor, API, estado, acciones, sistemas eléctricos, bitácora ni diagnóstico.
- Sin NPCs (Sprint 4), sin guardado (Sprint 6), sin cámara (Sprint 8).

---

## 4. Situación metodológica

- Modelo **híbrido** adoptado:
  - **Proyecto vivo + Git** como fuente de verdad y trabajo diario.
  - **Bundle/snapshot solo en hitos** (cierre de sprint, entrega, snapshot).
- El árbol canónico es `Proyecto Renacer 2.B/renacer`; no se mantienen dos fuentes de verdad.
- La documentación maestra vive en `docs/proyect/`.
- Reproducibilidad en hitos: clean checkout + `npm install` + test + validate + build.
- En DSH, `npm` puede fallar por ExecutionPolicy; usar `npm.cmd`. `test` y `build` pueden requerir acceso ampliado o terminal externa por el bloqueo de esbuild en `workspace-write`.
- No se regenera bundle por iteración.

---

## 5. Próximo trabajo: playtest y cierre de 2B

**Pendiente inmediato:**

- Ejecutar el playtest formal:
  - 5 participantes;
  - ≥4/5 diagnósticos correctos;
  - ≤10 minutos;
  - sin ayuda externa; la ayuda del juego se permite y se registra;
  - hardware: portátil antiguo, equipo de aula y dispositivo táctil.
- Registrar tiempo, última entrada de bitácora, aperturas de ayuda, bloqueos y observaciones cualitativas.
- Si el playtest pasa: cerrar Sprint 2B, crear el tag de cierre y generar el bundle del hito.
- Si falla: una iteración UX y nueva puerta según el roadmap.

**No iniciar Sprint 3 hasta cerrar formalmente 2B.**

---

## 6. Sprint 3 (contexto, no especificación)

**Reparar y Verificar.** Cerrar el bucle completo:
`Observar → Medir → Diagnosticar → Reparar → Verificar`.
Incluye reparación MVP, verificación, estado persistente **en memoria** (sin guardado a disco) y tres averías data-driven sobre el mismo sistema. Depende de 2B cerrado y de `state.systems` operativo.

No se ha implementado nada de Sprint 3.

---

## 7. Normas de trabajo futuras

- **Git obligatorio:** commits claros; rama por iteración cuando aporte valor; tag en hitos.
- **test + validate + build** verdes antes de cerrar una iteración.
- **Bundle solo en hitos/entregas**, no por iteración.
- No reabrir decisiones congeladas sin razón de peso.
- Cambios de UX/HUD/CSS **no** tocan motor, API, estado, acciones, sistemas eléctricos, bitácora ni diagnóstico.
- En hitos: clean checkout + `npm install` + test/validate/build para confirmar reproducibilidad.
- No commitear `node_modules/` ni `dist/`.
- No duplicar documentación maestra fuera de `docs/proyect/`; este contexto es el estado operativo de referencia.
