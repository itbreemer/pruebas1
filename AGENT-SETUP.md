# 🖥️ Agente de Inventario TI - Guía de Instalación y Configuración

## 📋 Descripción General

El **Agente de Inventario TI** es un script PowerShell que recolecta automáticamente información de hardware y software de equipos Windows y la envía a:
- **Firebase (ahora)** - Via REST API de Firestore
- **Servidor Virtual (futuro)** - Via API REST personalizada

### Características

✅ Recolecta CPU, RAM, Disco, SO, Red, Usuario  
✅ Funciona con Firebase Y Servidor Virtual  
✅ Almacenamiento local + reintentos automáticos  
✅ Distribuible via GPO (Group Policy)  
✅ Logs detallados con retención automática  
✅ Ejecutable manual o automático (Task Scheduler)  
✅ Bajo consumo de recursos  

---

## 📦 Archivos Incluidos

```
pruebas1/
├── agent-inventario.ps1          ← Script principal (el agente)
├── config.json                   ← Configuración personalizable
├── install-agent-gpo.ps1         ← Script de instalación (para administrador)
└── AGENT-SETUP.md                ← Esta guía
```

---

## 🚀 OPCIÓN 1: Instalación Manual en una Computadora

### Requisitos

- Windows 7 SP1 o superior
- PowerShell 5.0+
- Permisos de **administrador**
- Conexión a red (HTTP/HTTPS)

### Pasos

#### 1. Descargar archivos

Copia estos 3 archivos a una carpeta local (ej: `C:\Temp\AgentInventario`):
- `agent-inventario.ps1`
- `config.json`
- `install-agent-gpo.ps1`

#### 2. Personalizar configuración

Abre `config.json` con editor de texto y actualiza:

```json
{
  "endpoint": {
    "type": "firebase",
    "firebase": {
      "projectId": "tu-proyecto-firebase",
      "database": "equiposTI_v2",
      "apiKey": "AIzaSyD..."  ← Tu API Key de Firebase
    }
  },
  "schedule": {
    "frequency": "hourly"     ← "hourly", "daily", "weekly"
  }
}
```

**¿Cómo obtener tu API Key de Firebase?**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Configuración → Proyectos → Claves de la API web
4. Copia la clave (`apiKey`)

#### 3. Ejecutar instalador

Abre PowerShell **como Administrador** y ejecuta:

```powershell
cd C:\Temp\AgentInventario
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
.\install-agent-gpo.ps1 -SourcePath "C:\Temp\AgentInventario" -Frequency hourly
```

**Output esperado:**

```
✓ Permisos de administrador confirmados
✓ Archivo encontrado: agent-inventario.ps1
✓ Archivo encontrado: config.json
✓ Directorio creado: C:\ProgramData\AgentInventario
✓ Agente copiado a: C:\ProgramData\AgentInventario\bin\agent-inventario.ps1
✓ Configuración copiada a: C:\ProgramData\AgentInventario\config.json
✓ Tarea programada registrada: AgentInventarioTI

✓ INSTALACIÓN COMPLETADA
```

#### 4. Verificar instalación

```powershell
# Ver tarea programada
Get-ScheduledTask -TaskName "AgentInventarioTI"

# Ver logs
Get-Content "C:\ProgramData\AgentInventario\logs\agent-*.log" -Tail 20
```

---

## 🏢 OPCIÓN 2: Distribución via GPO (Dominio Active Directory)

### Requisitos

- Acceso a **Active Directory**
- Servidor de archivos compartido (ej: `\\servidor\scripts\`)
- Editor de Políticas de Grupo (GPMC)

### Pasos de Distribución

#### 1. Preparar compartida de red

En tu servidor de archivos, crea:

```
\\servidor\scripts\AgentInventario\
├── agent-inventario.ps1
├── config.json
├── install-agent-gpo.ps1
└── README.txt
```

Asigna permisos de lectura a **Usuarios del Dominio**:

```powershell
icacls "\\servidor\scripts\AgentInventario" /grant "DOMAIN\Domain Users:(OI)(CI)R"
```

#### 2. Personalizar config.json en la compartida

Edita la configuración centralizada que se distribuirá a todos:

```json
{
  "endpoint": {
    "type": "firebase",
    "firebase": {
      "projectId": "tu-proyecto",
      "database": "equiposTI_v2",
      "apiKey": "tu-key"
    }
  },
  "schedule": {
    "frequency": "hourly"
  }
}
```

#### 3. Crear GPO (Opción A: Script de Inicio)

Abre **Editor de Políticas de Grupo** (gpmc.msc):

1. Selecciona la OU donde están los equipos
2. **Crear GPO** → Nombre: "Desplegar Agente Inventario"
3. **Editar** → Políticas de Equipo → Configuración de Windows → Scripts (Inicio/Cierre)
4. **Scripts de Inicio**:
   - Agregar script:
   ```
   \\servidor\scripts\AgentInventario\install-agent-gpo.ps1
   ```
   - Argumentos:
   ```
   -SourcePath "\\servidor\scripts\AgentInventario" -Frequency hourly -RunImmediately $false
   ```

5. Configurar PowerShell Script Execution:
   - Ir a: Políticas de Equipo → Configuración de Windows → Configuración de Seguridad → Políticas de Restricción de Software
   - O establecer via GPO: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`

#### 4. Crear GPO (Opción B: Tarea Programada)

Si prefieres crear la tarea directamente via GPO:

1. Crear GPO: "Configurar Tarea Inventario"
2. **Editar** → Configuración de Equipo → Preferencias → Configuración del Panel de Control → Tareas Programadas
3. Crear tarea:
   - **Nombre**: AgentInventarioTI
   - **Acción**: Ejecutar script PowerShell
   - **Script**:
   ```powershell
   C:\ProgramData\AgentInventario\bin\agent-inventario.ps1 -ConfigPath "C:\ProgramData\AgentInventario\config.json"
   ```
   - **Frecuencia**: Cada hora
   - **Ejecutar como**: SYSTEM

#### 5. Vincular GPO a OU

1. En GPMC, selecciona la OU
2. **Vincular GPO existente**
3. Selecciona "Desplegar Agente Inventario"
4. Asigna prioridad si hay conflictos

#### 6. Aplicar GPO inmediatamente (para pruebas)

En los equipos clientes:

```powershell
# Forzar actualización de GPO
gpupdate /force

# Verificar que la tarea existe
Get-ScheduledTask -TaskName "AgentInventarioTI"
```

---

## 🔧 Configuración de Migracion a Servidor Virtual

Cuando migres de Firebase a tu servidor virtual, solo necesitas cambiar `config.json`:

### Configuración para Servidor Virtual

```json
{
  "endpoint": {
    "type": "custom",
    "custom": {
      "url": "https://ti.empresa.com/api/inventario/",
      "authType": "bearer",
      "token": "tu-token-api-aqui"
    }
  },
  "schedule": {
    "frequency": "hourly"
  }
}
```

**Tipos de autenticación soportados:**
- `bearer` - Token Bearer (Ej: Authorization: Bearer token)
- `basic` - Autenticación básica (usuario:contraseña codificado en base64)
- `none` - Sin autenticación

**Si tu servidor requiere credenciales de AD:**

```json
{
  "endpoint": {
    "type": "custom",
    "custom": {
      "url": "https://ti.empresa.com/api/inventario/",
      "authType": "bearer",
      "token": "tokenGeneradoDesdeSistemaDeAD"
    }
  }
}
```

---

## 📊 Validar que Funciona

### 1. Ejecutar manualmente

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\ProgramData\AgentInventario\bin\agent-inventario.ps1" -ConfigPath "C:\ProgramData\AgentInventario\config.json"
```

### 2. Revisar logs

```powershell
# Últimas 50 líneas
Get-Content "C:\ProgramData\AgentInventario\logs\agent-*.log" -Tail 50

# Filtrar solo errores
Select-String "ERROR" "C:\ProgramData\AgentInventario\logs\agent-*.log"
```

### 3. Ver inventarios pendientes (si falló envío)

```powershell
Get-ChildItem "C:\ProgramData\AgentInventario\data\"
```

### 4. Verificar en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Firestore Database → Colección `equiposTI_v2`
4. Busca un documento con nombre = nombre de tu equipo

Deberías ver algo como:
```json
{
  "timestamp": "2026-08-26 14:30:45",
  "computadora": "MI-COMPUTADORA",
  "hardware": {
    "procesador": {...},
    "memoria": {...},
    "discos": [...]
  }
}
```

---

## 🐛 Solución de Problemas

### El agente no se ejecuta

1. **Revisar permisos de Task Scheduler**:
   ```powershell
   Get-ScheduledTask -TaskName "AgentInventarioTI" | Select-Object State
   # Debe mostrar "Ready"
   ```

2. **Revisar último resultado**:
   ```powershell
   Get-ScheduledTask -TaskName "AgentInventarioTI" | Select-Object LastTaskResult, LastRunTime
   # LastTaskResult = 0 es OK
   ```

3. **Ver detalles del error**:
   ```powershell
   Get-ScheduledTaskInfo -TaskName "AgentInventarioTI"
   ```

### No hay logs

- Verifica que existe: `C:\ProgramData\AgentInventario\logs\`
- Ejecuta manualmente para ver errores en tiempo real
- Revisa permisos de carpeta

### No envía a Firebase

1. Valida que la **API Key** es correcta en `config.json`
2. Verifica conectividad:
   ```powershell
   Test-NetConnection -ComputerName "firestore.googleapis.com" -Port 443
   ```
3. Revisa logs para mensajes de error de conexión

### Hay inventarios pendientes en `data\`

- El agente intentará reintentar cada hora
- Verifica que se resolvió el problema de conectividad
- Revisa logs para ver el motivo del fallo

### Desinstalación completa

```powershell
# Eliminar tarea
Unregister-ScheduledTask -TaskName "AgentInventarioTI" -Confirm:$false

# Eliminar carpeta (y todos los datos)
Remove-Item -Path "C:\ProgramData\AgentInventario" -Recurse -Force
```

---

## 📈 Información Recolectada

El agente recolecta:

**Hardware:**
- CPU: Modelo, núcleos, hilos, velocidad
- RAM: Cantidad total en GB
- Discos: Tipo, capacidad, espacio libre, % de uso
- Red: IPs, MACs, velocidades
- BIOS: Versión, fabricante
- Serial: Número de serie del equipo

**Software:**
- SO: Nombre, versión, build, arquitectura
- Último arranque: Horas de tiempo de encendido
- Software instalado: Nombre, versión, fabricante

**Equipo:**
- Nombre del equipo
- Usuario de dominio
- Fabricante y modelo
- Tipo de máquina (Laptop, Desktop, Servidor)

---

## 🔐 Seguridad

### Recomendaciones

1. **API Key de Firebase:**
   - Usa una clave restringida (solo lectura en Firestore)
   - No la expongas en repositorios públicos
   - Rota regularmente

2. **Autenticación de Servidor Virtual:**
   - Usa tokens con expiración
   - Implementa HTTPS obligatorio
   - Valida certificados SSL

3. **Compartida de Red (GPO):**
   - Aplica permisos mínimos necesarios
   - Solo lectura para usuarios del dominio
   - Audita cambios en `config.json`

4. **Logs:**
   - Los logs se guardan localmente (sin datos sensibles)
   - Se limpian automáticamente después de 30 días
   - Máximo 100 MB por archivo

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs**: `C:\ProgramData\AgentInventario\logs\`
2. **Ejecuta manualmente**: Ve el error en tiempo real
3. **Verifica configuración**: `C:\ProgramData\AgentInventario\config.json`
4. **Reinicia tarea**: `Start-ScheduledTask -TaskName "AgentInventarioTI"`

---

## 📝 Versión

- **Versión del Agente**: 1.0
- **Compatible con**: Firebase, Servidor Virtual (futuro)
- **Última actualización**: Agosto 2026

---

¡Listo! El agente está configurado y funcionando. 🚀
