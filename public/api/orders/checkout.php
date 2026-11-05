<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';

$controller = new OrderController($pdo);
$data = json_decode(file_get_contents('php://input'), true);
$response = $controller->checkout($data ?? []);
json_response($response);
