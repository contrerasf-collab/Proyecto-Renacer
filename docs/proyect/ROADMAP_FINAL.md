# ROADMAP_FINAL — Hoja de ruta de RENACER

| Campo | Valor |
|---|---|
| **Título** | Roadmap final de RENACER |
| **Estado** | Normativo |
| **Fecha** | 3 de noviembre de 2026 |
| **Ámbito** | Producción y secuenciación |
| **Depende de** | ADR-001, ADR-002, PROGRESION_RENACER, MAPA_CURRICULAR, Vision v3, GDD, TDD |

---

## 1. Propósito

Este documento ordena la evolución de RENACER.

No organiza el desarrollo por cantidad de averías. Lo organiza por progresión:

- sistemas;
- representaciones;
- autonomía diagnóstica.

Es la referencia de secuenciación, no de contenido.

---

## 2. Relación con la normativa

- ADR-001: RENACER es herramienta integrada; el currículo es la referencia principal.
- ADR-002: dos ejes estructurales y autonomía como regulador.
- PROGRESION_RENACER: matriz sistema × representación con autonomía transversal.
- MAPA_CURRICULAR: qué puede trabajarse en RENACER.

Este roadmap no puede contradecir ninguno de ellos.

---

## 3. Estado actual

| Hito | Estado |
|---|---|
| Sprint 1 — Motor mínimo | Cerrado |
| Sprint 2A — Motor de medición | Cerrado |
| Sprint 2B — Medición jugable | Cerrado |
| Sprint 3 — Reparar y verificar | Cerrado |
| Fase documental 1 — Fundamentos | Cerrada |
| Fase documental 2 — Progresión | Cerrada |
| Fase documental 3 — Producto | Cerrada |
| Fase documental 4 — Consolidación | En curso |

---

## 4. Principios de secuenciación

1. La progresión se organiza por sistemas, representaciones y autonomía.
2. Las averías son variación de contenido, no unidad de progresión.
3. La autonomía es un regulador transversal.
4. Ante sistema o representación nuevos, la autonomía desciende y después crece.
5. No se sube autonomía a la vez que se introduce un eje estructural nuevo.
6. Toda fase se valida contra RA y CE.
7. Ninguna fase puede introducir una mecánica que contradiga el bucle de diagnóstico.

---

## 5. Fases futuras

Las fases futuras no se nombran por contenido. Se nombran por el tipo de progresión que producen.

### 5.1. Fase de representación

- **Objetivo:** elevar el nivel de representación sobre un sistema ya dominado.
- **Eje afectado:** representación.
- **Autonomía:** contenida al inicio; crece al estabilizarse.
- **Regla:** no se introduce un sistema nuevo.

### 5.2. Fase de sistema

- **Objetivo:** introducir un sistema de mayor complejidad.
- **Eje afectado:** sistema.
- **Representación:** la adecuada al nuevo perfil de complejidad.
- **Autonomía:** se reinicia y después crece.

### 5.3. Fase de autonomía

- **Objetivo:** elevar la autonomía sobre contenido ya dominado.
- **Eje afectado:** autonomía diagnóstica.
- **Regla:** no se introduce sistema ni representación nuevos.

### 5.4. Fase de transferencia

- **Objetivo:** aplicar el método a una situación o representación nuevas.
- **Ejes afectados:** los tres, con autonomía como evidencia.
- **Regla:** la transferencia valida el aprendizaje, no la cantidad de casos.

---

## 6. Puertas de validación

Toda fase debe cerrarse con una puerta que valide:

- que la competencia se puede observar;
- que se puede transferir;
- que respeta RA y CE;
- que no introduce progresión por averías;
- que la autonomía se ha regulado correctamente.

---

## 7. Métricas

Cada puerta registra:

- finalización del ciclo completo;
- interpretación de medidas;
- uso del esquema;
- planificación del diagnóstico;
- explicación de la causa;
- transferencia;
- tiempo;
- ayuda utilizada;
- evidencia formativa.

Ninguna puerta se mide por “número de averías resueltas”.

---

## 8. Criterios de éxito

Una fase se considera superada cuando el alumno:

- trabaja con el sistema y la representación previstos;
- actúa con la autonomía prevista;
- interpreta y explica;
- transfiere el método.

---

## 9. Reglas de no regresión

- No se puede reabrir la progresión por conveniencia de contenido.
- No se puede reorganizar el roadmap por cantidad de averías.
- No se puede eliminar el esquema como representación permanente.
- No se puede convertir la autonomía en contenido.
- No se puede sustituir al profesor, al taller ni a la evaluación.

---

## 10. Gobernanza

- Este documento es normativo.
- Solo puede modificarse mediante ADR aceptada.
- Se actualiza cuando cambia el currículo o la evidencia de playtest lo exige.

---

## 11. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-03 | Creación del roadmap alineado con la progresión | Normativo |
