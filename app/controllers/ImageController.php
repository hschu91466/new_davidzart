<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../services/ImageService.php';
require_once __DIR__ . '/../includes/helper.php';

class ImageController
{

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getShapedImagesForGallery(int $galleryId): array
    {
        $rows = ImageModel::getByGallery($this->pdo, $galleryId);

        if (!is_array($rows)) {
            $rows = [];
        }

        $rows = array_filter(
            $rows,
            fn($r) => ($r['is_active'] ?? 0) == 1 &&
                ($r['is_published'] ?? 0) == 1
        );

        usort(
            $rows,
            fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0)
        );

        return array_map(
            fn($r) => $this->shapeImage($r),
            $rows
        );
    }

    public function deleteImage(int $imageId): array
    {
        try {
            error_log("DELETE: Starting for imageId=$imageId");

            $image = ImageModel::getById($this->pdo, $imageId);
            error_log("DELETE: Image found = " . ($image ? 'yes' : 'no'));

            if (!$image) {
                return ['success' => false, 'message' => 'Image not found'];
            }

            error_log("DELETE: About to call ImageModel::delete");

            ImageModel::delete($this->pdo, $imageId);

            error_log("DELETE: Success");

            return ['success' => true, 'message' => 'Image deleted successfully'];
        } catch (Exception $e) {
            error_log("DELETE EXCEPTION: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
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

    public function update(array $data): array
    {
        $imageId = $data['image_id'] ?? null;

        if (!$imageId) {
            return [
                'success' => false,
                'message' => 'Image ID required'
            ];
        }

        try {
            $success = ImageModel::update($this->pdo, $data);

            if ($success) {
                return [
                    'success' => true,
                    'message' => 'Image updated'
                ];
            }

            return [
                'success' => false,
                'message' => 'Image not found'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function images(): array
    {
        $limit    = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 12;
        $random   = isset($_GET['random']) ? (bool)$_GET['random'] : true;
        $gallery  = isset($_GET['gallery']) ? trim((string)$_GET['gallery']) : '';
        $galleriesParam = isset($_GET['galleries']) ? trim((string)$_GET['galleries']) : '';
        $galleries = $galleriesParam ? array_filter(array_map('trim', explode(',', $galleriesParam))) : [];

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

        // Diagnostics payload
        $diag = [
            'params' => [
                'limit'     => $limit,
                'random'    => $random,
                'gallery'   => $gallery,
                'galleries' => $galleries,
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
                    return ['error' => 'Gallery not found'];
                }

                $rows = ImageModel::getByGallery($this->pdo, (int)$g['gallery_id']);
                if (!is_array($rows)) $rows = [];

                // Diagnostics on raw rows
                $withFilepath = array_filter($rows, fn($r) => isset($r['file_path']));
                $allowed      = array_filter($withFilepath, fn($r) => $this->isAllowedImage($r['file_path'], $allowedExt));

                $diag['per_gallery'][] = [
                    'slug'               => $gallery,
                    'gallery_id'         => (int)$g['gallery_id'],
                    'rows_total'         => count($rows),
                    'rows_with_file_path' => count($withFilepath),
                    'rows_allowed_ext'   => count($allowed),
                ];

                $rows = array_values($allowed);
                if ($random) shuffle($rows);
                $rows = array_slice($rows, 0, $limit);


                foreach ($rows as $r) {
                    $images[] = $this->shapeImage($r);
                }
            } else {
                // --- Active galleries path ---
                $activeAll = GalleryModel::getActive($this->pdo);
                if (!is_array($activeAll)) $activeAll = [];

                $active = $galleries ? $this->filterActiveBySlugs($activeAll, $galleries) : $activeAll;
                $diag['active_count'] = count($active);

                if (empty($active)) {
                    return ['error' => 'No galleries found'];
                }

                $pool = [];
                foreach ($active as $g) {
                    $rows = ImageModel::getByGallery($this->pdo, (int)($g['gallery_id'] ?? 0));
                    if (!is_array($rows)) $rows = [];

                    $withFilepath = array_filter($rows, fn($r) => isset($r['file_path']));
                    $allowed      = array_filter($withFilepath, fn($r) => $this->isAllowedImage($r['file_path'], $allowedExt));

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
                    $images[] = $this->shapeImage($r);
                }
            }

            return ['images' => $images];
        } catch (Throwable $e) {

            return ['error' => 'Server error'];
        }
    }

    public function homeImages(): array
    {
        try {
            $limit = isset($_GET['limit']) ? max(1, min(20, (int)$_GET['limit'])) : 5;
            $random = isset($_GET['random']) ? (bool)$_GET['random'] : true;

            $galleries = GalleryModel::getActive($this->pdo);

            if (!is_array($galleries)) {
                return ['images' => []];
            }

            $pool = [];

            foreach ($galleries as $g) {
                $rows = ImageModel::getByGallery(
                    $this->pdo,
                    (int)($g['gallery_id'] ?? 0)
                );

                if (!is_array($rows)) continue;

                foreach ($rows as $r) {
                    // Only include active + published like gallery()
                    if (
                        ($r['is_active'] ?? 0) == 1 &&
                        ($r['is_published'] ?? 0) == 1
                    ) {
                        $pool[] = $r;
                    }
                }
            }


            if ($random) {
                shuffle($pool);
            }

            $pool = array_slice($pool, 0, $limit);

            $images = array_map(
                fn($r) => $this->shapeImage($r),
                $pool
            );


            return [
                'images' => $images
            ];
        } catch (Throwable $e) {

            return ['error' => 'Server error'];
        }
    }
    private function isAllowedImage(string $path, array $allowed): bool
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return in_array($ext, $allowed, true);
    }
    private function shapeImage(array $row): array
    {
        $filePath = $row['file_path'] ?? '';
        $imageUrl = build_image_url($filePath);

        return [
            'id'           => (int)($row['image_id'] ?? 0),
            'image_url'    => $imageUrl,
            'title'        => $row['title'] ?? '',
            'media'        => $row['medium'] ?? '',
            'dimensions'   => $row['dimensions'] ?? '',
            'caption'      => $row['caption'] ?? '',
            'year_created' => $row['year_created'] ?? '',
            'orientation'  => $row['orientation'] ?? null,
        ];
    }
    private function filterActiveBySlugs(array $actives, array $slugs): array
    {

        $set = array_flip(array_map('strtolower', $slugs));
        return array_values(array_filter($actives, fn($g) => isset($g['slug']) && isset($set[strtolower($g['slug'])])));
    }
    public function listByGallery(int $galleryId): array
    {
        if ($galleryId <= 0) {
            return ['error' => 'Missing gallery_id'];
        }

        try {
            $images = ImageModel::getByGallery($this->pdo, $galleryId);

            // Add URLs to each image
            foreach ($images as &$row) {
                $row['url'] = build_image_url($row['file_path']);
            }

            return ['images' => $images];
        } catch (Exception $e) {
            return ['error' => 'Failed to load images'];
        }
    }
}
