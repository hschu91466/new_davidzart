<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/CommentsController.php';

require_admin();

// Get query parameters
$params = $_GET;

// Call controller
$controller = new CommentsController();
$response = $controller->getCommentCount($params);

// Return JSON
echo json_encode($response);
