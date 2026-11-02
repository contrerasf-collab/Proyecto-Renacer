# ADR-001 — Arquitectura pedagógica de RENACER

| Campo | Valor |
|---|---|
| **ID** | ADR-001 |
| **Título** | Arquitectura pedagógica de RENACER |
| **Estado** | Congelado |
| **Fecha** | 2 de noviembre de 2026 |
| **Ámbito** | Pedagogía, alcance, progresión y gobernanza |
| **Autoridad** | Product Owner / Diseño pedagógico / Arquitectura del proyecto |
| **Sustituye** | — |
| **Relacionada con** | Cierre de Sprint 3, Q5, revisión curricular del módulo |

---

## 1. Contexto

Sprint 3 ha demostrado que el bucle

```text
observar → medir → diagnosticar → registrar → reparar → verificar → resolver
```

es funcional y evaluable. RENACER puede sostener práctica diagnóstica sobre sistemas eléctricos simples.

Sin embargo, la revisión del módulo de Sistemas de Carga y Arranque deja claro que:

- el módulo tiene **196 horas** y **9 unidades de trabajo**;
- el profesor desarrolla simbología, leyes, circuitos, medida, esquemas, baterías, carga y arranque a lo largo del curso;
- el taller es el entorno principal de desmontaje, montaje, manipulación física y procedimientos reales;
- la evaluación sumativa corresponde al profesor y al módulo;
- RENACER no puede reproducir todo ese ecosistema;
- intentar cubrirlo todo produciría duplicación, inflación de alcance y pérdida de identidad.

La conclusión es que RENACER no debe definirse por lo que el módulo ya hace mejor, sino por aquello que la simulación aporta de forma diferencial: repetición, seguridad, visualización, interpretación de medidas, relación esquema-sistema y diagnóstico.

Esta ADR convierte esa conclusión en decisión formal.

---

## 2. Decisión

Se adopta el siguiente principio rector:

> **RENACER es una herramienta educativa de práctica deliberada, transferencia y diagnóstico que conecta los conceptos y representaciones del aula con las situaciones reales de taller, sin sustituir la enseñanza del profesor, la práctica física ni la evaluación.**

RENACER se define como **complemento integrado del módulo**, no como curso autónomo, no como módulo digital completo y no como sustituto del taller.

### 2.1. Pilares de RENACER

RENACER se articula alrededor de cuatro pilares complementarios de representación y razonamiento:

1. **Sistema físico**
2. **Esquema eléctrico**
3. **Medidas**
4. **Diagnóstico**

---

## 3. Decisiones aceptadas

| # | Decisión | Precisión |
|---|---|---|
| 1 | RENACER no es un sustituto del profesor. | El profesor conserva secuencia, explicación, acompañamiento y evaluación. |
| 2 | RENACER no es una versión digital completa del módulo. | No cubre las 196 horas ni todas las unidades. Es una herramienta focalizada. |
| 3 | RENACER no intenta cubrir todos los procesos de aprendizaje. | No sustituye teoría, taller, evaluación ni práctica física. |
| 4 | RENACER funciona como herramienta de práctica deliberada, transferencia y diagnóstico. | Es su valor central, no un efecto secundario. |
| 5 | El currículo y la programación didáctica son la referencia principal para la progresión. | Son referencia principal de progresión y prerrequisitos; no la única fuente de decisiones de interacción. |
| 6 | La progresión futura se organiza por sistemas, representaciones y autonomía diagnóstica, no por cantidad de averías. | Las averías son variación de contenido, no unidad de progresión. |
| 7 | El esquema eléctrico es una representación profesional y curricular permanente. No es una ayuda opcional. | El profesor hace la primera exposición; el juego practica su uso. El esquema es nominal, no oráculo. |
| 8 | La narrativa contextualiza la experiencia. No sustituye la lógica técnica. | La lógica eléctrica es invariante. Puede haber doble nomenclatura, no reglas narrativas. La narrativa puede aportar motivación, continuidad, identidad y significado a la experiencia; no determina la lógica técnica ni sustituye las competencias profesionales. |
| 9 | El taller sigue siendo el entorno principal para desmontaje, montaje, manipulación física y procedimientos reales. | RENACER no reproduce esos procesos de forma exhaustiva como núcleo. |
| 10 | RENACER se centra en donde la simulación aporta ventaja clara: diagnóstico, interpretación, visualización, repetición, transferencia y práctica segura. | Es una prioridad de foco, no una exclusión de contenido de soporte. |

---

## 4. Decisiones e interpretaciones rechazadas

Ninguna de las diez decisiones anteriores se rechaza.

Se rechazan expresamente las siguientes interpretaciones:

- RENACER sustituye al profesor.
- RENACER es el módulo digital completo.
- RENACER debe cubrir todos los RA y CE por sí solo.
- La progresión se mide por número de averías.
- El esquema es una ayuda opcional o una pista.
- La narrativa puede alterar la lógica eléctrica.
- La simulación debe reproducir desmontaje, montaje y procedimientos manuales como núcleo.
- El juego certifica o sustituye la evaluación del módulo.
- El éxito se mide por completar contenido o por engagement.
- RENACER debe ser autosuficiente y enseñar desde cero.
- Si una competencia se aprende mejor en taller, no puede aparecer en RENACER.
- Si el profesor ya lo enseña, el juego no debe representarlo.

---

## 5. Complementariedad Flexible

> **Principio de complementariedad flexible (sustituir vs complementar)**
>
> RENACER no sustituye al profesor, al taller ni a la evaluación. RENACER puede complementarlos.
>
> La existencia de una actividad equivalente en el aula o en el taller **no excluye por sí sola** su representación parcial en RENACER. Es aceptable cuando la simulación aporta un valor educativo adicional, como:
>
> - visualización de lo invisible;
> - preparación previa;
> - consolidación posterior;
> - repetición deliberada;
> - transferencia;
> - comprensión funcional;
> - comprensión de secuencias y procesos;
> - conexión entre sistema físico, esquema y medida.
>
> Queda fuera de alcance:
>
> 1. la reproducción exhaustiva de procedimientos físicos cuya principal fuente de valor sea la manipulación real (desmontaje, montaje, uso de herramientas, trabajo sobre componentes físicos);
> 2. la sustitución del profesor, del taller o de la evaluación como fuente primaria de aprendizaje o de certificación.

---

## 6. Sustituir vs Complementar

### 6.1. Sustituir el taller

Convertir la simulación en la fuente primaria o equivalente de la práctica física, o reproducir de forma exhaustiva un procedimiento cuyo valor principal es manual.

**Fuera de alcance.**

### 6.2. Complementar el taller

Preparar, consolidar, visualizar, conectar o transferir antes, durante o después de la práctica física, sin reclamar equivalencia con ella.

**Dentro de alcance, si aporta valor adicional.**

---

## 7. Test de valor educativo adicional

Toda representación parcial de contenido propio del taller debe responder afirmativamente a:

> **“¿Qué aporta aquí la simulación que el taller no puede ofrecer con la misma repetición, seguridad, control o claridad?”**

Si la respuesta es negativa, la idea no entra en RENACER.

---

## 8. Justificación

### 8.1. El módulo ya cubre lo que el juego no debe duplicar

El currículo y el taller ya ofrecen explicación teórica, simbología, leyes eléctricas, prácticas reales, desmontaje y montaje, manejo de herramientas, seguridad y evaluación sumativa. RENACER no aporta valor compitiendo en esas áreas.

### 8.2. La simulación tiene una ventaja comparativa clara

La simulación destaca en repetición sin coste material, error sin riesgo, variación controlada, visualización de lo invisible, conexión esquema-sistema-medida, diagnóstico guiado, feedback inmediato y experimentación segura.

No destaca en tacto, fuerza, manipulación física, desmontaje real, ruido, vibración, trabajo en equipo o seguridad real.

### 8.3. El currículo es la autoridad de progresión

La programación didáctica define qué se enseña, en qué orden, con qué prerrequisitos y con qué criterios de evaluación. RENACER no puede sustituir esa autoridad; debe alinearse con ella para que el aprendizaje sea transferible.

### 8.4. La progresión debe ser de competencia, no de contenido

Añadir averías no enseña a diagnosticar mejor. Añadir sistemas, representaciones y autonomía sí.

### 8.5. El esquema y la narrativa necesitan un lugar preciso

El esquema es la representación que conecta teoría, sistema físico y medida. La narrativa es el contexto que da sentido a la práctica. Ninguna de las dos puede reemplazar a la otra ni a la evidencia.

### 8.6. Sin esta decisión, el alcance se descontrola

Sin un principio de complementariedad, cualquier idea futura podría justificarse como “necesaria para que el juego sea completo”. Esta ADR establece el límite.

---

## 9. Consecuencias

### 9.1. Positivas

- Identidad clara: herramienta de práctica, no curso.
- Alcance controlado.
- Mayor coherencia curricular.
- Menos duplicación.
- Mejor adopción por parte del profesor.
- Progresión basada en competencia.
- Esquema y narrativa con papel definido.
- Métricas de éxito más significativas.

### 9.2. Trade-offs aceptados

- RENACER no será autosuficiente.
- No cubrirá todos los RA y CE.
- Dependerá del profesor y de la secuencia del módulo.
- Podrá percibirse como opcional si no se integra bien.
- No sustituirá la práctica física.
- No certificará el aprendizaje.
- No podrá simular todos los procesos del taller.
- Requerirá claridad de prerrequisitos y alineación con la notación del aula.

Estos trade-offs se aceptan como parte de la decisión.

---

## 10. Gobernanza

- ADR-001 es normativa y prevalece sobre Vision, GDD, TDD y Roadmap en materia pedagógica y de alcance.
- Solo puede modificarse mediante una ADR posterior aceptada.
- No se reabre por conveniencia de alcance ni por dificultad de implementación.
- La revisión solo procede por cambio curricular o evidencia sólida de playtest.
- Toda ADR futura debe citarla y no contradecirla.
- Ningún documento futuro —Vision, GDD, TDD o Roadmap— puede organizar la progresión por cantidad de averías. Las averías son variación de contenido, no unidad de progresión.

---

## 11. Criterios derivados para decisiones futuras

Una idea futura solo entra en RENACER si cumple:

1. **Valor de práctica:** mejora la práctica, la transferencia o el diagnóstico.
2. **Ventaja de simulación:** aprovecha repetición, seguridad, visualización o interpretación.
3. **No sustitución:** no sustituye al profesor, al taller ni a la evaluación.
4. **Alineación curricular:** trabaja competencias del módulo y respeta prerrequisitos.
5. **Agencia del alumno:** el alumno mide, interpreta y decide; el juego no da la respuesta.
6. **Esquema como herramienta:** la representación sigue siendo nominal y no revela la avería.
7. **Narrativa como contexto:** no altera la lógica técnica ni crea un currículo paralelo.
8. **Evaluación formativa:** no certifica ni sustituye al profesor.
9. **Transferencia:** el aprendizaje se puede aplicar a otro sistema.
10. **Sostenibilidad:** encaja en el tiempo, el currículo y la heterogeneidad del aula.

---

## 12. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-02 | Creación y aceptación de la arquitectura pedagógica | Congelado |
| 1.1 | 2026-11-02 | Incorporación de pilares, narrativa ampliada y regla de progresión | Congelado |
