<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';


ensure_session();

error_log("SESSION CONTENT LOGIN:");
error_log(print_r($_SESSION, true));


$data = json_decode(file_get_contents("php://input"), true) ?? [];

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$response = AuthController::login($pdo, $email, $password);

echo json_encode($response);
