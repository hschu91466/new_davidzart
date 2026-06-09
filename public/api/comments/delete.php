<?php
require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/CommentsController.php';

require_admin();

$controller = new CommentsController();

$data = json_decode(file_get_contents('php://input'), true);


$id = (int)(
    $data['comment_id']
    ?? $data['id']
    ?? $_POST['comment_id']
    ?? $_POST['id']
    ?? 0
);

$response = $controller->delete($id);

json_response($response);
