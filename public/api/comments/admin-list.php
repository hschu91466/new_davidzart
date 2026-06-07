<?php

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/CommentsController.php';

// Optional: block non-admin users
// if (!is_admin_request()) {
//     echo json_encode([
//         'ok' => false,
//         'error' => 'Unauthorized'
//     ]);
//     exit;
// }

// Get query parameters
$params = $_GET;

// Call controller
$controller = new CommentsController();
$response = $controller->listAdmin($params);

// Return JSON
echo json_encode($response);
