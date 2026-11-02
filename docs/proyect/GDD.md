# GDD — DOCUMENTO DE DISEÑO DE JUEGO

| Campo | Valor |
|---|---|
| **Título** | GDD — Documento de diseño de RENACER |
| **Estado** | Normativo |
| **Fecha** | 3 de noviembre de 2026 |
| **Ámbito** | Diseño de experiencia |
| **Depende de** | ADR-001, ADR-002, PRINCIPIOS_RECTORES, MARCO_PEDAGOGICO, Vision v3 |

---

## 1. Propósito

Este documento describe la experiencia de RENACER: cómo se juega, cómo se practica el diagnóstico y cómo se integra la herramienta en el proceso educativo.

No define contenido curricular. No define roadmap. Define la experiencia dentro de los límites normativos.

---

## 2. Alcance

Incluye:

- bucle de juego;
- herramientas;
- representaciones;
- narrativa y personajes;
- autonomía y andamiaje;
- UX;
- evidencia formativa;
- límites de alcance.

No incluye:

- arquitectura técnica (TDD);
- secuencia de producción (Roadmap);
- contenidos curriculares concretos (MAPA_CURRICULAR).

---

## 3. Bucle principal

```text
Necesidad humana
↓
Observar el sistema físico
↓
Consultar el esquema
↓
Medir
↓
Interpretar
↓
Diagnosticar
↓
Reparar
↓
Verificar
↓
Resolver
```

El esquema y las medidas acompañan todo el bucle. El diagnóstico es el razonamiento que conecta la evidencia.

---

## 4. Los pilares en la experiencia

| Pilar | Función en la experiencia |
|---|---|
| Sistema físico | El jugador localiza componentes y puntos. |
| Esquema eléctrico | El jugador comprende conexiones y función. |
| Medidas | El jugador obtiene evidencia. |
| Diagnóstico | El jugador decide la causa y repara. |

La experiencia debe mover al jugador entre los cuatro pilares sin que ninguno se convierta en decoración.

---

## 5. El polímetro

- Herramienta central.
- Modos de tensión y continuidad.
- Dos sondas: medición y referencia.
- La lectura informa; no decide.

El polímetro convierte la observación en evidencia.

---

## 6. El esquema

- Representación profesional y curricular.
- Esquema nominal: sin estado, sin avería, sin valores esperados.
- Permite planificar medidas y situar el sistema.
- El profesor introduce su lectura; el juego permite practicarla.

El esquema no es una pista. Es una representación.

---

## 7. La bitácora

- Registra hipótesis, reparaciones y mediciones.
- Solo cuenta la última hipótesis para la observación.
- No valida. No puntúa. No corrige.

Es memoria del aprendiz, no examen.

---

## 8. Reparación y verificación

- La reparación exige hipótesis registrada.
- La reparación se realiza sobre el componente, no sobre el punto de medida.
- La verificación es observable: el sistema vuelve a funcionar.
- El juego no muestra mensajes de “correcto” o “incorrecto”.

La reparación no es un botón de victoria. Es la consecuencia del razonamiento.

---

## 9. Narrativa y personajes

La narrativa contextualiza la práctica.

- El aprendiz no repara sistemas porque sí; los repara porque alguien los necesita.
- Cada encargo parte de una necesidad humana, no de una necesidad técnica.
- Los personajes actúan como contexto, no como explicación técnica.

Personajes del contexto:

- Ansel: mentor, no profesor.
- Elvira, Teresa, Anciano: comunidad de Remanso.

La lógica técnica no depende de los personajes.

---

## 10. Autonomía y andamiaje

La autonomía es un eje regulador transversal.

Niveles:

- Guiada.
- Semiautónoma.
- Autónoma.
- Transferencia.

El andamiaje se retira cuando el alumno se estabiliza. Ante un sistema o representación nuevos, la autonomía desciende y después vuelve a crecer.

---

## 11. Progresión en la experiencia

La experiencia crece según PROGRESION_RENACER:

- sistemas de mayor complejidad;
- representaciones más ricas;
- mayor autonomía.

No crece por cantidad de averías.

---

## 12. UX, HUD y controles

La interfaz debe ser estable y no añadir carga cognitiva.

Elementos existentes:

- banda de foco;
- polímetro;
- bitácora;
- ayuda;
- finalización de sesión.

Controles:

- mover, interactuar, medir, registrar, reparar, finalizar.

La interfaz no debe decidir por el alumno.

---

## 13. Contenido y modos de uso

El contenido se organiza según MAPA_CURRICULAR en modos:

- preparar;
- practicar;
- consolidar;
- transferir;
- fuera de alcance.

Los modos definen la relación del juego con la clase y el taller, no la dificultad.

---

## 14. Evidencia formativa

El juego puede registrar:

- tiempo hasta primera medición;
- tiempo hasta primer diagnóstico;
- última hipótesis;
- intentos de reparación;
- uso del esquema;
- aperturas de ayuda;
- interacción tras finalizar.

La interpretación y la calificación corresponden al profesor.

---

## 15. Límites de alcance

Quedan fuera:

- certificación y calificación;
- sustitución del taller;
- procedimientos manuales exhaustivos;
- inventario, crafting y economía, salvo que sirvan a la práctica;
- sistemas de combate, gestión o supervivencia;
- mecánicas que no refuercen el bucle de diagnóstico.

---

## 16. Gobernanza

- Este documento depende de Vision v3 y de la documentación normativa.
- No puede contradecir ADR-001, ADR-002 ni PROGRESION_RENACER.
- No puede organizar la progresión por cantidad de averías.
- Solo puede modificarse mediante ADR aceptada.

---

## 17. Historial de revisiones

| Versión | Fecha | Cambio | Estado |
|---|---|---|---|
| 1.0 | 2026-11-03 | Creación del GDD alineado con la base normativa | Normativo |
