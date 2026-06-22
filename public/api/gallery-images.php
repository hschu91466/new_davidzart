<?php

declare(strict_types=1);
// NOT CURRENTLY USING THIS FILE
require_once __DIR__ . '/../../app/config/config.php';   // if you set constants here
require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/config/database.php'; // should expose $pdo
require_once __DIR__ . '/../../app/controllers/GalleryController.php';

$controller = new GalleryController($pdo);
$controller->images();
