<?php

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';

$user = AuthController::currentUser($pdo);

if (!$user) {
    echo json_encode(["user" => null]);
    exit;
}

echo json_encode(["user" => $user]);
