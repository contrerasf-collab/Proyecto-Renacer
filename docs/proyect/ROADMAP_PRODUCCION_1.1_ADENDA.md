# ADENDA 1.1 — Correcciones Congeladas al Roadmap de Producción 1.0

Esta adenda forma parte del Roadmap de Producción 1.0 y prevalece sobre cualquier versión anterior en caso de conflicto.

---

# Corrección 1 — Compatibilidad futura del motor

## Nuevo requisito de Sprint 2a

Aunque Sprint 2a solo implementa:

- serie simple
- serie con derivación

el diseño del modelo deberá prever compatibilidad futura con:

- averías múltiples
- componentes incorrectos
- topologías paralelas completas
- fallos intermitentes

No es obligatorio implementar estas capacidades en Sprint 2a.

Sí es obligatorio que el modelo no impida implementarlas posteriormente sin refactorización estructural.

---

# Corrección 2 — Separación entre contenido y estado

El modelo de componentes deberá separar explícitamente:

## Contenido (inmutable)

```json
{
  "id": "sw_01",
  "tipo": "interruptor",
  "propiedades": {
    "resistencia": 0
  }
}
```

## Estado (mutable)

```json
{
  "estado": {
    "roto": false,
    "reparado": false
  }
}
```

Regla:

```text
Contenido nunca cambia.
Estado nunca vive dentro del contenido.
```

---

# Corrección 3 — Estado compatible con reparación futura

Aunque la reparación se implementa en Sprint 3, el schema definido en Sprint 2a deberá contemplar desde el inicio:

```text
estado
reparado
averiado
operativo
```

o equivalente.

Objetivo:

```text
Evitar refactorización de schemas
cuando llegue Sprint 3.
```

---

# Corrección 4 — Modelo de interacción física

Sprint 2a deberá definir explícitamente el mecanismo de relación entre:

```text
componente lógico
↓
representación física
```

Recomendación congelada:

```text
map.interactables[]
```

referenciando componentes.

Ejemplo conceptual:

```json
{
  "ref": "sw_01",
  "x": 13,
  "y": 8
}
```

Objetivo:

```text
Desacoplar lógica de circuito
y representación visual.
```

---

# Corrección 5 — Contrato de medición inválida

Sprint 2a deberá definir formalmente los resultados posibles de una medición.

Casos mínimos:

```text
Sistema inexistente

Nodo inexistente

Sin referencia

Medición válida
```

La UI nunca decidirá qué significa un error.

La UI solo mostrará el resultado entregado por el motor.

---

# Corrección 6 — Diagnóstico como bitácora

La decisión queda congelada.

## Aprobado

```text
B — Bitácora
```

El jugador podrá registrar hipótesis.

Ejemplo:

```text
Creo que el problema está en el interruptor.
```

El sistema:

- registra
- almacena
- muestra

Pero no responde:

```text
Correcto.
Incorrecto.
```

La validez se comprueba posteriormente mediante reparación y verificación.

---

# Corrección 7 — state.patch()

Sprint 2a incluirá:

```text
state.patch(path, value)
```

como operación básica del sistema de estado.

Objetivo:

```text
Reducir errores al modificar
state.systems
```

---

# Corrección 8 — API congelada antes de Sprint 2b

Sprint 2a deberá finalizar con:

- API documentada
- contratos definidos
- tipos de retorno fijados

Antes de comenzar Sprint 2b.

Regla:

```text
Sprint 2b consume la API.

Sprint 2b no redefine la API.
```

---

# Corrección 9 — Definición de diagnóstico correcto

Para los playtests de Sprint 2b:

Se considerará diagnóstico correcto cuando:

```text
La última entrada registrada
en la bitácora del jugador
identifique el componente realmente averiado.
```

Solo se considera la entrada final.

No las entradas previas.

---

# Corrección 10 — Validación futura de Sprint 7

Antes de cerrar Sprint 2a deberá realizarse un ejercicio conceptual.

Objetivo:

Representar sobre papel o esquema:

- una avería múltiple
- una avería intermitente
- un componente incorrecto
- una topología paralela completa

y verificar que el modelo diseñado en Sprint 2a puede representarlas.

No es una implementación.

Es una comprobación conceptual.

Objetivo:

```text
Evitar descubrir en Sprint 7
que el modelo elegido no escala.
```

---

# Corrección 11 — Persistencia

La decisión queda congelada.

## Sprint 3

Incluye:

```text
Persistencia de estado en memoria
```

No incluye:

```text
Guardado a disco
```

## Sprint 6

Incluye:

```text
localStorage
1 slot de guardado
```

junto al Vertical Slice.

---

# Corrección 12 — Cláusulas de fallo obligatorias

Todas las puertas de salida del roadmap deberán incluir:

```text
Condición de éxito
↓
Condición de fallo
↓
Acción correctiva
```

No existe avance automático.

Cada puerta deberá indicar explícitamente:

```text
Qué ocurre si no se supera.
```

---

# Corrección 13 — Principio rector congelado

Todo cambio de arquitectura futura deberá respetar:

```text
El motor puede crecer.

El motor no puede reescribirse
para soportar contenido ordinario.
```

Las averías nuevas deberán introducirse preferentemente mediante:

```text
datos
```

y no mediante:

```text
código específico.
```