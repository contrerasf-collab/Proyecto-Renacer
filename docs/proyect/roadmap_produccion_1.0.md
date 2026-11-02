# RENACER — Roadmap de Producción 1.0

**Estado:** APROBADO PARA IMPLEMENTACIÓN  
**Versión:** 1.0  
**Estado de Sprint 1:** COMPLETADO Y VALIDADO

---

# Principios Rectores

RENACER no es un juego de NPCs.

RENACER no es un juego de exploración.

RENACER no es un juego de misiones.

RENACER es un juego de:

```text
Observar
↓
Medir
↓
Diagnosticar
↓
Reparar
↓
Verificar
```

Todo el roadmap está diseñado para validar ese núcleo lo antes posible.

---

# Sprint 1 ✅ COMPLETADO

## Objetivo

Motor mínimo funcional.

## Entregado

- Movimiento
- Colisiones
- Render
- Estado
- Arquitectura
- Validación de contenido
- Tests
- Build single-file

## Validado

```text
✅ npm install
✅ npm run test
✅ npm run validate
✅ npm run dev
✅ npm run build
```

---

# Sprint 2a — Motor de Medición

## Objetivo

Validar el modelo técnico antes de construir UI.

## Alcance

### Correcciones de Sprint 1

- Orientación del jugador
- Interacción frontal
- Gestión correcta del foco

### Arquitectura

- Separación explícita entre contenido y estado
- Introducción de `state.patch()`
- Estructura de tests para sistemas eléctricos

### Sistema eléctrico

- Schema JSON del sistema
- Componentes
- Bornes
- Conexiones

### Topologías mínimas

#### Topología 1

Serie simple

```text
Batería
↓
Interruptor
↓
Bombilla
```

#### Topología 2

Serie con derivación

Sin introducir nuevos tipos de componente.

Objetivo:

```text
Validar que el modelo es genérico.
```

### Motor

- BFS de propagación
- Medición de tensión
- Medición de continuidad

### Averías

- Data-driven
- Sin hardcode

### Bitácora

Diagnóstico como registro del jugador.

No examen.

No validación inmediata.

Solo registro de hipótesis.

### API pública

Congelada antes de comenzar Sprint 2b.

### Contrato de medición inválida

Debe definirse explícitamente antes de programar.

Casos:

- sistema inexistente
- nodo inexistente
- sin referencia
- medición imposible

---

## NO incluye

```text
NPCs
Diálogos
Misiones
UI del polímetro
Reparación
Guardado
Cámara
```

---

## Puerta de salida

```text
node tools/test-circuit.js
```

diagnostica correctamente las averías.

Todos los tests pasan.

---

## Cláusula de fallo

```text
Si el modelo no soporta ambas topologías
sin refactor:

NO se avanza a Sprint 2b.
```

---

# Sprint 2b — Medición Jugable

## Objetivo

Validar si medir es comprensible.

## Alcance

### Cocina

- Interior mínimo
- Una pantalla

### Transiciones

```text
Exterior
↔
Interior
```

### Interacción

- Componentes interactivos
- Puntos de medida

### Polímetro MVP

Modos:

```text
Voltaje
Continuidad
```

### UI

- Teclado
- Táctil

### Avería

Una única avería data-driven.

### Bitácora

El jugador puede registrar:

```text
"Creo que el problema está aquí."
```

El juego registra.

No valida.

### Confirmación visual

Solo confirma:

```text
Diagnóstico registrado.
```

No existe:

```text
Correcto
Incorrecto
```

---

## NO incluye

```text
NPCs
Diálogos
Misiones
Reparación
Guardado
Cámara
```

---

## Puerta de salida

5 personas.

Al menos:

```text
4/5
```

diagnostican correctamente

sin ayuda

en:

```text
≤ 10 minutos
```

---

## Hardware obligatorio

Verificado en:

- Portátil antiguo
- Hardware objetivo de aula
- Dispositivo táctil

---

## Cláusula de fallo

```text
Si no se alcanza 4/5:

Iteración obligatoria.

Si tras dos iteraciones
sigue fallando:

Se replantea la mecánica.
```

---

# Sprint 3 — Reparar y Verificar

## Objetivo

Cerrar el bucle completo.

## Alcance

### Reparación MVP

### Verificación

### Estado persistente

En memoria.

### SIN guardado a disco

### Tres averías

Data-driven.

Mismo sistema.

Sin código específico.

### Tipología

Misma estructura lógica.

Distinto contenido.

---

## Bucle validado

```text
Observar
↓
Medir
↓
Diagnosticar
↓
Reparar
↓
Verificar
```

---

## Puerta de salida

5 participantes.

Al menos:

```text
3/5
```

quieren continuar.

Incluyendo:

```text
3 alumnos reales
```

---

## Cláusula de fallo

```text
Si falla:

Parada del roadmap.

Análisis de causa raíz.

No se avanza.
```

---

# Sprint 4 — NPCs y Diálogo

## Objetivo

Añadir contexto narrativo.

## Alcance

### Primer NPC

```text
Elvira
```

### Sistema

- Escena de diálogo
- JSON de diálogo
- Conversación

### Onboarding

El jugador entiende:

```text
Qué ocurre
Por qué ocurre
Qué debe hacer
```

---

## NO incluye

Sistema formal de misiones.

---

## Puerta de salida

El jugador:

- Recibe el problema
- Lo comprende
- Llega a la cocina
- Avanza sin ayuda

---

# Sprint 5 — Sistema de Misiones

## Objetivo

Formalizar una estructura que ya funciona.

## Alcance

### Estados

- Activa
- Completada

### Seguimiento

### Objetivos

Basados en:

```text
Medir
Diagnosticar
Reparar
Verificar
```

---

## Puerta de salida

Dos misiones completas.

Sin errores de estado.

---

# Sprint 6 — Vertical Slice

## Objetivo

Primera experiencia completa.

## Personajes

- Elvira
- Teresa
- Ansel

## Flujo

```text
Problema
↓
Investigación
↓
Diagnóstico
↓
Reparación
↓
Verificación
↓
Cierre
```

## Incluye

### Guardado

localStorage

1 slot.

### Playtest

10 alumnos.

30 minutos.

---

## Métricas

### Finalización

```text
≥ 70%
```

### Comprensión

```text
≥ 80%
```

### Intención de continuar

```text
≥ 60%
```

### Tiempo medio

```text
≤ 25 minutos
```

---

## Cláusula de fallo

```text
Si no se alcanzan las métricas:

No se avanza a Sprint 7.
```

---

# Sprint 7 — Averías Avanzadas

## Objetivo

Validar profundidad real.

## Incluye

### Fallos intermitentes

### Componentes incorrectos

### Averías múltiples

### Primera topología compleja

Paralelo simple completo.

---

## Regla

```text
El motor no se modifica.

Solo cambian los datos.
```

---

## Puerta de salida

Tres nuevas averías.

Sin tocar código del motor.

---

# Sprint 8 — Remanso Definitivo

## Objetivo

Construir el mundo.

## Incluye

### Cámara

### Remanso

Aproximadamente:

```text
96 x 64 tiles
```

### Interiores

- Cocina
- Taller
- Almacén
- Espacios comunes

### Puntos de interés

---

## Regla

```text
Remanso se diseña usando
lo aprendido en el Vertical Slice.

No antes.
```

---

## Puerta de salida

15 minutos de exploración continua.

Sin problemas de rendimiento.

---

# Sprint 9 — Expansión

## Objetivo

Ampliar el mundo.

## Incluye

### Bosque

### Cementerio de coches

### Nuevas averías

### Nuevos recursos narrativos

---

## Regla

Solo se ejecuta si:

```text
Sprint 6
+
Sprint 7
+
Sprint 8

han demostrado
que el núcleo funciona.
```

---

# Decisiones Congeladas

## Aprobadas

✅ Sprint 2 dividido en 2a y 2b.

✅ Dos topologías mínimas desde el inicio.

✅ Diagnóstico = bitácora.

✅ state.patch().

✅ Estado persistente en Sprint 3.

✅ Guardado real en Sprint 6.

✅ Cámara retrasada hasta Sprint 8.

✅ Remanso definitivo retrasado hasta Sprint 8.

✅ Expansión retrasada hasta Sprint 9.

✅ Hardware objetivo validado desde Sprint 2b.

✅ Cláusulas de fallo obligatorias en todas las puertas.

---

# Criterio Definitivo de Éxito

RENACER NO se considera validado cuando tenga:

```text
Mapa grande
NPCs
Misiones
Bosque
```

RENACER se considera validado cuando un jugador es capaz de:

```text
Observar
↓
Medir
↓
Diagnosticar
↓
Reparar
↓
Verificar
```

y desea repetir el proceso con una nueva avería.

Esa es la hipótesis central que el Roadmap de Producción 1.0 está diseñado para demostrar.