<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../includes/helper.php';
require_once __DIR__ . '/ImageController.php';

final class GalleryController
{
    public function __construct(private PDO $pdo) {}


    public function gallery(): void
    {


        header('Content-Type: application/json; charset=utf-8');

        $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Missing gallery slug']);
            exit;
        }

        try {
            // Fetch gallery by slug
            $gallery = GalleryModel::getBySlug($this->pdo, $slug);
            if (!$gallery) {
                http_response_code(404);
                echo json_encode(['error' => 'Gallery not found']);
                exit;
            }

            $imageController = new ImageController($this->pdo);
            $images = $imageController->getShapedImagesForGallery((int)$gallery['gallery_id']);

            echo json_encode([
                'gallery' => [
                    'id'          => (int)$gallery['gallery_id'],
                    'slug'        => $gallery['slug'],
                    'title'       => $gallery['title'],
                    'description' => $gallery['description'] ?? null,
                ],
                'images' => $images
            ]);
            exit;
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
            exit;
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
                exit;
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
                    'id'          => (int)$g['gallery_id'],
                    'slug'        => $g['slug'],
                    'title'       => $g['title'],
                    'description' => $g['description'] ?? null,
                    'cover_image' => $coverImage,
                    'sort_order'  => isset($g['sort_order']) ? (int)$g['sort_order'] : 0,
                ];
            }

            echo json_encode(['galleries' => $out]);
            exit;
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
            exit;
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
        error_log(print_r($data, true));
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
