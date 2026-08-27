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
  antes de llegar a una version que en teoría arma el JSON correctamente — **falta la
  confirmación final** de que el último fix (punto 6) funciona en la máquina de prueba y que la
  sección web "Inventario Automático" ya muestra los datos reales (no N/A).
- Pendiente: distribuir vía GPO a más equipos del dominio; considerar restringir la API Key de
  Firebase (por IP o servicio) antes de distribución masiva.
