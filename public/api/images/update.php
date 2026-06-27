<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/ImageController.php';

require_admin();

$data = json_decode(file_get_contents("php://input"), true);

$controller = new ImageController($pdo);
$response = $controller->update($data);

json_response($response);
