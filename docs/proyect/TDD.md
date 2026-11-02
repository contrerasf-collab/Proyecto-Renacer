# TDD — DOCUMENTO DE DISEÑO TÉCNICO

| Campo | Valor |
|---|---|
| **Título** | TDD — Documento de diseño técnico de RENACER |
| **Estado** | Normativo |
| **Fecha** | 3 de noviembre de 2026 |
| **Ámbito** | Diseño técnico |
| **Depende de** | ADR-001, ADR-002, PRINCIPIOS_RECTORES, Vision v3, GDD |

---

## 1. Propósito

Este documento describe la arquitectura técnica que sostiene la experiencia de RENACER.

No define contenido curricular ni roadmap. Define el modelo, la representación, la medición y los límites técnicos.

---

## 2. Arquitectura de contenido y estado

- El contenido es inmutable y vive en datos (JSON).
- El estado es mutable y vive separado del contenido.
- El estado se modifica únicamente mediante `actions` y `state.patch`.
- Separación estricta entre contenido, estado y presentación.

---

## 3. Motor eléctrico stateless

- El motor es stateless.
- Recibe la vista completa del estado en cada llamada.
- No guarda caché ni estado interno.
- Una misma instancia puede evaluar vistas distintas sin efectos colaterales.

---

## 4. Modelo de sistema

Un sistema se compone de:

- componentes;
- bornes;
- conexiones;
- referencia;
- estado.

Cada componente tiene tipo, propiedades inmutables y bornes.

---

## 5. Representación esquemática

La representación esquemática es una entidad de primer nivel del modelo.

- El esquema representa el sistema nominal: sin estado, sin avería, sin valores esperados.
- Debe existir correspondencia entre el esquema y el sistema físico.
- El esquema no decide el diagnóstico; orienta la medición.

El modelo debe poder asociar cada componente y cada borne a su representación en el esquema.

---

## 6. Medición y contrato

La medición devuelve un resultado explícito:

- válido con valor;
- inválido con razón.

Razones posibles:

- sistema inexistente;
- componente inexistente;
- nodo inexistente;
- sin referencia;
- medición imposible;
- estado incompleto.

La presentación muestra el resultado; no interpreta el error.

---

## 7. Taxonomía de averías subordinada

Las averías son variación de contenido, no unidad de progresión.

La taxonomía de averías es un modelo de datos, no una progresión:

- componente averiado;
- conexión defectuosa;
- valor incorrecto;
- componente incorrecto;
- fallo intermitente;
- fallos simultáneos.

Las averías se introducen como datos, no como código específico.

---

## 8. Compatibilidad futura

El motor debe poder representar sin refactor estructural:

- averías múltiples;
- averías intermitentes;
- componentes incorrectos;
- topologías con múltiples ramas.

El motor puede crecer. No se reescribe para soportar contenido ordinario.

---

## 9. Escenas, input y HUD

- Escenas de exploración.
- Input unificado para teclado y táctil.
- HUD con foco, polímetro, bitácora, ayuda y finalización.
- Separación entre lógica de dominio y presentación.

La presentación no decide el significado de los resultados.

---

## 10. Build y tooling

- Módulos ES.
- Build single-file.
- Validación de contenido JSON.
- Tests unitarios.
- Herramientas de diagnóstico de circuito.

---

## 11. Límites técnicos de alcance

El sistema no debe modelar:

- procedimientos manuales exhaustivos;
- desmontaje y montaje como simulación física;
- certificación o calificación;
- inventario, crafting o economía, salvo que sirvan a la práctica diagnóstica.

La fidelidad prioritaria es eléctrica y funcional. La fidelidad manual no es núcleo.

---

## 12. Pruebas y validación

Cada iteración debe validar:

- tests;
- validate;
- build;
- coherencia entre sistema físico, esquema y medidas;
- ausencia de progresión por cantidad de averías.

---

## 13. Relación con GDD y Roadmap

- El GDD describe la experiencia; el TDD describe el soporte técnico.
- El Roadmap ordena la producción siguiendo PROGRESION_RENACER.
- Ninguno puede contradecir ADR-001, ADR-002 ni la documentación normativa.

---

## 14. Gobernanza

- Este documento es normativo.
- Solo puede modificarse mediante ADR aceptada.
- No se modifica por conveniencia de contenido ni por dificultad de implementación.

---

## 15. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-03 | Creación del TDD alineado con la base normativa | Normativo |
