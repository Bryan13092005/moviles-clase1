# Decisiones — HU-001

## 1. Detección de materias repetidas
- **Pregunta:** ¿Confirmas que comparemos los nombres ignorando mayúsculas/minúsculas y espacios al inicio o al final, y guardemos el nombre sin esos espacios?
- **Respuesta:** Sí. Se ignoran diferencias de mayúsculas/minúsculas y se eliminan los espacios al inicio y al final al guardar.
- **Motivo:** Evita registrar como materias distintas nombres que solo varían por capitalización o espacios accidentales.

## 2. Segundo bimestre pendiente
- **Pregunta:** ¿Confirmas que la nota del segundo bimestre se guarde como no ingresada (no como 0) y se muestre en la lista como pendiente hasta completarla?
- **Respuesta:** Sí. Se muestra como pendiente y no tiene valor numérico.
- **Motivo:** Distingue una nota todavía no ingresada de una calificación real de cero.

## 3. Separador decimal de entrada
- **Pregunta:** ¿Qué separador decimal debe aceptar la nota escrita por el estudiante?
- **Respuesta:** Aceptar solo punto decimal.
- **Motivo:** Define un formato de entrada único y evita ambigüedades al interpretar la nota.

## 4. Presentación de errores de validación
- **Pregunta:** Cuando el nombre o la nota estén vacíos o inválidos, ¿cómo debe indicar la app qué corregir?
- **Respuesta:** Mostrar el error junto al campo correspondiente, conservar lo ingresado y no guardar.
- **Motivo:** Señala de forma directa qué dato corregir sin hacer perder al estudiante las demás entradas.

## 5. Error al guardar localmente
- **Pregunta:** Si ocurre un error al guardar localmente, ¿la app debe avisar que no se guardó y mantener el formulario para reintentar?
- **Respuesta:** Sí. Avisar que no se guardó y conservar el formulario.
- **Motivo:** Evita comunicar un éxito falso y permite reintentar sin volver a ingresar los datos.

## 6. Después de guardar correctamente
- **Pregunta:** Tras guardar correctamente, ¿la app debe volver a la lista y mostrar la materia recién creada?
- **Respuesta:** Sí, volver a la lista.
- **Motivo:** Permite confirmar el resultado y ver la materia en el contexto indicado por la historia.

## 7. Formato guardado de las notas
- **Pregunta:** ¿Confirmas guardar las notas como centésimas enteras (por ejemplo, 15.25 → 1525)?
- **Respuesta:** Sí, guardar centésimas enteras.
- **Motivo:** Representa exactamente la precisión permitida de dos decimales y evita errores de representación decimal.

## 8. Representación del segundo bimestre pendiente
- **Pregunta:** ¿Confirmas representar el segundo bimestre pendiente explícitamente como `null`, en vez de omitir el campo?
- **Respuesta:** Sí, guardar el campo con `null`.
- **Motivo:** Hace explícita la ausencia de nota y la distingue de cualquier valor numérico.
