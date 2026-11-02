# ADR-INDEX — Registro de Decisiones Arquitectónicas

| Campo | Valor |
|---|---|
| **Título** | Registro de ADRs |
| **Estado** | Normativo (vivo) |
| **Fecha** | 2 de noviembre de 2026 |
| **Ámbito** | Gobernanza |
| **Ubicación** | `docs/proyect/adr/ADR-INDEX.md` |

---

## 1. Propósito

Este registro centraliza todas las decisiones arquitectónicas del proyecto. Resuelve:

- dónde se registra una decisión;
- qué estado tiene;
- cómo se aprueba;
- cómo se resuelve un conflicto;
- cómo se evita decidir dos veces lo mismo.

No decide producto. Decide cómo se deciden las cosas.

---

## 2. Estados

| Estado | Significado |
|---|---|
| **Propuesta** | Idea de decisión, aún sin redactar. |
| **Borrador** | Redactada, no revisada. |
| **Revisión** | En discusión con las partes implicadas. |
| **Normativo** | Aceptada y vinculante. |
| **Congelado** | Aceptada y estable; solo modificable por otra ADR. |
| **Retirado** | Rechazada o reemplazada; queda como histórico. |
| **Superado** | Sustituida por una ADR posterior; queda como histórico. |

---

## 3. Flujo de aprobación

```text
Propuesta → Borrador → Revisión → Normativo → Congelado
                                  ↘
                                Retirado
```

Reglas:

- Una ADR solo se marca **Normativo** tras revisión con el responsable de ámbito.
- Una ADR se marca **Congelado** cuando la decisión es estable y no debe reabrirse sin causa mayor.
- Una ADR **Superada** debe indicar qué ADR la sustituye.
- No existe avance automático de estado.

---

## 4. Autoridad

- La ADR aceptada más reciente prevalece sobre las anteriores en su mismo ámbito.
- ADR-001 tiene prioridad en materia pedagógica y de alcance.
- Ningún documento de sprint, GDD, TDD o Roadmap puede contradecir una ADR normativa o congelada.
- Un conflicto entre ADRs se resuelve citando explícitamente la ADR que prevalece.

---

## 5. Plantilla para futuras ADR

Toda ADR nueva debe incluir:

1. **Metadatos:** ID, título, estado, fecha, ámbito, autoridad, sustituye, relacionada con.
2. **Contexto:** qué problema resuelve y por qué aparece ahora.
3. **Decisión:** enunciado claro y sin ambigüedad.
4. **Justificación:** por qué se toma y qué evidencia la sostiene.
5. **Consecuencias:** positivas, negativas y trade-offs aceptados.
6. **Gobernanza:** quién puede modificarla, cuándo se revisa y qué prevalece en caso de conflicto.
7. **Criterios derivados:** filtros que deben usarse en decisiones futuras.

---

## 6. Ámbitos admitidos

| Ámbito | Tipo de decisión |
|---|---|
| **Pedagógico** | Aprendizaje, progresión, roles educativos. |
| **Diseño** | Experiencia, identidad, alcance de producto. |
| **Técnico** | Arquitectura de código, datos, límites técnicos. |
| **Gobernanza** | Proceso de decisión y documentación. |

---

## 7. Tabla maestra de ADRs

| ID | Título | Estado | Fecha | Ámbito | Sustituye | Relacionada |
|---|---|---|---|---|---|---|
| ADR-001 | Arquitectura pedagógica de RENACER | Congelado | 2026-11-02 | Pedagógico | — | Sprint 3, Q5, revisión curricular |
| ADR-002 | Arquitectura de progresión de RENACER | Congelado | 2026-11-02 | Pedagógico | — | ADR-001 |

---

## 8. Mantenimiento

- Responsable: arquitectura documental / Product Owner.
- Cada nueva ADR se añade a la tabla maestra.
- Cada ADR retirada o superada se conserva en el histórico.
- La plantilla y las reglas de transición no se modifican sin una ADR de gobernanza.
