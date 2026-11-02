# RENACER — CONTEXTO OPERATIVO

**Uso:** abrir nueva sesión DSH con workspace `Proyecto Renacer 2.0/renacer`.
**Fecha de referencia:** cierre de sesión tras Sprint 2B.

---

## 1. Estado actual del proyecto

| Sprint | Estado | Validación | Resultado |
|---|---|---|---|
| Sprint 1 | Cerrado | `npm install`, `test`, `validate`, `dev`, `build` | Motor mínimo, movimiento, render, colisiones. 14 tests. |
| Sprint 2A | Cerrado | `test`, `validate`, `build` | Motor eléctrico stateless + API congelada + topologías 1/2 + avería data-driven. 42 tests. |
| Sprint 2B | Implementado y validado técnicamente | `test` (57/57), `validate`, `build` | Cocina jugable, transiciones, polímetro V/Ω, sondas, bitácora, HUD y controles teclado/táctil. Flujo completo jugable. |

Pendiente de Sprint 2B: **playtest formal** (5 personas, ≥4/5, ≤10 min) y decisión sobre pulido UX.

---

## 2. Estado técnico actual

- **Tests:** 57/57 (14 ficheros; 14 de Sprint 1 + 28 de 2A + 15 de 2B).
- **`npm run validate`:** OK (2 sistemas, 1 avería, 2 mapas: `remanso-exterior` y `cocina`; puertas e interactables válidos).
- **`npm run build`:** OK; single-file `dist/index.html` (~26.5 kB).
- **Bundle:** `renacer_sprint2b_bundle.txt` (completo 2A+2B, 50 ficheros) generado en el workspace. **Aún no aplicado al proyecto real.**
- **`rebuild.py`:** actualizado; reconstruye desde `renacer_sprint2b_bundle.txt` (UTF-8 + LF).
- **Proyecto real `Proyecto Renacer 2.0/renacer`:** sigue en **Sprint 1**. Antes de continuar: aplicar el bundle 2B, `npm install`, verificar test/validate/build y commitear (tag `v0.2b`).

---

## 3. Decisiones congeladas (no reabrir sin razón de peso)

- Motor eléctrico **stateless**: el estado se pasa como parámetro en cada llamada; sin caché ni estado interno.
- **Contenido inmutable / estado mutable** separados: estado en `state.systems[systemId].components`.
- **API pública de Sprint 2A congelada** (§3.10). Sprint 2B y siguientes la consumen; solo pueden **añadir**.
- **Bitácora:** registra hipótesis, **no valida** (Adenda C6). Solo cuenta la última entrada (C9).
- **Diagnóstico = hipótesis**; su validación llega con reparación + verificación (Sprint 3).
- Representación: **componentes interactivos + puntos de medida** (`interactable.ref` → componente; `nodo` para medida).
- **Averías data-driven**; el motor de medición no conoce averías, solo estado.
- Sin NPCs (Sprint 4), sin guardado (Sprint 6), sin cámara (Sprint 8).

---

## 4. Situación metodológica

- **Se abandona** el modelo "bundle completo por iteración".
- **Se adopta** modelo **híbrido**:
  - **Proyecto vivo** (git) como fuente de verdad y día a día.
  - **Bundle/snapshot solo en hitos** (cierre de sprint, entrega, snapshot).
- Razones: coste de regenerar el árbol en cada iteración, drift workspace↔proyecto real, doble verificación; git ya existe y da historial/rollback.
- Reproducibilidad se mantiene con **clean checkout** en hitos (`npm install` + test + validate + build).
- Próxima sesión debe abrirse con workspace = `Proyecto Renacer 2.0/renacer`.

---

## 5. Próximo trabajo pendiente (cierre de Sprint 2B)

**Descubierto en pruebas manuales:**
- Banner superior demasiado grande: tapa parte del circuito.
- Cuesta leer el circuito (recorrido/relación entre componentes).
- Relación sonda → punto → lectura poco evidente.
- Flujo de sondas (seleccionar sonda, acercarse, acción, repetir) sin explicación en el juego.

**Mejoras UX sobre la mesa (parecen aprobadas):**
- Banner compacto/descartable.
- Nombre visible del elemento enfocado.
- Sondas y puntos medidos visibles (mapa + HUD).
- Línea visible `Roja → X · Negra → Y · Resultado → Z`.
- Ayuda contextual mínima (5 pasos de uso del polímetro; sin electricidad, sin diagnóstico).

**No confundir con Sprint 3:** la bitácora no se toca; la validación del diagnóstico NO es de 2B; no añadir reparación/verificación ni mecánicas nuevas.

---

## 6. Sprint 3 (contexto, no especificación)

**Reparar y Verificar.** Cerrar el bucle completo:
`Observar → Medir → Diagnosticar → Reparar → Verificar`.
Incluye reparación MVP, verificación, estado persistente **en memoria** (sin guardado a disco) y tres averías data-driven sobre el mismo sistema. Depende de 2B cerrado y de `state.systems` operativo.

---

## 7. Normas de trabajo futuras

- **Git obligatorio**: commit antes de cambios importantes; rama por iteración; tag en hitos.
- **test + validate + build** verdes antes de cerrar una iteración.
- **Bundle solo en hitos/entregas**, no por iteración.
- No reabrir decisiones congeladas sin razón de peso.
- Cambios de UX/HUD/CSS **no** tocan motor, API ni bitácora.
- En hitos: clean checkout + `npm install` + test/validate/build para confirmar reproducibilidad.
- No commitear `node_modules/` ni `dist/`.
