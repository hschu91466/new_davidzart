<?php

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryApiController.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Assuming bootstrap.php exposes $pdo
$controller = new GalleryApiController($pdo);

if (isset($_GET['slug'])) {
    $controller->gallery();
} else {
    $controller->galleries();
}
