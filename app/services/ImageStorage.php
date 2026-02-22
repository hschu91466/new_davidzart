<?php
// app/services/ImageStorage.php

class ImageStorage
{
    private string $baseDir;     // filesystem base: .../public/assets/images/galleries
    private string $publicBase;  // web path base: /assets/images/galleries

    /**
     * @param string $publicRootDir Absolute path to your /public directory
     */
    public function __construct(string $publicRootDir)
    {
        $this->baseDir = rtrim($publicRootDir, DIRECTORY_SEPARATOR)
            . DIRECTORY_SEPARATOR . 'assets'
            . DIRECTORY_SEPARATOR . 'images'
            . DIRECTORY_SEPARATOR . 'galleries';

        $this->publicBase = '/assets/images/galleries';
    }

    /**
     * Ensure /public/assets/images/galleries/<slug>/ exists and is writable.
     * @throws RuntimeException
     */
    public function ensureGalleryDir(string $slug): string
    {
        $destDir = $this->baseDir . DIRECTORY_SEPARATOR . $slug . DIRECTORY_SEPARATOR;
        if (!is_dir($destDir)) {
            if (!mkdir($destDir, 0775, true) && !is_dir($destDir)) {
                throw new RuntimeException('Failed to create destination directory.');
            }
            @chmod($destDir, 0775);
        }
        if (!is_writable($destDir)) {
            throw new RuntimeException('Destination directory not writable.');
        }
        return $destDir;
    }

    /**
     * Generate a safe, unique filename with the provided extension.
     */
    public function generateFilename(string $ext): string
    {
        try {
            return date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        } catch (\Throwable $e) {
            return date('Ymd_His') . '_' . substr(sha1(uniqid('', true)), 0, 12) . '.' . $ext;
        }
    }

    /**
     * Move the uploaded tmp file into /public/assets/images/galleries/<slug>/<filename>
     * Returns [destPath (filesystem), publicPath (/assets/...)].
     * @throws RuntimeException
     */
    public function moveUploaded(string $tmpPath, string $slug, string $filename): array
    {
        if (!is_uploaded_file($tmpPath)) {
            throw new RuntimeException('Upload temp file is invalid.');
        }

        $destDir  = $this->ensureGalleryDir($slug);
        $destPath = $destDir . $filename;

        if (!move_uploaded_file($tmpPath, $destPath)) {
            throw new RuntimeException('Could not move uploaded file.');
        }

        $publicPath = "{$this->publicBase}/{$slug}/{$filename}";
        return [$destPath, $publicPath];
    }
}
