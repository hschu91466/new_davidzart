<?php

declare(strict_types=1);

class ImageModel
{
    public static function getByGallery(PDO $pdo, int $galleryId): array
    {
        $sql = "SELECT 
              image_id,
              file_path AS filepath,   -- << alias ensures 'filepath' is always present
              title,
              caption,
              orientation
            FROM images
            WHERE gallery_id = :gid AND is_active = 1
            ORDER BY sort_order, image_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':gid' => $galleryId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
