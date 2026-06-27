<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../includes/helper.php';
require_once __DIR__ . '/ImageController.php';

final class GalleryController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function gallery(): array
    {
        $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

        if ($slug === '') {
            return ['error' => 'Missing gallery slug'];
        }

        try {
            // Fetch gallery by slug
            $gallery = GalleryModel::getBySlug($this->pdo, $slug);
            if (!$gallery) {
                return ['error' => 'Gallery not found'];
            }

            $imageController = new ImageController($this->pdo);
            $images = $imageController->getShapedImagesForGallery((int)$gallery['gallery_id']);

            return [
                'gallery' => [
                    'id'          => (int)$gallery['gallery_id'],
                    'slug'        => $gallery['slug'],
                    'title'       => $gallery['title'],
                    'description' => $gallery['description'] ?? null,
                ],
                'images' => $images
            ];
        } catch (Throwable $e) {
            return ['error' => 'Server error'];
        }
    }

    public function galleries(): array
    {
        try {
            // Fetch active galleries
            $galleries = GalleryModel::getActive($this->pdo);
            if (!is_array($galleries)) {
                return ['galleries' => []];
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
                    usort(
                        $rows,
                        fn($a, $b) => ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0)
                    );

                    if (!empty($rows)) {
                        $img = $rows[0];

                        $coverImage = [
                            'image_id'    => (int)$img['image_id'],
                            'image_url'   => build_image_url($img['file_path']),
                            'orientation' => $img['orientation'] ?? null,
                        ];
                    }
                }

                $out[] = [
                    'gallery_id'          => (int)$g['gallery_id'],
                    'slug'        => $g['slug'],
                    'title'       => $g['title'],
                    'description' => $g['description'] ?? null,
                    'cover_image' => $coverImage,
                    'sort_order'  => isset($g['sort_order']) ? (int)$g['sort_order'] : 0,
                ];
            }

            return ['galleries' => $out];
        } catch (Throwable $e) {
            return ['error' => 'Server error'];
        }
    }

    public function create(array $data): array
    {
        $title = trim($data['title'] ?? '');

        if (empty($title)) {
            return [
                'success' => false,
                'message' => 'Gallery title is required'
            ];
        }

        try {
            $galleryId = GalleryModel::createGallery($this->pdo, [
                'title' => $title,
                'description' => $data['description'] ?? null,
            ]);

            return [
                'success' => true,
                'gallery_id' => $galleryId
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
        $galleryId = $data['gallery_id'] ?? null;
        $title = trim($data['title'] ?? '');

        if (!$galleryId || empty($title)) {
            return [
                'success' => false,
                'message' => 'Gallery ID and title are required'
            ];
        };


        try {
            GalleryModel::updateGallery($this->pdo, $data);

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

    public function toggle(array $data): array
    {
        $galleryId = $data['gallery_id'] ?? null;
        $isActive = $data['is_active'] ?? null;

        if (!$galleryId || $isActive === null) {
            return ([
                'success' => false,
                'message' => 'Invalid request'
            ]);
        }
        try {
            GalleryModel::toggleGallery($this->pdo, (int)$galleryId, (int)$isActive);
            return [
                'success' => true,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function move(array $data): array
    {
        $galleryId = $data['gallery_id'] ?? null;
        $direction = $data['direction'] ?? null;

        if (!$galleryId || !in_array($direction, ['up', 'down'])) {
            return [
                'success' => false,
                'message' => 'Invalid request'
            ];
        }

        try {
            GalleryModel::moveGallery($this->pdo, (int)$galleryId, $direction);

            return ['success' => true];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
