# RENACER

Herramienta educativa integrada de práctica deliberada, transferencia y diagnóstico, ambientada en una comunidad post-colapso.

## Documentación de referencia

- `docs/proyect/adr/ADR-INDEX.md` — registro de decisiones arquitectónicas.
- `docs/proyect/RENACER_VISION_UNIFICADA_v3.md` — visión de proyecto.
- `docs/proyect/GDD.md` — diseño de experiencia.
- `docs/proyect/TDD.md` — diseño técnico.
- `docs/proyect/fundamentos/PRINCIPIOS_RECTORES.md` — reglas no negociables.
- `docs/proyect/fundamentos/MARCO_PEDAGOGICO.md` — fundamento didáctico.
- `docs/proyect/progresion/` — taxonomía y progresión.
- `docs/proyect/curriculo/MAPA_CURRICULAR.md` — referencia curricular.

## Requisitos

- Node.js 18+
- npm 9+

## Comandos

- `npm install` — instalar dependencias.
- `npm run dev` — servidor de desarrollo.
- `npm run build` — build a `dist/index.html` (single-file).
- `npm run test` — tests unitarios.
- `npm run validate` — validar contenido JSON.

## Estado actual

Sprint 3 cerrado: observar, medir, diagnosticar, reparar, verificar y resolver. Tres variantes de avería. 83/83 tests, validate y build verdes.

## Controles

### Teclado

- Flechas / WASD — mover.
- Enter / Espacio / Z — interactuar (accionar interruptor, colocar sonda) o confirmar en bitácora.
- R — reparar el componente registrado.
- P — cambiar modo del polímetro (V ↔ Ω).
- Tab — cambiar sonda activa (roja ↔ negra).
- B — abrir/cerrar bitácora.
- Esc / M — cerrar paneles.
- F — finalizar sesión.

### Táctil

- D-pad.
- Botón `A` (acción).
- Botón contextual `Reparar`.
- `V/Ω`, `Sonda`, `Bitácora`, `Finalizar`.

## Estructura

- `js/core/` — motor (loop, input, state, event-bus, render).
- `js/domain/` — reglas (world, actions, systems).
- `js/presentation/` — escenas, render, UI.
- `content/` — datos JSON (mapas, sistemas, averías).
- `css/` — estilos.
- `tests/` — tests unitarios.
- `tools/` — herramientas de desarrollo.
- `docs/proyect/` — documentación normativa, pedagógica, de producto y de producción.

## Sistemas eléctricos

Los sistemas viven en `content/systems/<id>.json`. Cada sistema define topología, componentes, bornes, conexiones y referencia. El estado vive separado, en `state.systems[systemId].components`.

Reglas de propagación, contrato de medición y flujo stateless: `docs/ELECTRICAL_RULES.md`.

## Averías

Las averías son data-driven y viven en `content/faults/<id>.json`. Son variación de contenido, no unidad de progresión.

## Formato de mapa

Un mapa es un objeto JSON con capas, spawns, sistemas, puertas e interactables. Ver `docs/ELECTRICAL_RULES.md` y `tools/validate-content.js`.
