# ZIVAH International - Verificación Simple del Sistema de Loading
Write-Host "Verificando Sistema de Loading v1.0.3..." -ForegroundColor Green

# Verificar archivos principales
$files = @(
    "index.html",
    "css/styles.css", 
    "js/main.js"
)

Write-Host "`nArchivos principales:" -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  FALTA: $file" -ForegroundColor Red
    }
}

# Verificar versiones
Write-Host "`nVersiones en HTML:" -ForegroundColor Yellow
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    
    if ($content -match "styles\.css\?v=") {
        Write-Host "  OK: CSS styles found with version" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: CSS styles version not found" -ForegroundColor Red
    }
    
    if ($content -match "main\.js\?v=") {
        Write-Host "  OK: JavaScript main.js found with version (consolidated)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: JavaScript main.js version not found" -ForegroundColor Red
    }
}

# Verificar documentación
Write-Host "`nDocumentación:" -ForegroundColor Yellow
$docs = @(
    "SMOOTH-LOADING-GUIDE.md",
    "PERFORMANCE-ANALYSIS.md", 
    "CHANGELOG-v1.0.3.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  OK: $doc" -ForegroundColor Green
    } else {
        Write-Host "  FALTA: $doc" -ForegroundColor Yellow
    }
}

# Verificar demo
Write-Host "`nDemo:" -ForegroundColor Yellow
if (Test-Path "demo-loading.html") {
    Write-Host "  OK: demo-loading.html" -ForegroundColor Green
} else {
    Write-Host "  FALTA: demo-loading.html" -ForegroundColor Yellow
}

Write-Host "`nSistema de Loading v1.0.3 verificado!" -ForegroundColor Cyan
Write-Host "Probar en navegador: index.html" -ForegroundColor White
Write-Host "Ver demo: demo-loading.html" -ForegroundColor White