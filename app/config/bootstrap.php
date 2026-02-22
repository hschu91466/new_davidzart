<?php

declare(strict_types=1);
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$ROOT = dirname(__DIR__); // /app
require_once $ROOT . '/config/database.php'; // db(), $pdo
require_once $ROOT . '/includes/helper.php';
require_once $ROOT . '/models/GalleryModel.php';
require_once $ROOT . '/models/ImageModel.php';
require_once $ROOT . '/services/ImageUploadService.php';
require_once $ROOT . '/services/ImageStorage.php';

// Optional: initialize $pdo explicitly for legacy pages
$pdo = db();

// Optional: initialize $BASE_URL explicitly for legacy pages
$BASE_URL = getBaseURL();

$errors = [];
$flash = null;
