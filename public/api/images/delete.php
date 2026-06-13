<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/ImageController.php';

require_admin();

$data = json_decode(file_get_contents('php://input'), true);
$imageId = (int)($data['image_id'] ?? 0);

ImageController::delete($imageId, $pdo);
