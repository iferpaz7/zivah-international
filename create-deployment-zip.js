#!/usr/bin/env node

// Crear ZIP para despliegue en cPanel
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creando ZIP para despliegue...\n');

// Leer lista de archivos
const deploymentFiles = fs.readFileSync('deployment-files.txt', 'utf8')
    .split('\n')
    .filter(file => file.trim() && fs.existsSync(file.trim()));

console.log(`📋 Archivos a incluir: ${deploymentFiles.length}`);

// Crear comando PowerShell para comprimir
const filesToCompress = deploymentFiles.map(file => `"${file}"`).join(', ');

const powershellCommand = `
$files = @(${filesToCompress})
$destination = "zivah-international-website.zip"

# Eliminar ZIP existente si existe
if (Test-Path $destination) { Remove-Item $destination }

# Crear ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($destination, 'Create')

foreach ($file in $files) {
    if (Test-Path $file) {
        $relativePath = $file
        if (Test-Path $file -PathType Container) {
            # Es una carpeta
            Get-ChildItem -Path $file -Recurse -File | ForEach-Object {
                $entryName = $_.FullName.Substring((Get-Location).Path.Length + 1)
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName)
            }
        } else {
            # Es un archivo
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, $relativePath)
        }
    }
}

$zip.Dispose()
Write-Host "✅ ZIP creado: $destination"
`;

try {
    // Ejecutar PowerShell
    execSync(`powershell -Command "${powershellCommand.replace(/\n/g, '; ')}"`, { 
        stdio: 'inherit',
        shell: true 
    });
    
    console.log('\n🎉 ¡ZIP creado exitosamente!');
    console.log('📁 Archivo: zivah-international-website.zip');
    
    // Verificar tamaño del ZIP
    if (fs.existsSync('zivah-international-website.zip')) {
        const stats = fs.statSync('zivah-international-website.zip');
        console.log(`📊 Tamaño del ZIP: ${(stats.size / 1024).toFixed(2)} KB`);
    }
    
} catch (error) {
    console.error('❌ Error creando ZIP:', error.message);
    console.log('\n💡 Alternativa: Comprimir manualmente los archivos listados en deployment-files.txt');
}

console.log('\n📋 Próximos pasos para cPanel:');
console.log('1. Accede a tu cPanel');
console.log('2. Ve a "File Manager" o "Administrador de Archivos"');
console.log('3. Navega a la carpeta public_html/');
console.log('4. Sube el archivo zivah-international-website.zip');
console.log('5. Haz clic derecho en el ZIP y selecciona "Extract"');
console.log('6. Elimina el archivo ZIP después de extraer');
console.log('7. Verifica que todos los archivos estén en su lugar');
console.log('\n🔗 Luego visita tu dominio para verificar que todo funcione');