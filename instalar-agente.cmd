@echo off
REM Lanzador de un clic para instalar/reparar el Agente de Inventario TI.
REM Evita los 2 pasos manuales que mas problemas daban al probar en equipos
REM nuevos: la Politica de Ejecucion de PowerShell (bloqueaba el script por
REM defecto) y tener que escribir el comando a mano cada vez.
REM
REM Uso: clic derecho -> "Ejecutar como administrador" sobre este archivo
REM (debe estar en la misma carpeta que install-agent-gpo.ps1).

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-agent-gpo.ps1"

echo.
echo ============================================
echo Instalacion terminada. Revisa el resultado arriba.
echo ============================================
pause
