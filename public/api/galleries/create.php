<?php

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/GalleryApiController.php';

// Protect endpoint
require_admin();

$controller = new GalleryApiController($pdo);

// read JSON body
$data = json_decode(file_get_contents('php://input'), true);

// call controller
$response = $controller->create($data ?? []);

// return response
json_response($response);
