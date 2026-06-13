<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../services/ImageService.php';

class ImageController
{
    public static function delete(int $imageId, PDO $pdo): void
    {

        if (!$imageId) {
            json_error('Missing image_id');
        }

        ImageService::deleteImage($imageId, $pdo);
    }
}
