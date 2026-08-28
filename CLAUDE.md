# Proyecto: Sistema de Inventario TI

Sistema web (Firebase) de inventario de equipos TI, más un **Agente de Inventario** estilo GLPI
que recolecta hardware/software de PCs Windows y lo envía a Firebase (migrará a servidor virtual futuro).

## Ramas del repositorio (importante, no es lo típico)

- **NO existe rama `main`**. El repo tiene 3 ramas: `claude/funny-maxwell-lxolm4`,
  `claude/project-status-bp3wfn`, `claude/project-status-jcvsc9`.
- **`claude/funny-maxwell-lxolm4` es la rama por defecto (HEAD) y la que sirve GitHub Pages**
  en `https://itbreemer.github.io/pruebas1/` — es la rama "producción" del sitio web en vivo.
- **`claude/project-status-bp3wfn` es la rama de desarrollo** designada para el trabajo del
  Agente de Inventario y donde se hacen los commits normalmente.
- Cuando un cambio debe verse reflejado en el sitio en vivo, hay que fusionar
  `claude/project-status-bp3wfn` → `claude/funny-maxwell-lxolm4` y hacer push a esa rama
  (con permiso explícito del usuario, ya que afecta producción). Ya se hizo un merge así
  (fast-forward, sin conflictos) para publicar la sección "Inventario Automático".
- Al descargar el ZIP desde GitHub para probar en Windows, hay que asegurarse de bajar la
  rama correcta (`?` en la URL: `github.com/itbreemer/pruebas1/tree/claude/project-status-bp3wfn`),
  NO la rama por defecto, si se quiere probar cambios del agente antes de fusionarlos.

## Agente de Inventario (agent-inventario.ps1)

Archivos clave:
- `agent-inventario.ps1` — script principal del agente
- `config.json` — configuración (endpoint, credenciales, frecuencia, retry, logging)
- `install-agent-gpo.ps1` — instalador (crea tarea programada, para distribuir vía GPO)
- `test-agent.ps1` — script de validación/diagnóstico
- `AGENT-SETUP.md` — guía completa de instalación y GPO

Instala en `C:\ProgramData\AgentInventario` (bin/, config.json, logs/, data/).
Tarea programada: `AgentInventarioTI`, corre como SYSTEM.
Equipo de prueba: `LAPLNV250` (usuario `victor.morales`, dominio `GRUPOLTZ`).

### Credenciales Firebase (proyecto `inventario-ti-riol`)
- projectId: `inventario-ti-riol`
- database/colección Firestore del agente: `equiposTI_v2`
- apiKey: en `config.json` (no exponer en commits públicos si el repo se hace público)

### Reglas de Firestore
La colección `equiposTI_v2` tiene reglas especiales porque el agente autentica solo con
API Key (sin Firebase Auth de usuario):
```
match /equiposTI_v2/{equipoId} {
  allow read: if request.auth != null;
  allow write: if true;
}
```
El resto de colecciones del sistema usan `allow read, write: if request.auth != null;`.

### Bugs resueltos en agent-inventario.ps1 (importante para no repetirlos)

1. **`Invoke-WebRequest -Method PATCH` falla con `UriFormatException`** ("URI no válido: no se
   puede analizar el nombre de host") en Windows PowerShell/.NET Framework — bug conocido del
   truco por reflection que usa para soportar el verbo PATCH. **Fix**: se reemplazó por
   `System.Net.Http.HttpClient` en `Send-ToFirebase`.

2. **`(default)` sin codificar en la URL de Firestore** también puede causar problemas de parseo
   — se usa `%28default%29` en su lugar. (Al final este NO era la causa raíz del bug de PATCH,
   pero de todas formas es más correcto codificarlo.)

3. **Codificación UTF-8 al descargar el ZIP de GitHub en Windows**: los símbolos `✓`/`✗` en los
   scripts pueden romper el parser de PowerShell si el archivo no se re-guarda como UTF-8 tras
   extraer el ZIP. Aplicar en cada máquina tras descargar/actualizar el script:
   ```powershell
   $c = Get-Content .\archivo.ps1 -Raw -Encoding UTF8
   $c | Set-Content .\archivo.ps1 -Encoding UTF8
   ```

4. **`Send-ToFirebase` serializaba vacíos los campos anidados (hardware/software/red)**: el
   loop original solo manejaba campos de primer nivel; hashtables/arrays anidados se guardaban
   como `mapValue`/`arrayValue` vacíos. **Fix**: función recursiva `ConvertTo-FirestoreValue`
   que convierte cualquier valor de PowerShell (hashtable, PSCustomObject, array, string,
   numero, bool, null) al formato "Value" de Firestore.

5. **`ConvertTo-Json` corrompe el documento con estructuras muy anidadas** (bug real y confirmado
   de Windows PowerShell): al convertir el `$firestoreDoc` completo (cada nivel real de datos
   queda envuelto en 2-3 niveles extra por el formato Firestore: `mapValue`/`fields`,
   `arrayValue`/`values`), `ConvertTo-Json -Depth N` puede caer en su serialización por
   reflexión .NET del hashtable de nivel superior, devolviendo sus propiedades internas
   (`Keys`, `Values`, `Count`, `IsReadOnly`, `IsFixedSize`, `IsSynchronized`, `SyncRoot`) en vez
   de los nombres de campo reales (`computadora`, `hardware`, etc.) — aun cuando los VALORES
   anidados individuales se veían bien. Prueba definitiva de este bug: un campo `"SyncRoot":
   "System.Object"` apareciendo en el documento de Firestore. **Fix**: se dejó de usar
   `ConvertTo-Json` para el cuerpo de la petición; ahora `ConvertTo-FirestoreJsonValue` /
   `ConvertTo-FirestoreRequestBody` arman el texto JSON a mano de forma recursiva.

6. **El serializador manual (fix #5) al principio devolvía el valor "pelado" en vez del Value
   completo** — ej. `"GRUPOLTZ"` en vez de `{"stringValue":"GRUPOLTZ"}` — causando que Firestore
   rechazara el documento con 400 `INVALID_ARGUMENT` ("Unknown name X: Cannot find field" /
   "Invalid value at document.fields[N].value"). **Fix**: cada rama de
   `ConvertTo-FirestoreJsonValue` devuelve el objeto Value completo con su llave de tipo
   (`stringValue`, `integerValue` como string, `doubleValue`, `booleanValue`, `mapValue`,
   `arrayValue`). Este fue el último fix aplicado; **pendiente de confirmación** en la máquina
   de prueba (`LAPLNV250`) — el usuario iba a re-descargar, re-ejecutar y confirmar que el
   documento en Firestore y la vista web ya muestran los datos reales.

7. **Reintentos (`Retry-SendInventory`) recargan el inventario desde JSON local** vía
   `ConvertFrom-Json`, lo que produce `PSCustomObject` en vez de `Hashtable`.
   `ConvertTo-FirestoreValue` ahora también reconoce `[System.Management.Automation.PSCustomObject]`
   (además de `[hashtable]`) para no perder la estructura anidada en los reintentos.

### Metodología útil para depurar este tipo de bug
Cuando algo llega vacío o corrupto a Firestore: (1) confirmar con `console.log(JSON.stringify(...))`
en la consola del navegador qué llega realmente al cliente web, (2) comparar contra Firebase
Console (ojo: Firebase Console puede mostrar el array `Values` con índices numéricos que
parecen nombres de campo reales si el documento está corrupto — hay que mirar los nombres de
campo de primer nivel sin expandir nada para confirmar), (3) aislar con pruebas mínimas de
`ConvertTo-Json`/`Invoke-WebRequest` directamente en PowerShell antes de teorizar más.

## Sección web "Inventario Automático" (equiposTI_v2)

Se agregó una sección de solo lectura en la app principal (`index.html` + `app.js`) que muestra
los datos que junta el agente, siguiendo el mismo patrón que las demás secciones
(`crearVistaLista`, nav-tab, `*-sync.js`):

- `index.html`: botón de nav `data-vista="equiposTIv2"`, sección `#vista-equiposTIv2` con tabla
  (Equipo, Usuario, Procesador, RAM, SO, IP, Serial, Última Actualización), script tag para
  `equipos-ti-v2-sync.js`.
- `app.js`: `equiposTIv2Data` (array), `establecerEquiposTIv2DesdeSync` (setter, sin merge con
  nada local ya que es de solo lectura), `obtenerEquiposTIv2` (row mapper), `vistaEquiposTIv2`
  (`crearVistaLista`), rama en `cambiarVista()`.
- `equipos-ti-v2-sync.js`: nuevo archivo, solo `onSnapshot` (sin escritura) — el agente es el
  único que escribe en `equiposTI_v2`.

Esta es una colección **separada** de `equipos` (la colección administrativa/manual que usa el
resto de la app) — son dos inventarios distintos a propósito (Opción B que eligió el usuario):
`equipos` = captura manual de RRHH/asignación; `equiposTI_v2` = datos técnicos en vivo del agente.

### Estado actual
- Agente probado repetidamente en `LAPLNV250`; hardware/software se recolectan bien.
- El pipeline de envío a Firestore pasó por varias iteraciones de bugs (ver arriba, puntos 4-7)
  hasta el fix del punto 6 (últimol) — **confirmado funcionando**: el documento en Firestore y
  la vista web "Inventario Automático" ya muestran los datos reales (hardware/software completos,
  no N/A, no `Keys`/`Values`/`Count`).
- Se agregó detección del monitor físico conectado (`Get-ConnectedMonitors`, WMI `WmiMonitorID`
  en `root\wmi`) — guarda fabricante/modelo/serial en `hardware.monitores`. Funciona
  independiente de la marca de la PC. Puede fallar en VMs o con drivers de video genéricos (no
  es bug, es limitación del hardware/driver).
- Pendiente: distribuir vía GPO a más equipos del dominio; considerar restringir la API Key de
  Firebase (por IP o servicio) antes de distribución masiva.

## Dashboard flotante (dashboard.html / dashboard.js)

Ventana emergente de solo lectura (`window.open` desde `app.js`, botón del Tablero) con
tarjetas donut en vivo: Equipos Lenovo, Equipos Unidades de Negocio, Equipos RIOLSA, Impresoras
Canon, Contratos Lenovo. A diferencia de la app principal, **lee la colección `equipos` de
Firestore directamente** (no pasa por `app.js`/`data.js`).

### Bug importante ya resuelto: los totales no cuadraban con el Tablero
`app.js` aplica varias correcciones **solo en memoria, nunca se empujan a Firestore a
propósito** (para no arriesgar que una fecha "reciente" forzada le gane en la fusión a una
edición real más nueva hecha en otro navegador — ver comentarios en `quitarMarcaRevisionConfirmados`,
`corregirEmpresasMalCapturadas`, `corregirComentariosUsoRiolsa`, `corregirTipoEquipoMalClasificado`
en `app.js`), además de dos exclusiones (`eliminarDuplicadoP025194`, `eliminarChatarraConfirmada`)
que si empujan `sincronizarEliminacion` pero dependen de que algún navegador haya cargado
`index.html` después del cambio para que ya se haya borrado de Firestore.

Como `dashboard.js` lee Firestore "en crudo", estas correcciones NO se aplicaban ahí, causando
que la tarjeta "Equipos propios" del dashboard diera menos que la del Tablero (ej. 190 vs 208):
~24 equipos en `IDS_CONFIRMADOS_ACTIVOS` seguían marcados "en revisión" en el doc crudo de
Firestore aunque el Tablero ya les quita esa marca localmente.

**Fix aplicado**: se duplicaron en `dashboard.js` las listas `ID_DUPLICADO_P025194`,
`IDS_CHATARRA_CONFIRMADA` e `IDS_CONFIRMADOS_ACTIVOS` (mismas que `app.js`) y se replicó la
lógica de exclusión/override de "en revisión". **Importante para el futuro**: si se agregan o
quitan IDs de esas listas en `app.js`, hay que copiar el cambio también en `dashboard.js`, o los
totales del dashboard se desincronizarán de nuevo del Tablero. Si esto vuelve a pasar muy
seguido, considerar mover el cálculo a un documento resumen en Firestore que `app.js` publique
y `dashboard.js` solo lea (evitaría la duplicación, pero es un cambio más grande).

También se corrigió que los círculos del dashboard solo sumaban PC + Laptop para el número
central (dejando fuera equipos con `tipoEquipo` de otras familias) — ahora `pintarBloque` recibe
un total real explícito además del desglose PC/Laptop.

**Verificación final (con `window.__debugTablero` / `window.__debugDashboard` temporales,
ya quitados)**: el total sí cuadraba (208 = 190 "Equipos Unidades de Negocio" + 18 "Equipos
RIOLSA"). La confusión real del usuario fue de lectura: hay que fijarse en el **número grande
del centro de la dona** (el total real de esa categoría), no en la suma de PC+Laptop de la
leyenda de al lado (esa leyenda solo cuenta los clasificados como Desktop/Notebook; el resto de
`tipoEquipo` queda fuera de la leyenda pero sí está en el número central).

**Otra causa real de números "viejos" en pantalla**: `index.html` referencia `app.js` y
`style.css` con un parámetro `?v=` de cache-busting que hay que **subir manualmente cada vez
que se editan esos archivos** (igual que ya se hacía con `dashboard.html`/`dashboard.js`). Si
se te olvida, el navegador puede seguir sirviendo una copia en caché sin los últimos cambios
aunque el archivo en el repo ya esté actualizado. Antes de dar un cambio de `app.js`/`style.css`
por publicado, confirmar que el `?v=` en `index.html` se subió también.

## Mejoras recientes a la app web principal (index.html / app.js)

### Monitor vinculado al Catálogo de Monitores
- El campo "Monitor" del equipo (antes texto libre) ahora es un **autocompletado** que busca en
  `CATALOGO_MONITORES` (definido en `monitores.js`, ~180 monitores contratados con
  serial/modelo/descripción/contrato/fechaFin) por serial, modelo o descripción a medida que se
  escribe. Al seleccionar, se guarda el **serial** en `equipo.monitor` (sigue siendo un string
  plano, compatible con el sistema genérico `FIELD_IDS`). Debajo del campo se muestra un mensaje
  de confirmación con la descripción completa, contrato y fecha de vencimiento
  (`actualizarAyudaMonitor`), o una advertencia si el valor no calza con el catálogo (texto
  libre legado, se preserva).
- Funciones clave en `app.js`: `buscarMonitorCatalogo`, `descripcionMonitorEquipo`,
  `renderSugerenciasMonitor`, `inicializarAutocompleteMonitor`, `actualizarAyudaMonitor`.
- **NO usar `<select>`** para esto — con ~180 opciones resultó inutilizable (había que scrollear
  toda la lista). El autocompletado de texto libre + sugerencias filtradas es la solución que
  funcionó bien.
- El "Catálogo de monitores contratados (sin asignar a un equipo)" (`vistaCatalogoMonitores`) es
  clickeable: busca qué equipo tiene ese serial asignado (`equipoAsignadoAMonitor`) y abre su
  modal, o avisa que no está asignado aún.
- Nuevo campo `equipo.numeroInventarioMonitor` ("No. Inventario Monitor") — el número de
  activo fijo del monitor físico entregado (puede diferir del registrado si se entrega otro
  monitor). Se imprime en el Acta como **"Activo Fijo Monitor:"** (mismo naming que "Activo Fijo:").
  Campo `codigoRam` (Código RAM adicional) se dejó intacto a propósito — se usa en la Tarjeta de
  Responsabilidad para laptops (columna "CODIGO RAM", vs "S/N MONITOR" en desktops).

### Historial por equipo (dentro del modal de editar equipo, debajo de "Dominio")
- **"Mantenimiento"**: botón con contador en vivo + modal con el historial completo de
  mantenimientos de ESE equipo (`registrosMantenimientoDeEquipo`, `abrirHistorialMantenimientoEquipo`),
  matcheado por `equipoRef === nombreRed`.
- **"Garantías Lenovo"**: igual pero para `ticketsGarantiaData` (`registrosGarantiaDeEquipo`,
  `abrirHistorialGarantiaEquipo`). **Importante**: el campo `tgEquipo` es texto libre (con
  datalist de sugerencia `dl-nombreRedEquipo` para GBM, `dl-impresorasSerialCatalogo` para
  Canella) — en la práctica varios tickets GBM se capturaron con el **numeroSerial** del equipo
  en vez del `nombreRed` (confirmado: ticket de PCLNV139 usa su serial `PF3G9HQX` como
  `equipoRef`). Por eso `registrosGarantiaDeEquipo` compara contra **ambos** valores
  (nombreRed y numeroSerial, case-insensitive). Si se agregan más lookups de tickets de
  garantía por equipo en el futuro, replicar esta doble comparación.
- Ambos historiales se mantienen **separados a propósito** (no combinados en un solo reporte),
  para llevar control independiente de mantenimiento interno vs. cobertura de garantía.

### Mantenimiento de Equipos (sección completa)
- Nuevo campo `fechaSalida` (opcional) — cuándo se completó el mantenimiento.
- La tabla de mantenimiento **oculta por defecto** los registros ya finalizados (con
  `fechaSalida`), mostrando solo los "en proceso". Botón "🗂️ Ver historial completo" alterna a
  mostrar todo (`mostrarHistorialMantenimientoCompleto`, `alternarHistorialMantenimiento`).
- El "Reporte por Técnico" ahora también lista los equipos atendidos por cada técnico (no solo
  el conteo), con fechas ingreso→salida o "en proceso" (`generarReporteMantenimiento`).
- **Auto-asignación de "Técnico GBM"**: si el equipo seleccionado es Lenovo (`fabricante`) y
  tiene un contrato de renta activo (`nonEmpty(equipo.contratos)` — mismo criterio que el filtro
  "equipos propios" de la vista Computadoras), el campo "Técnico que Revisó" se fuerza a
  "Técnico GBM" (no al técnico logueado), ya que por contrato de arrendamiento solo GBM puede
  darles mantenimiento. Esto aplica tanto a registros **nuevos** como al **reabrir/editar
  existentes** (para poder corregir capturas previas a esta regla con solo abrir+guardar).
  Función: `actualizarUsuarioEquipoMantenimiento`.
- Checklist de "Solución Aplicada" incluye ahora Batería y Cargador (Mantenimiento Correctivo).

### Tickets de Garantía
- Nuevo campo `fechaResolucion` + columna calculada "Días de Respuesta"
  (`diasRespuestaGarantia` = fechaResolucion − fechaReporte en días) en la tabla principal y en
  el historial por equipo.

### Otros
- Botón "PBI Acta" eliminado (duplicaba "Generar Acta", sin lógica propia, era solo para
  comparación puntual).

### Patrón para reportes/listas nuevas en esta app
Todas las secciones de lista siguen `crearVistaLista({prefix, columnas, obtenerFilas, filtrar,
alClicFila})` (ver `app.js`). Los historiales "por equipo" (mantenimiento, garantía) en cambio
son modales simples con tabla estática (no usan `crearVistaLista`, no necesitan paginación) que
se repueblan cada vez que se abren, matcheando por `nombreRed` (y a veces `numeroSerial`) del
equipo activo en el formulario.
