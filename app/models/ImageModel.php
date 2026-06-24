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
            medium,
            dimensions,
            year_created,
            orientation,
            is_active,
            is_published,
            sort_order            
            FROM images
            WHERE gallery_id = :gid AND is_active = 1
            ORDER BY sort_order ASC, image_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':gid' => $galleryId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(PDO $pdo, int $imageId): ?array
    {
        $sql = "SELECT
            image_id,
            file_path,
            title,
            caption,
            medium,
            dimensions,
            year_created,
            orientation,
            is_active,
            is_published,
            sort_order            
            FROM images
            WHERE image_id = :imgid; ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':imgid' => $imageId]);
        $image = $stmt->fetch(PDO::FETCH_ASSOC);
        return $image ?: null;
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

    public static function update(PDO $pdo, array $data): bool
    {

        $sql = "UPDATE images
            SET 
                title = :title,
                caption = :caption,
                year_created = :year_created,
                medium = :medium,
                dimensions = :dimensions
            WHERE image_id = :image_id";


        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            ':title' => $data['title'],
            ':caption' => $data['caption'],
            ':year_created' => $data['year_created'],
            ':image_id' => $data['image_id'],
            ':medium' => $data['medium'],
            ':dimensions' => $data['dimensions'],
        ]);
    }

    public static function delete(PDO $pdo, int $id): bool
    {
        $sql = "DELETE FROM images WHERE image_id = :id";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            ':id' => $id
        ]);
    }

    public static function move(PDO $pdo, int $imageId, int $galleryId, string $direction): bool
    {
        $sql = "SELECT image_id, sort_order
        FROM images
        WHERE image_id = :image_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':image_id' => $imageId]);
        $current = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$current) return false;

        $currentSort = (int)$current['sort_order'];

        // ✅ find neighbor (same gallery only)
        if ($direction === 'up') {

            $sql = "SELECT image_id, sort_order
                FROM images
                WHERE gallery_id = :gallery_id
                    AND sort_order < :sort
                ORDER BY sort_order DESC
                LIMIT 1";

            $stmt = $pdo->prepare($sql);
        } else {

            $sql = "SELECT image_id, sort_order
                FROM images
                WHERE gallery_id = :gallery_id
                    AND sort_order > :sort
                ORDER BY sort_order ASC
                LIMIT 1";

            $stmt = $pdo->prepare($sql);
        }

        $stmt->execute([
            ':gallery_id' => $galleryId,
            ':sort' => $currentSort
        ]);

        $neighbor = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$neighbor) return false;

        // ✅ swap sort_order
        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("UPDATE images SET sort_order = :sort WHERE image_id = :id");

            $stmt->execute([
                ':sort' => $neighbor['sort_order'],
                ':id' => $current['image_id'],
            ]);

            $stmt->execute([
                ':sort' => $currentSort,
                ':id' => $neighbor['image_id'],
            ]);

            $pdo->commit();
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }

        return true;
    }
}
