# RENACER

Juego de diagnóstico técnico ambientado en una comunidad post-colapso.

## Documento de referencia
- `RENACER_VISION_UNIFICADA_v2.0` (fuente de verdad)

## Requisitos
- Node.js 18+
- npm 9+

## Comandos
- `npm install` — instalar dependencias
- `npm run dev` — servidor de desarrollo (http://localhost:3000)
- `npm run build` — build a `dist/index.html` (single-file)
- `npm run test` — ejecutar tests unitarios
- `npm run validate` — validar contenido JSON (mapas, sistemas, averías, interactables, puertas)

## Herramientas de diagnóstico
- `node tools/test-circuit.js` — secuencia de medición sobre topología 1.
- `node tools/test-circuit.js --topology 2` — idem sobre topología 2.

## Controles

### Teclado
- Flechas / WASD — mover.
- Enter / Espacio / Z — interactuar (accionar interruptor, colocar sonda) o confirmar en bitácora.
- P — cambiar modo del polímetro (V ↔ Ω).
- Tab — cambiar sonda activa (roja ↔ negra).
- B — abrir/cerrar bitácora.
- Esc / M — cerrar paneles.
- F — finalizar sesión.

### Táctil
- D-pad, botón `A` (acción), `V/Ω`, `Sonda`, `Bitácora` y `Finalizar`.

## Estructura
- `js/core/` — motor (loop, input, state, event-bus, render)
- `js/domain/` — reglas (world, actions, systems)
  - `js/domain/systems/electrical.js` — motor eléctrico stateless (BFS, medición)
  - `js/domain/systems/faults.js` — aplicación de averías → estado inicial
- `js/presentation/` — escenas, render, UI
  - `js/presentation/scenes/` — escena de mundo (movimiento, interacción, transiciones)
  - `js/presentation/ui/` — polímetro (modelo) y HUD (objetivo, display, bitácora, táctil)
  - `js/presentation/render/` — tilemap, sprite e interactables
- `content/` — datos JSON (mapas, sistemas, averías)
- `css/` — estilos
- `tests/` — tests unitarios
- `tools/` — herramientas de desarrollo
- `docs/` — documentación técnica

## Cocina (Sprint 2b)

La cocina es una escena interior de una pantalla. Se entra desde el exterior pisando la
puerta del edificio y se sale por la puerta inferior de la cocina. La luz no funciona: hay
que medir el circuito con el polímetro y registrar un diagnóstico en la bitácora.

- **Polímetro:** dos sondas. La roja es la sonda de medición y la negra la de referencia
  (por defecto, tierra). En *voltaje* la negra puede omitirse; en *continuidad* se exigen
  ambas.
- **Bitácora:** registra hipótesis. No valida. Para el playtest, solo cuenta la **última**
  entrada (Adenda C9).
- **Finalizar:** congela el tiempo y el diagnóstico final de la sesión.

## Sistemas eléctricos

Los sistemas eléctricos viven en `content/systems/<id>.json`. Cada sistema define su
topología (componentes, bornes, conexiones, referencia a tierra) y es **inmutable**.
El estado de los componentes vive separado, en `state.systems[systemId].components`, y se
modifica solo mediante `actions`.

- `sistema-cocina.json` — serie simple (batería → interruptor → bombilla).
- `sistema-cocina-derivacion.json` — serie con derivación (dos bombillas en paralelo).

Las reglas de propagación, el contrato de medición y el flujo stateless de
`estadoComponentes` están documentados en `docs/ELECTRICAL_RULES.md`.

## Averías

Las averías son data-driven y viven en `content/faults/<id>.json`. El motor de medición no
conoce averías: solo ve el estado de los componentes. Ver `docs/ELECTRICAL_RULES.md`.

## Formato de mapa

Un mapa es un objeto JSON con la siguiente estructura:

```json
{
  "id": "string, lowercase, hyphen-separated",
  "nombre": "string",
  "width": "entero > 0",
  "height": "entero > 0",
  "tileSize": "entero, debe ser 16",
  "capas": {
    "suelo": "array de height strings, cada una de width caracteres",
    "colision": "array de height strings, cada una de width caracteres"
  },
  "spawns": {
    "inicial": { "x": "entero", "y": "entero", "orientacion": "arriba|abajo|izquierda|derecha" }
  },
  "sistemas": ["ids de sistemas presentes en el mapa"],
  "puertas": [
    { "x": "entero", "y": "entero", "destino": { "mapa": "id", "x": "entero", "y": "entero", "orientacion": "..." } }
  ],
  "interactables": [
    { "ref": "id de componente", "x": "entero", "y": "entero", "tipo": "componente|medida", "nodo": "componente.borne (solo medida)" }
  ]
}
```

**Reglas:**
- `capas.suelo.length === height`.
- Cada string de `capas.suelo` tiene longitud `width`.
- `capas.colision.length === height`.
- Cada string de `capas.colision` tiene longitud `width`.
- Caracteres de `colision`: `0` (libre), `1` (sólido).
- `spawns.inicial` debe estar en una casilla libre (`colision[y][x] === '0'`).
- Cada `interactables[].ref` debe existir en algún sistema listado en `sistemas`.
- `interactables[].nodo` (tipo `medida`) debe ser un nodo válido del sistema.
- Cada `puertas[].destino` debe apuntar a un mapa existente y a una casilla libre.
