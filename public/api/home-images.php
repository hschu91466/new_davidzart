<?php

declare(strict_types=1);

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryApiController.php';

$controller = new GalleryApiController($pdo);
$controller->homeImages();
