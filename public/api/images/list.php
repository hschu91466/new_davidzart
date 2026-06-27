<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/ImageController.php';

$galleryId = (int)($_GET['gallery_id'] ?? 0);

$controller = new ImageController($pdo);
$response = $controller->listByGallery($galleryId);

json_response($response);
