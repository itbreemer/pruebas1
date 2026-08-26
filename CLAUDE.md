# Proyecto: Sistema de Inventario TI

Sistema web (Firebase) de inventario de equipos TI, más un **Agente de Inventario** estilo GLPI
que recolecta hardware/software de PCs Windows y lo envía a Firebase (migrará a servidor virtual futuro).

## Agente de Inventario (agent-inventario.ps1)

Archivos clave (rama `claude/project-status-bp3wfn`):
- `agent-inventario.ps1` — script principal del agente
- `config.json` — configuración (endpoint, credenciales, frecuencia, retry, logging)
- `install-agent-gpo.ps1` — instalador (crea tarea programada, para distribuir vía GPO)
- `test-agent.ps1` — script de validación/diagnóstico
- `AGENT-SETUP.md` — guía completa de instalación y GPO

Instala en `C:\ProgramData\AgentInventario` (bin/, config.json, logs/, data/).
Tarea programada: `AgentInventarioTI`, corre como SYSTEM.

### Credenciales Firebase (proyecto `inventario-ti-riol`)
- projectId: `inventario-ti-riol`
- database/colección Firestore: `equiposTI_v2`
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

### Bugs resueltos (importante para no repetirlos)
1. **`Invoke-WebRequest -Method PATCH` falla con `UriFormatException`** ("URI no válido: no se
   puede analizar el nombre de host") en Windows PowerShell/.NET Framework — bug conocido del
   truco por reflection que usa para soportar el verbo PATCH. **Fix aplicado**: se reemplazó por
   `System.Net.Http.HttpClient` en `Send-ToFirebase` (agent-inventario.ps1).
2. **`(default)` sin codificar en la URL de Firestore** también puede causar problemas de parseo
   — se usa `%28default%29` en su lugar.
3. **Codificación UTF-8 al descargar el ZIP de GitHub en Windows**: los símbolos `✓`/`✗` en los
   scripts pueden romper el parser de PowerShell si el archivo no se re-guarda como UTF-8 tras
   extraer el ZIP. Solución aplicada manualmente en cada máquina:
   ```powershell
   $c = Get-Content .\archivo.ps1 -Raw -Encoding UTF8
   $c | Set-Content .\archivo.ps1 -Encoding UTF8
   ```

### Estado actual
- Repositorio NO tiene rama `main` — todo el trabajo está en `claude/project-status-bp3wfn`.
- Agente probado exitosamente en equipo `LAPLNV250`: recolecta hardware/software y envía a
  Firestore correctamente (incluye reintento de inventarios pendientes guardados localmente).
- Pendiente: distribuir vía GPO a más equipos del dominio; considerar restringir la API Key de
  Firebase (por IP o servicio) antes de distribución masiva.
