<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);

$response = AuthController::register($pdo, $data);

echo json_encode($response);
