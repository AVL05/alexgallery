# Script para agregar metadatos de copyright a las imágenes
# Requiere ExifTool instalado

$artist = "Alex Vicente"
$copyright = "© Alex Vicente"
$publicDir = Join-Path $PSScriptRoot "public"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Agregando Metadatos de Copyright a las Imágenes     " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar si ExifTool está instalado
try {
    $null = & exiftool -ver 2>$null
    Write-Host "✓ ExifTool detectado" -ForegroundColor Green
} catch {
    Write-Host "✗ ExifTool no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar ExifTool:" -ForegroundColor Yellow
    Write-Host "1. Descarga desde: https://exiftool.org/" -ForegroundColor White
    Write-Host "2. O instala con Chocolatey: choco install exiftool" -ForegroundColor White
    Write-Host "3. O instala con Scoop: scoop install exiftool" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Verificar si existe el directorio public
if (-not (Test-Path $publicDir)) {
    Write-Host "✗ No se encontró el directorio 'public'" -ForegroundColor Red
    exit 1
}

Write-Host "Artista: $artist" -ForegroundColor White
Write-Host "Copyright: $copyright" -ForegroundColor White
Write-Host ""

# Obtener todas las imágenes .webp
$images = Get-ChildItem -Path $publicDir -Filter "*.webp"

if ($images.Count -eq 0) {
    Write-Host "✗ No se encontraron imágenes .webp en el directorio public" -ForegroundColor Red
    exit 1
}

Write-Host "Procesando $($images.Count) imágenes..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($image in $images) {
    try {
        Write-Host "Procesando: $($image.Name)... " -NoNewline
        
        # Agregar metadatos de copyright
        $result = & exiftool `
            -Artist="$artist" `
            -Copyright="$copyright" `
            -Creator="$artist" `
            -Rights="All Rights Reserved" `
            -overwrite_original `
            $image.FullName 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Completado" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "✗ Error" -ForegroundColor Red
            $errorCount++
        }
    } catch {
        Write-Host "✗ Error: $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Resumen                                              " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Total de imágenes: $($images.Count)" -ForegroundColor White
Write-Host "Exitosas: $successCount" -ForegroundColor Green
Write-Host "Errores: $errorCount" -ForegroundColor Red
Write-Host ""

if ($successCount -eq $images.Count) {
    Write-Host "¡Todos los metadatos se agregaron correctamente! ✓" -ForegroundColor Green
} else {
    Write-Host "Algunas imágenes tuvieron errores. Revisa los mensajes anteriores." -ForegroundColor Yellow
}

Write-Host ""
