<?php
require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/CommentsController.php';

$controller = new CommentsController();

// read JSON body
$data = json_decode(file_get_contents('php://input'), true);

$response = $controller->create($data ?? []);

json_response($response);
