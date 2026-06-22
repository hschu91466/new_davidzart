<?php

declare(strict_types=1);


ini_set('display_errors', 1);
error_reporting(E_ALL);


require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/controllers/GalleryController.php';

$controller = new GalleryController($pdo);
$controller->homeImages();
