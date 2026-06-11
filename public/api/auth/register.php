<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/AuthController.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? [];

error_log("RAW INPUT: " . $rawInput);
error_log("PARSED DATA: " . print_r($data, true));


$response = AuthController::register($pdo, $data);

echo json_encode($response);
