<?php

declare(strict_types=1);

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/models/ImageModel.php';


$galleryId = (int)($_GET['gallery_id'] ?? 0);

if (!$galleryId) {
    json_error('Missing gallery_id');
}

// ✅ Correct function name
$images = ImageModel::getByGallery($pdo, $galleryId);

// ✅ Add URLs
foreach ($images as &$row) {
    $row['url'] = build_image_url($row['file_path']);
}

json_ok($images);
