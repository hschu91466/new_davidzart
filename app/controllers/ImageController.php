<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../services/ImageService.php';

class ImageController
{

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public static function delete(int $imageId, PDO $pdo): void
    {
        if (!$imageId) {
            json_error('Missing image_id');
        }

        ImageService::deleteImage($imageId, $pdo);
    }

    public function move(array $data): array
    {    
        
    $imageId = $data['image_id'] ?? null;
        $galleryId = $data['gallery_id'] ?? null;
        $direction = $data['direction'] ?? null;

        if (!$imageId || !$galleryId || !in_array($direction, ['up', 'down'], true)) {
            return [
                'success' => false,
                'message' => 'Invalid request'
            ];
        }

        try {
            ImageModel::move($this->pdo, (int)$imageId, (int)$galleryId, $direction);

            return [
                'success' => true
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
