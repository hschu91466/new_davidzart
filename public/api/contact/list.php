<?php

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/ContactController.php';

header("Content-Type: application/json");

$controller = new ContactController($pdo);
$response = $controller->index();

json_response($response);
