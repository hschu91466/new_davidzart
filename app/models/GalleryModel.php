<?php

declare(strict_types=1);

class GalleryModel
{
    public static function getBySlug(PDO $pdo, string $slug): ?array
    {
        $sql = "SELECT gallery_id, slug, title, description
                FROM galleries
                WHERE slug = :slug AND is_active = 1
                LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public static function getActive(PDO $pdo): array
    {
        $sql = "
        SELECT gallery_id, slug, title
        FROM galleries
        WHERE is_active = 1
          AND TRIM(COALESCE(slug,'')) <> ''
        ORDER BY sort_order ASC, title ASC
    ";
        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }


    public static function getActiveWithImages(PDO $pdo): array
    {
        $sql = "
        SELECT g.gallery_id, 
        g.slug, 
        g.title,
        (select gi.file_path from images gi where gi.gallery_id = g.gallery_id order by gi.image_id asc limit 1) as cover_url
        FROM schu_art.galleries g
        WHERE g.is_active = 1
          AND TRIM(COALESCE(g.slug,'')) <> ''
          AND EXISTS (
            SELECT 1
            FROM schu_art.images gi
            WHERE gi.gallery_id = g.gallery_id
          )
        ORDER BY g.sort_order ASC, g.title ASC
    ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
