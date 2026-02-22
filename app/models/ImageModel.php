<?php

declare(strict_types=1);

class ImageModel
{
    public static function getByGallery(PDO $pdo, int $galleryId): array
    {
        $sql = "SELECT 
              image_id,
              file_path, 
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


    public static function nextSortOrder(PDO $pdo, int $galleryId): int
    {
        $stmt = $pdo->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort FROM images WHERE gallery_id = :gid");
        $stmt->execute([':gid' => $galleryId]);
        return (int) $stmt->fetchColumn();
    }


    public static function create(PDO $pdo, array $data): int
    {
        $sql = "INSERT INTO images (
                    gallery_id, file_path, title, caption, price_cents, is_sold,
                    year_created, medium, dimensions, sort_order, is_active,
                    is_published, orientation, created_at
                ) VALUES (
                    :gallery_id, :file_path, :title, :caption, :price_cents, :is_sold,
                    :year_created, :medium, :dimensions, :sort_order, :is_active,
                    :is_published, :orientation, NOW()
                )";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':gallery_id'   => $data['gallery_id'],
            ':file_path'    => $data['file_path'],
            ':title'        => $data['title'],
            ':caption'      => $data['caption'],
            ':price_cents'  => $data['price_cents'],
            ':is_sold'      => $data['is_sold'],
            ':year_created' => $data['year_created'],
            ':medium'       => $data['medium'],
            ':dimensions'   => $data['dimensions'],
            ':sort_order'   => $data['sort_order'],
            ':is_active'    => $data['is_active'],
            ':is_published' => $data['is_published'],
            ':orientation'  => $data['orientation'],
        ]);

        return (int) $pdo->lastInsertId();
    }
}
