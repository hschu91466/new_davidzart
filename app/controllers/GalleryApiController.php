<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';

final class GalleryApiController
{
    public function __construct(private PDO $pdo) {}

    public function images(): void
    {
        header('Content-Type: application/json');

        $limit    = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 12;
        $random   = isset($_GET['random']) ? (bool)$_GET['random'] : true;
        $gallery  = isset($_GET['gallery']) ? trim((string)$_GET['gallery']) : '';
        $galleriesParam = isset($_GET['galleries']) ? trim((string)$_GET['galleries']) : '';
        $galleries = $galleriesParam ? array_filter(array_map('trim', explode(',', $galleriesParam))) : [];
        $lightbox = isset($_GET['lightbox']) ? (string)$_GET['lightbox'] : 'original';

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

        try {
            $images = [];

            if ($gallery !== '') {
                $g = GalleryModel::getBySlug($this->pdo, $gallery);
                if (!$g) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Gallery not found']);
                    return;
                }
                $rows = ImageModel::getByGallery($this->pdo, (int)$g['gallery_id']);
                $rows = array_values(array_filter($rows, fn($r) => isset($r['filepath']) && $this->isAllowedImage($r['filepath'], $allowedExt)));
                if ($random) shuffle($rows);
                $rows = array_slice($rows, 0, $limit);

                foreach ($rows as $r) {
                    $images[] = $this->shapeImage($r, $lightbox);
                }
            } else {
                $active = $galleries ? $this->filterActiveBySlugs(GalleryModel::getActive($this->pdo), $galleries)
                    : GalleryModel::getActive($this->pdo);
                if (!$active) {
                    http_response_code(404);
                    echo json_encode(['error' => 'No galleries found']);
                    return;
                }

                $pool = [];
                foreach ($active as $g) {
                    $rows = ImageModel::getByGallery($this->pdo, (int)$g['gallery_id']);
                    foreach ($rows as $r) {
                        if (!isset($r['filepath'])) continue;
                        if (!$this->isAllowedImage($r['filepath'], $allowedExt)) continue;
                        $pool[] = $r;
                    }
                }

                if ($random) shuffle($pool);
                $pool = array_slice($pool, 0, $limit);

                foreach ($pool as $r) {
                    $images[] = $this->shapeImage($r, $lightbox);
                }
            }

            header('Cache-Control: no-store');
            echo json_encode(['images' => $images]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
            // TODO: log $e->getMessage()
        }
    }

    private function isAllowedImage(string $path, array $allowed): bool
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }

    private function toWebUrl(string $path): string
    {
        if (preg_match('#^https?://#i', $path)) return $path;

        // Remove server-side prefix(s) so we return web paths
        $path = preg_replace('#^/sites/production/davidschu_new/public/#', '', $path);

        // Normalize to project-relative (no leading slash)
        $path = ltrim($path, '/');

        // If DB sometimes stores only filenames, map to your images folder
        if (!str_starts_with($path, 'assets/images/')) {
            $path = 'assets/images/' . basename($path);
        }

        return $path; // e.g., 'assets/images/galleries/gallery-one/art-img12.jpg'
    }

    private function shapeImage(array $row, string $lightbox): array
    {
        $url = $this->toWebUrl($row['filepath']);
        $name = pathinfo($url, PATHINFO_FILENAME);
        $dir  = rtrim(dirname($url), '/');

        // Optional: if you generate variants
        $large = "{$dir}/{$name}-1600.webp";
        $thumb = "{$dir}/{$name}-640.webp";

        $href = ($lightbox === 'large') ? $large : $url;

        return [
            'id'          => (int)($row['image_id'] ?? 0),
            'url'         => $url,
            'href'        => $href,
            'thumb'       => $thumb,
            'alt'         => $row['title'] ?? '',
            'caption'     => $row['caption'] ?? '',
            'orientation' => $row['orientation'] ?? null,
        ];
    }

    private function filterActiveBySlugs(array $actives, array $slugs): array
    {
        $set = array_flip(array_map('strtolower', $slugs));
        return array_values(array_filter($actives, fn($g) => isset($g['slug']) && isset($set[strtolower($g['slug'])])));
    }
}
