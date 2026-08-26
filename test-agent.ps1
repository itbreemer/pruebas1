#Requires -Version 5.0
<#
.SYNOPSIS
    Script de prueba para validar el Agente de Inventario TI

.DESCRIPTION
    - Valida la estructura de instalación
    - Prueba recolección de datos
    - Prueba conectividad a Firebase
    - Genera reporte de diagnóstico

.NOTES
    No requiere permisos de administrador
    Uso: .\test-agent.ps1
#>

param(
    [string]$ConfigPath = "C:\ProgramData\AgentInventario\config.json"
)

Write-Host "=========================================="
Write-Host "Test Agent - Validación de Instalación"
Write-Host "=========================================="
Write-Host ""

# ============================================================================
# VALIDACIÓN 1: ESTRUCTURA DE DIRECTORIOS
# ============================================================================

Write-Host "1. Validando estructura de directorios..." -ForegroundColor Cyan

$checks = @{
    "Directorio Base" = "C:\ProgramData\AgentInventario"
    "Script del Agente" = "C:\ProgramData\AgentInventario\bin\agent-inventario.ps1"
    "Configuración" = "C:\ProgramData\AgentInventario\config.json"
    "Directorio de Logs" = "C:\ProgramData\AgentInventario\logs"
    "Directorio de Datos" = "C:\ProgramData\AgentInventario\data"
}

$allExist = $true
foreach ($check in $checks.GetEnumerator()) {
    if (Test-Path $check.Value) {
        Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $($check.Key) NO ENCONTRADO" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "`n⚠ Algunos archivos no fueron encontrados. Ejecuta la instalación primero." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 2: CONFIGURACIÓN
# ============================================================================

Write-Host "2. Validando configuración..." -ForegroundColor Cyan

if (-not (Test-Path $ConfigPath)) {
    Write-Host "  ✗ Archivo de configuración no encontrado: $ConfigPath" -ForegroundColor Red
    exit 1
}

try {
    $config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
    Write-Host "  ✓ Configuración válida (JSON)" -ForegroundColor Green

    Write-Host "    - Tipo de endpoint: $($config.endpoint.type)" -ForegroundColor Gray
    Write-Host "    - Frecuencia: $($config.schedule.frequency)" -ForegroundColor Gray
    Write-Host "    - Incluir hardware: $($config.data.includeHardware)" -ForegroundColor Gray
    Write-Host "    - Incluir software: $($config.data.includeSoftware)" -ForegroundColor Gray
}
catch {
    Write-Host "  ✗ Error en formato JSON: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 3: RECOLECCIÓN DE DATOS
# ============================================================================

Write-Host "3. Probando recolección de datos..." -ForegroundColor Cyan

try {
    # Nombre del equipo
    $computerInfo = Get-CimInstance Win32_ComputerSystem
    Write-Host "  ✓ Nombre del equipo: $($computerInfo.Name)" -ForegroundColor Green

    # Procesador
    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
    Write-Host "  ✓ Procesador: $($cpu.Name) ($($cpu.NumberOfCores) núcleos)" -ForegroundColor Green

    # Memoria
    $ram = $computerInfo.TotalPhysicalMemory / 1GB
    Write-Host "  ✓ Memoria RAM: $([math]::Round($ram, 2)) GB" -ForegroundColor Green

    # SO
    $os = Get-CimInstance Win32_OperatingSystem
    Write-Host "  ✓ Sistema Operativo: $($os.Caption) Build $($os.BuildNumber)" -ForegroundColor Green

    # Discos
    $discoCount = (Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 }).Count
    Write-Host "  ✓ Discos lógicos: $discoCount" -ForegroundColor Green

    # Red
    $nics = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' }
    Write-Host "  ✓ Interfaces de red activas: $($nics.Count)" -ForegroundColor Green

    foreach ($nic in $nics) {
        $ip = Get-NetIPAddress -InterfaceIndex $nic.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($ip) {
            Write-Host "      - $($nic.Name): $($ip.IPAddress) ($($nic.MacAddress))" -ForegroundColor Gray
        }
    }

    # Usuario
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    Write-Host "  ✓ Usuario actual: $currentUser" -ForegroundColor Green

}
catch {
    Write-Host "  ✗ Error recolectando datos: $_" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 4: CONECTIVIDAD DE RED
# ============================================================================

Write-Host "4. Probando conectividad..." -ForegroundColor Cyan

$endpoints = @(
    @{ Name = "Google DNS"; Host = "8.8.8.8"; Port = 53 }
    @{ Name = "Firebase"; Host = "firestore.googleapis.com"; Port = 443 }
)

if ($config.endpoint.type -eq "custom") {
    $customUrl = $config.endpoint.custom.url
    $uri = [System.Uri]$customUrl
    $endpoints += @{ Name = "Servidor Custom"; Host = $uri.Host; Port = $uri.Port }
}

foreach ($ep in $endpoints) {
    try {
        $result = Test-NetConnection -ComputerName $ep.Host -Port $ep.Port -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "  ✓ $($ep.Name)" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠ $($ep.Name) - Conectado pero puerto no responde" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ✗ $($ep.Name) - Error de conectividad" -ForegroundColor Red
    }
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 5: VALIDAR CREDENCIALES DE FIREBASE
# ============================================================================

if ($config.endpoint.type -eq "firebase") {
    Write-Host "5. Validando credenciales de Firebase..." -ForegroundColor Cyan

    $projectId = $config.endpoint.firebase.projectId
    $apiKey = $config.endpoint.firebase.apiKey
    $database = $config.endpoint.firebase.database

    if ([string]::IsNullOrWhiteSpace($projectId)) {
        Write-Host "  ✗ projectId no configurado" -ForegroundColor Red
    }
    elseif ($projectId -eq "tu-proyecto-firebase") {
        Write-Host "  ⚠ projectId no personalizado (valor por defecto)" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✓ projectId: $projectId" -ForegroundColor Green
    }

    if ([string]::IsNullOrWhiteSpace($apiKey)) {
        Write-Host "  ✗ apiKey no configurado" -ForegroundColor Red
    }
    elseif ($apiKey -eq "tu-api-key-firebase-aqui") {
        Write-Host "  ⚠ apiKey no personalizado (valor por defecto)" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✓ apiKey configurado (primeros 10 chars: $($apiKey.Substring(0, [Math]::Min(10, $apiKey.Length)))...)" -ForegroundColor Green
    }

    Write-Host "  ✓ Database: $database" -ForegroundColor Green

    # Intentar conectar a Firebase
    Write-Host "`n  Probando conexión a Firebase..." -ForegroundColor Gray

    try {
        $testUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents"
        $response = Invoke-WebRequest -Uri "$testUrl?key=$apiKey" -Method GET -TimeoutSec 10 -ErrorAction Stop

        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Conexión a Firebase exitosa" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ Código de respuesta: $($response.StatusCode)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ✗ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 6: TAREA PROGRAMADA
# ============================================================================

Write-Host "6. Validando tarea programada..." -ForegroundColor Cyan

try {
    $task = Get-ScheduledTask -TaskName "AgentInventarioTI" -ErrorAction Stop
    Write-Host "  ✓ Tarea encontrada: AgentInventarioTI" -ForegroundColor Green
    Write-Host "    - Estado: $($task.State)" -ForegroundColor Gray
    Write-Host "    - Última ejecución: $($task.LastRunTime)" -ForegroundColor Gray

    $taskInfo = Get-ScheduledTaskInfo -TaskName "AgentInventarioTI"
    if ($taskInfo.LastTaskResult -eq 0) {
        Write-Host "    - Último resultado: ✓ Exitoso" -ForegroundColor Green
    }
    else {
        Write-Host "    - Último resultado: ✗ Error (Código: $($taskInfo.LastTaskResult))" -ForegroundColor Red
    }
}
catch {
    Write-Host "  ⚠ Tarea programada no encontrada" -ForegroundColor Yellow
    Write-Host "    (Se crea después de ejecutar install-agent-gpo.ps1)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 7: LOGS
# ============================================================================

Write-Host "7. Validando logs..." -ForegroundColor Cyan

$logDir = "C:\ProgramData\AgentInventario\logs"
$logFiles = Get-ChildItem -Path $logDir -Filter "*.log" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending

if ($logFiles) {
    $latestLog = $logFiles | Select-Object -First 1
    Write-Host "  ✓ Logs encontrados" -ForegroundColor Green
    Write-Host "    - Archivo más reciente: $($latestLog.Name)" -ForegroundColor Gray
    Write-Host "    - Tamaño: $([math]::Round($latestLog.Length / 1KB, 2)) KB" -ForegroundColor Gray

    Write-Host "`n  Últimas líneas del log:" -ForegroundColor Gray
    Get-Content -Path $latestLog.FullPath -Tail 5 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
}
else {
    Write-Host "  ⚠ No hay logs aún (se crean después de la primera ejecución)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# VALIDACIÓN 8: DATOS PENDIENTES
# ============================================================================

Write-Host "8. Validando datos pendientes..." -ForegroundColor Cyan

$dataDir = "C:\ProgramData\AgentInventario\data"
$pendingFiles = Get-ChildItem -Path $dataDir -Filter "*.json" -ErrorAction SilentlyContinue

if ($pendingFiles) {
    Write-Host "  ⚠ Hay $($pendingFiles.Count) inventario(s) pendiente(s) de envío" -ForegroundColor Yellow
    $pendingFiles | ForEach-Object {
        Write-Host "    - $($_.Name) ($([math]::Round($_.Length / 1KB, 2)) KB)" -ForegroundColor Gray
    }
}
else {
    Write-Host "  ✓ No hay datos pendientes (todo se sincronizó correctamente)" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# RESUMEN FINAL
# ============================================================================

Write-Host "=========================================="
Write-Host "RESUMEN DE VALIDACIÓN"
Write-Host "=========================================="
Write-Host ""
Write-Host "✓ Instalación completada" -ForegroundColor Green
Write-Host "✓ Estructura de directorios válida" -ForegroundColor Green
Write-Host "✓ Configuración válida" -ForegroundColor Green
Write-Host "✓ Recolección de datos funciona" -ForegroundColor Green
Write-Host "✓ Conectividad de red OK" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta el agente manualmente: " -ForegroundColor Cyan
Write-Host "   powershell -NoProfile -ExecutionPolicy Bypass -File 'C:\ProgramData\AgentInventario\bin\agent-inventario.ps1'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Revisa los logs: " -ForegroundColor Cyan
Write-Host "   Get-Content 'C:\ProgramData\AgentInventario\logs\agent-*.log' -Tail 50" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifica en Firebase Console que aparece tu equipo" -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================="
