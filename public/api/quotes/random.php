<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/QuoteController.php';

$controller = new QuoteController($pdo);
$response = $controller->random();

json_response($response);
