# MODEL_FUTURE_COMPAT — Verificación conceptual de compatibilidad futura

Ejercicio obligatorio (Adenda C10, §3.12 de Sprint 2a) antes de cerrar el sprint. Verifica
sobre papel que el modelo admite los cuatro escenarios futuros **sin refactor estructural**.

> Regla congelada (Adenda C13): el motor puede crecer; el motor no puede reescribirse para
> soportar contenido ordinario. Las averías nuevas se introducen como **datos**, no como
> código específico.

---

## 1. Averías múltiples (dos o más componentes rotos a la vez)

- El estado es un mapa `{ [componentId]: { roto, ... } }`: admite **N** componentes con
  `roto: true` sin cambiar el schema.
- El motor recibe la vista completa `estadoComponentes` y no conoce la avería; por tanto no
  le importa si hay una o varias. `calcularEstado` propaga por BFS y cada componente
  averiado interrumpe la conductividad en su tramo de forma independiente.
- **Conclusión:** representable sin refactor. ✔

## 2. Averías intermitentes (conduce a veces sí, a veces no)

- El estado es un objeto extensible por componente: se pueden añadir campos
  `intermitente: true` y `probabilidad` que el motor de Sprint 2a **ignora**.
- El consumidor (Sprint 7) puede re-evaluar `conduce` entre ticks y volver a llamar a
  `medirContinuidad`/`calcularEstado` con la vista actualizada. Al ser el motor stateless,
  no hay caché que invalidar.
- **Conclusión:** representable sin refactor. ✔

## 3. Componentes incorrectos (un interruptor NA donde debería ser NC)

- El estado admite un campo `tipoEfectivo` distinto del `tipo` del contenido. El motor sigue
  leyendo `tipo` del contenido y el estado por componente; la lógica de "tipo efectivo" se
  expresa como datos de estado, no como código nuevo.
- La propagación depende de `posicion` y `conduce` (estado), no del `tipo` del contenido, así
  que un "NA montado como NC" es solo un cambio de datos de estado.
- **Conclusión:** representable sin refactor. ✔

## 4. Topologías paralelas completas (N ramas con caminos independientes)

- La Topología 2 ya valida el BFS con dos ramas en paralelo que comparten nodos. El BFS
  recorre conexiones y componentes por índice, no por casos fijos.
- Añadir una rama es añadir una `carga` y dos `conexiones` (mismo tipo, misma estructura).
  Por inducción, N ramas escalan sin tocar el motor.
- **Conclusión:** representable sin refactor. ✔

---

## Resultado

Los cuatro escenarios se representan con el modelo de Sprint 2a sin refactor estructural.
No se requiere modificar el schema antes de cerrar Sprint 2a.
