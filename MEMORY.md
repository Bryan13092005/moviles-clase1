# MEMORY.md - Calculadora de Supletorio
Estado del trabajo entre sesiones. Maximo ~50 lineas.

## Estado actual
- La HU-001 quedó implementada en lo que toca a lógica, persistencia y flujo de
  listado/formulario: validación, normalización, conversión a centésimas,
  detección de duplicados y almacenamiento local están funcionando con pruebas
  Jest en `src/features/materias/*.test.ts`.
- La pantalla inicial de la app se reemplazó por la lista de materias con
  formulario para registrar una materia y mostrar el estado "Pendiente" cuando
  el segundo bimestre aún no existe.

## Proximos pasos
- Validar manualmente en Expo Go los puntos de `rn-conventions` (vertical/giro,
  teclado, accesibilidad, textos sin depender del color y persistencia al
  cerrar/reabrir la app) antes de cerrar la historia formalmente.