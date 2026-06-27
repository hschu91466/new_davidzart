<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/services/ImageUploadService.php';

require_admin();

$response = handleImageUpload($_FILES['image'] ?? [], $pdo);

json_response($response);
