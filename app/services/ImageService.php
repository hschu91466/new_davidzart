<?php

declare(strict_types=1);

require_once __DIR__ . '/ImageStorage.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../includes/helper.php';

class ImageService
{
    public static function deleteImage(int $imageId, PDO $pdo): void
    {
        $image = ImageModel::getById($pdo, $imageId);

        if (!$image) {
            json_error('Image not found');
        }

        // ✅ Build R2 path
        $site = $_ENV['SITE_NAME'];
        $fullPath = $site . '/' . $image['file_path'];

        // ✅ Delete from R2
        deleteFromR2($fullPath);

        // ✅ Delete from DB
        ImageModel::delete($pdo, $imageId);

        json_ok(['message' => 'Image deleted']);
    }
}
