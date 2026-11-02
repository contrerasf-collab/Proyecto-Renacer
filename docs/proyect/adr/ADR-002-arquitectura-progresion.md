# ADR-002 — Arquitectura de progresión de RENACER

| Campo | Valor |
|---|---|
| **ID** | ADR-002 |
| **Título** | Arquitectura de progresión de RENACER |
| **Estado** | Congelado |
| **Fecha** | 2 de noviembre de 2026 |
| **Ámbito** | Pedagogía y progresión |
| **Autoridad** | Product Owner / Diseño pedagógico / Arquitectura del proyecto |
| **Sustituye** | — |
| **Relacionada con** | ADR-001 |

---

## 1. Contexto

ADR-001 estableció que la progresión de RENACER se organiza por sistemas, representaciones y autonomía diagnóstica, y que no se organiza por cantidad de averías.

Al preparar la Fase 2 de documentación, se detectó una ambigüedad: no estaba definido si los tres elementos tenían el mismo rango conceptual o si la autonomía cumplía una función distinta a la de los otros dos.

La práctica docente y el comportamiento observado del aprendizaje indican que la autonomía no define contenido, sino que regula cuánto apoyo recibe el alumno mientras trabaja sobre un sistema y una representación dados.

Esta ADR resuelve esa ambigüedad.

---

## 2. Problema que resuelve

Define si la autonomía diagnóstica es:

- un eje de progresión estructural equivalente a sistemas y representaciones, o
- un eje regulador transversal que modula la práctica sobre los dos ejes estructurales.

Resolver esta cuestión evita:

- sobrecarga cognitiva por crecimiento simultáneo;
- tratar la autonomía como contenido artificial;
- diseñar una progresión tridimensional confusa;
- no explicar por qué la autonomía desciende al introducir un sistema o representación nuevos.

---

## 3. Decisión

Se adopta el siguiente modelo:

```text
Ejes estructurales:
  1. Sistemas
  2. Representaciones

Eje regulador transversal:
  3. Autonomía diagnóstica
```

- **Sistemas** y **Representaciones** definen qué contenido trabaja RENACER.
- **Autonomía diagnóstica** no constituye un eje estructural equivalente. No define contenido.
- La autonomía modula ayudas, andamiaje, guía, carga cognitiva y decisiones delegadas al alumno.

---

## 4. Ejes estructurales

### 4.1. Sistemas

Eje estructural.

La complejidad de un sistema se describe mediante atributos, no mediante una etiqueta única:

- ramas;
- componentes;
- interdependencia;
- puntos de medida;
- modos de fallo.

### 4.2. Representaciones

Eje estructural.

Niveles aprobados:

1. **Simplificada.**
2. **Simbólica básica.**
3. **Técnica.**
4. **Documentación profesional.**

---

## 5. Eje regulador

### Autonomía diagnóstica

Eje regulador transversal.

Niveles aprobados:

- **Guiada.**
- **Semiautónoma.**
- **Autónoma.**
- **Transferencia.**

La autonomía es simultáneamente:

- una estrategia de andamiaje;
- una competencia observable.

No define contenido. Regula el grado de apoyo y de decisión delegada al alumno.

---

## 6. Regla de reinicio

Ante la introducción de:

- un sistema nuevo, o
- una representación nueva,

la autonomía diagnóstica **disminuye temporalmente** y posteriormente vuelve a aumentar.

---

## 7. Regla de no simultaneidad

No debe incrementarse la autonomía al mismo tiempo que se introduce un nuevo eje estructural de complejidad.

Si se introduce un sistema o una representación nuevos, la autonomía permanece contenida hasta que el alumno se estabiliza en ese nuevo contenido.

---

## 8. Justificación pedagógica

### 8.1. La autonomía es apoyo, no contenido

El profesor y el juego no enseñan “autonomía” como materia. Regulan cuánta ayuda proporcionan y cuántas decisiones delegan. La autonomía es una propiedad del andamiaje y de la competencia, no del sistema.

### 8.2. Zona de desarrollo próximo

El aprendizaje eficaz se produce cuando el alumno trabaja en el límite de lo que puede hacer con apoyo. La autonomía debe descender al entrar en un contenido nuevo y subir cuando el contenido se domina.

### 8.3. Carga cognitiva

Subir sistema, representación y autonomía a la vez produce sobrecarga. Mantener la autonomía contenida al introducir complejidad protege al alumno.

### 8.4. Dificultad deseable

La dificultad es deseable cuando el alumno tiene los conceptos y el apoyo adecuado. La autonomía regula ese equilibrio.

### 8.5. Competencia observable

La autonomía sigue siendo un objetivo y una evidencia de aprendizaje: el alumno es más autónomo cuando decide, planifica, interpreta y explica por sí mismo.

---

## 9. Consecuencias

### 9.1. Positivas

- Separación clara entre contenido y andamiaje.
- Explicación natural del reinicio de autonomía.
- Progresión planificable sin sobrecarga.
- Autonomía medible como competencia.
- Matriz de progresión más simple: sistema × representación.

### 9.2. Trade-offs aceptados

- La autonomía deja de aparecer como un tercer eje de contenido.
- Requiere una escala propia, separada de la taxonomía de sistemas y representaciones.
- Exige distinguir en todo momento “qué se trabaja” de “cuánto apoyo se da”.

---

## 10. Impacto documental

ADR-002 declara explícitamente que:

- **TAXONOMIA_SISTEMAS_Y_REPRESENTACIONES.md** dependerá de ADR-002 y clasificará solo sistemas y representaciones.
- **MAPA_CURRICULAR.md** deberá respetar ADR-002 y no tratará la autonomía como contenido.
- **PROGRESION_RENACER.md** deberá implementar ADR-002 como matriz de dos ejes estructurales con la autonomía como capa transversal.
- **Vision, GDD, TDD y Roadmap** no podrán contradecir ADR-002.

---

## 11. Relación con ADR-001

ADR-002 no modifica ADR-001. La aclara.

ADR-001 estableció que la progresión se organiza por sistemas, representaciones y autonomía. ADR-002 precisa el papel de cada elemento:

- sistemas y representaciones, como ejes estructurales;
- autonomía, como eje regulador transversal.

En caso de conflicto, ADR-001 prevalece como norma superior.

---

## 12. Gobernanza

- ADR-002 está congelada.
- Solo puede modificarse mediante una ADR posterior aceptada.
- No se reabre por conveniencia de alcance ni por dificultad de implementación.
- Su revisión solo procede por evidencia pedagógica sólida o por cambio curricular.
- Toda ADR futura sobre progresión debe citarla y no contradecirla.

---

## 13. Criterios derivados para Fase 2

Antes de redactar los documentos de Fase 2, deben cumplirse estos criterios:

1. Los ejes estructurales son únicamente **Sistemas** y **Representaciones**.
2. La **Autonomía diagnóstica** es un eje regulador transversal, no estructural.
3. La complejidad de un sistema se describe por perfil de atributos, no por etiqueta única.
4. Los niveles de representación son: simplificada, simbólica básica, técnica y documentación profesional.
5. Los niveles de autonomía son: guiada, semiautónoma, autónoma y transferencia.
6. Se aplica la regla de reinicio ante contenido nuevo.
7. Se aplica la regla de no simultaneidad.
8. Ningún documento de Fase 2 puede reintroducir la autonomía como contenido.

---

## 14. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-02 | Creación y congelación de la arquitectura de progresión | Congelado |
