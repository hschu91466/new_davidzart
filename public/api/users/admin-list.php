<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/UserController.php';

require_admin();

$controller = new UserController();
$response = $controller->listAdmin($_GET);

header('Content-Type: application/json');
echo json_encode($response);
