#Requires -RunAsAdministrator
#Requires -Version 5.0
<#
.SYNOPSIS
    Script de instalación del Agente de Inventario TI
    Configura el agente para ejecutarse via Task Scheduler (GPO-compatible)

.DESCRIPTION
    - Crea directorio C:\ProgramData\AgentInventario
    - Copia archivos del agente
    - Copia archivo de configuración
    - Crea tarea programada en Task Scheduler
    - La tarea se ejecuta como SYSTEM

.NOTES
    Requiere: Permisos de administrador
    Uso: .\install-agent-gpo.ps1 -SourcePath "\\servidor\compartida\AgentInventario"
#>

param(
    [string]$SourcePath = $PSScriptRoot,
    [string]$Frequency = "hourly",
    [bool]$RunImmediately = $true
)

# ============================================================================
# VALIDACIONES PREVIAS
# ============================================================================

Write-Host "=========================================="
Write-Host "Instalador - Agente de Inventario TI"
Write-Host "=========================================="

# Validar permisos de administrador
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Este script requiere permisos de administrador" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Permisos de administrador confirmados" -ForegroundColor Green

# Validar archivos de origen
$requiredFiles = @("agent-inventario.ps1", "config.json")
foreach ($file in $requiredFiles) {
    $filePath = Join-Path -Path $SourcePath -ChildPath $file
    if (-not (Test-Path $filePath)) {
        Write-Host "ERROR: Archivo no encontrado: $filePath" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Archivo encontrado: $file" -ForegroundColor Green
}

# ============================================================================
# CREAR ESTRUCTURA DE DIRECTORIOS
# ============================================================================

Write-Host "`nCreando estructura de directorios..." -ForegroundColor Cyan

$BaseDir = "C:\ProgramData\AgentInventario"
$LogDir = "$BaseDir\logs"
$DataDir = "$BaseDir\data"
$BinDir = "$BaseDir\bin"

@($BaseDir, $LogDir, $DataDir, $BinDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Host "✓ Directorio creado: $_" -ForegroundColor Green
    }
    else {
        Write-Host "✓ Directorio existe: $_" -ForegroundColor Green
    }
}

# ============================================================================
# COPIAR ARCHIVOS
# ============================================================================

Write-Host "`nCopiando archivos..." -ForegroundColor Cyan

try {
    # Copiar script del agente
    $sourcescript = Join-Path -Path $SourcePath -ChildPath "agent-inventario.ps1"
    $targetScript = "$BinDir\agent-inventario.ps1"
    Copy-Item -Path $sourcescript -Destination $targetScript -Force
    Write-Host "✓ Agente copiado a: $targetScript" -ForegroundColor Green

    # Copiar configuración
    $sourceConfig = Join-Path -Path $SourcePath -ChildPath "config.json"
    $targetConfig = "$BaseDir\config.json"
    Copy-Item -Path $sourceConfig -Destination $targetConfig -Force
    Write-Host "✓ Configuración copiada a: $targetConfig" -ForegroundColor Green
}
catch {
    Write-Host "ERROR al copiar archivos: $_" -ForegroundColor Red
    exit 1
}

# ============================================================================
# CREAR TAREA PROGRAMADA
# ============================================================================

Write-Host "`nCreando tarea programada..." -ForegroundColor Cyan

$TaskName = "AgentInventarioTI"
$TaskPath = "\AgentInventarioTI\"
$TaskDescription = "Agente de Inventario TI - Recolecta información de hardware y software"

# Eliminar tarea si existe
try {
    $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false | Out-Null
        Write-Host "✓ Tarea anterior eliminada" -ForegroundColor Green
    }
}
catch {
    Write-Host "Aviso: No se pudo eliminar tarea anterior (no existe)" -ForegroundColor Yellow
}

# Crear acción de tarea
$scriptPath = "$BinDir\agent-inventario.ps1"
$configPath = "$BaseDir\config.json"

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`" -ConfigPath `"$configPath`""

Write-Host "✓ Acción de tarea configurada" -ForegroundColor Green

# Crear disparador
switch ($Frequency) {
    "hourly" {
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 999)
        Write-Host "✓ Disparador: Cada hora" -ForegroundColor Green
    }
    "daily" {
        $trigger = New-ScheduledTaskTrigger -Daily -At "22:00"
        Write-Host "✓ Disparador: Diariamente a las 22:00" -ForegroundColor Green
    }
    "weekly" {
        $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "02:00"
        Write-Host "✓ Disparador: Semanalmente (lunes a las 02:00)" -ForegroundColor Green
    }
    default {
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 999)
        Write-Host "✓ Disparador: Cada hora (por defecto)" -ForegroundColor Green
    }
}

# Crear configuración de seguridad (ejecutar como SYSTEM)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Crear configuración adicional
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

# Registrar tarea
try {
    Register-ScheduledTask -TaskName $TaskName `
        -TaskPath $TaskPath `
        -Action $action `
        -Trigger $trigger `
        -Principal $principal `
        -Settings $settings `
        -Description $TaskDescription `
        -Force | Out-Null

    Write-Host "✓ Tarea programada registrada: $TaskName" -ForegroundColor Green
}
catch {
    Write-Host "ERROR al registrar tarea: $_" -ForegroundColor Red
    exit 1
}

# ============================================================================
# CONFIGURAR PERMISOS
# ============================================================================

Write-Host "`nConfigurando permisos de carpeta..." -ForegroundColor Cyan

try {
    # Dar permisos SYSTEM al directorio
    $acl = Get-Acl $BaseDir
    $systemSid = New-Object System.Security.Principal.SecurityIdentifier("S-1-5-18")  # SYSTEM SID
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($systemSid, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($rule)
    Set-Acl -Path $BaseDir -AclObject $acl

    Write-Host "✓ Permisos configurados para SYSTEM" -ForegroundColor Green
}
catch {
    Write-Host "Aviso: No se pudieron configurar permisos avanzados (no crítico): $_" -ForegroundColor Yellow
}

# ============================================================================
# CREAR ARCHIVO README
# ============================================================================

Write-Host "`nCreando documentación..." -ForegroundColor Cyan

$readmeContent = @"
# Agente de Inventario TI

## Instalación completada

El agente ha sido instalado correctamente en: **C:\ProgramData\AgentInventario**

### Estructura de directorios

- **C:\ProgramData\AgentInventario\bin\** - Script ejecutable
- **C:\ProgramData\AgentInventario\config.json** - Archivo de configuración
- **C:\ProgramData\AgentInventario\logs\** - Archivos de log
- **C:\ProgramData\AgentInventario\data\** - Datos pendientes (si falla envío)

### Configuración

Edita **config.json** para personalizar:

1. **endpoint.type**: "firebase" o "custom"
2. **Firebase credentials**: projectId, database, apiKey
3. **Custom server**: URL, authType, token
4. **schedule.frequency**: "hourly", "daily", "weekly"
5. **logging.level**: "DEBUG", "INFO", "WARNING", "ERROR"

### Tarea programada

- **Nombre**: AgentInventarioTI
- **Usuario**: SYSTEM
- **Frecuencia**: $Frequency
- **Estado**: Habilitada

### Ver logs

Los logs se guardan en: **C:\ProgramData\AgentInventario\logs\agent-YYYYMMDD.log**

Ejemplo:
```
powershell -NoProfile -Command "Get-Content C:\ProgramData\AgentInventario\logs\agent-$(Get-Date -Format 'yyyyMMdd').log -Tail 50"
```

### Ejecutar manualmente

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\ProgramData\AgentInventario\bin\agent-inventario.ps1" -ConfigPath "C:\ProgramData\AgentInventario\config.json"
```

### Verificar estado de tarea

```powershell
Get-ScheduledTask -TaskName "AgentInventarioTI" | Select-Object State, LastRunTime, LastTaskResult
```

### Solución de problemas

1. **Revisar logs**: C:\ProgramData\AgentInventario\logs\
2. **Verificar configuración**: C:\ProgramData\AgentInventario\config.json
3. **Ejecutar manualmente**: Usa el comando anterior para ver errores en tiempo real
4. **Reintentos pendientes**: Revisar C:\ProgramData\AgentInventario\data\

### Desinstalación

```powershell
Unregister-ScheduledTask -TaskName "AgentInventarioTI" -Confirm:`$false
Remove-Item -Path "C:\ProgramData\AgentInventario" -Recurse -Force
```

---

**Última actualización**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@

$readmePath = "$BaseDir\README.txt"
$readmeContent | Set-Content -Path $readmePath -Encoding UTF8
Write-Host "✓ Documentación creada: $readmePath" -ForegroundColor Green

# ============================================================================
# EJECUTAR AGENTE INMEDIATAMENTE (OPCIONAL)
# ============================================================================

if ($RunImmediately) {
    Write-Host "`nEjecutando agente por primera vez..." -ForegroundColor Cyan

    try {
        Start-ScheduledTask -TaskName $TaskName
        Write-Host "✓ Agente ejecutado. Espera 30 segundos y revisa los logs..." -ForegroundColor Green
        Start-Sleep -Seconds 3

        $logFile = "$LogDir\agent-$(Get-Date -Format 'yyyyMMdd').log"
        if (Test-Path $logFile) {
            Write-Host "`nÚltimas líneas del log:" -ForegroundColor Cyan
            Get-Content -Path $logFile -Tail 10 -ErrorAction SilentlyContinue
        }
    }
    catch {
        Write-Host "Aviso: No se pudo ejecutar automáticamente (no crítico): $_" -ForegroundColor Yellow
    }
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================

Write-Host "`n=========================================="
Write-Host "✓ INSTALACIÓN COMPLETADA"
Write-Host "=========================================="
Write-Host "
Próximos pasos:

1. Edita la configuración:
   notepad '$targetConfig'

2. Verifica la tarea programada:
   Get-ScheduledTask -TaskName 'AgentInventarioTI'

3. Revisa los logs:
   Get-Content '$logDir\agent-*.log' -Tail 50

4. Para distribuir via GPO:
   - Copia la carpeta a un compartida de red
   - Configura GPO para ejecutar este script
   - O crea GPO para ejecutar el agente directamente

---
Para ayuda, revisa: $readmePath
" -ForegroundColor Green

exit 0
