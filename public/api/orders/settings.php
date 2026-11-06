<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';

require_admin();

$controller = new ShopSettingsController($pdo);
$response = $controller->status();

json_response($response);
