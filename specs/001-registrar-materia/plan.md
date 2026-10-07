# Plan — HU-001: Registrar materia

## Alcance y trazabilidad

Este plan cubre todos los requisitos funcionales RF-01 a RF-07 de la spec
aprobada. No incluye edición, eliminación, notas del segundo bimestre,
cálculos académicos ni servicios externos.

## Archivos y responsabilidades

| Archivo | Acción | Responsabilidad | RF |
|---|---|---|---|
| `src/features/materias/types.ts` | Crear | Definir el modelo `Materia`: identificador estable, nombre sin espacios externos, nota del primer bimestre como centésimas enteras y nota del segundo bimestre como `null` mientras esté pendiente. | RF-01, RF-03, RF-06, RF-07 |
| `src/features/materias/domain.ts` | Crear | Funciones puras para normalizar y comparar nombres, validar los datos del formulario, convertir notas a centésimas y formatear las centésimas para mostrarlas como nota decimal. No importa React Native ni almacenamiento. | RF-01, RF-02, RF-03, RF-04, RF-07 |
| `src/features/materias/storage.ts` | Crear | Adaptador de persistencia local sobre la dependencia ya instalada `@react-native-async-storage/async-storage`. Leer y escribir la colección serializada preservando el modelo; propagar errores de escritura al llamador. | RF-01, RF-05, RF-06, RF-07 |
| `src/features/materias/domain.test.ts` | Crear | Pruebas Jest de validación de nombre/nota, límites, conversión a centésimas y detección de duplicados. | RF-02, RF-03, RF-04 |
| `src/features/materias/storage.test.ts` | Crear | Pruebas Jest del adaptador con AsyncStorage simulado: persistencia/lectura del modelo y propagación del fallo de escritura. | RF-01, RF-05, RF-06, RF-07 |
| `src/app/index.tsx` | Modificar | Sustituir la pantalla inicial de ejemplo por la lista de materias y el flujo de formulario; cargar los datos al abrir, renderizar nota pendiente y coordinar validación, guardado, errores y retorno a la lista. | RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07 |
| `src/components/app-tabs.tsx` | Modificar | Cambiar la etiqueta de la pestaña de inicio a «Materias» para identificar la lista de la historia. No cambiar la otra pestaña ni su comportamiento. | RF-01, RF-07 |

## Funciones puras de lógica

Implementar en `domain.ts`, sin dependencias de UI ni efectos secundarios:

- Normalizar el nombre quitando espacios al principio y al final, según la
  Decisión 1.
- Obtener una clave de comparación del nombre normalizado sin distinguir
  mayúsculas/minúsculas, según la Decisión 1.
- Validar los campos requeridos y el formato/rango de la nota. Aceptar el punto
  decimal, hasta dos posiciones decimales y valores entre 0.00 y 20.00
  inclusive; devolver errores asociados al campo sin alterar los valores
  escritos. El punto, la precisión y el rango corresponden a las Decisiones 3,
  7 y 9.
- Convertir la representación decimal aceptada directamente a centésimas
  enteras (por ejemplo, `15.25` a `1525`), evitando usar el valor decimal
  binario como formato persistido, según la Decisión 7.
- Formatear centésimas enteras para la interfaz como una nota decimal con dos
  posiciones, de modo que el valor persistido `1525` se presente como `15.25`
  (Decisión 7).
- Determinar si un nombre normalizado ya existe en la colección, según la
  Decisión 1.

La creación de una materia válida asigna una clave estable para la lista,
guarda el nombre normalizado, conserva la nota en centésimas y asigna
explícitamente `null` al segundo bimestre (Decisiones 2 y 8). El identificador
se genera una sola vez al crear; no se usa el índice de la lista como clave.

## Persistencia

- Reutilizar `@react-native-async-storage/async-storage`, que ya está en las
  dependencias; no añadir paquetes.
- Centralizar el acceso en `storage.ts`, con operaciones asíncronas para leer
  y guardar la colección completa. La pantalla no accede directamente al
  almacenamiento.
- Serializar los datos de forma que se conserven el identificador, nombre,
  nota en centésimas enteras y segundo bimestre `null`.
- No considerar una operación completada hasta que la escritura asíncrona
  termine sin error. Si falla, mantener el formulario y permitir reintentar,
  conforme a la Decisión 5 y RF-05.
- Al montar la pantalla, leer la colección para presentar las materias
  previamente guardadas, conforme a la Decisión 8 y RF-07.

## Algoritmo en pseudocódigo

```text
al abrir la pantalla:
    materias := leer colección local
    mostrar cada materia con nota del primer bimestre formateada desde centésimas
    si nota del segundo bimestre es null:
        mostrar estado textual "Pendiente"

al enviar el formulario:
    errores := validar nombre y nota del primer bimestre
    si hay errores:
        mostrar cada error junto a su campo
        conservar ambos valores escritos
        terminar

    nombre := normalizar nombre
    si ya existe una materia con la misma clave de comparación:
        mostrar advertencia de duplicado
        conservar el formulario y no guardar
        terminar

    materia := {
        id estable,
        nombre,
        notaPrimerBimestre en centésimas,
        notaSegundoBimestre: null
    }
    intentar guardar colección anterior + materia
    si la escritura falla:
        informar que no se guardó
        conservar el formulario y permitir reintento
        terminar

    actualizar la colección mostrada
    volver a la lista y mostrar la materia nueva
```

## Interfaz y presentación

- En `src/app/index.tsx`, la vista principal es la lista de materias y ofrece
  una acción clara para registrar una nueva. El formulario solicita nombre y
  nota del primer bimestre; los errores de validación se muestran junto al
  campo respectivo, sin limpiar lo escrito (RF-02).
- La entrada de nota usa `keyboardType="decimal-pad"`. Aunque algunos teclados
  ofrezcan coma, la validación aplica lo aprobado en la spec: solo admite
  punto decimal. Un valor inválido produce el error junto al campo, sin
  pérdida de lo escrito (RF-02, RF-03).
- El formulario debe ajustarse o desplazarse cuando aparezca el teclado; los
  controles que se estén usando permanecen alcanzables. Usar áreas seguras,
  `StyleSheet`, textos en español, objetivos táctiles de al menos 44×44 puntos
  y etiquetas de accesibilidad para botones/iconos, conforme a
  `rn-conventions`.
- Mostrar los errores de guardado y duplicado como mensajes comprensibles en
  español sin borrar el formulario (RF-04, RF-05). Tras guardar correctamente,
  volver a la lista y mostrar la fila añadida (Decisión 6, RF-01).
- Presentar la nota del primer bimestre en formato decimal legible a partir de
  las centésimas almacenadas. Presentar el segundo bimestre pendiente con
  texto explícito, no con `0` ni dependiendo solamente del color (RF-01,
  RF-06, RF-07).
- Renderizar la colección con `FlatList` y usar el identificador de cada
  materia como `keyExtractor`, nunca el índice (convención de interfaz).

## Decisiones técnicas justificadas

| Decisión del plan | Justificación | Alternativa descartada |
|---|---|---|
| Mantener las reglas en funciones puras separadas de la pantalla. | Cumple la Constitución (reglas independientes de React/almacenamiento) y hace verificables RF-02, RF-03 y RF-04 con Jest. | Validar y convertir dentro del componente, lo que mezcla estado visual con reglas y dificulta las pruebas. |
| Usar el AsyncStorage ya instalado detrás de un adaptador único. | La spec exige almacenamiento local y manejo de fallo (RF-05, RF-07); reutilizarlo evita dependencias nuevas (Constitución, principio 1). | Añadir otra biblioteca o repartir lecturas/escrituras directamente por la UI. |
| Persistir las notas como centésimas enteras y el segundo bimestre como `null`. | Es exactamente la representación aprobada (Decisiones 2, 7 y 8) y evita confundir pendiente con cero. | Guardar números decimales binarios o representar pendiente omitiendo el campo/como cero. |
| Mantener el formulario y sus valores si la validación o escritura falla. | Cumple RF-02 y RF-05 y las Decisiones 4 y 5. | Limpiar el formulario antes de confirmar el guardado o al fallar. |
| Sustituir la pantalla inicial por el flujo lista/formulario y conservarlo en la ruta de inicio. | Cubre la historia sin introducir rutas o navegación nuevas que la spec no pide; el éxito regresa a la lista (Decisión 6). | Añadir un flujo de navegación independiente o una estructura de pantallas no requerida. |

## Estrategia de pruebas con Jest

- `domain.test.ts`: ejecutar con `npx jest`; comprobar campo vacío, separador
  coma rechazado, formato con punto, límites 0.00 y 20.00, valores fuera del
  rango, conversión a centésimas y formato de presentación, recorte de
  espacios y duplicados que solo difieren en mayúsculas/espacios externos.
  RF-01, RF-02, RF-03, RF-04, RF-07.
- `storage.test.ts`: simular AsyncStorage y comprobar escritura/lectura con
  centésimas enteras y `null`, además de que el error de escritura se propaga
  para que la UI no declare éxito. RF-01, RF-05, RF-06, RF-07.
- Tras cada cambio de lógica, ejecutar `npx jest` (suite enfocada y, al
  integrar, suite completa). No avanzar con pruebas en rojo.
- La UI se coteja manualmente en Expo Go contra la lista de
  `rn-conventions`: vertical y giro, teclado y botón accesibles, separador
  decimal que ofrece el teléfono frente a la regla de la spec, persistencia
  al cerrar por completo/reabrir y estado legible sin depender del color.
  También comprobar errores junto a los campos, formulario conservado ante
  duplicado/fallo de almacenamiento y retorno a la lista tras éxito.

## Cobertura de RF

| RF | Partes que lo cubren |
|---|---|
| RF-01 | `domain.ts` (formateo de centésimas), `storage.ts`, `src/app/index.tsx`; prueba de persistencia y verificación manual del guardado/lista. |
| RF-02 | `domain.ts`, formulario en `src/app/index.tsx`; pruebas Jest de validación y revisión manual de errores/retención. |
| RF-03 | Conversión y validación en `domain.ts`; pruebas Jest de formato, bordes y centésimas; revisión manual con teclado decimal. |
| RF-04 | Comparación pura en `domain.ts`, flujo de envío de `src/app/index.tsx`; prueba Jest de equivalencia y revisión manual de aviso/no duplicación. |
| RF-05 | Propagación de error en `storage.ts` y tratamiento en `src/app/index.tsx`; prueba Jest de error y revisión manual de reintento. |
| RF-06 | Modelo y persistencia de `null`, render de estado en `src/app/index.tsx`; prueba Jest y revisión manual de texto pendiente. |
| RF-07 | Lectura inicial y render de `src/app/index.tsx`, adaptador `storage.ts`; pruebas Jest y revisión manual de cierre/reapertura. |
