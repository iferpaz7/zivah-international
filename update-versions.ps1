# ZIVAH International - Script para actualizar versiones de archivos
param([string]$Version = "1.0.1")

Write-Host "Actualizando versiones a v$Version..." -ForegroundColor Green

$htmlFile = "index.html"
if (Test-Path $htmlFile) {
    $content = Get-Content $htmlFile -Raw
    
    # Actualizar CSS
    $content = $content -replace 'href="css/styles\.css\?v=[^"]*"', "href=`"css/styles.css?v=$Version`""
    $content = $content -replace 'href="css/responsive\.css\?v=[^"]*"', "href=`"css/responsive.css?v=$Version`""
    
    # Actualizar JS
    $content = $content -replace 'src="js/main\.js\?v=[^"]*"', "src=`"js/main.js?v=$Version`""
    $content = $content -replace 'src="js/seo-utils\.js\?v=[^"]*"', "src=`"js/seo-utils.js?v=$Version`""
    $content = $content -replace 'src="js/utils\.js\?v=[^"]*"', "src=`"js/utils.js?v=$Version`""
    
    Set-Content $htmlFile $content -NoNewline
    Write-Host "✅ Versiones actualizadas exitosamente!" -ForegroundColor Green
} else {
    Write-Host "❌ No se encontró index.html" -ForegroundColor Red
}

Write-Host "`n💡 Recuerda:" -ForegroundColor Cyan
Write-Host "   - Subir archivos al servidor" -ForegroundColor White
Write-Host "   - Usar Ctrl+Shift+R para hard refresh" -ForegroundColor White
Write-Host "   - Verificar que .htaccess esté en el servidor" -ForegroundColor White 
