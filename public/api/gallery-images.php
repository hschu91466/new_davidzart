<?php

declare(strict_types=1);

require_once __DIR__ . '/../../app/config/config.php';   // if you set constants here
require_once __DIR__ . '/../../app/config/database.php'; // should expose $pdo
require_once __DIR__ . '/../../app/controllers/GalleryApiController.php';

$controller = new GalleryApiController($pdo);
$controller->images();
