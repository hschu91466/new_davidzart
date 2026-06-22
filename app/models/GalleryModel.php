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

  public static function getImagesBySlug(PDO $pdo, string $slug): array
  {
    $sql = "
        SELECT 
            i.image_id AS id,
            i.file_path AS url
        FROM images i
        JOIN galleries g 
            ON g.gallery_id = i.gallery_id
        WHERE g.slug = :slug
        ORDER BY i.image_id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':slug' => $slug]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
  }

  public static function getActive(PDO $pdo): array
  {
    $sql = "
        SELECT gallery_id, slug, title, description
        FROM galleries
        WHERE is_active = 1
          AND TRIM(COALESCE(slug,'')) <> ''
        ORDER BY sort_order IS NULL, sort_order ASC, title ASC
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
    $sql = "SELECT g.gallery_id, 
      g.slug, 
      g.title,
      
      (select gi.file_path 
        from images gi 
        where gi.gallery_id = g.gallery_id
        order by gi.sort_order asc, gi.image_id asc 
        limit 1) as cover_url,

      (select gi.orientation 
        from images gi 
        where gi.gallery_id = g.gallery_id
        order by gi.sort_order asc, gi.image_id asc 
        limit 1) as orientation

    FROM galleries g
    WHERE g.is_active = 1
      AND TRIM(COALESCE(g.slug,'')) <> ''
      AND EXISTS (
        SELECT 1
        FROM images gi
        WHERE gi.gallery_id = g.gallery_id
      )
    ORDER BY g.sort_order ASC, g.title ASC";

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

  private static function generateSlug(string $title): string
  {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    return trim($slug, '-');
  }

  private static function generateUniqueSlug(PDO $pdo, string $title): string
  {
    $baseSlug = self::generateSlug($title);
    $slug = $baseSlug;
    $i = 1;

    while (self::slugExists($pdo, $slug)) {
      $slug = $baseSlug . '-' . $i;
      $i++;
    }

    return $slug;
  }

  private static function slugExists(PDO $pdo, string $slug): bool
  {
    $stmt = $pdo->prepare("SELECT 1 FROM galleries WHERE slug = :slug");
    $stmt->execute([':slug' => $slug]);
    return (bool) $stmt->fetchColumn();
  }

  public static function createGallery(PDO $pdo, array $data): int
  {
    $title = trim($data['title']);

    if (empty($title)) {
      throw new Exception("Gallery title is required");
    }

    $slug = self::generateUniqueSlug($pdo, $title);

    // ✅ get next sort order
    $stmt = $pdo->query("SELECT MAX(sort_order) FROM galleries");
    $nextSort = ((int)$stmt->fetchColumn()) + 1;

    $sql = "
    INSERT INTO galleries (slug, title, description, sort_order)
    VALUES (:slug, :title, :description, :sort_order)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':slug' => $slug,
      ':title' => $title,
      ':description' => $data['description'] ?? null,
      ':sort_order' => $nextSort,
    ]);

    return (int) $pdo->lastInsertId();
  }

  public static function updateGallery(PDO $pdo, array $data): bool
  {
    $sql = "UPDATE galleries SET title = :title, description = :description WHERE gallery_id = :gallery_id";
    $stmt = $pdo->prepare($sql);
    return $stmt->execute([
      ':title' => trim($data['title']),
      ':description' => $data['description'] ?? null,
      ':gallery_id' => $data['gallery_id'],
    ]);
  }

  public static function toggleGallery(PDO $pdo, int $galleryId, int $isActive): bool
  {
    $sql = "UPDATE galleries SET is_active = :is_active WHERE gallery_id = :gallery_id";

    $stmt = $pdo->prepare($sql);

    return $stmt->execute([
      ':is_active' => $isActive,
      ':gallery_id' => $galleryId,
    ]);
  }

  public static function moveGallery(PDO $pdo, int $galleryId, string $direction): bool
  {
    $sql = "SELECT gallery_id, sort_order FROM galleries WHERE gallery_id = :gallery_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':gallery_id' => $galleryId]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$current) return false;

    $currentSort = (int)$current['sort_order'];

    if ($direction === 'up') {

      $stmt = $pdo->prepare("
      SELECT gallery_id, sort_order
      FROM galleries
      WHERE sort_order < :sort
        AND is_active = 1
      ORDER BY sort_order DESC
      LIMIT 1");
    } else {
      $stmt = $pdo->prepare("
      SELECT gallery_id, sort_order
      FROM galleries
      WHERE sort_order > :sort
        AND is_active = 1
      ORDER BY sort_order ASC
      LIMIT 1");
    }

    $stmt->execute([':sort' => $currentSort]);
    $neighbor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$neighbor) return false;

    try {
      $pdo->beginTransaction();

      $stmt = $pdo->prepare("
    UPDATE galleries SET sort_order = :sort WHERE gallery_id = :id");

      $stmt->execute([
        ':sort' => $neighbor['sort_order'],
        ':id' => $current['gallery_id'],
      ]);

      $stmt->execute([
        ':sort' => $currentSort,
        ':id' => $neighbor['gallery_id'],
      ]);

      $pdo->commit();
    }
    catch (Exception $e) {
      $pdo->rollBack();
      throw $e;
    }  
    return true;
  }
}
