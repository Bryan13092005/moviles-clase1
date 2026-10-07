# Tareas — HU-001: Registrar materia

- [x] **T1. Definir modelo y validación de campos (25 min).** RF-02, RF-03
  - Hecho cuando: `src/features/materias/domain.test.ts` cubre nombre/nota vacíos, punto frente a coma, precisión de hasta dos decimales y rango inclusivo; `npx jest src/features/materias/domain.test.ts` pasa.

- [x] **T2. Implementar normalización, conversión y duplicados (25 min).** RF-01, RF-03, RF-04, RF-06
  - Hecho cuando: las pruebas Jest verifican normalización de espacios, comparación sin distinguir mayúsculas, conversión a centésimas, formato de presentación de la nota y segundo bimestre `null`; `npx jest src/features/materias/domain.test.ts` pasa.

- [x] **T3. Implementar persistencia local y pruebas del adaptador (25 min).** RF-01, RF-05, RF-06, RF-07
  - Hecho cuando: las pruebas Jest con AsyncStorage simulado verifican lectura/escritura de la materia y el valor `null`, y que un fallo de escritura se propaga; `npx jest src/features/materias/storage.test.ts` pasa.

- [x] **T4. Construir la lista persistente de materias (25 min).** RF-01, RF-06, RF-07
  - Hecho cuando: al abrir la ruta inicial se cargan las materias guardadas, cada fila se identifica por el id y una materia con segundo bimestre `null` se muestra como pendiente; cotejar en Expo Go que los textos de estado se entiendan sin depender del color y que la lista se vea bien en vertical y al girar.

- [x] **T5. Construir formulario y presentación de validación (25 min).** RF-02, RF-03
  - Hecho cuando: los errores aparecen junto al campo, el texto ingresado se conserva y el teclado decimal no tapa el campo ni el botón; cotejar en Expo Go los puntos manuales de `rn-conventions`: vertical/giro, teclado y botón alcanzables con teclado abierto, separador ofrecido por el teléfono según la spec, objetivos táctiles/etiquetas accesibles y textos de estado legibles sin depender del color.

- [x] **T6. Integrar duplicados y guardado con manejo de fallos (25 min).** RF-01, RF-04, RF-05
  - Hecho cuando: un duplicado no se guarda y se advierte, un fallo de almacenamiento informa el error y permite reintentar sin limpiar el formulario, y un guardado exitoso retorna a la lista mostrando la nueva materia; cotejar estos caminos en Expo Go y comprobar que el teclado no tapa los controles y los mensajes de estado no dependen solo del color.

- [x] **T7. Verificar persistencia y flujo completo en Expo Go (25 min).** RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07
  - Hecho cuando: tras guardar una materia, cerrar la app por completo y volver a abrirla conserva nombre, nota del primer bimestre y estado pendiente del segundo; la lista manual de `rn-conventions` queda cotejada, incluidos vertical/giro, teclado, separador ofrecido por el teléfono y textos de estado comprensibles sin depender del color.

- [x] **T8. Ejecutar la suite completa y revisar trazabilidad (20 min).** RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07
  - Hecho cuando: `npx jest` termina sin pruebas fallidas y cada RF-01 a RF-07 tiene prueba lógica donde corresponde o comprobación manual de interfaz/persistencia documentada en el plan.
