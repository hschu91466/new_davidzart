<?php

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryController.php';

// Assuming bootstrap.php exposes $pdo
$controller = new GalleryController($pdo);


if (isset($_GET['slug'])) {
    $response = $controller->gallery();
} else {
    $response = $controller->galleries();
}
json_response($response);
