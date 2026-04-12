<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../includes/helper.php';

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
        $debug    = isset($_GET['debug']);

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

        // Diagnostics payload
        $diag = [
            'params' => [
                'limit'     => $limit,
                'random'    => $random,
                'gallery'   => $gallery,
                'galleries' => $galleries,
                'lightbox'  => $lightbox,
            ],
            'active_count' => 0,
            'per_gallery'  => [],
            'pool_before'  => 0,
            'pool_after'   => 0,
        ];

        try {
            $images = [];

            if ($gallery !== '') {
                // --- Specific gallery path ---
                $g = GalleryModel::getBySlug($this->pdo, $gallery);
                if (!$g) {
                    http_response_code(404);
                    $out = ['error' => 'Gallery not found'];
                    if ($debug) $out['debug'] = $diag;
                    echo json_encode($out);
                    return;
                }

                $rows = ImageModel::getByGallery($this->pdo, (int)$g['gallery_id']);
                if (!is_array($rows)) $rows = [];

                // Diagnostics on raw rows
                $withFilepath = array_filter($rows, fn($r) => isset($r['filepath']));
                $allowed      = array_filter($withFilepath, fn($r) => $this->isAllowedImage($r['filepath'], $allowedExt));

                $diag['per_gallery'][] = [
                    'slug'               => $gallery,
                    'gallery_id'         => (int)$g['gallery_id'],
                    'rows_total'         => count($rows),
                    'rows_with_filepath' => count($withFilepath),
                    'rows_allowed_ext'   => count($allowed),
                ];

                $rows = array_values($allowed);
                if ($random) shuffle($rows);
                $rows = array_slice($rows, 0, $limit);

                foreach ($rows as $r) {
                    $images[] = $this->shapeImage($r, $lightbox);
                }
            } else {
                // --- Active galleries path ---
                $activeAll = GalleryModel::getActive($this->pdo);
                if (!is_array($activeAll)) $activeAll = [];

                $active = $galleries ? $this->filterActiveBySlugs($activeAll, $galleries) : $activeAll;
                $diag['active_count'] = count($active);

                if (empty($active)) {
                    http_response_code(404);
                    $out = ['error' => 'No galleries found'];
                    if ($debug) $out['debug'] = $diag;
                    echo json_encode($out);
                    return;
                }

                $pool = [];
                foreach ($active as $g) {
                    $rows = ImageModel::getByGallery($this->pdo, (int)($g['gallery_id'] ?? 0));
                    if (!is_array($rows)) $rows = [];

                    $withFilepath = array_filter($rows, fn($r) => isset($r['filepath']));
                    $allowed      = array_filter($withFilepath, fn($r) => $this->isAllowedImage($r['filepath'], $allowedExt));

                    $diag['per_gallery'][] = [
                        'slug'               => $g['slug'] ?? null,
                        'gallery_id'         => (int)($g['gallery_id'] ?? 0),
                        'rows_total'         => count($rows),
                        'rows_with_filepath' => count($withFilepath),
                        'rows_allowed_ext'   => count($allowed),
                    ];

                    foreach ($allowed as $r) {
                        $pool[] = $r;
                    }
                }

                $diag['pool_before'] = count($pool);

                if ($random) shuffle($pool);
                $pool = array_slice($pool, 0, $limit);

                $diag['pool_after'] = count($pool);

                foreach ($pool as $r) {
                    $images[] = $this->shapeImage($r, $lightbox);
                }
            }

            header('Cache-Control: no-store');
            $payload = ['images' => $images];
            if ($debug) $payload['debug'] = $diag;

            echo json_encode($payload);
        } catch (Throwable $e) {
            http_response_code(500);
            $payload = ['error' => 'Server error'];
            if ($debug) $payload['exception'] = $e->getMessage();
            echo json_encode($payload);
        }
    }

    public function gallery(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Missing gallery slug']);
            return;
        }

        try {
            // Fetch gallery by slug
            $gallery = GalleryModel::getBySlug($this->pdo, $slug);
            if (!$gallery) {
                http_response_code(404);
                echo json_encode(['error' => 'Gallery not found']);
                return;
            }

            // Fetch images for gallery
            $rows = ImageModel::getByGallery(
                $this->pdo,
                (int)$gallery['gallery_id']
            );

            if (!is_array($rows)) {
                $rows = [];
            }

            // Filter + order images
            $rows = array_filter(
                $rows,
                fn($r) => ($r['is_active'] ?? 0) == 1 &&
                    ($r['is_published'] ?? 0) == 1
            );

            usort(
                $rows,
                fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0)
            );

            $images = array_map(
                fn($r) =>
                $this->shapeImage($r, 'original'),
                $rows
            );

            echo json_encode([
                'gallery' => [
                    'id'          => (int)$gallery['gallery_id'],
                    'slug'        => $gallery['slug'],
                    'title'       => $gallery['title'],
                    'description' => $gallery['description'] ?? null
                ],
                'images' => $images
            ]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
        }
    }

    public function galleries(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {
            // Fetch active galleries
            $galleries = GalleryModel::getActive($this->pdo);
            if (!is_array($galleries)) {
                echo json_encode(['galleries' => []]);
                return;
            }

            $out = [];

            foreach ($galleries as $g) {
                $coverImage = null;

                // Fetch images for gallery to derive cover
                $rows = ImageModel::getByGallery(
                    $this->pdo,
                    (int)$g['gallery_id']
                );

                if (is_array($rows)) {
                    // Filter active + published images
                    $rows = array_filter(
                        $rows,
                        fn($r) => ($r['is_active'] ?? 0) == 1 &&
                            ($r['is_published'] ?? 0) == 1
                    );

                    usort(
                        $rows,
                        fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0)
                    );

                    if (!empty($rows)) {
                        $img = $rows[0];
                        $coverImage = [
                            'image_id'   => (int)$img['image_id'],
                            'file_path'  => normalize_to_assets($img['filepath'] ?? ''),
                            'orientation' => $img['orientation'] ?? null
                        ];
                    }
                }

                $out[] = [
                    'id'          => (int)$g['gallery_id'],
                    'slug'        => $g['slug'],
                    'title'       => $g['title'],
                    'description' => $g['description'] ?? null,
                    'cover_image' => $coverImage,
                    'sort_order'  => isset($g['sort_order']) ? (int)$g['sort_order'] : 0,
                ];
            }

            echo json_encode(['galleries' => $out]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
        }
    }

    private function isAllowedImage(string $path, array $allowed): bool
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }

    private function shapeImage(array $row, string $lightbox): array
    {
        $web = normalize_to_assets($row['filepath'] ?? '');
        $url = ltrim($web, '/');

        $thumb = $url;
        $href = $url;

        // Emit ABSOLUTE URLs rooted at the public base
        $absUrl   = img_src($url,   true); // internally calls base_url() → getBaseURL()
        $absHref  = img_src($href,  true);
        $absThumb = img_src($thumb, true);

        return [
            'id'          => (int)($row['image_id'] ?? 0),
            'url'         => $absUrl,
            'href'        => $absHref,
            'thumb'       => $absThumb,
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
