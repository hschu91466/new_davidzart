<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/GalleryController.php';

require_admin();

$controller = new GalleryController($pdo);

$data = json_decode(file_get_contents('php://input'), true);

$response = $controller->move($data ?? []);

json_response($response);
