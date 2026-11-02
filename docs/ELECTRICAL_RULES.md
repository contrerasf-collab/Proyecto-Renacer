# ELECTRICAL_RULES — Reglas del motor eléctrico (Sprint 2a)

Documento técnico vinculante para Sprint 2b y Sprint 3. Describe el schema concreto
del sistema eléctrico, las reglas de propagación y medición, y el flujo stateless de
`estadoComponentes`.

---

## 1. Entidades

| Entidad | Descripción |
|---|---|
| **Sistema** | `id`, `tipo` (`electrico`), lista de componentes, lista de conexiones, nodo de referencia (tierra), efectos. |
| **Componente** | `id`, `tipo` (`fuente` \| `conductor` \| `interruptor` \| `carga`), `subtipo` opcional, `propiedades` inmutables, `bornes`. |
| **Borne** | `id` dentro del componente, `polaridad` (`positivo` \| `negativo`). |
| **Conexión** | Par `{ desde, hacia }` dirigido; ambos extremos son nodos `"componente.borne"`. |
| **Nodo** | Cadena `"<componenteId>.<borneId>"`. Unidad atómica de medición. |

El estado de un componente **nunca** vive en el contenido: vive en
`state.systems[systemId].components`.

---

## 2. Schema del contenido (JSON)

### 2.1 Sistema — `content/systems/<id>.json`

```json
{
  "id": "sistema-cocina",
  "nombre": "Circuito de la cocina (serie simple)",
  "tipo": "electrico",
  "referencia": "bat_01.negativo",
  "componentes": [ "..." ],
  "conexiones": [
    { "desde": "bat_01.positivo", "hacia": "cable_01.a" }
  ],
  "efectos": []
}
```

- `referencia` es un nodo válido del propio sistema. Fija el cero absoluto (tierra).
- `componentes` es un array no vacío de componentes (véase §2.2).
- `conexiones` es un array de pares dirigidos `{ desde, hacia }` entre nodos válidos.

### 2.2 Componente

```json
{
  "id": "sw_01",
  "tipo": "interruptor",
  "subtipo": "interruptor_simple",
  "propiedades": { "resistencia": 0 },
  "bornes": [
    { "id": "entrada", "polaridad": "positivo" },
    { "id": "salida", "polaridad": "negativo" }
  ]
}
```

- `tipo` ∈ `{ fuente, conductor, interruptor, carga }`.
- `propiedades` inmutables: `voltaje` (para fuentes), `resistencia` (para el resto).
- `bornes`: array no vacío. La `polaridad` solo es eléctricamente significativa en las
  fuentes (el borne `positivo` es el que siembra la tensión). En el resto es una etiqueta
  de schema requerida pero sin efecto en el cálculo.

### 2.3 Avería — `content/faults/<id>.json`

```json
{
  "id": "interruptor-cocina-roto",
  "nombre": "Interruptor de cocina roto por dentro",
  "componenteRef": "sw_01",
  "tipo": "roto_por_dentro",
  "parametros": {}
}
```

Tipos admitidos por el schema: `roto_por_dentro` (implementado), y reservados
`desconectado`, `valor_incorrecto`, `intermitente` (el motor de Sprint 2a no los interpreta).

---

## 3. Vista `estadoComponentes`

Es el objeto `state.systems[systemId].components`: mapa
`{ [componentId]: { roto, reparado, operativo, posicion, conduce, encendida } }`.

| Campo | Tipo | Significado |
|---|---|---|
| `roto` | boolean | Componente averiado físicamente. |
| `reparado` | boolean | Fue reparado (siempre `false` en Sprint 2a). |
| `operativo` | boolean | `!roto` (materializado, no derivado en tiempo de ejecución). |
| `posicion` | `on` \| `off` \| `null` | Solo interruptores. |
| `conduce` | boolean | Conduce eléctricamente (distingue "hace clic" de "conduce"). |
| `encendida` | boolean | Bombilla encendida (no calculado por el motor en Sprint 2a). |

---

## 4. Reglas de propagación (cálculo de voltaje)

El motor es **stateless**. `calcularEstado(estadoComponentes)` recibe la vista completa y
no guarda nada entre llamadas.

1. **Semilla.** Cada borne `positivo` de cada componente `fuente` recibe
   `propiedades.voltaje` (por defecto 12). Cada borne `negativo` de fuente recibe 0.
2. **Referencia.** El nodo `referencia` del sistema fija el cero absoluto.
3. **BFS.** Desde los bornes positivos de las fuentes se propaga la tensión a través de:
   - **conexiones externas** (siempre, en ambos sentidos, sin caída);
   - **conductor** con `roto !== true` (une sus dos bornes);
   - **interruptor** con `posicion === 'on' && conduce === true` (une sus dos bornes).
4. **Carga (bombilla).** Recibe voltaje en su borne de entrada pero **no propaga** la
   tensión a su borne de salida (caída de tensión a través de la carga). Su borne de
   salida queda en el lado de retorno (0).
5. **Fuente.** No une sus bornes (no hay cortocircuito interno).

**Salida:** `{ voltajes: Map<nodo, número>, conectados: Set<nodo> }`.
`conectados` es el conjunto de nodos alcanzables desde la fuente positiva (nodos "vivos",
con tensión de fuente). Los nodos no alcanzados tienen voltaje 0.

---

## 5. Reglas de continuidad

`medirContinuidad(estadoComponentes, nodoA, nodoB)` usa un grafo de **conductividad**
independiente del grafo de tensión:

- conexiones externas: conductivas (siempre);
- `conductor` con `roto !== true`: conductivo entre sus bornes;
- `interruptor` con `posicion === 'on' && conduce === true`: conductivo;
- `carga` con `roto !== true`: conductiva (filamento íntegro);
- `fuente`: no conductiva entre sus bornes.

Si existe camino entre `nodoA` y `nodoB` → `{ valido: true, valor: 0, unidad: 'Ω' }`.
Si no → `{ valido: false, razon: 'medicion_imposible' }`.

---

## 6. Contrato de medición (razones)

`medirTension(estadoComponentes, nodoRef, nodoMedida)` devuelve
`{ valido: true, valor: V(nodoMedida) − V(nodoRef), unidad: 'V' }`.

Toda medición inválida devuelve `{ valido: false, razon }`:

| Razón | Cuándo se produce |
|---|---|
| `sistema_inexistente` | `createElectricalSystem(null/undefined)` → sistema degenerado; sus mediciones lo devuelven. |
| `componente_inexistente` | Un nodo referencia un `componenteId` que no está en el sistema. |
| `nodo_inexistente` | El `componenteId` existe pero el `borneId` no. |
| `sin_referencia` | El sistema no tiene `referencia` válida (medir tensión absoluta es imposible). |
| `medicion_imposible` | No hay camino conductivo entre los dos nodos (continuidad). |
| `estado_incompleto` | La vista `estadoComponentes` no contiene entrada para algún componente del sistema. |

La UI **nunca** decide el significado de un error; solo muestra el resultado.

---

## 7. Flujo stateless de `estadoComponentes`

- **Origen:** `state.systems[systemId].components`; lo gestiona `state` y lo muta `actions`.
- **Destino:** primer parámetro de `calcularEstado`, `medirTension` y `medirContinuidad`.
- **Transición:** sin caché, sin inicialización diferida, sin `sistema.actualizarEstado()`.
  Una misma instancia `sistema` puede invocarse con vistas distintas sin efectos colaterales.
- **Validación:** `estado_incompleto` si falta un componente.

---

## 8. Topologías mínimas

### Topología 1 — `sistema-cocina.json` (serie simple)

`bat_01` → `cable_01` → `sw_01` → `lamp_01` → `cable_02` → vuelta a `bat_01`.
5 conexiones, 4 nodos medibles (`sw_01.entrada`, `sw_01.salida`, `lamp_01.entrada`,
`lamp_01.salida`).

### Topología 2 — `sistema-cocina-derivacion.json` (serie con derivación)

Igual que T1 con una segunda bombilla `lamp_02` en paralelo a `lamp_01` (ambas comparten
`sw_01.salida` y `cable_02.a`). 7 conexiones, 6 nodos medibles.

Ambas usan los mismos tipos de componente y de conexión: el BFS resuelve la derivación sin
refactor (validación del criterio §3.7 del sprint).
