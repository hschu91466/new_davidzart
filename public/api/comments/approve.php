<?php
require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/CommentsController.php';

$controller = new CommentsController();

$data = json_decode(file_get_contents('php://input'), true);


$id = (int)(
    $data['id']
    ?? $_POST['id']
    ?? 0
);

$response = $controller->approve($id);

json_response($response);
