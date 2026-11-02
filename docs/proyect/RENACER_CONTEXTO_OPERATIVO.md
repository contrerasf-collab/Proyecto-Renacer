# RENACER — CONTEXTO OPERATIVO

**Uso:** abrir nueva sesión DSH con workspace `Proyecto Renacer 2.B/renacer`.
**Fecha de referencia:** 3 de noviembre de 2026, tras el cierre de Fase 4 documental.
**Árbol canónico:** `Proyecto Renacer 2.B/renacer`.

---

## 1. Estado actual del proyecto

| Hito | Estado |
|---|---|
| Sprint 1 | Cerrado |
| Sprint 2A | Cerrado |
| Sprint 2B | Cerrado |
| Sprint 3 | Cerrado |
| Fase documental 1 — Fundamentos | Cerrada |
| Fase documental 2 — Progresión | Cerrada |
| Fase documental 3 — Producto | Cerrada |
| Fase documental 4 — Consolidación | En curso |

---

## 2. Baseline y commits relevantes

- `a13ccac` — baseline Sprint 2B.
- `83635a0` — UX Pass post Sprint 2B.
- `2ec2f2d` — cierre de ayuda al abrir bitácora.
- `f7f81ab` — orientación contra pared.
- `34eb877` — sincronización del contexto operativo.
- `6e176a3` — contenido de Sprint 3.
- `3cc4021` — estado y variante de Sprint 3.
- `af4a945` — dominio D1-D6.
- `2b7b1fb` — UX U1-U7.
- `8d7293f` — corrección QA-01 y QA-02.

---

## 3. Validación técnica

- Tests: **83/83**.
- `npm run validate`: OK.
- `npm run build`: OK.
- `dist/`: artefacto generado, no versionado.

---

## 4. Decisiones congeladas

- ADR-001 — Arquitectura pedagógica. **Congelada.**
- ADR-002 — Arquitectura de progresión. **Congelada.**
- PRINCIPIOS_RECTORES. **Congelado.**
- Motor eléctrico stateless.
- Contenido inmutable / estado mutable separados.
- Bitácora registra, no valida.
- Averías data-driven, no progresión.
- Esquema como representación permanente.

---

## 5. Documentación maestra

```text
docs/proyect/
├── adr/            ADR-INDEX, ADR-001, ADR-002
├── fundamentos/    PRINCIPIOS_RECTORES, MARCO_PEDAGOGICO
├── curriculo/      MAPA_CURRICULAR
├── progresion/     TAXONOMIA, PROGRESION_RENACER
├── RENACER_VISION_UNIFICADA_v3.md
├── GDD.md
├── TDD.md
├── ROADMAP_FINAL.md
└── RENACER_CONTEXTO_OPERATIVO.md
```

Documentación técnica heredada que se mantiene como referencia:

- `docs/ELECTRICAL_RULES.md`
- `docs/MODEL_FUTURE_COMPAT.md`

`RENACER_VISION_UNIFICADA_v2.0` queda como histórico.

---

## 6. Estado de playtest

- Q5 interno: completado.
- Playtest externo: pendiente.

---

## 7. Próximo trabajo

1. Consolidar y versionar la documentación de Fase 4.
2. Reanudar el desarrollo gobernado por ROADMAP_FINAL y la documentación normativa.
3. Ejecutar el playtest externo cuando el roadmap lo indique.

---

## 8. Normas de trabajo

- Git obligatorio; commits claros.
- `test + validate + build` verdes antes de cerrar una iteración.
- Bundle solo en hitos/entregas.
- No reabrir decisiones congeladas sin ADR.
- No commitear `node_modules/` ni `dist/`.
- No duplicar documentación maestra fuera de `docs/proyect/`.

---

## 9. Reproducibilidad

Clean checkout + `npm install` + `npm run test` + `npm run validate` + `npm run build`.
