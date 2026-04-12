<?php

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryApiController.php';

header('Content-Type: application/json; charset=utf-8');

// Assuming bootstrap.php exposes $pdo
$controller = new GalleryApiController($pdo);

if (isset($_GET['slug'])) {
    $controller->gallery();
} else {
    $controller->galleries();
}
