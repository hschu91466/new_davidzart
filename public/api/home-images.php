<?php

declare(strict_types=1);


ini_set('display_errors', 1);
error_reporting(E_ALL);


require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryApiController.php';

$controller = new GalleryApiController($pdo);
$controller->homeImages();
