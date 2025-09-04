<?php
// ZIVAH International - Generador de versiones para archivos
// Este archivo genera versiones únicas para evitar problemas de caché

function getFileVersion($filePath) {
    if (file_exists($filePath)) {
        return filemtime($filePath);
    }
    return time();
}

// Obtener versiones de archivos
$cssVersion = getFileVersion('css/styles.css');
$responsiveVersion = getFileVersion('css/responsive.css');
$mainJsVersion = getFileVersion('js/main.js');
$seoJsVersion = getFileVersion('js/seo-utils.js');
$utilsJsVersion = getFileVersion('js/utils.js');

// Retornar las versiones como JSON
header('Content-Type: application/json');
echo json_encode([
    'css' => $cssVersion,
    'responsive' => $responsiveVersion,
    'main_js' => $mainJsVersion,
    'seo_js' => $seoJsVersion,
    'utils_js' => $utilsJsVersion,
    'timestamp' => time()
]);
?>
