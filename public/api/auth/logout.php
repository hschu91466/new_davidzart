<?php

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';

$response = AuthController::logout();

echo json_encode($response);
