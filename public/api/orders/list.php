<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
// require_once __DIR__ . '/../../../app/controllers/OrderController.php';

require_admin();

$controller = new OrderController($pdo);
$response = $controller->list();

json_response($response);
