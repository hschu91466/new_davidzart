<?php
// app/services/ImageUploadService.php

class ImageUploadService
{
    /** @var array<string,string> */
    private array $allowed = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
        'image/webp' => 'webp',
    ];

    public function __construct(
        private PDO $pdo,
        private ImageStorage $storage
    ) {}

    /**
     * Validates gallery & file, moves it, and inserts DB row (with optional metadata).
     *
     * @param int   $galleryId
     * @param array $file      e.g. $_FILES['image']
     * @param array $metadata  Optional keys: title, caption, price_cents, year_created,
     *                         medium, dimensions, is_published, is_active, is_sold
     * @return array{image_id:int, publicPath:string, orientation:?int, slug:string, filename:string}
     * @throws RuntimeException
     */
    public function handle(int $galleryId, array $file, array $metadata = []): array
    {
        // 1) Validate gallery & resolve slug
        $g = GalleryModel::getById($this->pdo, $galleryId);
        if (!$g) {
            throw new RuntimeException('Selected gallery not found.');
        }
        $slug = $g['slug'] ?? '';
        if ($slug === '' || !preg_match('~^[a-z0-9-]+$~i', $slug)) {
            throw new RuntimeException('Gallery has an invalid slug.');
        }

        // 2) Validate file array
        if (!is_array($file) || !isset($file['error'], $file['tmp_name'])) {
            throw new RuntimeException('No file was uploaded.');
        }
        if ((int)$file['error'] !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Upload error code: ' . (int)$file['error']);
        }
        $tmpPath = $file['tmp_name'];
        if (!file_exists($tmpPath)) {
            throw new RuntimeException('Temporary upload file missing.');
        }

        // 3) Detect mime → extension
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = $finfo ? finfo_file($finfo, $tmpPath) : null;
        if ($finfo) finfo_close($finfo);

        if (!$mime || !isset($this->allowed[$mime])) {
            throw new RuntimeException('Unsupported image type.');
        }
        $ext = $this->allowed[$mime];

        // 4) Move to /public/assets/images/galleries/<slug>/<filename>
        $filename = $this->storage->generateFilename($ext);
        [$destPath, $publicPath] = $this->storage->moveUploaded($tmpPath, $slug, $filename);

        // 5) Optional EXIF orientation for JPEG

        $exifOrientation = null;
        if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
            $exif = @exif_read_data($destPath);
            if ($exif && isset($exif['Orientation'])) {
                $exifOrientation = (int)$exif['Orientation'];
            }
        }

        // Normalize orientation from the form
        $formOrientation = null;
        if (array_key_exists('orientation', $metadata)) {
            $val = $metadata['orientation'];
            if ($val !== null && $val !== '') {
                $formOrientation = $val; // use exactly what user typed
            }
        }


        // 6) Sort order
        $sortOrder = ImageModel::nextSortOrder($this->pdo, $galleryId);

        // 7) Build payload for your ImageModel::create (match column names exactly)
        $payload = [
            'gallery_id'   => $galleryId,
            'file_path'    => $publicPath, // URL path with leading slash
            'title'        => $metadata['title']        ?? null,
            'caption'      => $metadata['caption']      ?? null,
            'price_cents'  => $metadata['price_cents']  ?? 0,
            'is_sold'      => $metadata['is_sold']      ?? 0,
            'year_created' => $metadata['year_created'] ?? null,
            'medium'       => $metadata['medium']       ?? null,
            'dimensions'   => $metadata['dimensions']   ?? null,
            'sort_order'   => $metadata['sort_order']   ?? $sortOrder,
            'is_active'    => $metadata['is_active']    ?? 1,
            'is_published' => $metadata['is_published'] ?? 0,
            'orientation'  => ($formOrientation !== null ? $formOrientation : $exifOrientation) ?? null,
            // created_at handled by NOW() in SQL
        ];

        $imageId = ImageModel::create($this->pdo, $payload);
        if (!$imageId) {
            $lastId = (int)$this->pdo->lastInsertId();
            if ($lastId <= 0) {
                throw new RuntimeException('Failed to create image record.');
            }
            $imageId = $lastId;
        }

        return [
            'image_id'    => (int)$imageId,
            'publicPath'  => $publicPath,
            'orientation' => ($formOrientation !== null ? $formOrientation : $exifOrientation) ?? null,
            'slug'        => $slug,
            'filename'    => $filename,
        ];
    }
}
