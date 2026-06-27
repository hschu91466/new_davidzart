<?php

declare(strict_types=1);

require_once __DIR__ . '/ImageStorage.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../includes/helper.php';

class ImageService
{
    public static function deleteImage(int $imageId, PDO $pdo): array
    {
        try {
            $image = ImageModel::getById($pdo, $imageId);

            if (!$image) {
                return ['success' => false, 'message' => 'Image not found'];
            }

            // // ✅ Build R2 path
            $site = $_ENV['SITE_NAME'];
            $fullPath = $site . '/' . $image['file_path'];

            // ✅ Delete from R2
            $deleted = deleteFromR2($fullPath);
            if (!$deleted) {
                return ['success' => false, 'message' => 'Failed to delete from storage'];
            }

            // ✅ Delete from DB
            ImageModel::delete($pdo, $imageId);

            return ['success' => true, 'message' => 'Image deleted successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
