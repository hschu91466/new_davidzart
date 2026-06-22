<?php

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/GalleryController.php';

require_admin();

$controller = new GalleryController($pdo);

$data = json_decode(file_get_contents('php://input'), true);

$response = $controller->update($data ?? []);

json_response($response);
