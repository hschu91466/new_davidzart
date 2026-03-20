<?php

declare(strict_types=1);

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/models/CommentModel.php';
require_once __DIR__ . '/../../app/includes/helper.php';

ensure_session();
if (!is_admin_request()) {
    json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
}

$commentId = (int)($_POST['id'] ?? 0);
if ($commentId <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid id'], 400);
}

try {
    $ok = CommentModel::unspam($pdo, $commentId);
    if (!$ok) {
        json_response(['ok' => false, 'error' => 'Not found'], 404);
    }
    json_response(['ok' => true, 'id' => $commentId]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Server error'], 500);
}
