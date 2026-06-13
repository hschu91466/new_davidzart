<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/services/ImageUploadService.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_admin();

$response = handleImageUpload($_FILES['image'] ?? [], $pdo);

json_ok($response);
