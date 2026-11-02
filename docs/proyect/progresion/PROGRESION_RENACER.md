# PROGRESIÓN DE RENACER

| Campo | Valor |
|---|---|
| **Título** | Progresión de RENACER |
| **Estado** | Normativo |
| **Fecha** | 3 de noviembre de 2026 |
| **Ámbito** | Progresión y diseño |
| **Autoridad** | Arquitectura documental / Diseño pedagógico |
| **Depende de** | ADR-001, ADR-002, PRINCIPIOS_RECTORES, MARCO_PEDAGOGICO, TAXONOMIA_SISTEMAS_Y_REPRESENTACIONES, MAPA_CURRICULAR |

---

## 1. Propósito

Este documento responde a la pregunta:

> **“¿Cómo crece RENACER?”**

Define cómo se organiza la evolución del proyecto en términos de sistemas, representaciones y autonomía diagnóstica.

No es un roadmap. No define contenido. No define sistemas concretos.

---

## 2. Relación con ADR-001

ADR-001 establece que la progresión se organiza por sistemas, representaciones y autonomía, y no por cantidad de averías. Este documento desarrolla esa decisión.

---

## 3. Relación con ADR-002

ADR-002 precisa que:

- **Sistemas** y **Representaciones** son ejes estructurales;
- **Autonomía diagnóstica** es un eje regulador transversal.

Este documento implementa ese modelo.

---

## 4. Ejes estructurales

### 4.1. Sistemas

Eje estructural. Define qué contenido se trabaja.

La complejidad de un sistema se describe mediante el perfil de atributos definido en la taxonomía.

### 4.2. Representaciones

Eje estructural. Define cómo se muestra el contenido.

Los niveles son: simplificada, simbólica básica, técnica y documentación profesional.

Aplica a las tres representaciones: sistema físico, esquema eléctrico y medidas.

---

## 5. Eje regulador transversal

### Autonomía diagnóstica

No define contenido. Regula ayudas, andamiaje, guía, carga cognitiva y decisiones delegadas.

Niveles: guiada, semiautónoma, autónoma y transferencia.

Es, a la vez, una estrategia de apoyo y una competencia observable.

---

## 6. Definición oficial de progresión

RENACER crece cuando el alumno es capaz de:

- trabajar con sistemas de mayor complejidad;
- usar representaciones más ricas;
- actuar con mayor autonomía.

La progresión se planifica mediante una **matriz de dos ejes estructurales** —sistema y representación— sobre la que se aplica la autonomía como capa reguladora.

---

## 7. Regla de reinicio

Ante la introducción de un sistema nuevo o de una representación nueva, la autonomía diagnóstica **disminuye temporalmente** y después vuelve a aumentar.

---

## 8. Regla de no simultaneidad

No debe incrementarse la autonomía al mismo tiempo que se introduce un nuevo eje estructural de complejidad.

Los ejes estructurales pueden crecer juntos. La autonomía se mantiene contenida hasta que el alumno se estabiliza en el nuevo contenido.

---

## 9. Matriz conceptual

```text
Sistema (perfil de complejidad)
        ×
Representación (nivel 1–4)
        +
Autonomía (capa reguladora transversal)
```

- **Sistema × Representación** define el contenido.
- **Autonomía** define cuánto apoyo recibe el alumno sobre ese contenido.

---

## 10. Zonas de aprendizaje

Son combinaciones en las que el contenido es nuevo para el alumno.

Características:

- sistema nuevo o representación nueva;
- autonomía reducida;
- apoyo y andamiaje presentes;
- objetivo: estabilizar la comprensión.

---

## 11. Zonas de dominio

Son combinaciones en las que el alumno ya domina el contenido.

Características:

- sistema y representación conocidos;
- autonomía alta;
- menor andamiaje;
- objetivo: consolidar y transferir.

---

## 12. Zonas de sobrecarga

Son combinaciones que deben evitarse.

Características:

- sistema nuevo;
- representación nueva;
- autonomía alta al mismo tiempo.

La regla de no simultaneidad existe para impedir estas zonas.

---

## 13. Relación con RA y CE

La progresión de RENACER debe poder trazarse a los resultados de aprendizaje y criterios de evaluación del currículo, tal como los define MAPA_CURRICULAR.

Ningún avance de progresión es válido si no se puede relacionar con la competencia curricular que pretende ejercitar.

---

## 14. Relación con Vision, GDD, TDD y Roadmap

- **Vision:** debe respetar esta progresión.
- **GDD:** debe diseñar la experiencia dentro de estos ejes.
- **TDD:** debe modelar sistemas y representaciones según la taxonomía.
- **Roadmap:** debe ordenar la producción siguiendo esta progresión, sin convertirla en una lista de averías.

Ninguno de los cuatro puede contradecir este documento.

---

## 15. Gobernanza

- Este documento es normativo.
- Solo puede modificarse mediante ADR aceptada.
- No se modifica por conveniencia de contenido ni por dificultad de implementación.
- Es la referencia de progresión para toda la documentación posterior.

---

## 16. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-03 | Creación de la arquitectura de progresión | Normativo |
