<?php

declare(strict_types=1);

require_once __DIR__ . '/ImageStorage.php';
require_once __DIR__ . '/../models/GalleryModel.php';
require_once __DIR__ . '/../models/ImageModel.php';



function handleImageUpload(array $file, PDO $pdo): array
{
    if (!$file || !isset($file['tmp_name'])) {
        return [
            'ok' => false,
            'error' => 'No file uploaded'
        ];
    }

    $galleryId = (int)($_POST['gallery_id'] ?? 0);

    // Get gallery from model
    $gallery = GalleryModel::getById($pdo, $galleryId);

    if (!$gallery) {
        return [
            'ok' => false,
            'error' => 'Invalid gallery'
        ];
    }

    $sortOrder = ImageModel::nextSortOrder($pdo, $galleryId);



    $galleryCode = $gallery['slug'];

    $fileName = uniqid() . '_' . basename($file['name']);
    $tmpName = $file['tmp_name'];

    // ✅ Build path using slug
    $site = $_ENV['SITE_NAME'] ?? 'default';
    $uploadPath = "$site/images/galleries/$galleryCode/" . $fileName;
    $relativePath = "images/galleries/$galleryCode/" . $fileName;

    // ✅ Upload to R2
    $success = uploadToR2($tmpName, $uploadPath);

    if (!$success) {
        return [
            'ok' => false,
            'error' => 'Upload failed'
        ];
    }

    // ✅ Build URL
    $imageUrl = $_ENV['CDN_BASE'] . '/' . $uploadPath;

    $data = [
        'gallery_id'   => $galleryId,
        'file_path'    => $relativePath,
        'title'        => '',
        'caption'      => '',
        'price_cents'  => null,
        'is_sold'      => 0,
        'year_created' => null,
        'medium'       => null,
        'dimensions'   => null,
        'sort_order'   => $sortOrder,
        'is_active'    => 1,
        'is_published' => 1,
        'orientation'  => null,
    ];

    // ✅ Save to database
    $imageId = ImageModel::create($pdo, $data);

    return [
        'ok' => true,
        'url' => $imageUrl,
        'imageId' => $imageId,
    ];
}
