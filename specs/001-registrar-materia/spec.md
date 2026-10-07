# Spec 001 — Registrar materia

Estado: aprobada
HU de origen: docs/historias/HU-001.md

## Contexto y objetivo
La aplicación debe permitir al estudiante registrar una materia con su nota del primer bimestre, validar la información ingresada y conservar la materia entre sesiones. El objetivo es que el estudiante pueda empezar a llevar el control académico sin perder datos ni duplicar registros.

## Usuarios
- Estudiante: registra materias, introduce la nota del primer bimestre y revisa el listado de materias.

## Historias de usuario
- Como estudiante, quiero guardar una materia con la nota de mi primer bimestre, para tenerla registrada y completarla cuando salga la del segundo.
- Como estudiante, quiero que la aplicación me avise si faltan datos o si la nota es inválida, para corregirla antes de guardar.
- Como estudiante, quiero que la aplicación impida duplicados, para mantener mi listado ordenado.
- Como estudiante, quiero que mis materias sigan guardadas al cerrar y volver a abrir la aplicación, para no perder información.

## Definiciones
- Materia: asignatura que el estudiante desea registrar y conservar en la lista.
- Nota del primer bimestre: calificación de la materia del primer período, con precisión de dos decimales, rango válido de 0.00 a 20.00 inclusive y guardada como centésimas enteras.
- Segundo bimestre pendiente: ausencia de valor numérico para la nota del segundo bimestre, representada explícitamente como nula.

## Requisitos funcionales
- RF-01: CUANDO el estudiante ingrese un nombre de materia y una nota del primer bimestre válida, EL SISTEMA debe guardar la materia y mostrarla en la lista. Origen: Escenario: Guardar una materia; Decisión 6.
- RF-02: SI el nombre de la materia está vacío, la nota del primer bimestre está vacía o la nota no cumple el formato decimal aceptado (".") o el rango permitido de 0.00 a 20.00 inclusive, ENTONCES EL SISTEMA debe mostrar el error junto al campo correspondiente, conservar lo ingresado y no guardar la materia. Origen: Escenario: Datos incompletos o inválidos; Decisión 3; Decisión 4; Decisión 9.
- RF-03: CUANDO el estudiante escriba la nota del primer bimestre, EL SISTEMA debe aceptar solo el separador decimal ".", validar que esté en el rango de 0.00 a 20.00 inclusive y convertir el valor a centésimas enteras para su almacenamiento. Origen: Decisión 3; Decisión 7; Decisión 9.
- RF-04: SI el nombre de una materia ya existe ignorando mayúsculas y espacios al inicio o al final, ENTONCES EL SISTEMA debe advertir que la materia ya está registrada y no crear una entrada duplicada. Origen: Escenario: Materia repetida; Decisión 1.
- RF-05: SI ocurre un error al guardar la materia en el almacenamiento local, ENTONCES EL SISTEMA debe informar que la operación falló, conservar el formulario y permitir reintentar la operación. Origen: Decisión 5.
- RF-06: MIENTRAS la nota del segundo bimestre no haya sido ingresada, EL SISTEMA debe mostrar esa materia como pendiente y no como un valor numérico. Origen: Decisión 2; Decisión 8.
- RF-07: CUANDO el estudiante cierre y vuelva a abrir la aplicación con materias guardadas, EL SISTEMA debe conservar la información registrada y mostrarla en la lista con su nota del primer bimestre y el estado del segundo bimestre pendiente si corresponde. Origen: Escenario: Conservar mis datos; Decisión 8.

## Requisitos no funcionales
- RNF-01: La validación de la materia debe ser inmediata y clara, para que el estudiante corrija el dato sin perder lo ingresado.
- RNF-02: La información guardada debe persistirse entre sesiones, con la misma nota del primer bimestre y el estado pendiente del segundo bimestre cuando corresponda.

## Casos límite
- Nombre de la materia con espacios al inicio o al final.
- Nombre de la materia escrito con mayúsculas o minúsculas distintas a una ya registrada.
- Nota del primer bimestre con separador decimal "," en lugar de ".".
- Nota del primer bimestre vacía o fuera del rango vigente.
- Materia guardada sin nota del segundo bimestre, que debe quedar pendiente.
- Error de almacenamiento local durante el guardado.

## Fuera de alcance
- Edición o eliminación de materias ya registradas.
- Registro de más de una nota por materia en el mismo bimestre.
- Cálculo del supletorio o del estado académico final.
- Validación en backend o sincronización con servicios externos.

## Criterios de finalización
- La aplicación permite registrar una materia con la nota del primer bimestre.
- Los errores de validación se muestran junto al campo correspondiente y no se guarda la materia inválida.
- Las materias duplicadas se detectan ignorando mayúsculas y espacios al inicio o final.
- La materia registrada se conserva al cerrar y volver a abrir la aplicación.
- La nota del segundo bimestre sin valor se representa como pendiente y no como cero.

## Decisiones
1. Detección de materias repetidas: comparar nombres ignorando mayúsculas/minúsculas y espacios al inicio o al final; guardar el nombre sin esos espacios al inicio o al final.
2. Segundo bimestre pendiente: la nota del segundo bimestre se guarda como no ingresada (`null`) y se muestra en la lista como pendiente hasta completarla.
3. Separador decimal de entrada: aceptar solo punto decimal.
4. Presentación de errores de validación: mostrar el error junto al campo correspondiente, conservar lo ingresado y no guardar.
5. Error al guardar localmente: avisar que no se guardó y conservar el formulario para reintentar.
6. Después de guardar correctamente: volver a la lista y mostrar la materia recién creada.
7. Formato guardado de las notas: guardar las notas como centésimas enteras (por ejemplo, 15.25 → 1525).
8. Representación del segundo bimestre pendiente: guardar el campo con `null`.
9. Rango de notas válidas del primer bimestre: desde 0.00 hasta 20.00 inclusive.
