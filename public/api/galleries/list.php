<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/GalleryController.php';

$controller = new GalleryController($pdo);
$response = $controller->galleries();

json_response($response);
