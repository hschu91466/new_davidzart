<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/ImageController.php';

// require_admin();

error_log("DELETE.PHP CALLED");  // Simple test log

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $imageId = (int)($data['image_id'] ?? 0);

    error_log("DELETE: imageId = " . $imageId);  // Debug log

    if ($imageId <= 0) {
        json_response(['error' => 'Invalid image_id']);
        exit;
    }

    $controller = new ImageController($pdo);
    $response = $controller->deleteImage($imageId);

    error_log("DELETE response: " . print_r($response, true));  // Debug log

    json_response($response);
} catch (Throwable $e) {
    error_log("DELETE ERROR: " . $e->getMessage() . " | " . $e->getFile() . ":" . $e->getLine());
    json_response(['error' => $e->getMessage()]);
}
