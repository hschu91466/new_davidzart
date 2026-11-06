<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';

require_admin();

$controller = new ShopSettingsController($pdo);

$data = json_decode(file_get_contents('php://input'), true);
$response = $controller->update($data ?? []);

json_response($response);
