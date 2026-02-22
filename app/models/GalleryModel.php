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

  public static function getAllActiveForUpload(PDO $pdo): array
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

  public static function getAllForUpload(PDO $pdo): array
  {
    $sql = "
        SELECT gallery_id, slug, title, is_active
        FROM galleries
        WHERE TRIM(COALESCE(slug,'')) <> ''
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
        (select gi.file_path from images gi where gi.gallery_id = g.gallery_id order by gi.image_id asc limit 1) as cover_url,
        (select gi.orientation from images gi where gi.gallery_id = g.gallery_id order by gi.image_id asc limit 1) as orientation
        FROM galleries g
        WHERE g.is_active = 1
          AND TRIM(COALESCE(g.slug,'')) <> ''
          AND EXISTS (
            SELECT 1
            FROM images gi
            WHERE gi.gallery_id = g.gallery_id
          )
        ORDER BY g.sort_order ASC, g.title ASC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
  }


  public static function getById(PDO $pdo, int $id): ?array
  {
    $stmt = $pdo->prepare("
        SELECT gallery_id, slug, title, is_active
        FROM galleries
        WHERE gallery_id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
  }

  public static function getAllForUploadIncludingEmpty(PDO $pdo): array
  {
    $sql = "
        SELECT 
            g.gallery_id,
            g.slug,
            g.title,
            g.is_active,
            CASE WHEN COUNT(i.image_id) > 0 THEN 1 ELSE 0 END AS has_images
        FROM galleries g
        LEFT JOIN images i
            ON i.gallery_id = g.gallery_id
            AND i.is_active = 1  -- optional: only count active images
        WHERE TRIM(COALESCE(g.slug, '')) <> ''   -- keep requiring a slug (as you want)
          AND g.is_active = 1                    -- you said all are active; keep this if you only want active
        GROUP BY g.gallery_id, g.slug, g.title, g.is_active
        ORDER BY COALESCE(g.sort_order, 0) ASC, g.title ASC
    ";
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
  }
}
