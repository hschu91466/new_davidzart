<?php

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$response = AuthController::login($pdo, $email, $password);

echo json_encode($response);

error_log("SESSION USER ID: " . ($_SESSION['user_id'] ?? 'NOT SET'));
