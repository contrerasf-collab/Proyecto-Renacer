# TAXONOMÍA DE SISTEMAS Y REPRESENTACIONES

| Campo | Valor |
|---|---|
| **Título** | Taxonomía de sistemas y representaciones |
| **Estado** | Normativo |
| **Fecha** | 3 de noviembre de 2026 |
| **Ámbito** | Progresión y clasificación |
| **Autoridad** | Arquitectura documental / Diseño pedagógico |
| **Depende de** | ADR-001, ADR-002, PRINCIPIOS_RECTORES, MARCO_PEDAGOGICO |

---

## 1. Propósito

Este documento define el vocabulario oficial para clasificar los sistemas y las representaciones que puede utilizar RENACER.

Responde a la pregunta:

> **“¿Qué tipos de sistemas y representaciones puede utilizar RENACER?”**

Es la referencia de clasificación para:

- MAPA_CURRICULAR;
- PROGRESION_RENACER;
- Vision;
- GDD;
- TDD.

No define contenido. No define sistemas concretos. Define cómo se clasifican.

Distingue dos términos que no son sinónimos:

- **cuatro pilares:** el conjunto completo de representación y razonamiento;
- **tres representaciones:** sistema físico, esquema eléctrico y medidas.

---

## 2. Alcance

Este documento clasifica:

- sistemas;
- representaciones.

No clasifica:

- autonomía diagnóstica;
- averías;
- contenido curricular;
- mecánicas;
- dificultad subjetiva;
- roadmap;
- evaluación.

---

## 3. Autoridad documental

- **Nivel:** normativo-clasificatorio.
- **Subordinado a:** ADR-001 y ADR-002.
- **Depende de:** PRINCIPIOS_RECTORES y MARCO_PEDAGOGICO.
- **Referenciado por:** MAPA_CURRICULAR, PROGRESION_RENACER, Vision, GDD y TDD.

Este documento no decide contenido. Fija el lenguaje con el que se describirá el contenido.

---

## 4. Relación con ADR-001 y ADR-002

### Con ADR-001

ADR-001 establece que el esquema es una representación permanente y que la progresión se organiza por sistemas, representaciones y autonomía. Este documento desarrolla la parte clasificatoria de esa decisión.

### Con ADR-002

ADR-002 establece que:

- **Sistemas** es un eje estructural.
- **Representaciones** es un eje estructural.
- **Autonomía diagnóstica** es un eje regulador transversal.

Este documento implementa la clasificación de los dos ejes estructurales. La autonomía queda fuera de su alcance.

---

## 5. Definición de sistema

Un sistema es una unidad funcional formada por:

- componentes;
- conexiones;
- referencia;
- estado.

El alumno puede observarlo, medirlo y diagnosticarlo. Un sistema se representa, se mide y se razona; no es solo una lista de piezas.

Para RENACER, un sistema es cualquier unidad que permita sostener el bucle:

```text
observar → medir → diagnosticar → reparar → verificar
```

---

## 6. Dimensiones de complejidad de un sistema

La complejidad de un sistema no se describe con una etiqueta única. Se describe mediante un **perfil de atributos**.

| Dimensión | Qué evalúa |
|---|---|
| **Topología** | Número de ramas, caminos y recorridos posibles. |
| **Componentes** | Cantidad y variedad de componentes. |
| **Funciones** | Diversidad de funciones: fuente, conducción, control, carga. |
| **Separación funcional** | Existencia de circuitos de mando y de potencia, o de control y actuación. |
| **Interdependencia** | Dependencia entre componentes y efectos en cascada. |
| **Puntos de medida** | Cantidad, accesibilidad y ambigüedad de los puntos. |
| **Modos de fallo** | Número de formas distintas en que el sistema puede fallar. |
| **Visibilidad** | Grado en que las conexiones son visibles o deben inferirse. |
| **Seguridad** | Implicaciones de riesgo asociadas al sistema. |

Estas dimensiones son independientes del contenido. Sirven para comparar sistemas sin nombrarlos.

---

## 7. Método de clasificación de sistemas

Cada sistema se clasifica mediante un **perfil de complejidad**:

1. Se evalúa cada dimensión con un grado: **bajo**, **medio** o **alto**.
2. Se registra el perfil resultante.
3. El perfil, no una puntuación única, es la clasificación oficial.

Un sistema no recibe un número total. Recibe un perfil que permite decidir, de forma reproducible, si un sistema es más complejo que otro en una dimensión concreta.

---

## 8. Pilares y representaciones

RENACER trabaja con **cuatro pilares**:

1. **Sistema físico** — representación.
2. **Esquema eléctrico** — representación.
3. **Medidas** — representación.
4. **Diagnóstico** — pilar de razonamiento.

Por tanto:

- hay **tres representaciones**: sistema físico, esquema eléctrico y medidas;
- hay **un pilar de razonamiento**: el diagnóstico.

Los términos **“pilares”** y **“representaciones”** no deben utilizarse como sinónimos.

---

## 9. Niveles de representación

| Nivel | Definición |
|---|---|
| **1. Simplificada** | Representación reducida, icónica o por bloques. Muestra la estructura esencial sin detalle normativo. |
| **2. Simbólica básica** | Usa símbolos elementales normalizados y conexiones simples. Introduce convenciones básicas. |
| **3. Técnica** | Representación completa con símbolos, bornes, referencias y ramas. Permite planificar medidas y diagnosticar. |
| **4. Documentación profesional** | Representación de nivel técnico profesional: planos, tablas de bornes, leyendas y especificaciones. |

Los niveles son acumulativos: cada nivel añade detalle y exigencia sobre el anterior.

---

## 10. Aplicación a las tres representaciones

### 10.1. Sistema físico

La representación evoluciona desde una disposición reducida y visible hasta una disposición detallada, con cableado oculto, conexiones no evidentes y separación entre lo físico y lo lógico.

### 10.2. Esquema eléctrico

La representación evoluciona desde bloques funcionales hasta símbolos básicos, esquema técnico con bornes y referencias, y documentación profesional.

### 10.3. Medidas

La representación evoluciona desde una lectura única y evidente hasta la planificación de múltiples medidas, la elección de referencia, la comparación de valores y la interpretación contextual.

### 10.4. Diagnóstico

El diagnóstico es un pilar de razonamiento y no una representación.

No tiene un nivel de representación propio. Se apoya en las tres representaciones:

- cuanto más rica es la representación, más rico puede ser el razonamiento;
- cuanto más complejo es el sistema, más necesaria es una representación adecuada.

---

## 11. Reglas de clasificación

1. Todo sistema recibe un **perfil de complejidad**, no una etiqueta única.
2. Toda representación recibe un **nivel** de 1 a 4.
3. Un mismo sistema puede presentarse en varios niveles de representación.
4. La clasificación debe ser reproducible y no depender del contenido.
5. La autonomía no se clasifica en esta taxonomía.
6. Las averías no se clasifican en esta taxonomía.
7. Ningún nivel implica un sistema o contenido concreto.
8. Los términos “pilares” y “representaciones” no se usan como sinónimos.

---

## 12. Qué no clasifica esta taxonomía

- Autonomía diagnóstica.
- Averías.
- Contenido curricular.
- Sistemas concretos.
- Mecánicas de juego.
- Dificultad subjetiva.
- Roadmap.
- Evaluación.

---

## 13. Relación con la futura progresión

Esta taxonomía proporciona el vocabulario de los dos ejes estructurales:

- el **perfil de complejidad** del sistema;
- el **nivel de representación** de las tres representaciones: sistema físico, esquema eléctrico y medidas.

PROGRESION_RENACER usará ambos para definir cómo crece el proyecto. La autonomía, como eje regulador, se definirá fuera de esta taxonomía.

---

## 14. Gobernanza

- Este documento es normativo.
- Solo puede modificarse mediante una ADR aceptada.
- No se modifica por conveniencia de contenido ni por dificultad de implementación.
- MAPA_CURRICULAR, PROGRESION_RENACER, Vision, GDD y TDD deben respetar su vocabulario.

---

## 15. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-03 | Creación de la taxonomía de sistemas y representaciones | Normativo |
| 1.1 | 2026-11-03 | Corrección terminológica: cuatro pilares / tres representaciones | Normativo |
